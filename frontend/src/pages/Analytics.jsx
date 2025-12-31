// ========================================
// Analytics Page
// Uses LearningContext for real user data
// ========================================

import { useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLearning } from '../contexts/LearningContext'
import { useConceptMemory } from '../stores/useConceptMemory'
import { 
  getRecommendations, 
  getMasteryTrend, 
  getSkillRadar as getLocalSkillRadar,
  calculateDifficultyLevel,
  DIFFICULTY
} from '../services/adaptiveLearning'
import SkillRadar from '../components/SkillRadar'
import Recommendations from '../components/Recommendations'

const difficultyInfo = {
  [DIFFICULTY.EASY]: { label: 'Beginner', color: 'text-emerald-400', icon: '🌱' },
  [DIFFICULTY.MEDIUM]: { label: 'Intermediate', color: 'text-amber-400', icon: '📈' },
  [DIFFICULTY.HARD]: { label: 'Advanced', color: 'text-orange-400', icon: '🔥' },
  [DIFFICULTY.EXPERT]: { label: 'Expert', color: 'text-rose-400', icon: '⭐' }
}

function Analytics() {
  const { isAuthenticated, user } = useAuth()
  const { 
    stats, 
    readiness, 
    skillRadar: dbSkillRadar, 
    loading, 
    lastSync,
    totalConcepts,
    avgMastery,
    weakCount,
    strongCount,
    loadUserData 
  } = useLearning()
  const { concepts: masteryData } = useConceptMemory()

  // Load fresh data on mount
  useEffect(() => {
    if (isAuthenticated) {
      loadUserData()
    }
  }, [isAuthenticated, loadUserData])
  
  const completedConcepts = useMemo(() => 
    Object.entries(masteryData)
      .filter(([_, data]) => data.mastery >= 70)
      .map(([id]) => id),
    [masteryData]
  )

  const recommendations = useMemo(() => 
    getRecommendations(masteryData, completedConcepts), 
    [masteryData, completedConcepts]
  )
  const masteryTrend = useMemo(() => getMasteryTrend(masteryData), [masteryData])
  
  const skillRadarData = useMemo(() => {
    if (isAuthenticated && dbSkillRadar && dbSkillRadar.length > 0) {
      return dbSkillRadar
    }
    return getLocalSkillRadar(masteryData)
  }, [isAuthenticated, dbSkillRadar, masteryData])

  const difficulty = useMemo(() => calculateDifficultyLevel(masteryData), [masteryData])
  const diffInfo = difficultyInfo[difficulty]

  const maxTrend = Math.max(...masteryTrend.map(d => d.value), 1)

  // Stats from DB or local
  const displayStats = {
    totalPracticed: isAuthenticated ? totalConcepts : Object.keys(masteryData).filter(k => masteryData[k]?.exposures > 0).length,
    averageMastery: isAuthenticated ? avgMastery : Object.values(masteryData).reduce((a, b) => a + (b.mastery || 0), 0) / Math.max(Object.keys(masteryData).length, 1),
    successRate: stats?.success_rate || 0,
    strongCount: isAuthenticated ? strongCount : Object.values(masteryData).filter(m => m.mastery >= 80).length,
    weakCount: isAuthenticated ? weakCount : Object.values(masteryData).filter(m => m.mastery < 50).length,
    totalExposures: stats?.total_exposures || 0
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center animate-fade-in-up">
        <div className="inline-flex items-center gap-2 badge badge-primary mb-4">
          {isAuthenticated ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Data from Database
            </>
          ) : '📊 Local Analytics'}
        </div>
        <h1 className="text-4xl font-bold mb-4">
          {user?.name ? `${user.name}'s ` : ''}Learning Analytics
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          {isAuthenticated 
            ? `Real-time stats from your account. Last synced: ${lastSync ? new Date(lastSync).toLocaleTimeString() : 'Never'}`
            : 'Login to save your progress and see personalized analytics.'}
        </p>
      </div>

      {/* Login prompt */}
      {!isAuthenticated && (
        <div className="card bg-gradient-to-r from-indigo-950/50 to-purple-950/50 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🔐</span>
            <div className="flex-1">
              <h3 className="font-semibold">Login for Real-Time Analytics</h3>
              <p className="text-sm text-slate-400">
                Your data will be stored in the database and synced across devices.
              </p>
            </div>
            <Link to="/login" className="btn btn-primary">
              Sign In →
            </Link>
          </div>
        </div>
      )}

      {/* Job Readiness (DB only) */}
      {isAuthenticated && readiness && (
        <div className="card bg-gradient-to-r from-indigo-950/50 to-purple-950/50 animate-fade-in-up">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Job Readiness Score
                <span className="text-xs text-emerald-400 ml-2">● From DB</span>
              </h3>
              <p className="text-sm text-slate-400">Based on {displayStats.totalPracticed} concepts in your account</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-indigo-400">{readiness.overall}%</div>
              <div className="text-sm text-slate-400">{readiness.level}</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
            <div className="glass rounded-lg p-2">
              <div className="text-indigo-400 font-bold">{readiness.breakdown?.mastery || 0}%</div>
              <div className="text-slate-500">Mastery</div>
            </div>
            <div className="glass rounded-lg p-2">
              <div className="text-purple-400 font-bold">{readiness.breakdown?.coverage || 0}%</div>
              <div className="text-slate-500">Coverage</div>
            </div>
            <div className="glass rounded-lg p-2">
              <div className="text-pink-400 font-bold">{readiness.breakdown?.consistency || 0}%</div>
              <div className="text-slate-500">Consistency</div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {[
          { icon: '📚', value: loading ? '...' : displayStats.totalPracticed, label: 'Concepts Practiced', fromDb: isAuthenticated },
          { icon: '📊', value: loading ? '...' : `${Math.round(displayStats.averageMastery)}%`, label: 'Avg Mastery', fromDb: isAuthenticated },
          { icon: '✅', value: loading ? '...' : `${displayStats.successRate}%`, label: 'Success Rate', fromDb: isAuthenticated },
          { icon: diffInfo.icon, value: diffInfo.label, label: 'Current Level', colorClass: diffInfo.color }
        ].map((stat, i) => (
          <div key={i} className="card text-center">
            <span className="text-2xl mb-2 block">{stat.icon}</span>
            <div className={`text-2xl font-bold ${stat.colorClass || ''}`}>{stat.value}</div>
            <div className="text-sm text-slate-400">
              {stat.label}
              {stat.fromDb && <span className="text-emerald-400 ml-1">●</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill Radar */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-semibold mb-4">
            Skill Distribution 
            {isAuthenticated && <span className="text-xs text-emerald-400 ml-2">● From DB</span>}
          </h3>
          <SkillRadar data={skillRadarData} />
        </div>

        {/* Mastery Trend */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <h3 className="font-semibold mb-4">Mastery Trend (7 Days)</h3>
          <div className="flex items-end justify-between h-40 pt-8">
            {masteryTrend.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <span className="text-xs text-slate-400">{day.value}%</span>
                <div 
                  className="w-full max-w-[40px] bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t mx-1 transition-all"
                  style={{ height: `${(day.value / maxTrend) * 100}%`, minHeight: '8px' }}
                />
                <span className="text-xs text-slate-500">{day.day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm text-emerald-400">
              ↑ {Math.max(0, masteryTrend[6].value - masteryTrend[0].value)}% improvement this week
            </span>
          </div>
        </div>
      </div>

      {/* Recommendations & Breakdown */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="font-semibold mb-4">🎯 Recommended Next</h3>
          <Recommendations recommendations={recommendations} />
        </div>

        <div className="card animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h3 className="font-semibold mb-4">
            Concept Breakdown
            {isAuthenticated && <span className="text-xs text-emerald-400 ml-2">● From DB</span>}
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-emerald-950/30 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Strong Concepts</span>
              </div>
              <span className="text-xl font-bold text-emerald-400">{displayStats.strongCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-950/30 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">⚠</span>
                <span>Needs Practice</span>
              </div>
              <span className="text-xl font-bold text-amber-400">{displayStats.weakCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">📝</span>
                <span>Total Exposures</span>
              </div>
              <span className="text-xl font-bold">{displayStats.totalExposures}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <Link to="/practice" className="btn btn-primary w-full text-center">
              Start Practice Session →
            </Link>
          </div>
        </div>
      </div>

      {/* Database Sync Info */}
      <div className="glass rounded-xl p-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-start gap-4">
          <span className="text-3xl">{isAuthenticated ? '💾' : '🧠'}</span>
          <div>
            <h4 className="font-semibold mb-2">
              {isAuthenticated ? 'Database Sync Active' : 'Adaptive Learning'}
            </h4>
            <p className="text-sm text-slate-400">
              {isAuthenticated 
                ? `Your learning data is stored in PostgreSQL. The Evaluator Agent calculates your readiness score in real-time based on ${displayStats.totalPracticed} tracked concepts.`
                : 'Your difficulty level is set to ' + diffInfo.label + '. Login to sync your progress to the database.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
