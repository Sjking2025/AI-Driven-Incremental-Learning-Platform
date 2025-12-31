import { Link } from 'react-router-dom'

const foundationModules = [
  {
    id: 'design-principles',
    icon: '🎨',
    title: 'Design Principles',
    duration: '2 hours',
    topics: [
      { title: 'Visual Hierarchy', desc: 'What draws the eye first?' },
      { title: 'Color Theory', desc: 'Psychology of color choices' },
      { title: 'Typography', desc: 'Font pairing and readability' },
      { title: 'Whitespace', desc: 'Breathing room in design' }
    ]
  },
  {
    id: 'layout-reasoning',
    icon: '📐',
    title: 'Layout Reasoning',
    duration: '2 hours',
    topics: [
      { title: 'Box Model Thinking', desc: 'Everything is a box' },
      { title: 'Flexbox vs Grid', desc: 'When to use which' },
      { title: 'Responsive Mindset', desc: 'Mobile-first approach' },
      { title: 'Layout Patterns', desc: 'Common UI structures' }
    ]
  },
  {
    id: 'ux-thinking',
    icon: '🧠',
    title: 'UX Thinking',
    duration: '2 hours',
    topics: [
      { title: 'User Flow Mapping', desc: 'How users navigate' },
      { title: 'Affordances', desc: 'Making things clickable' },
      { title: 'Error Prevention', desc: 'Guide before they fail' },
      { title: 'Feedback Loops', desc: 'Confirm user actions' }
    ]
  }
]

function Foundation() {
  return (
    <div className="space-y-8">
      <div className="text-center animate-fade-in-up">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="badge badge-primary">🎨 Frontend Developer</span>
          <span className="badge badge-warning">Foundation Phase</span>
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Master the <span className="gradient-text">"Why"</span> Before the "How"
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Before writing a single line of code, understand the principles 
          that make great frontend developers.
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {foundationModules.map((module, i) => (
          <div 
            key={module.id}
            className="card hover:border-indigo-500 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-3xl">{module.icon}</span>
              <div>
                <h3 className="font-semibold">{module.title}</h3>
                <span className="text-sm text-slate-500">⏱️ {module.duration}</span>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              {module.topics.map((topic) => (
                <div key={topic.title} className="flex items-start gap-2">
                  <span className="text-indigo-400 mt-1">○</span>
                  <div>
                    <div className="text-sm font-medium">{topic.title}</div>
                    <div className="text-xs text-slate-500">{topic.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link 
              to={`/learn/${module.id}`}
              className="btn btn-primary w-full text-center"
            >
              Start Module →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Foundation
