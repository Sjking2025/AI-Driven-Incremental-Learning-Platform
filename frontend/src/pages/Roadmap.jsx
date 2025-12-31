import { Link } from 'react-router-dom'
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
  const selectedCareer = useAppStore((state) => state.selectedCareer)

  return (
    <div className="space-y-8">
      <div className="text-center animate-fade-in-up">
        <span className="badge badge-primary mb-2">🎨 Frontend Developer</span>
        <h1 className="text-4xl font-bold mb-2">Your Learning Roadmap</h1>
        <p className="text-slate-400">Master each phase before moving forward</p>
      </div>

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
