// ========================================
// Recommendations Panel Component
// Personalized learning suggestions
// ========================================

import { Link } from 'react-router-dom'

const priorityColors = {
  high: 'border-rose-500 bg-rose-950/20',
  medium: 'border-amber-500 bg-amber-950/20',
  normal: 'border-slate-700'
}

const typeActions = {
  review: '/practice',
  'spaced-review': '/practice',
  new: '/learn',
  practice: '/practice'
}

function Recommendations({ recommendations }) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="card text-center py-8">
        <span className="text-3xl mb-4 block">🎉</span>
        <h4 className="font-semibold">All caught up!</h4>
        <p className="text-sm text-slate-400 mt-2">
          Continue exploring new concepts or practice what you've learned.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {recommendations.map((rec, i) => (
        <Link
          key={i}
          to={rec.conceptId ? `${typeActions[rec.type]}/${rec.conceptId}` : typeActions[rec.type]}
          className={`card flex items-center gap-4 p-4 border transition-all hover:scale-[1.02] ${priorityColors[rec.priority]}`}
        >
          <span className="text-2xl">{rec.icon}</span>
          <div className="flex-1">
            <h4 className="font-semibold text-sm">{rec.title}</h4>
            <p className="text-xs text-slate-400">{rec.reason}</p>
          </div>
          <span className="text-indigo-400">→</span>
        </Link>
      ))}
    </div>
  )
}

export default Recommendations
