// ========================================
// Project Workspace Page
// ========================================

const currentProject = {
    id: 'form-validation',
    title: 'Dynamic Form Validation Engine',
    level: 'micro',
    phase: 1,
    totalPhases: 4,
    phases: [
        {
            id: 1,
            title: 'Setup & Structure',
            status: 'current',
            tasks: [
                { text: 'Create HTML form structure', completed: true },
                { text: 'Add input fields with proper IDs', completed: true },
                { text: 'Setup validation container', completed: false }
            ]
        },
        {
            id: 2,
            title: 'Validation Logic',
            status: 'locked',
            tasks: [
                { text: 'Create validation rules object', completed: false },
                { text: 'Implement email regex validation', completed: false },
                { text: 'Add password strength checker', completed: false }
            ]
        },
        {
            id: 3,
            title: 'Real-time Feedback',
            status: 'locked',
            tasks: [
                { text: 'Add input event listeners', completed: false },
                { text: 'Implement debouncing', completed: false },
                { text: 'Show/hide error messages', completed: false }
            ]
        },
        {
            id: 4,
            title: 'Polish & Accessibility',
            status: 'locked',
            tasks: [
                { text: 'Add ARIA attributes', completed: false },
                { text: 'Style error states', completed: false },
                { text: 'Test with keyboard navigation', completed: false }
            ]
        }
    ],
    currentHint: 'Start by creating a form with email, password, and confirm password fields. Each should have a unique ID for targeting.',
    starterCode: `<!-- Form Validation Exercise -->
<form id="signup-form" novalidate>
  <div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" name="email">
    <span class="error" id="email-error"></span>
  </div>
  
  <div class="form-group">
    <label for="password">Password</label>
    <input type="password" id="password" name="password">
    <span class="error" id="password-error"></span>
  </div>
  
  <div class="form-group">
    <label for="confirm">Confirm Password</label>
    <input type="password" id="confirm" name="confirm">
    <span class="error" id="confirm-error"></span>
  </div>
  
  <button type="submit">Sign Up</button>
</form>`,
    expectedOutput: 'Form validates in real-time, showing errors as user types with debouncing'
};

export function renderProjectWorkspace() {
    const completedTasks = currentProject.phases.flatMap(p => p.tasks).filter(t => t.completed).length;
    const totalTasks = currentProject.phases.flatMap(p => p.tasks).length;
    const progressPercent = Math.round((completedTasks / totalTasks) * 100);

    return `
        <section class="workspace">
            <div class="workspace-header animate-fade-in-up">
                <div class="workspace-breadcrumb">
                    <a href="#projects">Projects</a> → 
                    <span class="badge level-${currentProject.level}">${currentProject.level}</span>
                </div>
                <h1>${currentProject.title}</h1>
                <div class="workspace-progress">
                    <div class="progress-text">
                        Phase ${currentProject.phase} of ${currentProject.totalPhases} • ${progressPercent}% Complete
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercent}%"></div>
                    </div>
                </div>
            </div>
            
            <div class="workspace-grid mt-xl">
                <!-- Left: Instructions & Tasks -->
                <div class="workspace-sidebar animate-slide-in-left">
                    <div class="phases-list">
                        ${currentProject.phases.map(phase => `
                            <div class="phase-card ${phase.status}">
                                <div class="phase-header">
                                    <span class="phase-indicator">
                                        ${phase.status === 'current' ? '▶' : phase.status === 'completed' ? '✓' : '🔒'}
                                    </span>
                                    <h4>${phase.id}. ${phase.title}</h4>
                                </div>
                                ${phase.status !== 'locked' ? `
                                    <div class="phase-tasks">
                                        ${phase.tasks.map(task => `
                                            <label class="task-item ${task.completed ? 'completed' : ''}">
                                                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                                                <span>${task.text}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="hint-card mt-lg">
                        <h5>💡 Current Hint</h5>
                        <p>${currentProject.currentHint}</p>
                    </div>
                </div>
                
                <!-- Right: Code Editor -->
                <div class="workspace-editor animate-fade-in-up">
                    <div class="editor-header">
                        <div class="editor-tabs">
                            <button class="editor-tab active">index.html</button>
                            <button class="editor-tab">styles.css</button>
                            <button class="editor-tab">script.js</button>
                        </div>
                        <div class="editor-actions">
                            <button class="btn btn-secondary btn-sm">Reset</button>
                            <button class="btn btn-primary btn-sm">▶ Run</button>
                        </div>
                    </div>
                    
                    <div class="code-editor">
                        <pre><code>${escapeHtml(currentProject.starterCode)}</code></pre>
                    </div>
                    
                    <div class="preview-panel">
                        <div class="preview-header">
                            <span>Preview</span>
                            <span class="text-muted">Live output will appear here</span>
                        </div>
                        <div class="preview-content">
                            <p class="text-muted text-center">Click "Run" to see your code in action</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        
        <style>
            .workspace {
                height: calc(100vh - 120px);
                display: flex;
                flex-direction: column;
            }
            
            .workspace-header {
                flex-shrink: 0;
            }
            
            .workspace-breadcrumb {
                font-size: var(--font-size-sm);
                color: var(--text-muted);
                margin-bottom: var(--spacing-sm);
            }
            
            .workspace-breadcrumb a {
                color: var(--accent-primary);
            }
            
            .workspace-progress {
                margin-top: var(--spacing-md);
            }
            
            .progress-text {
                font-size: var(--font-size-sm);
                color: var(--text-muted);
                margin-bottom: var(--spacing-xs);
            }
            
            .workspace-grid {
                display: grid;
                grid-template-columns: 320px 1fr;
                gap: var(--spacing-lg);
                flex: 1;
                min-height: 0;
            }
            
            .workspace-sidebar {
                display: flex;
                flex-direction: column;
                gap: var(--spacing-md);
                overflow-y: auto;
            }
            
            .phase-card {
                background: var(--bg-card);
                border: 1px solid var(--border-subtle);
                border-radius: var(--radius-lg);
                padding: var(--spacing-md);
            }
            
            .phase-card.current {
                border-color: var(--accent-primary);
            }
            
            .phase-card.locked {
                opacity: 0.5;
            }
            
            .phase-header {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
            }
            
            .phase-indicator {
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
            }
            
            .phase-tasks {
                margin-top: var(--spacing-md);
                padding-left: var(--spacing-lg);
                display: flex;
                flex-direction: column;
                gap: var(--spacing-xs);
            }
            
            .task-item {
                display: flex;
                align-items: center;
                gap: var(--spacing-sm);
                font-size: var(--font-size-sm);
                cursor: pointer;
            }
            
            .task-item.completed span {
                text-decoration: line-through;
                color: var(--text-muted);
            }
            
            .hint-card {
                background: var(--bg-glass);
                border: 1px solid var(--border-accent);
                border-radius: var(--radius-lg);
                padding: var(--spacing-md);
            }
            
            .hint-card h5 {
                margin-bottom: var(--spacing-sm);
            }
            
            .hint-card p {
                font-size: var(--font-size-sm);
                color: var(--text-secondary);
            }
            
            .workspace-editor {
                display: flex;
                flex-direction: column;
                background: var(--bg-card);
                border: 1px solid var(--border-subtle);
                border-radius: var(--radius-xl);
                overflow: hidden;
            }
            
            .editor-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: var(--spacing-sm) var(--spacing-md);
                background: var(--bg-tertiary);
                border-bottom: 1px solid var(--border-subtle);
            }
            
            .editor-tabs {
                display: flex;
                gap: var(--spacing-xs);
            }
            
            .editor-tab {
                background: transparent;
                border: none;
                padding: var(--spacing-xs) var(--spacing-md);
                color: var(--text-muted);
                cursor: pointer;
                border-radius: var(--radius-sm);
                font-size: var(--font-size-sm);
            }
            
            .editor-tab.active {
                background: var(--bg-card);
                color: var(--text-primary);
            }
            
            .editor-actions {
                display: flex;
                gap: var(--spacing-sm);
            }
            
            .code-editor {
                flex: 1;
                overflow: auto;
                padding: var(--spacing-md);
                background: #1a1a2e;
            }
            
            .code-editor pre {
                margin: 0;
                font-family: 'Monaco', 'Menlo', monospace;
                font-size: 13px;
                line-height: 1.6;
            }
            
            .code-editor code {
                color: #e0e0e0;
            }
            
            .preview-panel {
                border-top: 1px solid var(--border-subtle);
                height: 200px;
            }
            
            .preview-header {
                display: flex;
                justify-content: space-between;
                padding: var(--spacing-sm) var(--spacing-md);
                background: var(--bg-tertiary);
                border-bottom: 1px solid var(--border-subtle);
                font-size: var(--font-size-sm);
            }
            
            .preview-content {
                padding: var(--spacing-xl);
                display: flex;
                align-items: center;
                justify-content: center;
                height: calc(100% - 40px);
            }
        </style>
    `;
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
