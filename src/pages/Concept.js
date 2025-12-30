// ========================================
// Concept Learning Page (5-Step Flow)
// ========================================

const conceptData = {
    id: 'increment-operators',
    title: 'Increment Operators (++)',
    module: 'JavaScript Core',
    phase: 'Phase 4',

    step1: {
        what: 'The ++ operator increases a value by 1. But the critical difference is WHEN the increment happens.',
        where: [
            { name: 'Loop counters', example: 'for(let i=0; i<10; i++)' },
            { name: 'Analytics tracking', example: 'pageViews++' },
            { name: 'Rate limiting', example: 'Track request counts' }
        ],
        why: 'Understanding pre vs post increment prevents silent logical bugs that are extremely hard to debug in production.',
        mistakes: [
            'Using i++ when ++i is needed in compound expressions',
            'Forgetting that i++ returns the OLD value',
            'Using count = count++ (this does nothing!)'
        ]
    },

    step2: {
        title: 'User Login Counter System',
        scenario: 'You\'re building a daily login tracker for an analytics dashboard. The count should increment BEFORE being logged.',
        buggyCode: `let loginCount = 0;

function trackLogin(userId) {
    // Log the current count (BUG HERE!)
    console.log(\`Login #\${loginCount++} by \${userId}\`);
    return loginCount;
}

trackLogin('user_1'); // Logs: "Login #0" (should be #1!)
trackLogin('user_2'); // Logs: "Login #1" (should be #2!)`,

        hint: 'Look at what value is used in the template literal vs what gets stored.',
        fixedCode: `let loginCount = 0;

function trackLogin(userId) {
    // Use pre-increment: increment FIRST, then use
    console.log(\`Login #\${++loginCount} by \${userId}\`);
    return loginCount;
}

trackLogin('user_1'); // Logs: "Login #1" ✓
trackLogin('user_2'); // Logs: "Login #2" ✓`
    },

    step3: {
        correct: {
            code: '++count',
            explanation: 'Pre-increment: Increases value FIRST, then returns the NEW value. Use when you need the updated value immediately.'
        },
        wrong: [
            {
                code: 'count = count++',
                whyFails: 'Post-increment returns the OLD value, which then gets assigned back. The increment is lost!',
                execution: '1. count++ evaluates to 0 (old value)\n2. count becomes 1 (increment happens)\n3. count = 0 (assignment overwrites with old value)\n4. Result: count is STILL 0!'
            },
            {
                code: 'let x = arr[i++]',
                whyFails: 'Gets element at current index, THEN increments. Often confused with ++i which would get the NEXT element.',
                tip: 'In loops, i++ at the end is fine. In expressions, think carefully about which value you need.'
            }
        ],
        seniorThinking: 'Experienced developers prefer ++i in for loops (micro-optimization in some languages) and explicitly separate increment from usage in complex expressions to avoid confusion.'
    },

    step4: {
        companies: [
            { name: 'Google Analytics', usage: 'Page view counters' },
            { name: 'Stripe', usage: 'Transaction sequence numbers' },
            { name: 'Firebase', usage: 'Real-time listener counts' }
        ],
        modules: ['Authentication', 'Rate Limiting', 'Metrics', 'Pagination'],
        productionStory: 'A fintech startup had a billing bug where transactions were logged with wrong sequence numbers. The root cause? Using count++ in a log statement instead of ++count. Took 3 days to debug because the count was correct in the database, just wrong in logs.',
        interviewTrap: 'What does a++ + ++a evaluate to if a=5? (Answer: 11, but the real answer is "this code is confusing and should be rewritten")'
    },

    step5: {
        task: 'Debug this transaction counter used in a payment system',
        brokenCode: `let transactionId = 1000;

function processPayment(amount) {
    const currentId = transactionId++;
    logTransaction(currentId, amount);
    
    // BUG: Receipt shows wrong ID
    return {
        receiptId: transactionId, 
        amount: amount,
        status: 'completed'
    };
}`,
        expectedOutput: 'Receipt ID should match logged transaction ID',
        hints: [
            'What value does transactionId have when building the return object?',
            'Compare currentId vs transactionId at return time'
        ]
    }
};

export function renderConcept() {
    return `
        <section class="learning-container">
            <aside class="learning-sidebar animate-slide-in-left">
                <h4 class="mb-md">5-Step Learning</h4>
                
                <nav class="step-nav">
                    <div class="step-nav-item active" data-step="1">
                        <span class="step-number">1</span>
                        <span>Concept Intro</span>
                    </div>
                    <div class="step-nav-item" data-step="2">
                        <span class="step-number">2</span>
                        <span>Mini Project</span>
                    </div>
                    <div class="step-nav-item" data-step="3">
                        <span class="step-number">3</span>
                        <span>Why This Works</span>
                    </div>
                    <div class="step-nav-item" data-step="4">
                        <span class="step-number">4</span>
                        <span>Industry Mapping</span>
                    </div>
                    <div class="step-nav-item" data-step="5">
                        <span class="step-number">5</span>
                        <span>Skill Challenge</span>
                    </div>
                </nav>
                
                <div class="mt-xl">
                    <button class="btn btn-primary" style="width: 100%;" id="mark-complete-btn">
                        ✓ Mark Complete
                    </button>
                </div>
            </aside>
            
            <main class="learning-main animate-fade-in-up">
                <div class="concept-header">
                    <div class="concept-breadcrumb">
                        ${conceptData.phase} → ${conceptData.module}
                    </div>
                    <h2 class="concept-title">${conceptData.title}</h2>
                </div>
                
                <!-- Step 1: Concept Introduction -->
                <div class="step-content" data-step="1">
                    <div class="concept-section">
                        <h4 class="section-title">
                            <span class="section-icon">📖</span>
                            What It Actually Does
                        </h4>
                        <p>${conceptData.step1.what}</p>
                        
                        <div class="code-block mt-md">
                            <code>
let a = 5;
let b = a++;  // b = 5, a = 6 (post: return old, then increment)
let c = ++a;  // c = 7, a = 7 (pre: increment, then return new)
                            </code>
                        </div>
                    </div>
                    
                    <div class="concept-section">
                        <h4 class="section-title">
                            <span class="section-icon">🏢</span>
                            Where It's Used
                        </h4>
                        ${conceptData.step1.where.map(w => `
                            <div class="why-panel" style="margin-bottom: 8px;">
                                <strong>${w.name}</strong>
                                <code style="display: block; margin-top: 4px; color: var(--text-muted);">
                                    ${w.example}
                                </code>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="concept-section">
                        <h4 class="section-title">
                            <span class="section-icon">⚠️</span>
                            Common Mistakes Beginners Make
                        </h4>
                        <ul style="list-style: none; padding: 0;">
                            ${conceptData.step1.mistakes.map(m => `
                                <li style="padding: 8px 0; color: var(--accent-danger);">
                                    ❌ ${m}
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
                
                <!-- Step 2: Mini Project -->
                <div class="step-content" data-step="2" style="display: none;">
                    <div class="concept-section">
                        <h4 class="section-title">
                            <span class="section-icon">💼</span>
                            ${conceptData.step2.title}
                        </h4>
                        <p>${conceptData.step2.scenario}</p>
                    </div>
                    
                    <div class="concept-section">
                        <h4 class="section-title">
                            <span class="section-icon">🐛</span>
                            The Buggy Code
                        </h4>
                        <div class="code-block code-wrong">
                            <code><pre>${conceptData.step2.buggyCode}</pre></code>
                        </div>
                        
                        <div class="why-panel why-wrong mt-md">
                            <div class="why-header">
                                <span>💡</span> Hint
                            </div>
                            <p>${conceptData.step2.hint}</p>
                        </div>
                    </div>
                    
                    <div class="concept-section">
                        <h4 class="section-title">
                            <span class="section-icon">✅</span>
                            The Fixed Code
                        </h4>
                        <div class="code-block code-correct">
                            <code><pre>${conceptData.step2.fixedCode}</pre></code>
                        </div>
                    </div>
                </div>
                
                <!-- Step 3: Why This Works -->
                <div class="step-content" data-step="3" style="display: none;">
                    <div class="concept-section">
                        <h4 class="section-title">
                            <span class="section-icon">✅</span>
                            Why This Works
                        </h4>
                        <div class="why-panel why-correct">
                            <div class="code-block">
                                <code>${conceptData.step3.correct.code}</code>
                            </div>
                            <p class="mt-md">${conceptData.step3.correct.explanation}</p>
                        </div>
                    </div>
                    
                    <div class="concept-section">
                        <h4 class="section-title">
                            <span class="section-icon">❌</span>
                            Why These Fail
                        </h4>
                        ${conceptData.step3.wrong.map(w => `
                            <div class="why-panel why-wrong mb-md">
                                <div class="code-block">
                                    <code>${w.code}</code>
                                </div>
                                <p class="mt-md"><strong>Why it fails:</strong> ${w.whyFails}</p>
                                ${w.execution ? `
                                    <div class="code-block mt-md" style="background: var(--bg-tertiary);">
                                        <code><pre>${w.execution}</pre></code>
                                    </div>
                                ` : ''}
                                ${w.tip ? `<p class="mt-sm text-muted">💡 ${w.tip}</p>` : ''}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="concept-section">
                        <h4 class="section-title">
                            <span class="section-icon">🧠</span>
                            How Seniors Think
                        </h4>
                        <div class="card-glass">
                            <p>${conceptData.step3.seniorThinking}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Step 4: Industry Mapping -->
                <div class="step-content" data-step="4" style="display: none;">
                    <div class="concept-section">
                        <h4 class="section-title">
                            <span class="section-icon">🏢</span>
                            Where Real Companies Use This
                        </h4>
                        <div class="grid grid-3">
                            ${conceptData.step4.companies.map(c => `
                                <div class="card">
                                    <h5>${c.name}</h5>
                                    <p class="text-muted">${c.usage}</p>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="concept-section">
                        <h4 class="section-title">
                            <span class="section-icon">📦</span>
                            Common Modules
                        </h4>
                        <div class="flex gap-sm" style="flex-wrap: wrap;">
                            ${conceptData.step4.modules.map(m => `
                                <span class="badge badge-primary">${m}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="concept-section">
                        <h4 class="section-title">
                            <span class="section-icon">🔥</span>
                            Production Story
                        </h4>
                        <div class="card-glass">
                            <p>${conceptData.step4.productionStory}</p>
                        </div>
                    </div>
                    
                    <div class="concept-section">
                        <h4 class="section-title">
                            <span class="section-icon">🎯</span>
                            Interview Trap
                        </h4>
                        <div class="why-panel why-wrong">
                            <p>${conceptData.step4.interviewTrap}</p>
                        </div>
                    </div>
                </div>
                
                <!-- Step 5: Skill Challenge -->
                <div class="step-content" data-step="5" style="display: none;">
                    <div class="concept-section">
                        <h4 class="section-title">
                            <span class="section-icon">🎯</span>
                            Debug Challenge
                        </h4>
                        <p>${conceptData.step5.task}</p>
                    </div>
                    
                    <div class="concept-section">
                        <h4 class="section-title">
                            <span class="section-icon">🐛</span>
                            Broken Code
                        </h4>
                        <div class="code-block code-wrong">
                            <code><pre>${conceptData.step5.brokenCode}</pre></code>
                        </div>
                        <p class="mt-md"><strong>Expected:</strong> ${conceptData.step5.expectedOutput}</p>
                    </div>
                    
                    <div class="concept-section">
                        <h4 class="section-title">
                            <span class="section-icon">💡</span>
                            Hints
                        </h4>
                        ${conceptData.step5.hints.map((h, i) => `
                            <div class="why-panel mb-sm">
                                <strong>Hint ${i + 1}:</strong> ${h}
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="mt-xl text-center">
                        <button class="btn btn-primary btn-lg" id="reveal-solution-btn">
                            Reveal Solution
                        </button>
                    </div>
                </div>
            </main>
        </section>
    `;
}
