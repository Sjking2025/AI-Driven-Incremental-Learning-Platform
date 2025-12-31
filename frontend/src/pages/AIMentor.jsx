// ========================================
// AI Mentor Page
// Full page AI assistant interface
// ========================================

import AIMentorChat from '../components/AIMentorChat'
import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🎯',
    title: 'Ask "Why"',
    description: 'Understand the reasoning behind concepts, not just syntax'
  },
  {
    icon: '🏢',
    title: 'Industry Context',
    description: 'Learn where concepts are used in real production code'
  },
  {
    icon: '🐛',
    title: 'Debug Help',
    description: 'Get explanations for why your code fails and how to fix it'
  }
]

function AIMentor() {
  return (
    <div className="space-y-8">
      <div className="text-center animate-fade-in-up">
        <div className="inline-flex items-center gap-2 badge badge-primary mb-4">
          <span>✨</span> Powered by Google Gemini
        </div>
        <h1 className="text-4xl font-bold mb-4">
          Your <span className="gradient-text">AI Mentor</span>
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Ask anything and get explanations like a senior developer would give. 
          Not just "how" — but "why" and "where it's used."
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {features.map((f, i) => (
          <div key={i} className="glass rounded-xl p-4 text-center">
            <span className="text-2xl mb-2 block">{f.icon}</span>
            <h4 className="font-semibold mb-1">{f.title}</h4>
            <p className="text-xs text-slate-400">{f.description}</p>
          </div>
        ))}
      </div>

      {/* Chat Interface */}
      <div className="card animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <AIMentorChat />
      </div>

      {/* Quick Links */}
      <div className="flex justify-center gap-4 text-sm">
        <Link to="/skills" className="text-slate-400 hover:text-white">
          ← Back to Skill Tree
        </Link>
        <Link to="/practice" className="text-slate-400 hover:text-white">
          Practice Mode →
        </Link>
      </div>
    </div>
  )
}

export default AIMentor
