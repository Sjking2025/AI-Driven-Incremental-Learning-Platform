// ========================================
// Learn Page
// Connected to Explainer + Scenario Agents
// ========================================

import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useExplainer } from '../hooks/useAgents'
import { learnAPI } from '../services/api'
import { useAppStore } from '../stores/useAppStore'
import ReactMarkdown from 'react-markdown'

// Static concept data (fallback)
const conceptData = {
  'design-principles': {
    title: 'Design Principles',
    steps: [
      {
        id: 'intro',
        title: '1. Concept Intro',
        content: `### What is Visual Hierarchy?

Visual hierarchy is the arrangement of elements to show their order of importance.

**Where it's used:**
- Landing pages - Guide users to CTA
- Dashboards - Highlight key metrics
- E-commerce - Focus on products`
      }
    ]
  }
}

function Learn() {
  const { conceptId } = useParams()
  const { isAuthenticated } = useAuth()
  const { explain, explanation, loading, error } = useExplainer()
  const updateConceptMastery = useAppStore((state) => state.updateConceptMastery)
  
  const [currentStep, setCurrentStep] = useState(0)
  const [aiContent, setAiContent] = useState(null)

  const concept = conceptData[conceptId] || { title: conceptId?.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), steps: [] }

  // Fetch AI explanation when concept changes
  useEffect(() => {
    if (isAuthenticated && conceptId) {
      explain(conceptId, 'beginner')
    }
  }, [isAuthenticated, conceptId, explain])

  // Update AI content when explanation is received
  useEffect(() => {
    if (explanation) {
      setAiContent(explanation)
    }
  }, [explanation])

  const handleComplete = async () => {
    updateConceptMastery(conceptId, 0.8)
    
    // Record to backend if authenticated
    if (isAuthenticated) {
      try {
        await learnAPI.recordProgress(conceptId, true)
      } catch (err) {
        console.error('Failed to record progress:', err)
      }
    }
  }

  const steps = [
    { id: 'ai-explain', title: '🧠 AI Explanation' },
    ...(concept.steps || []),
    { id: 'practice', title: '🎯 Practice' }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <Link to="/foundation" className="text-sm text-slate-400 hover:text-white">
          ← Back to Foundation
        </Link>
        <div className="flex items-center gap-4 mt-4">
          <h1 className="text-3xl font-bold">{concept.title}</h1>
          {isAuthenticated && (
            <span className="badge badge-primary text-xs">
              Explainer Agent Active
            </span>
          )}
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
          // AI Explanation (first step)
          <div>
            <h3 className="flex items-center gap-2">
              <span>🧠</span>
              AI-Generated Explanation
            </h3>
            
            {loading ? (
              <div className="flex items-center gap-3 py-8">
                <div className="animate-spin w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full" />
                <span className="text-slate-400">Explainer Agent is preparing your lesson...</span>
              </div>
            ) : error ? (
              <div className="bg-rose-950/30 border border-rose-500/50 rounded-lg p-4">
                <p className="text-rose-300">{error}</p>
                {!isAuthenticated && (
                  <Link to="/login" className="text-indigo-400 hover:underline mt-2 block">
                    Log in for AI-powered explanations →
                  </Link>
                )}
              </div>
            ) : aiContent ? (
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
                {aiContent}
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
        ) : currentStep === steps.length - 1 ? (
          // Practice step (last step)
          <div>
            <h3>🎯 Practice Challenge</h3>
            <p>Apply what you've learned with a real-world scenario.</p>
            
            <div className="bg-slate-800 p-4 rounded-lg my-4">
              <p className="font-semibold mb-2">Your Task:</p>
              <p>Explain {conceptId?.replace(/-/g, ' ')} to a junior developer in your own words.</p>
            </div>

            <div className="bg-indigo-900/50 p-4 rounded-lg">
              <p className="font-semibold mb-2">💡 Senior Tip:</p>
              <p>If you can teach it, you understand it. Try explaining without looking at the notes.</p>
            </div>
          </div>
        ) : (
          // Static steps
          <div dangerouslySetInnerHTML={{ __html: steps[currentStep]?.content || '' }} />
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
          <Link 
            to="/foundation"
            onClick={handleComplete}
            className="btn btn-primary"
          >
            Complete Module ✓
          </Link>
        ) : (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="btn btn-primary"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}

export default Learn
