// ========================================
// Projects Page - Industry-Grade Projects
// ========================================

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
            industryContext: {
                usedAt: ['Stripe', 'Shopify', 'Every checkout flow'],
                why: 'Bad forms lose customers. 67% of users abandon confusing forms.'
            },
            notThisBut: {
                not: 'Simple required field check',
                but: 'Real-time validation with debouncing, custom rules, and accessibility'
            },
            learningOutcomes: [
                'Event delegation and debouncing',
                'Regular expressions for validation',
                'Accessible error messaging',
                'UX patterns for form feedback'
            ]
        },
        {
            id: 'counter-bugs',
            title: 'Transaction Counter Bug Hunt',
            icon: '🔢',
            level: 'micro',
            duration: '1-2 hours',
            skills: ['Increment operators', 'Debugging', 'State'],
            description: 'Debug a payment counter with subtle increment operator bugs',
            industryContext: {
                usedAt: ['Payment systems', 'Analytics', 'Rate limiting'],
                why: 'Increment bugs caused a $2M billing error at a fintech startup.'
            },
            notThisBut: {
                not: 'Console.log a++ vs ++a',
                but: 'Find and fix bugs in production-like transaction logging'
            },
            learningOutcomes: [
                'Pre vs post increment in real context',
                'Debugging async increment issues',
                'Writing bug-resistant counter code'
            ]
        },
        {
            id: 'api-error-handler',
            title: 'API Error Handler',
            icon: '⚠️',
            level: 'micro',
            duration: '2-3 hours',
            skills: ['Fetch', 'Error handling', 'UX'],
            description: 'Build a robust error handling system for API failures',
            industryContext: {
                usedAt: ['Every production app'],
                why: 'Users don\'t see console errors. They see blank screens and leave.'
            },
            notThisBut: {
                not: 'try/catch with console.log',
                but: 'User-friendly error states, retry logic, and graceful degradation'
            },
            learningOutcomes: [
                'Error classification (network, server, client)',
                'User-friendly error messaging',
                'Retry with exponential backoff',
                'Loading and error states'
            ]
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
            industryContext: {
                usedAt: ['Stripe Dashboard', 'Vercel', 'Shopify Admin'],
                why: '90% of web apps have admin panels. This is a must-have skill.'
            },
            notThisBut: {
                not: 'Static cards with fake numbers',
                but: 'Interactive dashboard with filters, date ranges, and real chart logic'
            },
            phases: [
                { title: 'Layout Structure', skills: ['CSS Grid', 'Responsive'] },
                { title: 'Data Display', skills: ['Charts', 'Tables'] },
                { title: 'Interactivity', skills: ['Filters', 'State management'] },
                { title: 'Polish', skills: ['Loading states', 'Animations'] }
            ],
            learningOutcomes: [
                'Dashboard UI patterns',
                'State management for filters',
                'Data visualization basics',
                'Performance optimization'
            ]
        },
        {
            id: 'infinite-scroll',
            title: 'Infinite Scroll Feed',
            icon: '📜',
            level: 'feature',
            duration: '6-8 hours',
            skills: ['Intersection Observer', 'Pagination', 'Performance'],
            description: 'Build a Twitter/Instagram-style infinite scroll with virtualization',
            industryContext: {
                usedAt: ['Twitter', 'Instagram', 'Reddit', 'LinkedIn'],
                why: 'Social feeds are everywhere. Done wrong, they crash browsers.'
            },
            notThisBut: {
                not: 'Append divs on scroll',
                but: 'Memory-efficient virtualization that handles 10,000+ items'
            },
            learningOutcomes: [
                'Intersection Observer API',
                'Virtual scrolling concepts',
                'Memory management',
                'API pagination patterns'
            ]
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
            industryContext: {
                usedAt: ['Slack', 'GitHub', 'Discord', 'Every SaaS'],
                why: 'Real-time features define modern apps. This is senior-level work.'
            },
            notThisBut: {
                not: 'Alert box on button click',
                but: 'Persistent, dismissible, prioritized notifications with WebSocket updates'
            },
            components: [
                'WebSocket connection management',
                'Notification queue and priority',
                'Toast UI with animations',
                'Persistence and read/unread state',
                'Desktop notification integration'
            ],
            learningOutcomes: [
                'WebSocket fundamentals',
                'Real-time state synchronization',
                'Queue data structures',
                'Cross-tab communication'
            ]
        }
    ]
};

export function renderProjects() {
    return `
        <section class="projects-page">
            <div class="projects-header animate-fade-in-up">
                <h1>Industry-Grade Projects</h1>
                <p class="hero-subtitle">
                    Not todo apps. Not clones. Real engineering challenges that teach you 
                    to think like a senior developer.
                </p>
            </div>
            
            <!-- Micro Projects -->
            <div class="projects-section mt-xl">
                <div class="section-header">
                    <span class="badge level-micro">Micro Projects</span>
                    <h3>Single Concept Focus</h3>
                    <p class="text-muted">1-3 hours each. Master one concept deeply.</p>
                </div>
                
                <div class="projects-grid">
                    ${projectsData.micro.map((project, idx) => renderProjectCard(project, idx)).join('')}
                </div>
            </div>
            
            <!-- Feature Projects -->
            <div class="projects-section mt-xl">
                <div class="section-header">
                    <span class="badge level-feature">Feature Projects</span>
                    <h3>Multi-Concept Integration</h3>
                    <p class="text-muted">6-12 hours. Build portfolio-worthy features.</p>
                </div>
                
                <div class="projects-grid">
                    ${projectsData.feature.map((project, idx) => renderProjectCard(project, idx)).join('')}
                </div>
            </div>
            
            <!-- System Projects -->
            <div class="projects-section mt-xl">
                <div class="section-header">
                    <span class="badge level-system">System Projects</span>
                    <h3>Full Architecture</h3>
                    <p class="text-muted">15-25 hours. Senior-level engineering challenges.</p>
                </div>
                
                <div class="projects-grid">
                    ${projectsData.system.map((project, idx) => renderProjectCard(project, idx)).join('')}
                </div>
            </div>
        </section>
        
        <style>
            .projects-header {
                text-align: center;
                padding: var(--spacing-xl) 0;
            }
            
            .projects-section {
                margin-bottom: var(--spacing-2xl);
            }
            
            .section-header {
                margin-bottom: var(--spacing-lg);
            }
            
            .section-header h3 {
                margin: var(--spacing-sm) 0 0;
            }
            
            .projects-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: var(--spacing-lg);
            }
            
            .project-card {
                background: var(--bg-card);
                border: 1px solid var(--border-subtle);
                border-radius: var(--radius-xl);
                padding: var(--spacing-xl);
                position: relative;
                transition: all var(--transition-base);
            }
            
            .project-card:hover {
                border-color: var(--border-accent);
                transform: translateY(-4px);
                box-shadow: var(--shadow-glow);
            }
            
            .project-header {
                display: flex;
                align-items: flex-start;
                gap: var(--spacing-md);
                margin-bottom: var(--spacing-md);
            }
            
            .project-icon {
                font-size: 32px;
                width: 56px;
                height: 56px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--gradient-card);
                border-radius: var(--radius-lg);
            }
            
            .project-meta {
                display: flex;
                gap: var(--spacing-md);
                margin-top: var(--spacing-sm);
                font-size: var(--font-size-xs);
                color: var(--text-muted);
            }
            
            .project-skills {
                display: flex;
                flex-wrap: wrap;
                gap: var(--spacing-xs);
                margin: var(--spacing-md) 0;
            }
            
            .not-but {
                background: var(--bg-glass);
                border-radius: var(--radius-md);
                padding: var(--spacing-md);
                margin: var(--spacing-md) 0;
            }
            
            .not-this {
                color: var(--accent-danger);
                font-size: var(--font-size-sm);
                margin-bottom: var(--spacing-xs);
            }
            
            .but-this {
                color: var(--accent-success);
                font-size: var(--font-size-sm);
            }
            
            .industry-tag {
                font-size: var(--font-size-xs);
                color: var(--text-muted);
                margin-top: var(--spacing-md);
            }
            
            .level-micro { background: rgba(16, 185, 129, 0.2); color: var(--accent-success); }
            .level-feature { background: rgba(245, 158, 11, 0.2); color: var(--accent-warning); }
            .level-system { background: rgba(239, 68, 68, 0.2); color: var(--accent-danger); }
        </style>
    `;
}

function renderProjectCard(project, index) {
    return `
        <div class="project-card hover-lift animate-fade-in-up stagger-${index + 1}" 
             data-project="${project.id}">
            <span class="badge level-${project.level}" style="position: absolute; top: 16px; right: 16px;">
                ${project.level}
            </span>
            
            <div class="project-header">
                <span class="project-icon">${project.icon}</span>
                <div>
                    <h4>${project.title}</h4>
                    <div class="project-meta">
                        <span>⏱️ ${project.duration}</span>
                    </div>
                </div>
            </div>
            
            <p class="text-muted">${project.description}</p>
            
            <div class="project-skills">
                ${project.skills.map(s => `<span class="badge badge-primary">${s}</span>`).join('')}
            </div>
            
            <div class="not-but">
                <div class="not-this">❌ Not: ${project.notThisBut.not}</div>
                <div class="but-this">✅ But: ${project.notThisBut.but}</div>
            </div>
            
            <div class="industry-tag">
                🏢 Used at: ${project.industryContext.usedAt.join(', ')}
            </div>
            
            <button class="btn btn-primary mt-lg" style="width: 100%;">
                Start Project →
            </button>
        </div>
    `;
}
