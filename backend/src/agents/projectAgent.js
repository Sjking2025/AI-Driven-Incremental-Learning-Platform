// ========================================
// Agent 4: Mini Project Builder Agent
// Designs hands-on coding challenges
// ========================================

import { callGemini } from '../services/geminiService.js'

const SYSTEM_PROMPT = `You are a Project Builder Agent - you design practical mini-projects for learning.

Your projects should:
1. Be completable in 30 minutes to 2 hours
2. Reinforce specific concepts through practice
3. Gradually increase complexity
4. Feel like real features, not toy exercises
5. Include clear requirements and hints

Output Format (JSON):
{
  "project": {
    "title": "string",
    "description": "What you're building",
    "concepts": ["concept1", "concept2"],
    "difficulty": "easy|medium|hard",
    "estimatedMinutes": number,
    "requirements": [
      { "id": 1, "description": "Requirement text", "hint": "Optional hint" }
    ],
    "starterCode": "// Code template if needed",
    "testCases": [
      { "input": "example input", "expectedOutput": "expected result" }
    ],
    "bonusChallenges": ["Challenge 1", "Challenge 2"]
  }
}`

/**
 * Generate a mini project
 */
export async function generateProject(concepts, difficulty = 'medium') {
    const conceptList = Array.isArray(concepts) ? concepts : [concepts]

    const prompt = `${SYSTEM_PROMPT}

Concepts to practice: ${conceptList.join(', ')}
Difficulty: ${difficulty}

Design a single mini-project that naturally uses these concepts together.
Make it feel like a real feature you'd build at a startup.
Return ONLY valid JSON.`

    const response = await callGemini(prompt, { temperature: 0.8, maxTokens: 1500 })

    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
    } catch (error) {
        console.error('Project parse error:', error.message)
    }

    return { project: { title: 'Project', raw: response } }
}

/**
 * Generate a series of progressive challenges
 */
export async function generateProgressiveChallenges(concept, count = 3) {
    const prompt = `${SYSTEM_PROMPT}

Concept: ${concept}
Create ${count} progressive challenges that get harder.

Format:
{
  "challenges": [
    {
      "level": 1,
      "title": "string",
      "description": "string",
      "task": "What to implement",
      "hint": "Optional hint",
      "estimatedMinutes": number
    }
  ]
}`

    const response = await callGemini(prompt, { temperature: 0.7 })

    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
    } catch (error) {
        console.error('Challenges parse error:', error.message)
    }

    return { challenges: [] }
}

export default { generateProject, generateProgressiveChallenges }
