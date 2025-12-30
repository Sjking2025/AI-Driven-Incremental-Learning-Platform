// ========================================
// Enhanced Dashboard Page
// ========================================

export function renderDashboard(userProgress = {}) {
    const completedConcepts = userProgress.completedConcepts?.length || 3;
    const totalConcepts = 25;
    const progressPercent = Math.round((completedConcepts / totalConcepts) * 100);

    const skills = [
        { name: 'HTML', level: 85, color: '#f97316' },
        { name: 'CSS', level: 70, color: '#8b5cf6' },
        { name: 'JavaScript', level: 45, color: '#eab308' },
        { name: 'React', level: 10, color: '#06b6d4' }
    ];

    const weeklyProgress = [
        { day: 'Mon', hours: 2.5 },
        { day: 'Tue', hours: 1.5 },
        { day: 'Wed', hours: 3.0 },
        { day: 'Thu', hours: 2.0 },
        { day: 'Fri', hours: 4.0 },
        { day: 'Sat', hours: 1.0 },
        { day: 'Sun', hours: 0.5 }
    ];

    const maxHours = Math.max(...weeklyProgress.map(d => d.hours));

    const recentActivity = [
        { type: 'completed', item: 'Closures Deep Dive', time: '2 hours ago', icon: '✅' },
        { type: 'started', item: 'Async/Await Patterns', time: '3 hours ago', icon: '📖' },
        { type: 'completed', item: 'Increment Operators', time: 'Yesterday', icon: '✅' },
        { type: 'project', item: 'Form Validation Engine', time: '2 days ago', icon: '🔨' }
    ];

    const achievements = [
        { name: 'First Concept', icon: '🎯', unlocked: true },
        { name: '5 Day Streak', icon: '🔥', unlocked: true },
        { name: 'Debug Master', icon: '🐛', unlocked: false },
        { name: 'Project Builder', icon: '🏗️', unlocked: false }
    ];

    return `
        <section class="dashboard-enhanced">
            <div class="dashboard-header animate-fade-in-up">
                <div>
                    <h1>Welcome back! 👋</h1>
                    <p class="text-muted">Frontend Developer Path • Day ${userProgress.streak || 5} Streak</p>
                </div>
                <div class="streak-container">
                    <div class="streak-badge animate-float">
                        <span class="streak-number">🔥 ${userProgress.streak || 5}</span>
                        <span class="streak-label">Day Streak</span>
                    </div>
                </div>
            </div>
            
            <div class="dashboard-grid mt-xl">
                <!-- Main Stats Row -->
                <div class="stats-row animate-fade-in-up" style="animation-delay: 0.1s;">
                    <div class="stat-card-large">
                        <div class="stat-icon">📚</div>
                        <div class="stat-info">
                            <span class="stat-value">${completedConcepts}</span>
                            <span class="stat-label">Concepts Mastered</span>
                        </div>
                    </div>
                    <div class="stat-card-large">
                        <div class="stat-icon">🔨</div>
                        <div class="stat-info">
                            <span class="stat-value">2</span>
                            <span class="stat-label">Projects Completed</span>
                        </div>
                    </div>
                    <div class="stat-card-large">
                        <div class="stat-icon">⏱️</div>
                        <div class="stat-info">
                            <span class="stat-value">14.5h</span>
                            <span class="stat-label">This Week</span>
                        </div>
                    </div>
                    <div class="stat-card-large primary">
                        <div class="stat-icon">🎯</div>
                        <div class="stat-info">
                            <span class="stat-value">${progressPercent}%</span>
                            <span class="stat-label">Job Ready</span>
                        </div>
                    </div>
                </div>
                
                <!-- Charts Row -->
                <div class="charts-row animate-fade-in-up" style="animation-delay: 0.2s;">
                    <!-- Readiness Ring -->
                    <div class="card chart-card">
                        <h4>Job Readiness</h4>
                        <div class="readiness-ring-container">
                            <svg viewBox="0 0 200 200" class="readiness-ring">
                                <defs>
                                    <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" style="stop-color:#6366f1"/>
                                        <stop offset="50%" style="stop-color:#8b5cf6"/>
                                        <stop offset="100%" style="stop-color:#06b6d4"/>
                                    </linearGradient>
                                </defs>
                                <circle class="ring-bg" cx="100" cy="100" r="80"/>
                                <circle class="ring-fill" cx="100" cy="100" r="80"
                                    stroke-dasharray="502"
                                    stroke-dashoffset="${502 - (502 * progressPercent / 100)}"/>
                            </svg>
                            <div class="ring-center">
                                <span class="ring-value">${progressPercent}%</span>
                                <span class="ring-label">Ready</span>
                            </div>
                        </div>
                        <div class="readiness-stages">
                            ${['Beginner', 'Learning', 'Practicing', 'Advanced', 'Job Ready'].map((stage, i) => `
                                <div class="stage ${(i + 1) * 20 <= progressPercent ? 'active' : ''}">
                                    ${stage}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Weekly Activity -->
                    <div class="card chart-card">
                        <h4>Weekly Activity</h4>
                        <div class="bar-chart">
                            ${weeklyProgress.map(day => `
                                <div class="bar-group">
                                    <div class="bar-container">
                                        <div class="bar" style="height: ${(day.hours / maxHours) * 100}%">
                                            <span class="bar-value">${day.hours}h</span>
                                        </div>
                                    </div>
                                    <span class="bar-label">${day.day}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Skills & Activity Row -->
                <div class="skills-activity-row animate-fade-in-up" style="animation-delay: 0.3s;">
                    <!-- Skills Progress -->
                    <div class="card">
                        <h4>Skills Progress</h4>
                        <div class="skills-progress">
                            ${skills.map(skill => `
                                <div class="skill-row">
                                    <div class="skill-info">
                                        <span class="skill-name">${skill.name}</span>
                                        <span class="skill-percent">${skill.level}%</span>
                                    </div>
                                    <div class="skill-bar">
                                        <div class="skill-fill" style="width: ${skill.level}%; background: ${skill.color}"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Recent Activity -->
                    <div class="card">
                        <h4>Recent Activity</h4>
                        <div class="activity-list">
                            ${recentActivity.map(activity => `
                                <div class="activity-item">
                                    <span class="activity-icon">${activity.icon}</span>
                                    <div class="activity-details">
                                        <span class="activity-name">${activity.item}</span>
                                        <span class="activity-time text-muted">${activity.time}</span>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Achievements -->
                    <div class="card">
                        <h4>Achievements</h4>
                        <div class="achievements-grid">
                            ${achievements.map(ach => `
                                <div class="achievement ${ach.unlocked ? 'unlocked' : 'locked'}">
                                    <span class="achievement-icon">${ach.icon}</span>
                                    <span class="achievement-name">${ach.name}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
                
                <!-- Continue Learning CTA -->
                <div class="continue-section animate-fade-in-up" style="animation-delay: 0.4s;">
                    <div class="continue-card">
                        <div class="continue-info">
                            <h4>Continue Learning</h4>
                            <p class="text-muted">Pick up where you left off</p>
                        </div>
                        <div class="continue-item">
                            <span class="continue-icon">📖</span>
                            <div>
                                <strong>Async/Await Patterns</strong>
                                <span class="text-muted">Step 3 of 5</span>
                            </div>
                            <button class="btn btn-primary">Continue →</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <style>
            .dashboard-enhanced {
                max-width: 1400px;
                margin: 0 auto;
            }
            
            .dashboard-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .streak-container {
                display: flex;
                align-items: center;
            }
            
            .streak-badge {
                display: flex;
                flex-direction: column;
                align-items: center;
                background: var(--gradient-card);
                padding: var(--spacing-md) var(--spacing-xl);
                border-radius: var(--radius-xl);
                border: 1px solid var(--border-accent);
            }
            
            .streak-number {
                font-size: 24px;
                font-weight: 700;
            }
            
            .streak-label {
                font-size: var(--font-size-xs);
                color: var(--text-muted);
            }
            
            .stats-row {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: var(--spacing-md);
            }
            
            .stat-card-large {
                background: var(--bg-card);
                border: 1px solid var(--border-subtle);
                border-radius: var(--radius-lg);
                padding: var(--spacing-lg);
                display: flex;
                align-items: center;
                gap: var(--spacing-md);
                transition: all var(--transition-base);
            }
            
            .stat-card-large:hover {
                border-color: var(--border-accent);
                transform: translateY(-2px);
            }
            
            .stat-card-large.primary {
                background: var(--gradient-card);
                border-color: var(--accent-primary);
            }
            
            .stat-icon {
                font-size: 28px;
                width: 48px;
                height: 48px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: var(--bg-glass);
                border-radius: var(--radius-md);
            }
            
            .stat-info {
                display: flex;
                flex-direction: column;
            }
            
            .stat-value {
                font-size: var(--font-size-xl);
                font-weight: 700;
            }
            
            .stat-label {
                font-size: var(--font-size-sm);
                color: var(--text-muted);
            }
            
            .charts-row {
                display: grid;
                grid-template-columns: 1fr 2fr;
                gap: var(--spacing-lg);
                margin-top: var(--spacing-lg);
            }
            
            .chart-card h4 {
                margin-bottom: var(--spacing-lg);
            }
            
            .readiness-ring-container {
                position: relative;
                width: 160px;
                height: 160px;
                margin: 0 auto var(--spacing-md);
            }
            
            .readiness-ring {
                width: 100%;
                height: 100%;
                transform: rotate(-90deg);
            }
            
            .ring-bg {
                fill: none;
                stroke: var(--bg-tertiary);
                stroke-width: 12;
            }
            
            .ring-fill {
                fill: none;
                stroke: url(#ring-gradient);
                stroke-width: 12;
                stroke-linecap: round;
                transition: stroke-dashoffset 1s ease;
            }
            
            .ring-center {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
            }
            
            .ring-value {
                display: block;
                font-size: 28px;
                font-weight: 700;
                color: var(--text-primary);
            }
            
            .ring-label {
                font-size: var(--font-size-sm);
                color: var(--text-muted);
            }
            
            .readiness-stages {
                display: flex;
                justify-content: space-between;
                font-size: var(--font-size-xs);
                color: var(--text-muted);
            }
            
            .readiness-stages .stage.active {
                color: var(--accent-primary);
                font-weight: 600;
            }
            
            .bar-chart {
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                height: 180px;
                padding-top: var(--spacing-md);
            }
            
            .bar-group {
                display: flex;
                flex-direction: column;
                align-items: center;
                flex: 1;
            }
            
            .bar-container {
                height: 140px;
                width: 32px;
                display: flex;
                align-items: flex-end;
            }
            
            .bar {
                width: 100%;
                background: linear-gradient(to top, var(--accent-primary), var(--accent-secondary));
                border-radius: var(--radius-sm) var(--radius-sm) 0 0;
                min-height: 4px;
                position: relative;
                transition: height 0.5s ease;
            }
            
            .bar-value {
                position: absolute;
                top: -20px;
                left: 50%;
                transform: translateX(-50%);
                font-size: var(--font-size-xs);
                color: var(--text-muted);
            }
            
            .bar-label {
                margin-top: var(--spacing-sm);
                font-size: var(--font-size-xs);
                color: var(--text-muted);
            }
            
            .skills-activity-row {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: var(--spacing-lg);
                margin-top: var(--spacing-lg);
            }
            
            .skills-progress {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-md);
            }
            
            .skill-row {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-xs);
            }
            
            .skill-info {
                display: flex;
                justify-content: space-between;
                font-size: var(--font-size-sm);
            }
            
            .skill-bar {
                height: 8px;
                background: var(--bg-tertiary);
                border-radius: var(--radius-sm);
                overflow: hidden;
            }
            
            .skill-fill {
                height: 100%;
                border-radius: var(--radius-sm);
                transition: width 1s ease;
            }
            
            .activity-list {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-md);
            }
            
            .activity-item {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
            }
            
            .activity-icon {
                font-size: 18px;
            }
            
            .activity-details {
                display: flex;
                flex-direction: column;
            }
            
            .activity-name {
                font-size: var(--font-size-sm);
            }
            
            .activity-time {
                font-size: var(--font-size-xs);
            }
            
            .achievements-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: var(--spacing-sm);
            }
            
            .achievement {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                padding: var(--spacing-sm);
                background: var(--bg-glass);
                border-radius: var(--radius-md);
                font-size: var(--font-size-sm);
            }
            
            .achievement.locked {
                opacity: 0.4;
            }
            
            .achievement.unlocked {
                border: 1px solid var(--border-accent);
            }
            
            .continue-section {
                margin-top: var(--spacing-lg);
            }
            
            .continue-card {
                background: var(--gradient-card);
                border: 1px solid var(--border-accent);
                border-radius: var(--radius-xl);
                padding: var(--spacing-xl);
            }
            
            .continue-info {
                margin-bottom: var(--spacing-lg);
            }
            
            .continue-item {
                display: flex;
                align-items: center;
                gap: var(--spacing-md);
                background: var(--bg-card);
                padding: var(--spacing-md);
                border-radius: var(--radius-lg);
            }
            
            .continue-icon {
                font-size: 24px;
            }
            
            .continue-item > div {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            
            @media (max-width: 1024px) {
                .stats-row { grid-template-columns: repeat(2, 1fr); }
                .charts-row { grid-template-columns: 1fr; }
                .skills-activity-row { grid-template-columns: 1fr; }
            }
            
            @media (max-width: 640px) {
                .stats-row { grid-template-columns: 1fr; }
            }
        </style>
    `;
}
