// ========================================
// Skill Tree Visualization Component
// Shows concept dependencies and progress
// ========================================

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
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
  const { concepts: masteryData } = useConceptMemory()
  
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
  
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Skill Tree</h2>
          <p className="text-slate-400">Master concepts to unlock the next level</p>
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
      
      {/* Phases */}
      {Object.entries(conceptsByPhase).map(([phaseId, concepts]) => {
        const info = phaseInfo[phaseId] || { title: phaseId, icon: '📚', color: 'slate' }
        
        return (
          <div key={phaseId} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{info.icon}</span>
              <h3 className="text-lg font-semibold">{info.title}</h3>
              <span className="badge badge-primary">
                {concepts.filter(c => completedConcepts.includes(c.id)).length}/{concepts.length}
              </span>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {concepts.map(concept => (
                <ConceptNode 
                  key={concept.id}
                  concept={concept}
                  masteryData={masteryData[concept.id]}
                  isCompleted={completedConcepts.includes(concept.id)}
                  isUnlocked={canUnlock(concept.id, completedConcepts)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function ConceptNode({ concept, masteryData, isCompleted, isUnlocked }) {
  const mastery = masteryData?.mastery || 0
  const locked = !isCompleted && !isUnlocked
  
  return (
    <div 
      className={`card transition-all ${
        isCompleted 
          ? 'border-emerald-500 bg-emerald-950/20' 
          : locked 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:border-indigo-500'
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold">{concept.title}</h4>
        {isCompleted && <span className="text-emerald-400">✓</span>}
        {locked && <span className="text-slate-500">🔒</span>}
      </div>
      
      {/* Mastery Bar */}
      {masteryData && (
        <div className="mb-3">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Mastery</span>
            <span>{mastery}%</span>
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
        <Link 
          to={`/learn/${concept.id}`}
          className={`btn w-full text-center text-sm ${
            isCompleted ? 'btn-secondary' : 'btn-primary'
          }`}
        >
          {isCompleted ? 'Review' : 'Start'} →
        </Link>
      )}
    </div>
  )
}

export default SkillTree
