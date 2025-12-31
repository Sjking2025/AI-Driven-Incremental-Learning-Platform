// ========================================
// AI Mentor Service
// Powered by Google Gemini API
// ========================================

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

// System prompt for the AI mentor
const MENTOR_SYSTEM_PROMPT = `You are an expert programming mentor who explains concepts like a senior developer would to a junior developer.

Your responses should:
1. Explain the "WHY" not just the "WHAT"
2. Use real-world analogies
3. Include code examples when helpful
4. Mention where this concept is used in production
5. Point out common mistakes and how to avoid them

Format your responses with:
- Clear sections using markdown headers
- Code blocks with proper syntax highlighting
- Bullet points for key takeaways
- A "Senior Insight" section with industry perspective

Keep responses concise but thorough (max 400 words).`

// Ask the AI mentor a question
export async function askMentor(question, context = {}) {
    console.log('API Key available:', !!GEMINI_API_KEY)

    if (!GEMINI_API_KEY) {
        console.warn('Gemini API key not found, using mock response')
        return getMockResponse(question)
    }

    try {
        const prompt = buildPrompt(question, context)

        console.log('Making API call to Gemini...')

        const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 1024
                }
            })
        })

        console.log('API Response status:', response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error('API Error:', errorText)
            throw new Error(`API error: ${response.status}`)
        }

        const data = await response.json()
        console.log('API Response data:', data)

        const text = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!text) {
            throw new Error('No response from API')
        }

        return {
            success: true,
            answer: text,
            timestamp: new Date().toISOString()
        }
    } catch (error) {
        console.error('AI Mentor error:', error)
        return {
            success: false,
            error: error.message,
            answer: getMockResponse(question).answer,
            timestamp: new Date().toISOString()
        }
    }
}

// Build the prompt with context
function buildPrompt(question, context) {
    let prompt = MENTOR_SYSTEM_PROMPT + '\n\n'

    if (context.currentConcept) {
        prompt += `The user is currently learning: ${context.currentConcept}\n`
    }

    if (context.skillLevel) {
        prompt += `User skill level: ${context.skillLevel}\n`
    }

    if (context.previousConcepts?.length > 0) {
        prompt += `Concepts they've mastered: ${context.previousConcepts.join(', ')}\n`
    }

    prompt += `\nUser question: ${question}`

    return prompt
}

// Explain a concept in depth
export async function explainConcept(conceptId, conceptTitle) {
    const question = `Explain "${conceptTitle}" in depth. 
  - What is it and why does it exist?
  - Where is it used in real production code?
  - What are common mistakes beginners make?
  - Give a practical code example.`

    return askMentor(question, { currentConcept: conceptTitle })
}

// Debug user code
export async function debugCode(code, errorMessage) {
    const question = `Debug this code and explain what's wrong:

Code:
\`\`\`
${code}
\`\`\`

Error/Issue: ${errorMessage}

Explain:
1. What's causing the problem
2. Why this is a common mistake
3. How to fix it
4. How to prevent it in the future`

    return askMentor(question)
}

// Ask "Why does this fail in production?"
export async function whyThisFails(scenario) {
    const question = `As a senior developer, explain why this approach fails in production:

Scenario: ${scenario}

Cover:
1. What works in tutorials but breaks in real apps
2. Edge cases that cause problems
3. The industry-standard solution
4. Real companies that faced this issue`

    return askMentor(question)
}

// Mock responses for when API is unavailable
function getMockResponse(question) {
    const lowerQ = question.toLowerCase()

    if (lowerQ.includes('closure')) {
        return {
            success: true,
            answer: `## Closures in JavaScript

A closure is when a function "remembers" variables from its outer scope even after that scope has finished executing.

### Why They Exist
JavaScript uses closures to give functions private state. Without them, you'd need global variables everywhere.

### Real-World Example
\`\`\`javascript
function createCounter() {
  let count = 0; // Private!
  return () => ++count;
}
const counter = createCounter();
counter(); // 1
counter(); // 2
\`\`\`

### Senior Insight
React's useState hook uses closures internally. Every time you call setState, it's using closure to remember which component's state to update.

### Common Mistakes
- Creating closures inside loops without using let
- Not understanding that closures hold references, not copies`,
            timestamp: new Date().toISOString()
        }
    }

    if (lowerQ.includes('hook') || lowerQ.includes('react')) {
        return {
            success: true,
            answer: `## React Hooks

React Hooks are functions that let you "hook into" React features from function components.

### Why They Exist
Before hooks, you needed class components for state and lifecycle. Hooks let function components do everything classes can.

### Core Hooks
- **useState** - Add state to function components
- **useEffect** - Handle side effects (API calls, subscriptions)
- **useContext** - Access context without nesting
- **useRef** - Persist values across renders

### Real-World Example
\`\`\`javascript
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]); // Only runs when count changes
  
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
\`\`\`

### Senior Insight
Hooks solve the "wrapper hell" problem of HOCs and render props. They also make code more reusable through custom hooks.

### Common Mistakes
- Calling hooks inside loops/conditions
- Missing dependencies in useEffect
- Not understanding closure issues with stale state`,
            timestamp: new Date().toISOString()
        }
    }

    return {
        success: true,
        answer: `## Understanding: ${question.slice(0, 50)}...

This is a great question! Here's what you need to know:

### The Core Concept
Every programming concept exists to solve a specific problem. Understanding the "why" helps you know when to use it.

### Industry Context
Senior developers always ask: "What problem does this solve?" before using any pattern or technique.

### Senior Insight
The best developers aren't those who know the most syntax—they're the ones who understand when and why to use each tool.

*Ask me a more specific question for detailed guidance!*`,
        timestamp: new Date().toISOString()
    }
}

export default { askMentor, explainConcept, debugCode, whyThisFails }
