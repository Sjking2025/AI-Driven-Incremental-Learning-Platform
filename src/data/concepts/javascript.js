// ========================================
// Concepts Data - Multiple JavaScript Concepts
// ========================================

export const conceptsData = {
    'increment-operators': {
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
    console.log(\`Login #\${loginCount++} by \${userId}\`);
    return loginCount;
}

trackLogin('user_1'); // Logs: "Login #0" (should be #1!)`,
            hint: 'Look at what value is used in the template literal vs what gets stored.',
            fixedCode: `let loginCount = 0;

function trackLogin(userId) {
    console.log(\`Login #\${++loginCount} by \${userId}\`);
    return loginCount;
}

trackLogin('user_1'); // Logs: "Login #1" ✓`
        },

        step3: {
            correct: {
                code: '++count',
                explanation: 'Pre-increment: Increases value FIRST, then returns the NEW value.'
            },
            wrong: [
                {
                    code: 'count = count++',
                    whyFails: 'Post-increment returns OLD value, which gets assigned back.',
                    execution: '1. count++ → 0\\n2. count becomes 1\\n3. count = 0'
                }
            ],
            seniorThinking: 'Prefer ++i in for loops. Separate increment from usage in complex expressions.'
        },

        step4: {
            companies: ['Google Analytics', 'Stripe', 'Firebase'],
            modules: ['Auth', 'Rate Limiting', 'Metrics'],
            productionStory: 'A fintech had billing bugs from wrong sequence numbers. Root cause: count++ in log statement.',
            interviewTrap: 'What is a++ + ++a if a=5?'
        },

        step5: {
            task: 'Debug this transaction counter',
            brokenCode: `let transactionId = 1000;
function processPayment(amount) {
    const currentId = transactionId++;
    return { receiptId: transactionId, amount };
    // Bug: receiptId doesn't match logged ID!
}`,
            hints: ['Compare currentId vs transactionId at return time']
        }
    },

    'closures': {
        id: 'closures',
        title: 'Closures',
        module: 'JavaScript Core',
        phase: 'Phase 4',

        step1: {
            what: 'A closure is a function that remembers variables from its outer scope, even after the outer function has finished.',
            where: [
                { name: 'Private variables', example: 'Encapsulated state' },
                { name: 'Event handlers', example: 'Callbacks with context' },
                { name: 'Factory functions', example: 'Creating instances' },
                { name: 'React Hooks', example: 'useState, useEffect' }
            ],
            why: 'Closures enable data privacy and stateful functions. They\'re THE most tested JS concept in interviews.',
            mistakes: [
                'Not understanding closures capture by reference',
                'Creating closures in loops with var',
                'Memory leaks from forgotten closures'
            ]
        },

        step2: {
            title: 'Private Counter API',
            scenario: 'Build a counter that cannot be tampered with from outside.',
            buggyCode: `let count = 0;
function increment() { count++; return count; }
// Problem: Anyone can do count = 1000;`,
            hint: 'How can count be hidden yet accessible to functions?',
            fixedCode: `function createCounter() {
    let count = 0; // Private!
    return {
        increment() { return ++count; },
        getCount() { return count; }
    };
}
const counter = createCounter();
// count = 1000; // Error!`
        },

        step3: {
            correct: {
                code: 'function outer() { let x = 10; return () => x; }',
                explanation: 'Inner function "closes over" x. Still accessible after outer() finishes.'
            },
            wrong: [
                {
                    code: 'for (var i = 0; i < 3; i++) { setTimeout(() => console.log(i), 100); }',
                    whyFails: 'var is function-scoped. All callbacks see i = 3.',
                    execution: 'Logs: 3, 3, 3 (not 0, 1, 2)'
                }
            ],
            seniorThinking: 'Closures are about lexical scope - where defined determines access, not where called.'
        },

        step4: {
            companies: ['React (Hooks)', 'Event Systems', 'Lodash (debounce)'],
            modules: ['State Management', 'Event Handling', 'Utilities'],
            productionStory: 'E-commerce site had wrong cart quantities due to loop closure bug. Took a week to find.',
            interviewTrap: 'Write a function that counts how many times it was called.'
        },

        step5: {
            task: 'Fix this debounce function',
            brokenCode: `function debounce(fn, delay) {
    let timer;
    return function() {
        clearTimeout(timer);
        timer = setTimeout(function() {
            fn(arguments); // Bug!
        }, delay);
    };
}`,
            hints: ['What does "arguments" refer to inside setTimeout?', 'Consider arrow functions']
        }
    },

    'async-await': {
        id: 'async-await',
        title: 'Async/Await',
        module: 'JavaScript Core',
        phase: 'Phase 4',

        step1: {
            what: 'Async/await is syntactic sugar over Promises, making asynchronous code look synchronous.',
            where: [
                { name: 'API calls', example: 'const data = await fetch(url)' },
                { name: 'Database queries', example: 'const user = await db.find()' },
                { name: 'File operations', example: 'const content = await readFile()' }
            ],
            why: 'Callback hell crashed productivity. Promises helped. Async/await made async code readable.',
            mistakes: [
                'Forgetting await (getting Promise instead of value)',
                'Using await in loops when Promise.all would be faster',
                'Not handling errors with try/catch'
            ]
        },

        step2: {
            title: 'User Profile Loader',
            scenario: 'Load user data, then their posts, then display. Handle failures gracefully.',
            buggyCode: `async function loadProfile(userId) {
    const user = await fetch('/api/user/' + userId);
    const posts = await fetch('/api/posts/' + userId);
    // Bug: What if API fails?
    return { user, posts };
}`,
            hint: 'What happens when fetch fails? Where\'s error handling?',
            fixedCode: `async function loadProfile(userId) {
    try {
        const user = await fetch('/api/user/' + userId).then(r => r.json());
        const posts = await fetch('/api/posts/' + userId).then(r => r.json());
        return { user, posts };
    } catch (error) {
        console.error('Failed to load profile:', error);
        return { error: 'Failed to load profile' };
    }
}`
        },

        step3: {
            correct: {
                code: 'const [a, b] = await Promise.all([fetchA(), fetchB()])',
                explanation: 'Parallel execution for independent operations. Much faster!'
            },
            wrong: [
                {
                    code: 'const a = await fetchA(); const b = await fetchB();',
                    whyFails: 'Sequential when it could be parallel. Doubles the wait time!',
                    execution: 'If each takes 1s, total = 2s. With Promise.all = 1s.'
                }
            ],
            seniorThinking: 'If operations are independent, parallelize. If dependent, sequence with async/await.'
        },

        step4: {
            companies: ['Every SaaS', 'Every API consumer', 'Every modern app'],
            modules: ['API Layer', 'Data Fetching', 'Background Jobs'],
            productionStory: 'Dashboard took 5s to load with sequential calls. Promise.all reduced to 1.2s.',
            interviewTrap: 'What is the output order of console.log with async/await?'
        },

        step5: {
            task: 'Optimize this slow profile loader',
            brokenCode: `async function loadDashboard() {
    const user = await fetchUser();
    const posts = await fetchPosts();
    const notifications = await fetchNotifications();
    const settings = await fetchSettings();
    // Takes 4x longer than needed!
}`,
            hints: ['Which of these are independent?', 'Use Promise.all for parallel execution']
        }
    }
};

export function getConceptById(id) {
    return conceptsData[id] || null;
}

export function getAllConcepts() {
    return Object.values(conceptsData);
}
