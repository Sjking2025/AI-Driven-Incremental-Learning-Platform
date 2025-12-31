// ========================================
// Analytics Page
// Comprehensive learning analytics dashboard
// ========================================

import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useConceptMemory } from '../stores/useConceptMemory'
import { 
  getRecommendations, 
  getLearningStats, 
  getMasteryTrend, 
  getSkillRadar,
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
  const { concepts: masteryData } = useConceptMemory()
  
  const completedConcepts = useMemo(() => 
    Object.entries(masteryData)
      .filter(([_, data]) => data.mastery >= 70)
      .map(([id]) => id),
    [masteryData]
  )

  const stats = useMemo(() => getLearningStats(masteryData), [masteryData])
  const recommendations = useMemo(() => 
    getRecommendations(masteryData, completedConcepts), 
    [masteryData, completedConcepts]
  )
  const masteryTrend = useMemo(() => getMasteryTrend(masteryData), [masteryData])
  const skillRadarData = useMemo(() => getSkillRadar(masteryData), [masteryData])
  const difficulty = useMemo(() => calculateDifficultyLevel(masteryData), [masteryData])
  const diffInfo = difficultyInfo[difficulty]

  const maxTrend = Math.max(...masteryTrend.map(d => d.value), 1)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-4">Learning Analytics</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Track your progress, identify weak areas, and get personalized recommendations.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {[
          { icon: '📚', value: stats.totalPracticed, label: 'Concepts Practiced' },
          { icon: '📊', value: `${stats.averageMastery}%`, label: 'Avg Mastery' },
          { icon: '✅', value: `${stats.successRate}%`, label: 'Success Rate' },
          { icon: diffInfo.icon, value: diffInfo.label, label: 'Current Level', colorClass: diffInfo.color }
        ].map((stat, i) => (
          <div key={i} className="card text-center">
            <span className="text-2xl mb-2 block">{stat.icon}</span>
            <div className={`text-2xl font-bold ${stat.colorClass || ''}`}>{stat.value}</div>
            <div className="text-sm text-slate-400">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Skill Radar */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h3 className="font-semibold mb-4">Skill Distribution</h3>
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

      {/* Recommendations & Strengths */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recommendations */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <h3 className="font-semibold mb-4">🎯 Recommended Next</h3>
          <Recommendations recommendations={recommendations} />
        </div>

        {/* Concept Breakdown */}
        <div className="card animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
          <h3 className="font-semibold mb-4">Concept Breakdown</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-emerald-950/30 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-emerald-400">✓</span>
                <span>Strong Concepts</span>
              </div>
              <span className="text-xl font-bold text-emerald-400">{stats.strongCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-amber-950/30 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-amber-400">⚠</span>
                <span>Needs Practice</span>
              </div>
              <span className="text-xl font-bold text-amber-400">{stats.weakCount}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">📝</span>
                <span>Total Exposures</span>
              </div>
              <span className="text-xl font-bold">{stats.totalExposures}</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800">
            <Link to="/practice" className="btn btn-primary w-full text-center">
              Start Practice Session →
            </Link>
          </div>
        </div>
      </div>

      {/* Adaptive Learning Info */}
      <div className="glass rounded-xl p-6 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-start gap-4">
          <span className="text-3xl">🧠</span>
          <div>
            <h4 className="font-semibold mb-2">Adaptive Learning Active</h4>
            <p className="text-sm text-slate-400">
              Your difficulty level is set to <strong className={diffInfo.color}>{diffInfo.label}</strong>. 
              The system automatically adjusts problem difficulty based on your performance. 
              Keep practicing to level up!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
