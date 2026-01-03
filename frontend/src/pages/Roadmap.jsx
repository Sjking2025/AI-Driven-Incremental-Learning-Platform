// ========================================
// Roadmap Page
// Connected to Backend Curriculum Agent
// ========================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { agents } from '../services/api'
import { useAppStore } from '../stores/useAppStore'

const roadmapPhases = [
  {
    id: 'foundation',
    title: 'Foundation Phase',
    subtitle: 'Before You Code',
    status: 'current',
    topics: [
      { name: 'Design Principles', completed: true },
      { name: 'Layout Reasoning', completed: true },
      { name: 'UX Thinking', completed: false }
    ]
  },
  {
    id: 'html-css',
    title: 'HTML & CSS',
    subtitle: 'Building Blocks',
    status: 'locked',
    topics: [
      { name: 'Semantic HTML', completed: false },
      { name: 'CSS Box Model', completed: false },
      { name: 'Flexbox & Grid', completed: false },
      { name: 'Responsive Design', completed: false }
    ]
  },
  {
    id: 'javascript',
    title: 'JavaScript Core',
    subtitle: 'Programming Logic',
    status: 'locked',
    topics: [
      { name: 'Variables & Types', completed: false },
      { name: 'Functions & Scope', completed: false },
      { name: 'DOM Manipulation', completed: false },
      { name: 'Async JavaScript', completed: false }
    ]
  },
  {
    id: 'react',
    title: 'React Framework',
    subtitle: 'Modern UI',
    status: 'locked',
    topics: [
      { name: 'Components & Props', completed: false },
      { name: 'State Management', completed: false },
      { name: 'Hooks', completed: false },
      { name: 'Performance', completed: false }
    ]
  }
]

function Roadmap() {
  const { isAuthenticated } = useAuth()
  const selectedCareer = useAppStore((state) => state.selectedCareer)
  
  const [customGoal, setCustomGoal] = useState('')
  const [aiRoadmap, setAiRoadmap] = useState(null)
  const [generating, setGenerating] = useState(false)

  const generateCustomRoadmap = async () => {
    if (!customGoal.trim()) return
    
    setGenerating(true)
    try {
      const result = await agents.generateRoadmap(customGoal, [])
      setAiRoadmap(result.result)
    } catch (err) {
      console.error('Failed to generate roadmap:', err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center animate-fade-in-up">
        <span className="badge badge-primary mb-2">
          {isAuthenticated ? '📚 Curriculum Agent Active' : '🎨 Frontend Developer'}
        </span>
        <h1 className="text-4xl font-bold mb-2">Your Learning Roadmap</h1>
        <p className="text-slate-400">Master each phase before moving forward</p>
      </div>

      {/* AI Roadmap Generator */}
      {isAuthenticated && (
        <div className="card bg-gradient-to-r from-indigo-950/50 to-purple-950/50 animate-fade-in-up">
          <h3 className="text-xl font-bold mb-4">🎯 Generate Custom Roadmap</h3>
          <p className="text-slate-400 mb-4">
            Tell the Curriculum Agent your goal, and it'll design a personalized learning path.
          </p>
          
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              placeholder="e.g., Become a React developer, Learn Node.js backend..."
              className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={generateCustomRoadmap}
              disabled={generating || !customGoal.trim()}
              className="btn btn-primary disabled:opacity-50"
            >
              {generating ? 'Generating...' : 'Generate Roadmap'}
            </button>
          </div>

          {aiRoadmap && aiRoadmap.roadmap && (
            <div className="bg-slate-800/50 rounded-lg p-6 mt-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold">{aiRoadmap.roadmap.goal}</h4>
                <span className="badge badge-primary">
                  ~{aiRoadmap.roadmap.estimatedWeeks} weeks
                </span>
              </div>
              
              <div className="space-y-4">
                {aiRoadmap.roadmap.phases?.map((phase, i) => (
                  <div key={i} className="border-l-2 border-indigo-500 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-indigo-400 font-semibold">{phase.name}</span>
                      <span className="text-xs text-slate-500">{phase.weeks} weeks</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {phase.skills?.map((skill, j) => (
                        <span key={j} className="text-xs px-2 py-1 bg-slate-700 rounded">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Progress Line */}
      <div className="max-w-3xl mx-auto space-y-0">
        {roadmapPhases.map((phase, i) => (
          <div 
            key={phase.id} 
            className="relative animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            {/* Connector Line */}
            {i < roadmapPhases.length - 1 && (
              <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-slate-800" />
            )}

            <div className={`card flex gap-6 ${
              phase.status === 'current' 
                ? 'border-indigo-500 bg-indigo-950/20' 
                : phase.status === 'locked' 
                  ? 'opacity-60' 
                  : ''
            }`}>
              {/* Icon */}
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                phase.status === 'current' 
                  ? 'bg-indigo-600' 
                  : phase.status === 'completed'
                    ? 'bg-emerald-600'
                    : 'bg-slate-800'
              }`}>
                {phase.status === 'completed' ? '✓' : phase.status === 'locked' ? '🔒' : i + 1}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold">{phase.title}</h3>
                    <p className="text-sm text-slate-400">{phase.subtitle}</p>
                  </div>
                  {phase.status === 'current' && (
                    <Link to="/foundation" className="btn btn-primary text-sm">
                      Continue →
                    </Link>
                  )}
                </div>

                {/* Topics */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {phase.topics.map((topic) => (
                    <span 
                      key={topic.name}
                      className={`text-xs px-3 py-1 rounded-full ${
                        topic.completed 
                          ? 'bg-emerald-500/20 text-emerald-400' 
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {topic.completed && '✓ '}{topic.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Roadmap
