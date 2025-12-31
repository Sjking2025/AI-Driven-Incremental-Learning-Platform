// ========================================
// Agent 3: Real-World Scenario Generator
// Creates industry-grade problem scenarios
// ========================================

import { callGemini } from '../services/geminiService.js'

const SYSTEM_PROMPT = `You are a Real-World Scenario Generator - you create industry-grade problem statements.

Your scenarios should:
1. Be based on ACTUAL production use cases (e.g., how Netflix handles X)
2. Include realistic constraints and requirements
3. Map directly to the concept being learned
4. Feel like real job tasks, not textbook exercises

Industries to draw from:
- E-commerce (Amazon, Shopify)
- Streaming (Netflix, Spotify)
- Social Media (Twitter, Instagram)
- Fintech (Stripe, PayPal)
- DevTools (GitHub, Vercel)

Output Format (JSON):
{
  "scenario": {
    "title": "string",
    "company": "string (real or realistic fictional)",
    "context": "Business context paragraph",
    "problem": "The specific problem to solve",
    "requirements": ["req1", "req2"],
    "constraints": ["constraint1", "constraint2"],
    "concepts_used": ["concept1", "concept2"],
    "hints": ["hint1", "hint2"],
    "difficulty": "easy|medium|hard"
  }
}`

/**
 * Generate a real-world scenario for a concept
 */
export async function generateScenario(concept, difficulty = 'medium', industry = null) {
    const prompt = `${SYSTEM_PROMPT}

Concept to practice: ${concept}
Difficulty: ${difficulty}
${industry ? `Industry focus: ${industry}` : 'Choose an appropriate industry'}

Create a realistic scenario that makes the student feel like a real developer solving real problems.
Return ONLY valid JSON.`

    const response = await callGemini(prompt, { temperature: 0.8, maxTokens: 1000 })

    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
    } catch (error) {
        console.error('Scenario parse error:', error.message)
    }

    return { scenario: { title: concept, raw: response } }
}

/**
 * Generate a "What would break" scenario
 */
export async function generateBreakageScenario(concept) {
    const prompt = `${SYSTEM_PROMPT}

Concept: ${concept}

Create a scenario where NOT understanding ${concept} would cause a production bug.

Format:
{
  "breakage": {
    "title": "The bug that happened",
    "company": "Real or fictional company",
    "what_happened": "Description of the incident",
    "root_cause": "Why ${concept} knowledge would have prevented this",
    "impact": "Business impact",
    "lesson": "The key learning"
  }
}`

    const response = await callGemini(prompt, { temperature: 0.7 })

    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
    } catch (error) {
        console.error('Breakage scenario parse error:', error.message)
    }

    return { breakage: { raw: response } }
}

export default { generateScenario, generateBreakageScenario }
