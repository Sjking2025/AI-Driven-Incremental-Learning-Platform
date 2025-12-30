// ========================================
// Career Selection Page
// ========================================

const careers = [
    {
        id: 'frontend',
        icon: '🎨',
        title: 'Frontend Developer',
        description: 'Build beautiful, responsive user interfaces that users love',
        foundation: ['Design Principles', 'Layout Reasoning', 'UX Thinking'],
        stack: ['HTML', 'CSS', 'JavaScript', 'React'],
        duration: '4-6 months',
        projects: 12
    },
    {
        id: 'backend',
        icon: '⚙️',
        title: 'Backend Developer',
        description: 'Design scalable APIs and robust server-side systems',
        foundation: ['System Design', 'API Thinking', 'Data Flow'],
        stack: ['Node.js', 'Python', 'Databases', 'REST/GraphQL'],
        duration: '5-7 months',
        projects: 15
    },
    {
        id: 'aiml',
        icon: '🤖',
        title: 'AI/ML Engineer',
        description: 'Build intelligent systems that learn and adapt',
        foundation: ['Math Foundations', 'Data Thinking', 'Model Intuition'],
        stack: ['Python', 'TensorFlow', 'PyTorch', 'Statistics'],
        duration: '6-9 months',
        projects: 10
    },
    {
        id: 'devops',
        icon: '🔧',
        title: 'DevOps Engineer',
        description: 'Automate, deploy, and scale infrastructure',
        foundation: ['Infrastructure Thinking', 'Automation Mindset', 'Reliability'],
        stack: ['Linux', 'Docker', 'Kubernetes', 'CI/CD'],
        duration: '4-6 months',
        projects: 8
    },
    {
        id: 'mobile',
        icon: '📱',
        title: 'Mobile Developer',
        description: 'Create powerful apps for iOS and Android',
        foundation: ['Mobile UX Patterns', 'Platform Differences', 'Performance'],
        stack: ['React Native', 'Flutter', 'Swift', 'Kotlin'],
        duration: '5-7 months',
        projects: 10
    },
    {
        id: 'data',
        icon: '📊',
        title: 'Data Analyst',
        description: 'Transform data into business insights',
        foundation: ['Statistical Thinking', 'Business Context', 'Visualization'],
        stack: ['SQL', 'Python', 'Tableau', 'Excel'],
        duration: '3-5 months',
        projects: 12
    }
];

export function renderCareerSelection() {
    return `
        <section class="career-selection">
            <div class="text-center mb-xl animate-fade-in-up">
                <h1>Choose Your Path</h1>
                <p class="hero-subtitle">
                    Select your target career. We'll build a personalized roadmap 
                    with foundation concepts, real projects, and industry insights.
                </p>
            </div>
            
            <div class="career-grid">
                ${careers.map((career, index) => `
                    <div class="career-card hover-lift animate-fade-in-up stagger-${index + 1}" 
                         data-career="${career.id}">
                        <div class="career-icon">${career.icon}</div>
                        <h3 class="career-title">${career.title}</h3>
                        <p class="career-description">${career.description}</p>
                        
                        <div class="career-foundation mb-md">
                            <p class="text-muted" style="font-size: 12px; margin-bottom: 8px;">
                                FOUNDATION PHASE:
                            </p>
                            <div class="flex gap-sm" style="flex-wrap: wrap;">
                                ${career.foundation.map(f => `
                                    <span class="badge badge-primary">${f}</span>
                                `).join('')}
                            </div>
                        </div>
                        
                        <div class="career-stack mb-md">
                            <p class="text-muted" style="font-size: 12px; margin-bottom: 8px;">
                                TECH STACK:
                            </p>
                            <p style="color: var(--text-primary); font-size: 14px;">
                                ${career.stack.join(' • ')}
                            </p>
                        </div>
                        
                        <div class="career-meta">
                            <span class="career-meta-item">
                                ⏱️ ${career.duration}
                            </span>
                            <span class="career-meta-item">
                                📁 ${career.projects} projects
                            </span>
                        </div>
                    </div>
                `).join('')}
            </div>
        </section>
        
        <style>
            .career-selection {
                padding: var(--spacing-xl) 0;
            }
            
            .career-foundation,
            .career-stack {
                padding-top: var(--spacing-md);
                border-top: 1px solid var(--border-subtle);
            }
        </style>
    `;
}
