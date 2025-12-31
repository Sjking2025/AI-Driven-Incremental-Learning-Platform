import { useAppStore, useReadiness } from '../stores/useAppStore'

function Dashboard() {
  const { conceptMastery, completedProjects, streak } = useAppStore()
  const readiness = useReadiness()

  const skills = [
    { name: 'HTML', level: 85, color: 'bg-orange-500' },
    { name: 'CSS', level: 70, color: 'bg-purple-500' },
    { name: 'JavaScript', level: 45, color: 'bg-yellow-500' },
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

  const recentActivity = [
    { icon: '✅', item: 'Closures Deep Dive', time: '2 hours ago' },
    { icon: '📖', item: 'Async/Await Patterns', time: '3 hours ago' },
    { icon: '✅', item: 'Increment Operators', time: 'Yesterday' },
    { icon: '🔨', item: 'Form Validation Project', time: '2 days ago' }
  ]

  const circumference = 2 * Math.PI * 80
  const offset = circumference - (readiness / 100) * circumference

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h1 className="text-3xl font-bold">Welcome back! 👋</h1>
          <p className="text-slate-400">Frontend Developer Path</p>
        </div>
        <div className="badge badge-warning text-lg px-4 py-2 animate-float">
          🔥 {streak || 5} Day Streak
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {[
          { icon: '📚', value: Object.keys(conceptMastery).length || 3, label: 'Concepts Mastered' },
          { icon: '🔨', value: completedProjects.length || 2, label: 'Projects Done' },
          { icon: '⏱️', value: '14.5h', label: 'This Week' },
          { icon: '🎯', value: `${readiness}%`, label: 'Job Ready', highlight: true }
        ].map((stat, i) => (
          <div 
            key={i} 
            className={`card flex items-center gap-4 ${stat.highlight ? 'border-indigo-500 bg-indigo-950/30' : ''}`}
          >
            <span className="text-2xl">{stat.icon}</span>
            <div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-slate-400">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        {/* Readiness Ring */}
        <div className="card flex flex-col items-center">
          <h3 className="font-semibold mb-4 self-start">Job Readiness</h3>
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
              <span className="text-3xl font-bold">{readiness}%</span>
              <span className="text-sm text-slate-400">Ready</span>
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
          <h3 className="font-semibold mb-4">Skills Progress</h3>
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

        {/* Recent Activity */}
        <div className="card">
          <h3 className="font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg">{activity.icon}</span>
                <div className="flex-1">
                  <div className="text-sm">{activity.item}</div>
                  <div className="text-xs text-slate-500">{activity.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
