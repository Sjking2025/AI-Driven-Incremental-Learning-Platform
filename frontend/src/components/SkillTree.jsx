// ========================================
// Skill Tree Visualization Component
// Tracks clicks and shows real DB progress
// ========================================

import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLearning } from '../contexts/LearningContext'
import { 
  frontendSkillGraph, 
  getConceptsByPhase, 
  canUnlock,
  calculateProgress 
} from '../data/skillGraph'
import { useConceptMemory } from '../stores/useConceptMemory'

const phaseInfo = {
  foundation: { title: 'Foundation', icon: '🎨', color: 'indigo' },
  'html-css': { title: 'HTML & CSS', icon: '📐', color: 'cyan' },
  javascript: { title: 'JavaScript', icon: '⚡', color: 'yellow' }
}

function SkillTree() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { 
    progress: dbProgress, 
    getMastery, 
    getConceptStatus, 
    viewConcept, 
    updateProfile,
    profile,
    loading 
  } = useLearning()
  const { concepts: localMastery } = useConceptMemory()
  
  // Use DB progress if authenticated, otherwise local
  const masteryData = useMemo(() => {
    if (isAuthenticated && dbProgress.length > 0) {
      return dbProgress.reduce((acc, p) => {
        acc[p.concept_id] = {
          mastery: p.mastery,
          exposures: p.exposures,
          status: p.status
        }
        return acc
      }, {})
    }
    return localMastery
  }, [isAuthenticated, dbProgress, localMastery])
  
  const completedConcepts = useMemo(() => 
    Object.entries(masteryData)
      .filter(([_, data]) => data.mastery >= 70)
      .map(([id]) => id),
    [masteryData]
  )
  
  const conceptsByPhase = useMemo(() => 
    getConceptsByPhase(frontendSkillGraph),
    []
  )
  
  const progress = calculateProgress(completedConcepts)

  // Handle concept click - track view and navigate
  const handleConceptClick = async (concept, isLocked) => {
    if (isLocked) return
    
    // Track view in database
    if (isAuthenticated) {
      await viewConcept(concept.id, 'skill_tree')
      
      // Update current concept in profile
      await updateProfile({
        currentConcept: concept.id,
        currentPhase: concept.phase
      })
    }
    
    // Navigate to learn page
    navigate(`/learn/${concept.id}`)
  }
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Skill Tree</h2>
          <p className="text-slate-400">
            {isAuthenticated 
              ? 'Progress synced with your account' 
              : 'Login to save your progress'}
            {isAuthenticated && <span className="text-emerald-400 ml-1">●</span>}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-indigo-400">{progress}%</div>
          <div className="text-sm text-slate-400">Complete</div>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="progress-bar h-3">
        <div 
          className="progress-fill" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Current Phase Indicator */}
      {isAuthenticated && profile?.current_phase && (
        <div className="glass rounded-lg p-3 flex items-center gap-3">
          <span className="text-lg">📍</span>
          <div>
            <div className="text-sm text-slate-400">Currently learning</div>
            <div className="font-semibold">{phaseInfo[profile.current_phase]?.title || profile.current_phase}</div>
          </div>
        </div>
      )}
      
      {/* Phases */}
      {Object.entries(conceptsByPhase).map(([phaseId, concepts]) => {
        const info = phaseInfo[phaseId] || { title: phaseId, icon: '📚', color: 'slate' }
        const phaseCompleted = concepts.filter(c => completedConcepts.includes(c.id)).length
        const isCurrentPhase = profile?.current_phase === phaseId
        
        return (
          <div 
            key={phaseId} 
            className={`space-y-4 ${isCurrentPhase ? 'border-l-2 border-indigo-500 pl-4' : ''}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{info.icon}</span>
              <h3 className="text-lg font-semibold">{info.title}</h3>
              <span className={`badge ${phaseCompleted === concepts.length ? 'bg-emerald-500/20 text-emerald-400' : 'badge-primary'}`}>
                {phaseCompleted}/{concepts.length}
              </span>
              {isCurrentPhase && (
                <span className="badge bg-indigo-500/20 text-indigo-400">Current</span>
              )}
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {concepts.map(concept => (
                <ConceptNode 
                  key={concept.id}
                  concept={concept}
                  masteryData={masteryData[concept.id]}
                  isCompleted={completedConcepts.includes(concept.id)}
                  isUnlocked={canUnlock(concept.id, completedConcepts)}
                  onClick={() => handleConceptClick(concept, !canUnlock(concept.id, completedConcepts) && !completedConcepts.includes(concept.id))}
                  isAuthenticated={isAuthenticated}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ConceptNode({ concept, masteryData, isCompleted, isUnlocked, onClick, isAuthenticated }) {
  const mastery = masteryData?.mastery || 0
  const exposures = masteryData?.exposures || 0
  const locked = !isCompleted && !isUnlocked
  
  const statusColor = isCompleted 
    ? 'border-emerald-500 bg-emerald-950/20' 
    : mastery > 0 
      ? 'border-amber-500/50 bg-amber-950/10'
      : locked 
        ? 'opacity-50 cursor-not-allowed' 
        : 'hover:border-indigo-500'
  
  return (
    <div 
      className={`card transition-all cursor-pointer ${statusColor}`}
      onClick={() => !locked && onClick()}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{concept.title}</h4>
        {isCompleted && <span className="text-emerald-400">✓</span>}
        {!isCompleted && mastery > 0 && <span className="text-amber-400">◐</span>}
        {locked && <span className="text-slate-500">🔒</span>}
      </div>
      
      {/* Mastery Bar */}
      {(masteryData || mastery > 0) && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Mastery</span>
            <span>
              {mastery}%
              {exposures > 0 && <span className="ml-1 text-slate-500">({exposures}x)</span>}
            </span>
          </div>
          <div className="progress-bar">
            <div 
              className={`h-full rounded-full transition-all ${
                mastery >= 70 ? 'bg-emerald-500' : 
                mastery >= 40 ? 'bg-amber-500' : 'bg-rose-500'
              }`}
              style={{ width: `${mastery}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-3">
        {concept.skills.slice(0, 3).map(skill => (
          <span key={skill} className="text-xs px-2 py-0.5 bg-slate-800 rounded">
            {skill}
          </span>
        ))}
      </div>
      
      {/* Prerequisites */}
      {concept.prerequisites.length > 0 && (
        <div className="text-xs text-slate-500 mb-3">
          Requires: {concept.prerequisites.join(', ')}
        </div>
      )}
      
      {/* Action */}
      {!locked && (
        <div 
          className={`btn w-full text-center text-sm ${
            isCompleted ? 'btn-secondary' : 'btn-primary'
          }`}
        >
          {isCompleted ? 'Review' : mastery > 0 ? 'Continue' : 'Start'} →
        </div>
      )}

      {/* DB indicator */}
      {isAuthenticated && mastery > 0 && (
        <div className="text-xs text-emerald-400 mt-2 text-center">
          ● Saved to DB
        </div>
      )}
    </div>
  )
}

export default SkillTree
