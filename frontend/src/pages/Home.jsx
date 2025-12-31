import { Link } from 'react-router-dom'

const features = [
  {
    icon: '🎯',
    title: 'Career-Driven Learning',
    description: 'Pick your target role. We map the exact skills you need.'
  },
  {
    icon: '🔄',
    title: 'Incremental Reinforcement',
    description: 'Every new topic reuses all previous concepts. No forgetting.'
  },
  {
    icon: '🏢',
    title: 'Real-World Projects',
    description: 'Industry-grade problems, not toy examples.'
  },
  {
    icon: '🧠',
    title: 'AI Mentor',
    description: 'Ask "why does this fail in production?" Get real answers.'
  }
]

const learningSteps = [
  { num: 1, title: 'Concept Intro', desc: 'What, where, why, common mistakes' },
  { num: 2, title: 'Mini Project', desc: 'Real industry scenario, not demos' },
  { num: 3, title: 'Why This Works', desc: 'The aha moment: why alternatives fail' },
  { num: 4, title: 'Industry Mapping', desc: 'Where companies use this in production' },
  { num: 5, title: 'Skill Challenge', desc: 'Debug it yourself, no hand-holding' }
]

function Home() {
  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="text-center py-16 animate-fade-in-up">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          <span className="gradient-text">Learn Like a Real Engineer</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-8">
          Not tutorials. Not clones. A career engineering system that trains you 
          the way the industry does — slowly, deeply, and correctly.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/careers" className="btn btn-primary">
            Start Your Journey →
          </Link>
          <Link to="/ask" className="btn btn-secondary">
            Ask Anything
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div 
            key={i} 
            className="card text-center animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <span className="text-4xl mb-4 block">{f.icon}</span>
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-slate-400 text-sm">{f.description}</p>
          </div>
        ))}
      </section>

      {/* 5-Step Flow */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4">
          The 5-Step Learning Flow
        </h2>
        <p className="text-slate-400 mb-12 max-w-xl mx-auto">
          Every concept follows this battle-tested methodology
        </p>

        <div className="flex flex-wrap justify-center gap-4">
          {learningSteps.map((step, i) => (
            <div 
              key={step.num}
              className="glass rounded-xl p-6 w-48 text-left animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mb-3">
                {step.num}
              </div>
              <h4 className="font-semibold mb-1">{step.title}</h4>
              <p className="text-xs text-slate-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center glass rounded-2xl p-12">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Build Like a Pro?
        </h2>
        <p className="text-slate-400 mb-8">
          Pick your career path. Master the fundamentals. Get job-ready.
        </p>
        <Link to="/careers" className="btn btn-primary">
          Choose Your Path →
        </Link>
      </section>
    </div>
  )
}

export default Home
