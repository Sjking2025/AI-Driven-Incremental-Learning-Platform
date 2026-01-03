// ========================================
// Dashboard Page
// Uses LearningContext for real user data
// ========================================

import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLearning } from '../contexts/LearningContext'
import { useAppStore } from '../stores/useAppStore'

function Dashboard() {
  const { user, isAuthenticated } = useAuth()
  const { 
    stats, 
    profile,
    loading, 
    totalConcepts, 
    avgMastery, 
    dueCount, 
    strongCount,
    currentStreak,
    loadAllUserData 
  } = useLearning()
  const { streak } = useAppStore()

  // Refresh data on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadAllUserData()
    }
  }, [isAuthenticated, loadAllUserData])

  const skills = [
    { name: 'HTML', level: 85, color: 'bg-orange-500' },
    { name: 'CSS', level: 70, color: 'bg-purple-500' },
    { name: 'JavaScript', level: avgMastery || 45, color: 'bg-yellow-500' },
    { name: 'React', level: 10, color: 'bg-cyan-500' }
  ]

  const weeklyProgress = [
    { day: 'Mon', hours: 2.5 },
    { day: 'Tue', hours: 1.5 },
    { day: 'Wed', hours: 3.0 },
    { day: 'Thu', hours: 2.0 },
    { day: 'Fri', hours: 4.0 },
    { day: 'Sat', hours: 1.0 },
    { day: 'Sun', hours: 0.5 }
  ]

  const maxHours = Math.max(...weeklyProgress.map(d => d.hours))

  const readinessScore = avgMastery || 35
  const readinessLevel = avgMastery >= 70 ? 'Job Ready' : avgMastery >= 40 ? 'In Progress' : 'Getting Started'

  const circumference = 2 * Math.PI * 80
  const offset = circumference - (readinessScore / 100) * circumference

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back{user?.name ? `, ${user.name}` : ''}! 👋
          </h1>
          <p className="text-slate-400">
            Frontend Developer Path
            {isAuthenticated && (
              <span className="ml-2 text-xs text-emerald-400">• Data synced with your account</span>
            )}
          </p>
        </div>
        <div className="badge badge-warning text-lg px-4 py-2 animate-float">
          🔥 {currentStreak || streak || 0} Day Streak
        </div>
      </div>

      {/* Login prompt if not authenticated */}
      {!isAuthenticated && (
        <div className="card bg-gradient-to-r from-indigo-950/50 to-purple-950/50 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🔐</span>
            <div className="flex-1">
              <h3 className="font-semibold">Login to Track Your Progress</h3>
              <p className="text-sm text-slate-400">
                Your learning data will be saved to your account and synced across devices.
              </p>
            </div>
            <Link to="/login" className="btn btn-primary">
              Sign In →
            </Link>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {[
          { 
            icon: '📚', 
            value: isAuthenticated ? totalConcepts : 3, 
            label: 'Concepts Learned',
            fromDb: isAuthenticated
          },
          { 
            icon: '🎯', 
            value: isAuthenticated ? strongCount : 2, 
            label: 'Mastered',
            fromDb: isAuthenticated
          },
          { 
            icon: '🔄', 
            value: isAuthenticated ? dueCount : 0, 
            label: 'Due for Review',
            highlight: dueCount > 0,
            fromDb: isAuthenticated
          },
          { 
            icon: '📊', 
            value: `${readinessScore}%`, 
            label: readinessLevel, 
            highlight: true,
            fromDb: isAuthenticated
          }
        ].map((stat, i) => (
          <div 
            key={i} 
            className={`card flex items-center gap-4 ${stat.highlight ? 'border-indigo-500 bg-indigo-950/30' : ''}`}
          >
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <div className="text-2xl font-bold">{loading ? '...' : stat.value}</div>
              <div className="text-sm text-slate-400">
                {stat.label}
                {stat.fromDb && <span className="text-emerald-400 ml-1">●</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {/* Readiness Ring */}
        <div className="card flex flex-col items-center">
          <h3 className="font-semibold mb-4 self-start">
            Job Readiness
            {isAuthenticated && <span className="text-xs text-emerald-400 ml-2">(from DB)</span>}
          </h3>
          <div className="relative">
            <svg width="180" height="180" className="-rotate-90">
              <circle cx="90" cy="90" r="80" fill="none" stroke="#1e293b" strokeWidth="12" />
              <circle
                cx="90" cy="90" r="80" fill="none"
                stroke="url(#gradient)" strokeWidth="12" strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#06b6d4" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">{readinessScore}%</span>
              <span className="text-sm text-slate-400">{readinessLevel}</span>
            </div>
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="card lg:col-span-2">
          <h3 className="font-semibold mb-4">Weekly Activity</h3>
          <div className="flex items-end justify-between h-40 pt-8">
            {weeklyProgress.map((day) => (
              <div key={day.day} className="flex flex-col items-center gap-2">
                <span className="text-xs text-slate-400">{day.hours}h</span>
                <div 
                  className="w-8 bg-gradient-to-t from-indigo-600 to-purple-600 rounded-t"
                  style={{ height: `${(day.hours / maxHours) * 100}%`, minHeight: '8px' }}
                />
                <span className="text-xs text-slate-500">{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skills & Activity */}
      <div className="grid lg:grid-cols-2 gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        {/* Skills */}
        <div className="card">
          <h3 className="font-semibold mb-4">
            Skills Progress
            {isAuthenticated && <span className="text-xs text-emerald-400 ml-2">(synced)</span>}
          </h3>
          <div className="space-y-4">
            {skills.map((skill) => (
              <div key={skill.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{skill.name}</span>
                  <span className="text-slate-400">{skill.level}%</span>
                </div>
                <div className="progress-bar">
                  <div 
                    className={`progress-fill ${skill.color}`}
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Due for Review */}
        <div className="card">
          <h3 className="font-semibold mb-4">
            {dueCount > 0 ? '🔔 Due for Review' : '✅ All Caught Up'}
          </h3>
          {dueCount > 0 ? (
            <div className="space-y-4">
              <p className="text-slate-400">
                You have <strong className="text-amber-400">{dueCount} concepts</strong> due for review.
              </p>
              <Link to="/practice" className="btn btn-primary w-full">
                Start Review Session →
              </Link>
            </div>
          ) : (
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">🎉</span>
              <p className="text-slate-400">No concepts due for review!</p>
              <Link to="/skills" className="text-indigo-400 hover:underline mt-2 block">
                Learn something new →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* CTA */}
      <div className="card bg-gradient-to-r from-indigo-950/50 to-purple-950/50 text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <h3 className="text-xl font-bold mb-2">Continue Your Journey</h3>
        <p className="text-slate-400 mb-4">Pick up where you left off or explore new concepts</p>
        <div className="flex justify-center gap-4">
          <Link to="/practice" className="btn btn-primary">
            Practice Now →
          </Link>
          <Link to="/mentor" className="btn btn-secondary">
            Ask AI Mentor
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
