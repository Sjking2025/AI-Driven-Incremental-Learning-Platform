// ========================================
// Foundation Learning Page
// Pre-code learning with design principles
// ========================================

const foundationModules = {
    frontend: [
        {
            id: 'design-principles',
            icon: '🎨',
            title: 'Design Principles',
            duration: '2-3 hours',
            progress: 0,
            topics: [
                {
                    id: 'visual-hierarchy',
                    title: 'Visual Hierarchy',
                    what: 'The arrangement of elements that shows their importance',
                    why: 'Users scan, not read. Hierarchy guides their eyes to what matters.',
                    industryExample: {
                        company: 'Google',
                        description: "Google's homepage: one input, one button. Everything else fades away."
                    },
                    mistakes: [
                        'Making everything the same size',
                        'Too many bold elements competing for attention',
                        'Ignoring whitespace'
                    ],
                    seniorTip: 'Squint at your design. What stands out? That\'s your hierarchy.',
                    visual: `
┌─────────────────────────────────────┐
│  ████████████  ← Main Heading      │
│  ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒ ← Subtext      │
│                                     │
│  ┌─────────┐  ┌─────────┐           │
│  │  Card   │  │  Card   │           │
│  └─────────┘  └─────────┘           │
│                                     │
│         [ Primary CTA ]             │
└─────────────────────────────────────┘
`
                },
                {
                    id: 'spacing-rhythm',
                    title: 'Spacing & Rhythm',
                    what: 'Consistent use of whitespace between elements',
                    why: 'Cramped designs feel cheap. Breathing room feels premium.',
                    industryExample: {
                        company: 'Apple',
                        description: "Apple's product pages use massive whitespace to feel luxurious."
                    },
                    mistakes: [
                        'Random padding values (10px here, 17px there)',
                        'Elements too close together',
                        'Inconsistent gaps between sections'
                    ],
                    seniorTip: 'Use a spacing scale (4, 8, 16, 24, 32, 48px). Never invent random values.',
                    spacingScale: [4, 8, 16, 24, 32, 48, 64]
                },
                {
                    id: 'color-theory',
                    title: 'Color Theory Basics',
                    what: 'How colors work together and affect perception',
                    why: 'Wrong colors = unprofessional. Right colors = trust and emotion.',
                    industryExample: {
                        company: 'Multiple',
                        description: 'Banks use blue (trust). Food apps use red/orange (appetite).'
                    },
                    mistakes: [
                        'Using pure black (#000) on pure white',
                        'Too many accent colors',
                        'Poor contrast for accessibility'
                    ],
                    seniorTip: 'Pick 1 primary, 1 accent, and 2-3 neutrals. That\'s it.',
                    colorMeanings: {
                        blue: 'Trust, stability (banks, tech)',
                        red: 'Urgency, appetite (food, sales)',
                        green: 'Growth, nature (eco, health)',
                        purple: 'Premium, creative (luxury, design)',
                        orange: 'Energy, fun (youth brands)'
                    }
                }
            ]
        },
        {
            id: 'layout-reasoning',
            icon: '📐',
            title: 'Layout Reasoning',
            duration: '3-4 hours',
            progress: 0,
            topics: [
                {
                    id: 'flexbox-vs-grid',
                    title: 'Flexbox vs Grid: The Decision',
                    what: 'Two CSS layout systems with different strengths',
                    why: 'Using the wrong one makes code messy. Using the right one feels effortless.',
                    decisionTree: {
                        question: 'Is your layout 1D or 2D?',
                        if1D: {
                            answer: 'Use Flexbox',
                            examples: ['Nav bars', 'Card rows', 'Button groups', 'Centering']
                        },
                        if2D: {
                            answer: 'Use Grid',
                            examples: ['Dashboards', 'Photo galleries', 'Complex forms', 'Page layouts']
                        }
                    },
                    mistakes: [
                        'Using Grid for simple centering (Flexbox is simpler)',
                        'Nesting too many Flex containers',
                        'Fighting the default behavior'
                    ],
                    seniorTip: 'Ask: "Is this 1D or 2D?" 1D = Flexbox. 2D = Grid.'
                },
                {
                    id: 'responsive-thinking',
                    title: 'Responsive Design Thinking',
                    what: 'Designing for all screen sizes, not just desktop',
                    why: '60%+ of web traffic is mobile. Desktop-only designs fail.',
                    approach: 'Mobile First',
                    whyMobileFirst: 'It\'s easier to add than remove. Mobile forces you to prioritize.',
                    breakpoints: {
                        mobile: '< 640px',
                        tablet: '640px - 1024px',
                        desktop: '> 1024px'
                    },
                    mistakes: [
                        'Designing desktop first, then squishing for mobile',
                        'Fixed pixel widths instead of percentages',
                        'Breakpoints that don\'t match content needs'
                    ],
                    seniorTip: 'Resize your browser constantly while developing. Never assume one size.'
                }
            ]
        },
        {
            id: 'ux-thinking',
            icon: '🧠',
            title: 'UX Thinking',
            duration: '2-3 hours',
            progress: 0,
            topics: [
                {
                    id: 'user-flow',
                    title: 'User Flow Basics',
                    what: 'The path a user takes to complete a task',
                    why: 'Confusing flows = abandoned carts, lost users, failed products.',
                    industryExample: {
                        company: 'Amazon',
                        description: "1-click buy: reduced friction = billions in revenue."
                    },
                    flowExample: 'Landing → Product → Cart → Checkout → Confirmation',
                    mistakes: [
                        'Too many steps for simple actions',
                        'Unclear next actions',
                        'No feedback after user actions'
                    ],
                    seniorTip: 'Every click is a chance to lose the user. Minimize clicks ruthlessly.'
                },
                {
                    id: 'accessibility-basics',
                    title: 'Accessibility Basics',
                    what: 'Making interfaces usable by everyone',
                    why: '1B+ people have disabilities. It\'s also the law.',
                    quickWins: [
                        'Alt text on images',
                        'Sufficient color contrast (4.5:1 minimum)',
                        'Keyboard navigation support',
                        'Clear focus states'
                    ],
                    mistakes: [
                        'Relying only on color to convey meaning',
                        'Tiny click targets',
                        'Removing focus outlines'
                    ],
                    seniorTip: 'Use your site with keyboard only. If you can\'t, fix it.'
                }
            ]
        }
    ]
};

export function renderFoundation(careerId = 'frontend') {
    const modules = foundationModules[careerId] || foundationModules.frontend;

    return `
        <section class="foundation-page">
            <div class="foundation-header animate-fade-in-up">
                <div class="foundation-badge">
                    <span class="badge badge-primary">🎨 Frontend Developer</span>
                    <span class="badge badge-warning">Foundation Phase</span>
                </div>
                <h1>Master the "Why" Before the "How"</h1>
                <p class="hero-subtitle">
                    Before writing a single line of code, understand the principles 
                    that make great frontend developers.
                </p>
            </div>
            
            <div class="foundation-grid mt-xl">
                ${modules.map((module, idx) => `
                    <div class="foundation-module card hover-lift animate-fade-in-up stagger-${idx + 1}" 
                         data-module="${module.id}">
                        <div class="module-header">
                            <span class="module-icon">${module.icon}</span>
                            <div>
                                <h3 class="module-title">${module.title}</h3>
                                <span class="module-duration text-muted">⏱️ ${module.duration}</span>
                            </div>
                        </div>
                        
                        <div class="module-topics mt-md">
                            ${module.topics.map(topic => `
                                <div class="topic-preview">
                                    <span class="topic-bullet">○</span>
                                    <span>${topic.title}</span>
                                </div>
                            `).join('')}
                        </div>
                        
                        <button class="btn btn-primary mt-lg" style="width: 100%;">
                            Start Module →
                        </button>
                    </div>
                `).join('')}
            </div>
            
            <!-- Expanded Topic View (hidden by default) -->
            <div id="topic-detail" class="topic-detail-panel" style="display: none;">
                <!-- Content loaded dynamically -->
            </div>
        </section>
        
        <style>
            .foundation-header {
                text-align: center;
                padding: var(--spacing-xl) 0;
            }
            
            .foundation-badge {
                display: flex;
                gap: var(--spacing-sm);
                justify-content: center;
                margin-bottom: var(--spacing-md);
            }
            
            .foundation-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                gap: var(--spacing-lg);
            }
            
            .module-header {
                display: flex;
                align-items: flex-start;
                gap: var(--spacing-md);
            }
            
            .module-icon {
                font-size: 32px;
                width: 56px;
                height: 56px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--gradient-card);
                border-radius: var(--radius-lg);
            }
            
            .module-topics {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-sm);
                padding-top: var(--spacing-md);
                border-top: 1px solid var(--border-subtle);
            }
            
            .topic-preview {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                font-size: var(--font-size-sm);
                color: var(--text-secondary);
            }
            
            .topic-bullet {
                color: var(--accent-primary);
            }
            
            .topic-detail-panel {
                margin-top: var(--spacing-xl);
                padding: var(--spacing-xl);
                background: var(--bg-card);
                border: 1px solid var(--border-subtle);
                border-radius: var(--radius-xl);
            }
        </style>
    `;
}

// Export topic detail renderer for dynamic loading
export function renderTopicDetail(topic) {
    return `
        <div class="topic-header">
            <h2>${topic.title}</h2>
        </div>
        
        <div class="topic-section">
            <h4 class="section-title">
                <span class="section-icon">📖</span>
                What It Is
            </h4>
            <p>${topic.what}</p>
        </div>
        
        <div class="topic-section">
            <h4 class="section-title">
                <span class="section-icon">🎯</span>
                Why It Matters
            </h4>
            <p>${topic.why}</p>
        </div>
        
        ${topic.industryExample ? `
            <div class="topic-section">
                <h4 class="section-title">
                    <span class="section-icon">🏢</span>
                    Industry Example
                </h4>
                <div class="why-panel">
                    <strong>${topic.industryExample.company}</strong>
                    <p>${topic.industryExample.description}</p>
                </div>
            </div>
        ` : ''}
        
        ${topic.decisionTree ? `
            <div class="topic-section">
                <h4 class="section-title">
                    <span class="section-icon">🤔</span>
                    Decision Framework
                </h4>
                <div class="decision-tree">
                    <div class="decision-question">${topic.decisionTree.question}</div>
                    <div class="decision-branches">
                        <div class="decision-branch why-correct">
                            <strong>1D Layout</strong>
                            <p>→ ${topic.decisionTree.if1D.answer}</p>
                            <p class="text-muted">Examples: ${topic.decisionTree.if1D.examples.join(', ')}</p>
                        </div>
                        <div class="decision-branch why-panel">
                            <strong>2D Layout</strong>
                            <p>→ ${topic.decisionTree.if2D.answer}</p>
                            <p class="text-muted">Examples: ${topic.decisionTree.if2D.examples.join(', ')}</p>
                        </div>
                    </div>
                </div>
            </div>
        ` : ''}
        
        <div class="topic-section">
            <h4 class="section-title">
                <span class="section-icon">⚠️</span>
                Common Mistakes
            </h4>
            <ul class="mistakes-list">
                ${topic.mistakes.map(m => `
                    <li class="mistake-item">❌ ${m}</li>
                `).join('')}
            </ul>
        </div>
        
        <div class="topic-section">
            <h4 class="section-title">
                <span class="section-icon">🧠</span>
                Senior Developer Tip
            </h4>
            <div class="card-glass">
                <p>"${topic.seniorTip}"</p>
            </div>
        </div>
    `;
}
