// ========================================
// Reinforcement Engine
// Auto-injects prerequisites into new lessons
// Generates mixed practice problems
// ========================================

import { frontendSkillGraph, getReinforcementConcepts } from '../data/skillGraph'
import { useConceptMemory } from '../stores/useConceptMemory'

// Practice problem templates for each concept
const problemTemplates = {
    'js-variables': [
        {
            type: 'fix-bug',
            title: 'Variable Declaration Bug',
            description: 'Fix the bug in this code:',
            code: `let count = 5;
const message = "Hello";
count = 10; // This works
message = "World"; // Why does this fail?`,
            hint: 'Think about the difference between let and const',
            answer: 'const creates an immutable binding - you cannot reassign it'
        },
        {
            type: 'predict-output',
            title: 'What gets logged?',
            code: `let x = 10;
let y = x;
x = 20;
console.log(y);`,
            options: ['10', '20', 'undefined', 'Error'],
            answer: '10',
            explanation: 'Primitive values are copied by value, not reference'
        }
    ],
    'js-conditions': [
        {
            type: 'fix-bug',
            title: 'Condition Logic Bug',
            code: `let age = 18;
if (age = 21) {
  console.log("Can drink");
}`,
            hint: 'Look carefully at the comparison operator',
            answer: 'Using = instead of === for comparison'
        }
    ],
    'js-loops': [
        {
            type: 'predict-output',
            title: 'Loop Counter',
            code: `let sum = 0;
for (let i = 0; i < 5; i++) {
  sum += i;
}
console.log(sum);`,
            options: ['10', '15', '5', '0'],
            answer: '10',
            explanation: '0+1+2+3+4 = 10'
        }
    ],
    'js-functions': [
        {
            type: 'fix-bug',
            title: 'Function Scope Bug',
            code: `function greet(name) {
  let greeting = "Hello, " + name;
}
greet("Alice");
console.log(greeting);`,
            hint: 'Where is greeting accessible?',
            answer: 'greeting is block-scoped inside the function'
        }
    ],
    'js-closures': [
        {
            type: 'predict-output',
            title: 'Closure Memory',
            code: `function counter() {
  let count = 0;
  return function() {
    return ++count;
  };
}
const inc = counter();
console.log(inc());
console.log(inc());`,
            options: ['1, 1', '1, 2', '0, 1', 'undefined'],
            answer: '1, 2',
            explanation: 'The inner function closes over count and remembers it'
        }
    ]
}

// Generate a reinforcement session
export function generateReinforcementSession(currentConceptId, masteryData = {}) {
    const session = {
        mainConcept: currentConceptId,
        reinforcementConcepts: [],
        problems: []
    }

    // Get concepts to reinforce
    const toReinforce = getReinforcementConcepts(currentConceptId)
    session.reinforcementConcepts = toReinforce

    // Add problems from main concept
    const mainProblems = problemTemplates[currentConceptId] || []
    if (mainProblems.length > 0) {
        session.problems.push({
            ...mainProblems[0],
            conceptId: currentConceptId,
            isMain: true
        })
    }

    // Add problems from reinforcement concepts (prioritize weak ones)
    for (const conceptId of toReinforce) {
        const problems = problemTemplates[conceptId] || []
        if (problems.length > 0) {
            // Pick a random problem
            const problem = problems[Math.floor(Math.random() * problems.length)]
            session.problems.push({
                ...problem,
                conceptId,
                isReinforcement: true
            })
        }
    }

    // Shuffle reinforcement problems
    for (let i = session.problems.length - 1; i > 1; i--) {
        const j = 1 + Math.floor(Math.random() * i)
            ;[session.problems[i], session.problems[j]] = [session.problems[j], session.problems[i]]
    }

    return session
}

// Get weak concepts that need practice
export function getWeakConceptsForPractice(masteryData, limit = 3) {
    const weak = []

    for (const [conceptId, data] of Object.entries(masteryData)) {
        if (data.mastery < 50) {
            weak.push({ conceptId, mastery: data.mastery })
        }
    }

    // Sort by mastery (lowest first) and take top N
    return weak
        .sort((a, b) => a.mastery - b.mastery)
        .slice(0, limit)
        .map(w => w.conceptId)
}

// Generate mixed practice session
export function generateMixedPractice(completedConcepts, masteryData = {}, count = 5) {
    const problems = []

    // Get weak concepts first
    const weakConcepts = getWeakConceptsForPractice(masteryData, Math.ceil(count / 2))

    // Fill with weak concept problems
    for (const conceptId of weakConcepts) {
        const conceptProblems = problemTemplates[conceptId] || []
        if (conceptProblems.length > 0) {
            const problem = conceptProblems[Math.floor(Math.random() * conceptProblems.length)]
            problems.push({
                ...problem,
                conceptId,
                priority: 'weak'
            })
        }
    }

    // Fill remaining with random completed concepts
    const remaining = count - problems.length
    const otherConcepts = completedConcepts.filter(c => !weakConcepts.includes(c))

    for (let i = 0; i < remaining && otherConcepts.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * otherConcepts.length)
        const conceptId = otherConcepts.splice(randomIndex, 1)[0]

        const conceptProblems = problemTemplates[conceptId] || []
        if (conceptProblems.length > 0) {
            const problem = conceptProblems[Math.floor(Math.random() * conceptProblems.length)]
            problems.push({
                ...problem,
                conceptId,
                priority: 'review'
            })
        }
    }

    // Shuffle
    for (let i = problems.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[problems[i], problems[j]] = [problems[j], problems[i]]
    }

    return problems
}

// Check if a concept should be reinforced during current lesson
export function shouldReinforce(conceptId, masteryData = {}) {
    const memory = masteryData[conceptId]
    if (!memory) return true // Never seen, definitely reinforce

    // Reinforce if mastery < 70%
    if (memory.mastery < 70) return true

    // Reinforce if not practiced in 7+ days
    if (memory.lastPracticed) {
        const daysSince = Math.floor(
            (new Date() - new Date(memory.lastPracticed)) / (1000 * 60 * 60 * 24)
        )
        if (daysSince > 7) return true
    }

    return false
}

// Export problem templates for direct access
export { problemTemplates }
