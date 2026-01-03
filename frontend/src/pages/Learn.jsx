// ========================================
// Learn Page
// Tracks views and completion to database
// ========================================

import { useState, useEffect, useRef } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLearning } from '../contexts/LearningContext'
import { useExplainer } from '../hooks/useAgents'
import { learnAPI } from '../services/api'
import { useAppStore } from '../stores/useAppStore'
import { frontendSkillGraph } from '../data/skillGraph'
import ReactMarkdown from 'react-markdown'

function Learn() {
  const { conceptId } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { 
    viewConcept, 
    recordProgress, 
    updateProfile, 
    getMastery,
    loadAllUserData 
  } = useLearning()
  const { explain, explanation, loading: aiLoading, error: aiError } = useExplainer()
  const updateConceptMastery = useAppStore((state) => state.updateConceptMastery)
  
  const [currentStep, setCurrentStep] = useState(0)
  const [startTime] = useState(Date.now())
  const [completed, setCompleted] = useState(false)
  const hasTrackedView = useRef(false)

  // Get concept data from skill graph
  const concept = frontendSkillGraph[conceptId] || { 
    title: conceptId?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), 
    skills: [],
    phase: 'foundation'
  }

  const currentMastery = getMastery(conceptId) || 0

  // Track view when page loads
  useEffect(() => {
    if (isAuthenticated && conceptId && !hasTrackedView.current) {
      hasTrackedView.current = true
      viewConcept(conceptId, 'learn_page', 0)
      console.log(`👁️ Tracked view: ${conceptId}`)
    }
  }, [isAuthenticated, conceptId, viewConcept])

  // Fetch AI explanation when concept changes
  useEffect(() => {
    if (isAuthenticated && conceptId) {
      explain(conceptId, 'beginner')
    }
  }, [isAuthenticated, conceptId, explain])

  // Track time spent when leaving
  useEffect(() => {
    return () => {
      if (isAuthenticated && conceptId && hasTrackedView.current) {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000)
        if (timeSpent > 5) {
          viewConcept(conceptId, 'learn_page', timeSpent)
          console.log(`⏱️ Time tracked: ${timeSpent}s on ${conceptId}`)
        }
      }
    }
  }, [])

  const handleComplete = async () => {
    // Update local store
    updateConceptMastery(conceptId, 0.8)
    
    // Save to database if authenticated
    if (isAuthenticated) {
      try {
        await recordProgress(conceptId, true)
        
        // Track final time
        const timeSpent = Math.floor((Date.now() - startTime) / 1000)
        await viewConcept(conceptId, 'learn_page', timeSpent)
        
        // Refresh data
        await loadAllUserData()
        
        setCompleted(true)
        console.log(`✅ Completed: ${conceptId}`)
      } catch (err) {
        console.error('Failed to save completion:', err)
      }
    } else {
      setCompleted(true)
    }
  }

  const steps = [
    { id: 'intro', title: '1. Concept Intro' },
    { id: 'ai-explain', title: '🧠 AI Explanation' },
    { id: 'practice', title: '🎯 Practice' }
  ]

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-6xl mb-6">🎉</div>
        <h2 className="text-3xl font-bold mb-4">Concept Completed!</h2>
        <p className="text-slate-400 mb-2">{concept.title}</p>
        {isAuthenticated && (
          <p className="text-emerald-400 mb-8">✅ Progress saved to your account</p>
        )}
        
        <div className="flex gap-4 justify-center">
          <Link to="/skills" className="btn btn-secondary">
            ← Back to Skill Tree
          </Link>
          <Link to="/practice" className="btn btn-primary">
            Practice →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <Link to="/skills" className="text-sm text-slate-400 hover:text-white">
          ← Back to Skill Tree
        </Link>
        <div className="flex items-center justify-between mt-4">
          <div>
            <h1 className="text-3xl font-bold">{concept.title}</h1>
            <p className="text-slate-400">{concept.phase}</p>
          </div>
          <div className="text-right">
            {isAuthenticated && (
              <div className="badge badge-primary mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2" />
                Tracking
              </div>
            )}
            {currentMastery > 0 && (
              <div className="text-2xl font-bold text-indigo-400">{currentMastery}%</div>
            )}
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {steps.map((step, i) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(i)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
              currentStep === i
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {step.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div 
        className="card prose prose-invert max-w-none animate-fade-in-up"
        style={{ animationDelay: '0.2s' }}
      >
        {currentStep === 0 ? (
          // Intro
          <div>
            <h3>What is {concept.title}?</h3>
            <p className="text-slate-400">
              This concept is part of the <strong>{concept.phase}</strong> phase.
            </p>
            
            {concept.skills && concept.skills.length > 0 && (
              <div className="mt-4">
                <h4>Skills you'll learn:</h4>
                <div className="flex flex-wrap gap-2 not-prose">
                  {concept.skills.map(skill => (
                    <span key={skill} className="badge badge-primary">{skill}</span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-indigo-900/30 p-4 rounded-lg mt-6">
              <strong>💡 Tip:</strong> Check the AI Explanation tab for a personalized lesson.
            </div>
          </div>
        ) : currentStep === 1 ? (
          // AI Explanation
          <div>
            <h3 className="flex items-center gap-2">
              <span>🧠</span>
              AI-Generated Explanation
            </h3>
            
            {aiLoading ? (
              <div className="flex items-center gap-3 py-8">
                <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
                <span className="text-slate-400">Explainer Agent is preparing your lesson...</span>
              </div>
            ) : aiError ? (
              <div className="bg-rose-950/30 border border-rose-500/50 rounded-lg p-4">
                <p className="text-rose-300">{aiError}</p>
                {!isAuthenticated && (
                  <Link to="/login" className="text-indigo-400 hover:underline mt-2 block">
                    Log in for AI-powered explanations →
                  </Link>
                )}
              </div>
            ) : explanation ? (
              <ReactMarkdown
                components={{
                  code: ({ inline, children }) => 
                    inline ? (
                      <code className="bg-slate-700 px-1 rounded">{children}</code>
                    ) : (
                      <pre className="bg-slate-900 p-3 rounded-lg overflow-x-auto">
                        <code>{children}</code>
                      </pre>
                    )
                }}
              >
                {explanation}
              </ReactMarkdown>
            ) : (
              <div className="text-slate-400">
                <p>Log in to get AI-powered explanations from the Explainer Agent.</p>
                <Link to="/login" className="btn btn-primary mt-4">
                  Sign In →
                </Link>
              </div>
            )}
          </div>
        ) : (
          // Practice
          <div>
            <h3>🎯 Practice Challenge</h3>
            <p>Apply what you've learned with a real-world scenario.</p>
            
            <div className="bg-slate-800 p-4 rounded-lg my-4">
              <p className="font-semibold mb-2">Your Task:</p>
              <p>Explain {concept.title} to a junior developer in your own words.</p>
            </div>

            <div className="bg-indigo-900/50 p-4 rounded-lg">
              <p className="font-semibold mb-2">💡 Senior Tip:</p>
              <p>If you can teach it, you understand it. Try explaining without looking at the notes.</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="btn btn-secondary disabled:opacity-50"
        >
          ← Previous
        </button>

        {currentStep === steps.length - 1 ? (
          <button 
            onClick={handleComplete}
            className="btn btn-primary"
          >
            Complete Concept ✓
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="btn btn-primary"
          >
            Next →
          </button>
        )}
      </div>

      {/* Time indicator */}
      {isAuthenticated && (
        <div className="text-center text-xs text-slate-500">
          Time tracking active • Progress saves automatically
        </div>
      )}
    </div>
  )
}

export default Learn
