import { Link } from 'react-router-dom'
import { useAppStore } from '../stores/useAppStore'

const careers = [
  {
    id: 'frontend',
    icon: '🎨',
    title: 'Frontend Developer',
    description: 'Build beautiful, responsive user interfaces',
    foundation: ['Design Principles', 'Layout Reasoning', 'UX Thinking'],
    stack: ['HTML', 'CSS', 'JavaScript', 'React'],
    duration: '4-6 months',
    projects: 12
  },
  {
    id: 'backend',
    icon: '⚙️',
    title: 'Backend Developer',
    description: 'Design scalable APIs and server-side systems',
    foundation: ['System Thinking', 'API Design', 'Data Flow'],
    stack: ['Node.js', 'Python', 'SQL', 'REST'],
    duration: '5-7 months',
    projects: 10
  },
  {
    id: 'fullstack',
    icon: '🔗',
    title: 'Full Stack Developer',
    description: 'Master both frontend and backend development',
    foundation: ['Design', 'Systems', 'Integration'],
    stack: ['React', 'Node.js', 'PostgreSQL'],
    duration: '8-10 months',
    projects: 15
  },
  {
    id: 'aiml',
    icon: '🤖',
    title: 'AI/ML Engineer',
    description: 'Build intelligent systems and machine learning models',
    foundation: ['Math Foundations', 'Statistical Thinking', 'ML Concepts'],
    stack: ['Python', 'TensorFlow', 'PyTorch'],
    duration: '6-9 months',
    projects: 8
  },
  {
    id: 'devops',
    icon: '🔧',
    title: 'DevOps Engineer',
    description: 'Automate deployment and infrastructure',
    foundation: ['Linux Basics', 'Networking', 'CI/CD Concepts'],
    stack: ['Docker', 'Kubernetes', 'AWS'],
    duration: '5-7 months',
    projects: 8
  },
  {
    id: 'data',
    icon: '📊',
    title: 'Data Analyst',
    description: 'Turn data into actionable insights',
    foundation: ['Statistics', 'SQL Mastery', 'Visualization'],
    stack: ['Python', 'SQL', 'Tableau'],
    duration: '4-6 months',
    projects: 10
  }
]

function Careers() {
  const setCareer = useAppStore((state) => state.setCareer)

  const handleSelectCareer = (careerId) => {
    setCareer(careerId)
  }

  return (
    <div className="space-y-8">
      <div className="text-center animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-4">Choose Your Career Path</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Each path includes a foundation phase before you write code. 
          Learn the "why" before the "how".
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careers.map((career, i) => (
          <Link
            key={career.id}
            to="/roadmap"
            onClick={() => handleSelectCareer(career.id)}
            className="card group cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-center gap-4 mb-4">
              <span className="text-4xl">{career.icon}</span>
              <div>
                <h3 className="text-lg font-semibold group-hover:text-indigo-400 transition-colors">
                  {career.title}
                </h3>
                <span className="text-sm text-slate-500">{career.duration}</span>
              </div>
            </div>

            <p className="text-slate-400 text-sm mb-4">{career.description}</p>

            <div className="mb-4">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Foundation</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {career.foundation.map((f) => (
                  <span key={f} className="badge badge-primary">{f}</span>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <span className="text-xs text-slate-500 uppercase tracking-wider">Tech Stack</span>
              <div className="flex flex-wrap gap-2 mt-2">
                {career.stack.map((s) => (
                  <span key={s} className="px-2 py-1 text-xs bg-slate-800 rounded">{s}</span>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-slate-800">
              <span className="text-sm text-slate-500">
                📁 {career.projects} projects
              </span>
              <span className="text-indigo-400 group-hover:translate-x-1 transition-transform">
                Start →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Careers
