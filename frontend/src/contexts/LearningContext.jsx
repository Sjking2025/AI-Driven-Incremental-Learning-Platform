// ========================================
// Learning Context
// Complete user data sync with backend
// ========================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { userAPI, learnAPI } from '../services/api'

const LearningContext = createContext(null)

export function LearningProvider({ children }) {
  const { isAuthenticated, user } = useAuth()
  
  // User profile from database
  const [profile, setProfile] = useState(null)
  
  // Progress data from database
  const [progress, setProgress] = useState([])
  const [views, setViews] = useState([])
  const [activity, setActivity] = useState([])
  const [sessions, setSessions] = useState([])
  const [stats, setStats] = useState(null)
  
  // Loading states
  const [loading, setLoading] = useState(false)
  const [lastSync, setLastSync] = useState(null)

  // Load all user data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadAllUserData()
    } else {
      // Clear data when logged out
      setProfile(null)
      setProgress([])
      setViews([])
      setActivity([])
      setSessions([])
      setStats(null)
    }
  }, [isAuthenticated])

  // Load all user data from backend
  const loadAllUserData = useCallback(async () => {
    if (!isAuthenticated) return
    
    setLoading(true)
    try {
      const data = await userAPI.getAllProgress()
      
      setProfile(data.profile || null)
      setProgress(data.progress || [])
      setViews(data.views || [])
      setActivity(data.activity || [])
      setStats(data.stats || null)
      setLastSync(new Date())
      
      console.log('✅ Loaded user data from database')
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setLoading(false)
    }
  }, [isAuthenticated])

  // Update profile
  const updateProfile = useCallback(async (updates) => {
    if (!isAuthenticated) return null
    
    try {
      const result = await userAPI.updateProfile(updates)
      setProfile(result.profile)
      return result.profile
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error
    }
  }, [isAuthenticated])

  // Record viewing a concept
  const viewConcept = useCallback(async (conceptId, source = 'learn_page', timeSpentSeconds = 0) => {
    if (!isAuthenticated) return null
    
    try {
      const result = await userAPI.viewConcept(conceptId, source, timeSpentSeconds)
      
      // Update local views
      setViews(prev => {
        const existing = prev.find(v => v.concept_id === conceptId)
        if (existing) {
          return prev.map(v => v.concept_id === conceptId 
            ? { ...v, view_count: v.view_count + 1, time_spent_seconds: (v.time_spent_seconds || 0) + timeSpentSeconds }
            : v
          )
        }
        return [...prev, { concept_id: conceptId, view_count: 1, time_spent_seconds: timeSpentSeconds }]
      })
      
      return result.view
    } catch (error) {
      console.error('Failed to record view:', error)
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
      
      // Update local progress
      setProgress(prev => {
        const existing = prev.find(p => p.concept_id === conceptId)
        if (existing) {
          return prev.map(p => p.concept_id === conceptId 
            ? { 
                ...p, 
                mastery: result.mastery, 
                exposures: (p.exposures || 0) + 1,
                successes: success ? (p.successes || 0) + 1 : p.successes,
                failures: !success ? (p.failures || 0) + 1 : p.failures
              }
            : p
          )
        }
        return [...prev, { 
          concept_id: conceptId, 
          mastery: result.mastery, 
          exposures: 1,
          successes: success ? 1 : 0,
          failures: !success ? 1 : 0
        }]
      })
      
      console.log(`📊 Progress saved: ${conceptId} → ${result.mastery}%`)
      return result
    } catch (error) {
      console.error('Failed to record progress:', error)
      throw error
    }
  }, [isAuthenticated])

  // Record daily activity
  const recordActivity = useCallback(async (data) => {
    if (!isAuthenticated) return null
    
    try {
      const result = await userAPI.recordActivity(data)
      
      // Refresh activity
      const activityRes = await userAPI.getActivity(7)
      setActivity(activityRes.activity || [])
      
      return result.activity
    } catch (error) {
      console.error('Failed to record activity:', error)
    }
  }, [isAuthenticated])

  // Practice session management
  const startPracticeSession = useCallback(async (sessionType = 'mixed') => {
    if (!isAuthenticated) return null
    
    try {
      const result = await userAPI.startPracticeSession(sessionType)
      return result.session
    } catch (error) {
      console.error('Failed to start session:', error)
    }
  }, [isAuthenticated])

  const endPracticeSession = useCallback(async (sessionId, results) => {
    if (!isAuthenticated) return null
    
    try {
      const result = await userAPI.endPracticeSession(sessionId, results)
      
      // Record activity
      await recordActivity({
        conceptsPracticed: results.conceptsPracticed?.length || 0,
        questionsAnswered: results.totalQuestions || 0,
        correctAnswers: results.correctAnswers || 0
      })
      
      // Refresh data
      await loadAllUserData()
      
      return result.session
    } catch (error) {
      console.error('Failed to end session:', error)
    }
  }, [isAuthenticated, recordActivity, loadAllUserData])

  // Helper functions
  const getMastery = useCallback((conceptId) => {
    const concept = progress.find(p => p.concept_id === conceptId)
    return concept?.mastery || 0
  }, [progress])

  const getConceptStatus = useCallback((conceptId) => {
    const concept = progress.find(p => p.concept_id === conceptId)
    if (!concept) return 'not_started'
    if (concept.mastery >= 80) return 'mastered'
    if (concept.mastery > 0) return 'in_progress'
    return 'not_started'
  }, [progress])

  const getDueForReview = useCallback(() => {
    return progress.filter(p => {
      if (!p.next_review) return false
      return new Date(p.next_review) <= new Date()
    })
  }, [progress])

  const getWeakConcepts = useCallback(() => {
    return progress.filter(p => p.mastery > 0 && p.mastery < 50)
  }, [progress])

  const getStrongConcepts = useCallback(() => {
    return progress.filter(p => p.mastery >= 80)
  }, [progress])

  const hasViewed = useCallback((conceptId) => {
    return views.some(v => v.concept_id === conceptId)
  }, [views])

  const value = {
    // Profile
    profile,
    updateProfile,
    
    // Progress data
    progress,
    views,
    activity,
    sessions,
    stats,
    
    // Loading states
    loading,
    lastSync,
    
    // Actions
    loadAllUserData,
    viewConcept,
    recordProgress,
    recordActivity,
    startPracticeSession,
    endPracticeSession,
    
    // Helpers
    getMastery,
    getConceptStatus,
    getDueForReview,
    getWeakConcepts,
    getStrongConcepts,
    hasViewed,
    
    // Computed stats
    totalConcepts: progress.length,
    avgMastery: stats?.avgMastery || 0,
    dueCount: getDueForReview().length,
    weakCount: getWeakConcepts().length,
    strongCount: getStrongConcepts().length,
    currentStreak: profile?.current_streak || 0,
    totalTimeMinutes: profile?.total_time_minutes || 0
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
