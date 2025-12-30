import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAppStore } from '../stores/useAppStore'

// 5-Step Learning Content
const conceptData = {
  'design-principles': {
    title: 'Design Principles',
    steps: [
      {
        id: 'intro',
        title: '1. Concept Intro',
        content: `
          <h3>What is Visual Hierarchy?</h3>
          <p>Visual hierarchy is the arrangement of elements to show their order of importance.</p>
          
          <h4>Where it's used:</h4>
          <ul>
            <li>Landing pages - Guide users to CTA</li>
            <li>Dashboards - Highlight key metrics</li>
            <li>E-commerce - Focus on products</li>
          </ul>
          
          <h4>Why it matters:</h4>
          <p>Users scan, they don't read. Without hierarchy, everything competes for attention and nothing wins.</p>
          
          <h4>Common mistakes:</h4>
          <ul>
            <li>❌ Multiple equal-sized headings</li>
            <li>❌ Competing colors</li>
            <li>❌ No clear focal point</li>
          </ul>
        `
      },
      {
        id: 'practice',
        title: '2. Mini Project',
        content: `
          <h3>Scenario: E-commerce Product Page</h3>
          <p>You're designing a product page. What should users see first?</p>
          
          <div class="bg-slate-800 p-4 rounded-lg my-4">
            <p class="font-mono text-sm">
              Product Image → Price → Add to Cart → Reviews → Description
            </p>
          </div>
          
          <h4>Your Task:</h4>
          <p>Rank these elements by importance and explain your reasoning.</p>
          
          <h4>Hint:</h4>
          <p>Think about what the user came to do: BUY. Everything should guide there.</p>
        `
      },
      {
        id: 'why',
        title: '3. Why This Works',
        content: `
          <h3>The Psychology Behind It</h3>
          <p>Our eyes naturally follow a pattern:</p>
          
          <ul>
            <li><strong>Size:</strong> Bigger = more important</li>
            <li><strong>Color:</strong> Contrast draws attention</li>
            <li><strong>Position:</strong> Top-left starts the journey</li>
            <li><strong>Whitespace:</strong> Isolation creates focus</li>
          </ul>
          
          <h4>Why alternatives fail:</h4>
          <p>When everything is "important," nothing stands out. Users get overwhelmed and leave.</p>
          
          <div class="bg-indigo-900/50 p-4 rounded-lg my-4">
            <strong>Senior Insight:</strong> Amazon's "Add to Cart" button isn't just well-placed — it's the only orange element on a white page. That's deliberate.
          </div>
        `
      },
      {
        id: 'industry',
        title: '4. Industry Mapping',
        content: `
          <h3>Where Companies Use This</h3>
          
          <h4>🏢 Stripe</h4>
          <p>Their landing page has ONE focus: "Start now" button. Everything else fades.</p>
          
          <h4>🏢 Airbnb</h4>
          <p>Search bar dominates the header. Photos dominate listings.</p>
          
          <h4>🏢 Apple</h4>
          <p>Product images are massive. Text is minimal. The product sells itself.</p>
          
          <h4>Interview Question:</h4>
          <p>"How would you redesign this page to improve conversion?"</p>
          <p class="text-sm text-slate-400">Start with: "First, I'd identify the primary action..."</p>
        `
      },
      {
        id: 'challenge',
        title: '5. Skill Challenge',
        content: `
          <h3>Debug This Design</h3>
          <p>A landing page has these issues:</p>
          
          <ul>
            <li>3 CTAs of equal prominence</li>
            <li>Hero text and image compete for attention</li>
            <li>Navigation has 8 items at same size</li>
          </ul>
          
          <h4>Your Fix:</h4>
          <p>Describe 3 specific changes you'd make and why.</p>
          
          <div class="bg-emerald-900/30 p-4 rounded-lg my-4">
            <strong>Success criteria:</strong> After your changes, a stranger should know what to do within 3 seconds.
          </div>
        `
      }
    ]
  }
}

function Learn() {
  const { conceptId } = useParams()
  const [currentStep, setCurrentStep] = useState(0)
  const updateConceptMastery = useAppStore((state) => state.updateConceptMastery)

  const concept = conceptData[conceptId] || conceptData['design-principles']
  const steps = concept.steps

  const handleComplete = () => {
    updateConceptMastery(conceptId, 0.8) // 80% mastery on completion
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="animate-fade-in-up">
        <Link to="/foundation" className="text-sm text-slate-400 hover:text-white">
          ← Back to Foundation
        </Link>
        <h1 className="text-3xl font-bold mt-4">{concept.title}</h1>
      </div>

      {/* Step Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        {steps.map((step, i) => (
          <button
            key={step.id}
            onClick={() => setCurrentStep(i)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
              currentStep === i
                ? 'bg-indigo-600 text-white'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {step.title}
          </button>
        ))}
      </div>

      {/* Content */}
      <div 
        className="card prose prose-invert max-w-none animate-fade-in-up"
        style={{ animationDelay: '0.2s' }}
        dangerouslySetInnerHTML={{ __html: steps[currentStep].content }}
      />

      {/* Navigation */}
      <div className="flex justify-between animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="btn btn-secondary disabled:opacity-50"
        >
          ← Previous
        </button>

        {currentStep === steps.length - 1 ? (
          <Link 
            to="/foundation"
            onClick={handleComplete}
            className="btn btn-primary"
          >
            Complete Module ✓
          </Link>
        ) : (
          <button
            onClick={() => setCurrentStep(currentStep + 1)}
            className="btn btn-primary"
          >
            Next →
          </button>
        )}
      </div>
    </div>
  )
}

export default Learn
