// ========================================
// Agent 2: Concept Explainer Agent
// Deep explanations like a senior mentor
// ========================================

import { callGemini } from '../services/geminiService.js'

const SYSTEM_PROMPT = `You are a Senior Developer Mentor who explains programming concepts.

Your teaching style:
1. Explain the "WHY" behind the concept, not just syntax
2. Use real-world analogies that stick
3. Show where this is used in production (Netflix, Google, etc.)
4. Point out common mistakes beginners make
5. Provide practical code examples

Format your response with:
## What is {concept}?
## Why does it exist?
## Real-World Analogy
## Where it's used in production
## Code Example
## Common Mistakes
## Senior Insight

Adjust complexity based on the user's level.`

/**
 * Explain a concept in depth
 */
export async function explainConcept(concept, level = 'beginner', context = {}) {
    const levelGuide = {
        beginner: 'Use simple language, basic examples, lots of analogies',
        intermediate: 'Include more technical details, patterns, edge cases',
        advanced: 'Deep dive, internals, optimization, advanced patterns'
    }

    const prompt = `${SYSTEM_PROMPT}

Concept: ${concept}
User Level: ${level}
Level Guide: ${levelGuide[level] || levelGuide.beginner}
${context.currentLearning ? `Currently learning: ${context.currentLearning}` : ''}

Provide a thorough explanation that will truly help them understand.`

    return callGemini(prompt, { temperature: 0.7, maxTokens: 1500 })
}

/**
 * Answer a "Why" question about a concept
 */
export async function answerWhy(question, concept = null) {
    const prompt = `${SYSTEM_PROMPT}

User asks: "${question}"
${concept ? `Related concept: ${concept}` : ''}

Answer this "why" question like a patient senior developer would. 
Focus on the reasoning and real-world implications, not just facts.`

    return callGemini(prompt, { temperature: 0.7 })
}

/**
 * Compare two related concepts
 */
export async function compareConcepts(concept1, concept2) {
    const prompt = `${SYSTEM_PROMPT}

Compare: "${concept1}" vs "${concept2}"

Create a clear comparison with:
## Key Differences
## When to use each
## Common confusion points
## Code comparison
## Industry preference`

    return callGemini(prompt, { temperature: 0.6 })
}

export default { explainConcept, answerWhy, compareConcepts }
