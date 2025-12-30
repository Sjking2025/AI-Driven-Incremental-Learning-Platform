// ========================================
// Home Page
// ========================================

export function renderHome() {
    return `
        <section class="hero">
            <div class="hero-content animate-fade-in-up">
                <h1 class="hero-title">
                    Transform Your Career<br>
                    <span class="text-gradient">Not Just Your Code</span>
                </h1>
                
                <p class="hero-subtitle">
                    An AI-powered career builder that teaches you <strong>why code works</strong>, 
                    not just how to write it. From zero to job-ready with personalized paths.
                </p>
                
                <div class="hero-cta">
                    <button class="btn btn-primary btn-lg" id="start-journey-btn">
                        Start Your Journey 🚀
                    </button>
                    <button class="btn btn-secondary btn-lg">
                        How It Works
                    </button>
                </div>
            </div>
        </section>
        
        <section class="features mt-xl">
            <h2 class="text-center mb-xl">Why We're Different</h2>
            
            <div class="grid grid-3">
                <div class="card animate-fade-in-up stagger-1">
                    <div class="career-icon">🎯</div>
                    <h4>Career-Driven, Not Course-Driven</h4>
                    <p>Start with "I want to become a Frontend Developer" — not "Learn React"</p>
                </div>
                
                <div class="card animate-fade-in-up stagger-2">
                    <div class="career-icon">🧠</div>
                    <h4>Foundation Before Code</h4>
                    <p>Understand design principles, layout reasoning, and decision-making before touching code</p>
                </div>
                
                <div class="card animate-fade-in-up stagger-3">
                    <div class="career-icon">🔥</div>
                    <h4>Real Projects, Not Clones</h4>
                    <p>Industry-grade projects that teach engineering thinking, not todo apps</p>
                </div>
                
                <div class="card animate-fade-in-up stagger-4">
                    <div class="career-icon">💡</div>
                    <h4>Why This Works</h4>
                    <p>Every concept explains why it works AND why alternatives fail — the real "aha" moment</p>
                </div>
                
                <div class="card animate-fade-in-up stagger-5">
                    <div class="career-icon">🏢</div>
                    <h4>Industry Mapping</h4>
                    <p>See where each concept is used in real companies, with production stories</p>
                </div>
                
                <div class="card animate-fade-in-up stagger-6">
                    <div class="career-icon">📈</div>
                    <h4>Track Your Readiness</h4>
                    <p>From Beginner to Job-Ready with skill confidence meters and weak area identification</p>
                </div>
            </div>
        </section>
        
        <section class="learning-flow mt-xl">
            <h2 class="text-center mb-xl">The 5-Step Learning Flow</h2>
            
            <div class="card-glass" style="max-width: 800px; margin: 0 auto;">
                <div class="flow-steps">
                    <div class="flow-step">
                        <span class="step-badge badge badge-primary">1</span>
                        <div>
                            <h5>Concept Introduction</h5>
                            <p class="text-muted">What it is, where it's used, why it matters, common mistakes</p>
                        </div>
                    </div>
                    
                    <div class="flow-step">
                        <span class="step-badge badge badge-primary">2</span>
                        <div>
                            <h5>Mini Real-World Project</h5>
                            <p class="text-muted">Industry scenario with guided debugging — not toy problems</p>
                        </div>
                    </div>
                    
                    <div class="flow-step">
                        <span class="step-badge badge badge-primary">3</span>
                        <div>
                            <h5>Why This Works ✨</h5>
                            <p class="text-muted">The breakthrough: why correct code works, why alternatives fail</p>
                        </div>
                    </div>
                    
                    <div class="flow-step">
                        <span class="step-badge badge badge-primary">4</span>
                        <div>
                            <h5>Real-World Mapping</h5>
                            <p class="text-muted">Which companies use this, which modules, production stories</p>
                        </div>
                    </div>
                    
                    <div class="flow-step">
                        <span class="step-badge badge badge-primary">5</span>
                        <div>
                            <h5>Skill Validation</h5>
                            <p class="text-muted">Debug challenges that prove understanding — not MCQs</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <section class="cta-section mt-xl text-center">
            <h2>Ready to Think Like an Engineer?</h2>
            <p class="hero-subtitle">Choose your career path and start your personalized journey</p>
            <button class="btn btn-primary btn-lg mt-lg" id="explore-paths-btn">
                Explore Career Paths →
            </button>
        </section>
        
        <style>
            .flow-steps {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-lg);
            }
            
            .flow-step {
                display: flex;
                align-items: flex-start;
                gap: var(--spacing-md);
                padding: var(--spacing-md);
                border-radius: var(--radius-lg);
                transition: background var(--transition-fast);
            }
            
            .flow-step:hover {
                background: var(--bg-glass);
            }
            
            .step-badge {
                min-width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: 700;
            }
            
            .cta-section {
                padding: var(--spacing-3xl) 0;
            }
        </style>
    `;
}
