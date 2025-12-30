// ========================================
// Roadmap Page
// ========================================

const frontendRoadmap = {
    title: 'Frontend Developer',
    icon: '🎨',
    phases: [
        {
            id: 1,
            title: 'Foundation Phase',
            subtitle: 'Before You Code',
            status: 'current',
            topics: [
                { name: 'Design Principles', completed: true },
                { name: 'Layout Reasoning', completed: true },
                { name: 'UX Thinking', completed: false }
            ]
        },
        {
            id: 2,
            title: 'HTML Fundamentals',
            subtitle: 'Structure & Semantics',
            status: 'locked',
            topics: [
                { name: 'Document Structure', completed: false },
                { name: 'Semantic Elements', completed: false },
                { name: 'Forms & Accessibility', completed: false }
            ]
        },
        {
            id: 3,
            title: 'CSS Mastery',
            subtitle: 'Styling & Layout',
            status: 'locked',
            topics: [
                { name: 'Selectors & Specificity', completed: false },
                { name: 'Flexbox & Grid', completed: false },
                { name: 'Responsive Design', completed: false },
                { name: 'Animations', completed: false }
            ]
        },
        {
            id: 4,
            title: 'JavaScript Core',
            subtitle: 'Logic & Interactivity',
            status: 'locked',
            topics: [
                { name: 'Variables & Types', completed: false },
                { name: 'Functions & Scope', completed: false },
                { name: 'DOM Manipulation', completed: false },
                { name: 'Async/Await', completed: false }
            ]
        },
        {
            id: 5,
            title: 'React',
            subtitle: 'Modern UI Development',
            status: 'locked',
            topics: [
                { name: 'Components & Props', completed: false },
                { name: 'State & Hooks', completed: false },
                { name: 'Context & Routing', completed: false }
            ]
        },
        {
            id: 6,
            title: 'Industry Projects',
            subtitle: 'Portfolio Ready',
            status: 'locked',
            topics: [
                { name: 'Admin Dashboard', completed: false },
                { name: 'E-commerce UI', completed: false },
                { name: 'Real-time App', completed: false }
            ]
        }
    ]
};

export function renderRoadmap(selectedCareer, userProgress) {
    const roadmap = frontendRoadmap; // Use selected career later

    const completedTopics = roadmap.phases.reduce((acc, phase) => {
        return acc + phase.topics.filter(t => t.completed).length;
    }, 0);

    const totalTopics = roadmap.phases.reduce((acc, phase) => {
        return acc + phase.topics.length;
    }, 0);

    const progressPercent = Math.round((completedTopics / totalTopics) * 100);

    return `
        <section class="roadmap">
            <div class="roadmap-header animate-fade-in-up">
                <div>
                    <span class="badge badge-primary mb-sm">${roadmap.icon} ${roadmap.title}</span>
                    <h1>Your Learning Roadmap</h1>
                    <p class="text-muted">
                        Foundation first, then code. Each phase unlocks the next.
                    </p>
                </div>
                
                <div class="card" style="min-width: 200px; text-align: center;">
                    <div class="stat-value">${progressPercent}%</div>
                    <div class="stat-label">Journey Complete</div>
                    <div class="progress-bar mt-md">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="roadmap-timeline animate-fade-in-up" style="animation-delay: 0.2s;">
                ${roadmap.phases.map((phase, index) => {
        const phaseCompleted = phase.topics.filter(t => t.completed).length;
        const phaseTotal = phase.topics.length;
        const phaseProgress = Math.round((phaseCompleted / phaseTotal) * 100);

        return `
                        <div class="roadmap-phase ${phase.status}" data-phase="${phase.id}">
                            <div class="phase-header">
                                <div>
                                    <span class="badge ${phase.status === 'current' ? 'badge-warning' : phase.status === 'completed' ? 'badge-success' : 'badge-primary'}">
                                        Phase ${phase.id}
                                    </span>
                                    <h4 class="phase-title mt-sm">${phase.title}</h4>
                                    <p class="text-muted">${phase.subtitle}</p>
                                </div>
                                <div class="phase-progress">
                                    ${phaseCompleted}/${phaseTotal} topics
                                </div>
                            </div>
                            
                            <div class="phase-topics mt-md">
                                ${phase.topics.map(topic => `
                                    <div class="topic-item ${topic.completed ? 'completed' : ''}">
                                        <span class="topic-check">
                                            ${topic.completed ? '✓' : '○'}
                                        </span>
                                        <span>${topic.name}</span>
                                    </div>
                                `).join('')}
                            </div>
                            
                            ${phase.status !== 'locked' ? `
                                <button class="btn btn-primary mt-md" style="width: 100%;">
                                    ${phase.status === 'current' ? 'Continue Learning →' : 'Review Phase'}
                                </button>
                            ` : `
                                <div class="locked-notice mt-md">
                                    <span>🔒</span> Complete previous phase to unlock
                                </div>
                            `}
                        </div>
                    `;
    }).join('')}
            </div>
        </section>
        
        <style>
            .phase-topics {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-sm);
            }
            
            .topic-item {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                padding: var(--spacing-sm);
                border-radius: var(--radius-sm);
                font-size: var(--font-size-sm);
                color: var(--text-secondary);
            }
            
            .topic-item.completed {
                color: var(--accent-success);
            }
            
            .topic-check {
                width: 20px;
                font-weight: bold;
            }
            
            .locked-notice {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: var(--spacing-sm);
                padding: var(--spacing-md);
                background: var(--bg-glass);
                border-radius: var(--radius-md);
                color: var(--text-muted);
                font-size: var(--font-size-sm);
            }
        </style>
    `;
}
