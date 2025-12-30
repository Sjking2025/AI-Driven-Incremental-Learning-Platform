const projectsData = {
  micro: [
    {
      id: 'form-validation',
      title: 'Dynamic Form Validation Engine',
      icon: '📝',
      level: 'micro',
      duration: '2-3 hours',
      skills: ['DOM', 'Events', 'Regex'],
      description: 'Build a real-time form validator that shows errors as users type',
      notThis: 'Simple required field check',
      butThis: 'Real-time validation with debouncing, custom rules, and accessibility',
      usedAt: ['Stripe', 'Shopify', 'Every checkout flow']
    },
    {
      id: 'counter-bugs',
      title: 'Transaction Counter Bug Hunt',
      icon: '🔢',
      level: 'micro',
      duration: '1-2 hours',
      skills: ['Increment operators', 'Debugging', 'State'],
      description: 'Debug a payment counter with subtle increment operator bugs',
      notThis: 'Console.log a++ vs ++a',
      butThis: 'Find and fix bugs in production-like transaction logging',
      usedAt: ['Payment systems', 'Analytics', 'Rate limiting']
    }
  ],
  feature: [
    {
      id: 'admin-dashboard',
      title: 'Admin Analytics Dashboard',
      icon: '📊',
      level: 'feature',
      duration: '8-12 hours',
      skills: ['Components', 'State', 'Data visualization'],
      description: 'Build a real dashboard with charts, filters, and live data',
      notThis: 'Static cards with fake numbers',
      butThis: 'Interactive dashboard with filters, date ranges, and real chart logic',
      usedAt: ['Stripe Dashboard', 'Vercel', 'Shopify Admin']
    }
  ],
  system: [
    {
      id: 'realtime-notifications',
      title: 'Real-time Notification System',
      icon: '🔔',
      level: 'system',
      duration: '15-20 hours',
      skills: ['WebSockets', 'State', 'UI patterns', 'Queuing'],
      description: 'Build a complete notification system like Slack or GitHub',
      notThis: 'Alert box on button click',
      butThis: 'Persistent, dismissible, prioritized notifications with WebSocket updates',
      usedAt: ['Slack', 'GitHub', 'Discord']
    }
  ]
}

const levelColors = {
  micro: 'bg-emerald-500/20 text-emerald-400',
  feature: 'bg-amber-500/20 text-amber-400',
  system: 'bg-rose-500/20 text-rose-400'
}

function Projects() {
  return (
    <div className="space-y-12">
      <div className="text-center animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-4">Industry-Grade Projects</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Not todo apps. Not clones. Real engineering challenges that teach you 
          to think like a senior developer.
        </p>
      </div>

      {/* Micro Projects */}
      <Section 
        title="Micro Projects" 
        subtitle="1-3 hours each. Master one concept deeply."
        level="micro"
        projects={projectsData.micro}
      />

      {/* Feature Projects */}
      <Section 
        title="Feature Projects" 
        subtitle="6-12 hours. Build portfolio-worthy features."
        level="feature"
        projects={projectsData.feature}
      />

      {/* System Projects */}
      <Section 
        title="System Projects" 
        subtitle="15-25 hours. Senior-level engineering challenges."
        level="system"
        projects={projectsData.system}
      />
    </div>
  )
}

function Section({ title, subtitle, level, projects }) {
  return (
    <div className="space-y-6">
      <div>
        <span className={`badge ${levelColors[level]} mb-2`}>{level}</span>
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-slate-400">{subtitle}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <div 
            key={project.id}
            className="card animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{project.icon}</span>
                <div>
                  <h3 className="font-semibold">{project.title}</h3>
                  <span className="text-sm text-slate-500">⏱️ {project.duration}</span>
                </div>
              </div>
              <span className={`badge ${levelColors[project.level]}`}>{project.level}</span>
            </div>

            <p className="text-slate-400 text-sm mb-4">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {project.skills.map(s => (
                <span key={s} className="badge badge-primary">{s}</span>
              ))}
            </div>

            {/* Not This / But This */}
            <div className="bg-slate-800/50 rounded-lg p-4 mb-4 space-y-2">
              <div className="text-sm">
                <span className="text-rose-400">❌ Not:</span> {project.notThis}
              </div>
              <div className="text-sm">
                <span className="text-emerald-400">✅ But:</span> {project.butThis}
              </div>
            </div>

            <div className="text-xs text-slate-500 mb-4">
              🏢 Used at: {project.usedAt.join(', ')}
            </div>

            <button className="btn btn-primary w-full">
              Start Project →
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Projects
