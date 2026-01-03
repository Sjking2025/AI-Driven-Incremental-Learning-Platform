// ========================================
// Practice Page
// Records progress to PostgreSQL database
// ========================================

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLearning } from '../contexts/LearningContext'
import PracticeSession from '../components/PracticeSession'

function Practice() {
  const { isAuthenticated } = useAuth()
  const { 
    stats, 
    loading, 
    totalConcepts, 
    avgMastery, 
    weakCount, 
    dueCount,
    getWeakConcepts,
    getDueForReview,
    loadAllUserData 
  } = useLearning()
  const [showSession, setShowSession] = useState(false)
  
  // Refresh data on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadAllUserData()
    }
  }, [isAuthenticated, loadAllUserData])
  
  if (showSession) {
    return (
      <div>
        <button 
          onClick={() => {
            setShowSession(false)
            loadAllUserData() // Refresh after session
          }}
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
        <div className="inline-flex items-center gap-2 badge badge-primary mb-4">
          {isAuthenticated ? '📊 Progress synced to your account' : '📚 Local Mode'}
        </div>
        <h1 className="text-4xl font-bold mb-4">Practice Mode</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          {isAuthenticated 
            ? 'Your progress is saved to the database and used to personalize your learning.'
            : 'Login to save your progress and get personalized practice sessions.'}
        </p>
      </div>

      {/* Login prompt */}
      {!isAuthenticated && (
        <div className="card bg-gradient-to-r from-amber-950/30 to-orange-950/30 border-amber-500/50">
          <div className="flex items-center gap-4">
            <span className="text-3xl">⚠️</span>
            <div className="flex-1">
              <h3 className="font-semibold text-amber-300">Progress Not Saved</h3>
              <p className="text-sm text-slate-400">
                Login to save your practice results to the database.
              </p>
            </div>
            <Link to="/login" className="btn btn-primary">
              Sign In
            </Link>
          </div>
        </div>
      )}
      
      {/* Stats from DB */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { 
            label: 'Concepts Practiced', 
            value: loading ? '...' : totalConcepts, 
            icon: '📚',
            fromDb: isAuthenticated 
          },
          { 
            label: 'Average Mastery', 
            value: loading ? '...' : `${avgMastery}%`, 
            icon: '📊',
            fromDb: isAuthenticated 
          },
          { 
            label: 'Weak Areas', 
            value: loading ? '...' : weakCount, 
            icon: '⚠️', 
            highlight: weakCount > 0,
            fromDb: isAuthenticated 
          },
          { 
            label: 'Due for Review', 
            value: loading ? '...' : dueCount, 
            icon: '🔄', 
            highlight: dueCount > 0,
            fromDb: isAuthenticated 
          }
        ].map((stat, i) => (
          <div key={i} className={`card text-center ${stat.highlight ? 'border-amber-500/50' : ''}`}>
            <span className="text-2xl mb-2 block">{stat.icon}</span>
            <div className={`text-2xl font-bold ${stat.highlight ? 'text-amber-400' : ''}`}>
              {stat.value}
            </div>
            <div className="text-sm text-slate-400">
              {stat.label}
              {stat.fromDb && <span className="text-emerald-400 ml-1">●</span>}
            </div>
          </div>
        ))}
      </div>
      
      {/* Practice Options */}
      <div className="grid md:grid-cols-2 gap-6">
        <div 
          className="card hover:border-indigo-500 cursor-pointer transition-colors" 
          onClick={() => setShowSession(true)}
        >
          <div className="text-3xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">Mixed Practice</h3>
          <p className="text-slate-400 mb-4">
            Random mix of concepts.
            {isAuthenticated && ' Results saved to your account.'}
          </p>
          <button className="btn btn-primary w-full">
            Start Session →
          </button>
        </div>
        
        <div className={`card hover:border-amber-500 cursor-pointer transition-colors ${weakCount === 0 ? 'opacity-50' : ''}`}>
          <div className="text-3xl mb-4">⚠️</div>
          <h3 className="text-xl font-semibold mb-2">Weak Areas Focus</h3>
          <p className="text-slate-400 mb-4">
            Practice concepts with mastery below 50%.
            {weakCount > 0 && ` (${weakCount} weak concepts)`}
          </p>
          <button 
            className="btn btn-secondary w-full"
            disabled={weakCount === 0 || !isAuthenticated}
          >
            {!isAuthenticated ? 'Login Required' : weakCount > 0 ? 'Focus Practice' : 'No Weak Areas'}
          </button>
        </div>
      </div>

      {/* Review Due Alert */}
      {isAuthenticated && dueCount > 0 && (
        <div className="card bg-amber-950/30 border-amber-500/50 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🔔</span>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-300">
                {dueCount} concepts due for review!
              </h4>
              <p className="text-sm text-slate-400">
                Spaced repetition works best when you review on schedule.
              </p>
            </div>
            <button 
              onClick={() => setShowSession(true)}
              className="btn btn-primary"
            >
              Review Now
            </button>
          </div>
        </div>
      )}
      
      {/* Info */}
      <div className="glass rounded-xl p-6">
        <h4 className="font-semibold mb-2">
          {isAuthenticated ? '💾 Database Sync Active' : '💡 Why Login?'}
        </h4>
        <p className="text-slate-400">
          {isAuthenticated 
            ? 'Your practice results are stored in PostgreSQL. The system tracks your mastery of each concept and calculates optimal review times using spaced repetition.'
            : 'When you login, your progress is saved to the database. This enables personalized recommendations, spaced repetition, and syncing across devices.'}
        </p>
      </div>
    </div>
  )
}

export default Practice
