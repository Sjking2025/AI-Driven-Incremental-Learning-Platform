// ========================================
// Learning Context
// Syncs user progress with backend database
// ========================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { learnAPI, agents } from '../services/api'

const LearningContext = createContext(null)

export function LearningProvider({ children }) {
  const { isAuthenticated, user } = useAuth()
  
  // User's learning data from database
  const [progress, setProgress] = useState([])
  const [stats, setStats] = useState(null)
  const [readiness, setReadiness] = useState(null)
  const [skillRadar, setSkillRadar] = useState([])
  const [loading, setLoading] = useState(false)
  const [lastSync, setLastSync] = useState(null)

  // Load user data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadUserData()
    } else {
      // Clear data when logged out
      setProgress([])
      setStats(null)
      setReadiness(null)
      setSkillRadar([])
    }
  }, [isAuthenticated])

  // Load all user data from backend
  const loadUserData = useCallback(async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    try {
      // Fetch all data in parallel
      const [progressRes, statsRes] = await Promise.all([
        learnAPI.getProgress().catch(() => ({ progress: [] })),
        learnAPI.getStats().catch(() => ({ stats: null }))
      ])

      setProgress(progressRes.progress || [])
      setStats(statsRes.stats || null)
      setLastSync(new Date())

      // Fetch readiness and skill radar (require user data)
      try {
        const readinessRes = await agents.getReadiness('frontend')
        setReadiness(readinessRes.result)
      } catch (e) {
        console.log('Readiness fetch skipped')
      }

      try {
        const radarRes = await agents.getSkillRadar()
        setSkillRadar(radarRes.result || [])
      } catch (e) {
        console.log('Skill radar fetch skipped')
      }

    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  // Record progress for a concept
  const recordProgress = useCallback(async (conceptId, success) => {
    if (!isAuthenticated) {
      console.log('User not authenticated, progress not saved')
      return null
    }

    try {
      const result = await learnAPI.recordProgress(conceptId, success)
      
      // Update local state optimistically
      setProgress(prev => {
        const existing = prev.find(p => p.concept_id === conceptId)
        if (existing) {
          return prev.map(p => p.concept_id === conceptId 
            ? { ...p, mastery: result.mastery, exposures: (p.exposures || 0) + 1 }
            : p
          )
        }
        return [...prev, { concept_id: conceptId, mastery: result.mastery, exposures: 1 }]
      })

      // Refresh stats
      await loadUserData()
      
      return result
    } catch (error) {
      console.error('Failed to record progress:', error)
      throw error
    }
  }, [isAuthenticated, loadUserData])

  // Get mastery for a specific concept
  const getMastery = useCallback((conceptId) => {
    const concept = progress.find(p => p.concept_id === conceptId)
    return concept?.mastery || 0
  }, [progress])

  // Get concepts due for review
  const getDueForReview = useCallback(() => {
    return progress.filter(p => {
      if (!p.next_review) return false
      return new Date(p.next_review) <= new Date()
    })
  }, [progress])

  // Get weak concepts (mastery < 50%)
  const getWeakConcepts = useCallback(() => {
    return progress.filter(p => p.mastery < 50)
  }, [progress])

  // Get strong concepts (mastery >= 80%)
  const getStrongConcepts = useCallback(() => {
    return progress.filter(p => p.mastery >= 80)
  }, [progress])

  const value = {
    // Data
    progress,
    stats,
    readiness,
    skillRadar,
    loading,
    lastSync,
    
    // Actions
    loadUserData,
    recordProgress,
    
    // Helpers
    getMastery,
    getDueForReview,
    getWeakConcepts,
    getStrongConcepts,
    
    // Convenience stats
    totalConcepts: progress.length,
    avgMastery: stats?.avg_mastery || 0,
    dueCount: getDueForReview().length,
    weakCount: getWeakConcepts().length,
    strongCount: getStrongConcepts().length
  }

  return (
    <LearningContext.Provider value={value}>
      {children}
    </LearningContext.Provider>
  )
}

export function useLearning() {
  const context = useContext(LearningContext)
  if (!context) {
    throw new Error('useLearning must be used within LearningProvider')
  }
  return context
}

export default LearningContext
