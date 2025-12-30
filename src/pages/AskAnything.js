// ========================================
// Ask Anything Page - Interactive Q&A
// ========================================

const commonQuestions = [
    {
        category: 'JavaScript Core',
        questions: [
            {
                id: 'why-closures-exist',
                question: 'Why do closures exist in JavaScript?',
                answer: {
                    short: 'Closures allow functions to remember their lexical environment, enabling data privacy and stateful functions.',
                    detailed: `
## Why Closures Exist

### The Core Purpose
Closures solve a fundamental problem: **how do you give a function private state?**

### Without Closures (Bad)
\`\`\`javascript
// Global state - anyone can modify!
let count = 0;1
function increment() {
    return ++count;
}
count = 1000; // 😱 Corrupted!
\`\`\`

### With Closures (Good)
\`\`\`javascript
function createCounter() {
    let count = 0; // Private!
    return () => ++count;
}
const increment = createCounter();
increment(); // 1
increment(); // 2
// count = 1000; // Error! Can't access
\`\`\`

### Real-World Usage
- **React Hooks**: useState uses closures internally
- **Event Handlers**: Remember context when triggered
- **Module Pattern**: Private variables in modules
- **Debounce/Throttle**: Store timer state

### Senior Insight
"Closures aren't a feature to learn, they're a consequence of how JavaScript scopes work. Once you understand lexical scope, closures are inevitable."
                    `,
                    industryContext: 'Every major JavaScript library uses closures. React\'s entire hooks system depends on them.'
                }
            },
            {
                id: 'async-await-vs-promises',
                question: 'When should I use async/await vs .then()?',
                answer: {
                    short: 'Use async/await for cleaner sequential code, .then() for parallel operations or when you need more control.',
                    detailed: `
## Async/Await vs Promises: The Real Decision

### Use Async/Await When:
- You have **sequential** operations
- Code readability is priority
- Error handling needs try/catch

\`\`\`javascript
// Clean, readable, sequential
async function fetchUser() {
    try {
        const user = await getUser();
        const posts = await getPosts(user.id);
        const comments = await getComments(posts[0].id);
        return { user, posts, comments };
    } catch (error) {
        console.error('Failed:', error);
    }
}
\`\`\`

### Use .then() When:
- You need **parallel** execution
- Working with Promise utilities
- Chaining is simple (1-2 levels)

\`\`\`javascript
// Parallel - faster!
Promise.all([
    getUser(),
    getPosts(),
    getSettings()
]).then(([user, posts, settings]) => {
    // All loaded at once
});
\`\`\`

### The Mistake Juniors Make
\`\`\`javascript
// ❌ Sequential when it could be parallel
const user = await getUser();
const posts = await getPosts();
const settings = await getSettings();
// Each waits for the previous!

// ✅ Parallel when independent
const [user, posts, settings] = await Promise.all([
    getUser(), getPosts(), getSettings()
]);
\`\`\`

### Senior Rule
"If operations are independent, run them in parallel. If they depend on each other, use async/await for clarity."
                    `,
                    industryContext: 'API calls in production should always consider parallelization. Sequential calls can add seconds of latency.'
                }
            },
            {
                id: 'this-keyword',
                question: 'Why does "this" behave so strangely in JavaScript?',
                answer: {
                    short: '"this" is determined by HOW a function is called, not WHERE it\'s defined. Arrow functions are the exception.',
                    detailed: `
## The "this" Mystery Solved

### The Core Rule
"this" is determined at **call time**, not definition time.

### The Four Binding Rules

**1. Default Binding (global)**
\`\`\`javascript
function show() { console.log(this); }
show(); // window (or undefined in strict mode)
\`\`\`

**2. Implicit Binding (object method)**
\`\`\`javascript
const obj = {
    name: 'Object',
    show() { console.log(this.name); }
};
obj.show(); // "Object"
\`\`\`

**3. Explicit Binding (call/apply/bind)**
\`\`\`javascript
function greet() { console.log(this.name); }
greet.call({ name: 'Explicit' }); // "Explicit"
\`\`\`

**4. New Binding (constructor)**
\`\`\`javascript
function User(name) { this.name = name; }
const user = new User('New'); // this = new object
\`\`\`

### Arrow Functions: The Exception
\`\`\`javascript
const obj = {
    name: 'Object',
    // Arrow inherits "this" from lexical scope
    show: () => console.log(this.name),
    showRegular() { console.log(this.name); }
};
obj.show(); // undefined (inherited from outer scope!)
obj.showRegular(); // "Object"
\`\`\`

### The Interview Question
\`\`\`javascript
const obj = {
    name: 'Object',
    greet() { console.log(this.name); }
};
const greet = obj.greet;
greet(); // undefined! (lost context)
\`\`\`

### Senior Fix
\`\`\`javascript
const greet = obj.greet.bind(obj);
// Or use arrow function in class
\`\`\`
                    `,
                    industryContext: 'React class components had endless "this" bugs until hooks eliminated the need for class methods entirely.'
                }
            }
        ]
    },
    {
        category: 'CSS & Layout',
        questions: [
            {
                id: 'flexbox-vs-grid',
                question: 'When should I use Flexbox vs CSS Grid?',
                answer: {
                    short: 'Flexbox for 1D layouts (row OR column), Grid for 2D layouts (rows AND columns).',
                    detailed: `
## Flexbox vs Grid: The Real Decision

### The Simple Rule
- **1 dimension** (row OR column) → Flexbox
- **2 dimensions** (rows AND columns) → Grid

### Flexbox Examples
\`\`\`css
/* Navigation bar - single row */
.nav { display: flex; justify-content: space-between; }

/* Card footer - align buttons */
.card-footer { display: flex; gap: 8px; }

/* Center anything */
.center { display: flex; align-items: center; justify-content: center; }
\`\`\`

### Grid Examples
\`\`\`css
/* Dashboard layout */
.dashboard {
    display: grid;
    grid-template-columns: 250px 1fr;
    grid-template-rows: auto 1fr auto;
}

/* Photo gallery */
.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 16px;
}
\`\`\`

### Common Mistakes
❌ Using Grid for simple centering
❌ Nesting multiple Flexbox containers unnecessarily
❌ Fighting the defaults instead of choosing the right tool

### Senior Pattern
\`\`\`css
/* Page layout: Grid for structure */
.page {
    display: grid;
    grid-template: "header" auto "main" 1fr "footer" auto / 1fr;
}

/* Components inside: Flexbox for alignment */
.header { display: flex; justify-content: space-between; }
\`\`\`
                    `,
                    industryContext: 'Most production sites use Grid for page layout and Flexbox for component internals.'
                }
            }
        ]
    },
    {
        category: 'Real-World Patterns',
        questions: [
            {
                id: 'debounce-throttle',
                question: 'What\'s the difference between debounce and throttle?',
                answer: {
                    short: 'Debounce waits for silence. Throttle limits frequency. Use debounce for search inputs, throttle for scroll events.',
                    detailed: `
## Debounce vs Throttle

### Debounce: "Wait for silence"
Delays execution until input stops.

\`\`\`javascript
function debounce(fn, delay) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

// Usage: Search input
const search = debounce((query) => {
    fetchResults(query);
}, 300);
input.addEventListener('input', (e) => search(e.target.value));
\`\`\`

**Use cases:**
- Search as you type
- Auto-save drafts
- Window resize handlers

### Throttle: "Limit frequency"
Executes at most once per interval.

\`\`\`javascript
function throttle(fn, limit) {
    let inThrottle;
    return (...args) => {
        if (!inThrottle) {
            fn(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Usage: Scroll handler
const onScroll = throttle(() => {
    updateScrollPosition();
}, 100);
window.addEventListener('scroll', onScroll);
\`\`\`

**Use cases:**
- Scroll event handlers
- Mouse move tracking
- API rate limiting

### Visual Difference
\`\`\`
Input events: ----x-x-x-x-x-----x-x-x----
Debounce:     ----------------x--------x (after silence)
Throttle:     ----x-----x-----x-----x--- (every N ms)
\`\`\`
                    `,
                    industryContext: 'Google search uses debounce. Infinite scroll uses throttle. Wrong choice = performance problems or missed events.'
                }
            }
        ]
    }
];

export function renderAskAnything() {
    return `
        <section class="ask-anything-page">
            <div class="ask-header animate-fade-in-up">
                <h1>Ask Anything 💬</h1>
                <p class="hero-subtitle">
                    Get industry-context answers to your coding questions. 
                    Not just "how" — but "why" and "where it's used."
                </p>
            </div>
            
            <div class="ask-search-container animate-fade-in-up" style="animation-delay: 0.1s;">
                <div class="search-box">
                    <span class="search-icon">🔍</span>
                    <input type="text" 
                           id="ask-input" 
                           class="search-input" 
                           placeholder="Ask anything... e.g., 'Why do closures exist?'">
                </div>
                <div class="search-suggestions" id="search-suggestions">
                    <!-- Suggestions populated dynamically -->
                </div>
            </div>
            
            <div class="questions-container mt-xl">
                ${commonQuestions.map(category => `
                    <div class="question-category animate-fade-in-up">
                        <h3 class="category-title">${category.category}</h3>
                        <div class="questions-grid">
                            ${category.questions.map(q => `
                                <div class="question-card card hover-lift" data-question="${q.id}">
                                    <p class="question-text">${q.question}</p>
                                    <p class="answer-preview text-muted">${q.answer.short}</p>
                                    <button class="btn btn-secondary mt-md" style="width: 100%;">
                                        See Full Answer →
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <!-- Answer Modal -->
            <div id="answer-modal" class="answer-modal" style="display: none;">
                <div class="modal-content">
                    <button class="modal-close" id="close-modal">✕</button>
                    <div id="answer-content">
                        <!-- Answer loaded dynamically -->
                    </div>
                </div>
            </div>
        </section>
        
        <style>
            .ask-header {
                text-align: center;
                padding: var(--spacing-xl) 0;
            }
            
            .ask-search-container {
                max-width: 700px;
                margin: 0 auto;
            }
            
            .search-box {
                display: flex;
                align-items: center;
                gap: var(--spacing-md);
                background: var(--bg-card);
                border: 1px solid var(--border-subtle);
                border-radius: var(--radius-xl);
                padding: var(--spacing-md) var(--spacing-lg);
                transition: all var(--transition-base);
            }
            
            .search-box:focus-within {
                border-color: var(--accent-primary);
                box-shadow: var(--shadow-glow);
            }
            
            .search-icon {
                font-size: 20px;
            }
            
            .search-input {
                flex: 1;
                background: transparent;
                border: none;
                outline: none;
                font-size: var(--font-size-lg);
                color: var(--text-primary);
                font-family: var(--font-family);
            }
            
            .search-input::placeholder {
                color: var(--text-muted);
            }
            
            .category-title {
                margin-bottom: var(--spacing-lg);
                color: var(--text-accent);
            }
            
            .questions-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: var(--spacing-lg);
                margin-bottom: var(--spacing-xl);
            }
            
            .question-text {
                font-weight: 600;
                margin-bottom: var(--spacing-sm);
            }
            
            .answer-preview {
                font-size: var(--font-size-sm);
            }
            
            .answer-modal {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.8);
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: var(--spacing-xl);
            }
            
            .modal-content {
                background: var(--bg-secondary);
                border: 1px solid var(--border-subtle);
                border-radius: var(--radius-xl);
                max-width: 800px;
                max-height: 80vh;
                overflow-y: auto;
                padding: var(--spacing-xl);
                position: relative;
            }
            
            .modal-close {
                position: absolute;
                top: var(--spacing-md);
                right: var(--spacing-md);
                background: var(--bg-glass);
                border: none;
                color: var(--text-primary);
                width: 32px;
                height: 32px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 16px;
            }
            
            #answer-content h2 {
                margin-top: var(--spacing-xl);
                color: var(--text-primary);
            }
            
            #answer-content h3 {
                margin-top: var(--spacing-lg);
                color: var(--accent-primary);
            }
            
            #answer-content pre {
                background: var(--bg-tertiary);
                padding: var(--spacing-md);
                border-radius: var(--radius-md);
                overflow-x: auto;
                margin: var(--spacing-md) 0;
            }
            
            #answer-content code {
                font-family: 'Monaco', 'Menlo', monospace;
                font-size: var(--font-size-sm);
            }
            
            .industry-context {
                background: var(--gradient-card);
                border-left: 3px solid var(--accent-primary);
                padding: var(--spacing-md);
                margin-top: var(--spacing-lg);
                border-radius: var(--radius-md);
            }
        </style>
    `;
}

// Export for dynamic answer loading
export const questionsData = commonQuestions;
