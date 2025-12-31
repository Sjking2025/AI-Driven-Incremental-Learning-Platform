// ========================================
// Practice Page
// Wrapper for practice sessions
// ========================================

import { useState } from 'react'
import PracticeSession from '../components/PracticeSession'
import { useLearningStats } from '../stores/useConceptMemory'

function Practice() {
  const stats = useLearningStats()
  const [showSession, setShowSession] = useState(false)
  
  if (showSession) {
    return (
      <div>
        <button 
          onClick={() => setShowSession(false)}
          className="text-sm text-slate-400 hover:text-white mb-6"
        >
          ← Back to Practice Menu
        </button>
        <PracticeSession />
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      <div className="text-center animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-4">Practice Mode</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Reinforce your learning with mixed practice. The system prioritizes 
          your weak areas automatically.
        </p>
      </div>
      
      {/* Stats */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { label: 'Concepts Practiced', value: stats.totalPracticed, icon: '📚' },
          { label: 'Average Mastery', value: `${stats.averageMastery}%`, icon: '📊' },
          { label: 'Weak Areas', value: stats.weakCount, icon: '⚠️' },
          { label: 'Due for Review', value: stats.dueForReview, icon: '🔄' }
        ].map((stat, i) => (
          <div key={i} className="card text-center">
            <span className="text-2xl mb-2 block">{stat.icon}</span>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>
      
      {/* Practice Options */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card hover:border-indigo-500 cursor-pointer" onClick={() => setShowSession(true)}>
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">Mixed Practice</h3>
          <p className="text-slate-400 mb-4">
            Random mix of all concepts you've learned. Prioritizes weak areas.
          </p>
          <button className="btn btn-primary w-full">
            Start Session →
          </button>
        </div>
        
        <div className="card hover:border-amber-500 cursor-pointer opacity-75">
          <div className="text-3xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold mb-2">Weak Areas Focus</h3>
          <p className="text-slate-400 mb-4">
            Intensive practice on concepts with mastery below 50%.
          </p>
          <button className="btn btn-secondary w-full" disabled>
            Coming Soon
          </button>
        </div>
      </div>
      
      {/* Learning Tip */}
      <div className="glass rounded-xl p-6">
        <h4 className="font-semibold mb-2">💡 Incremental Learning Tip</h4>
        <p className="text-slate-400">
          Our system automatically mixes in concepts you've learned before. 
          This "spaced repetition" prevents forgetting and builds long-term memory.
        </p>
      </div>
    </div>
  )
}

export default Practice
