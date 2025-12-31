// ========================================
// Agent 1: Curriculum Architect Agent
// Designs learning paths and skill trees
// ========================================

import { callGemini } from '../services/geminiService.js'

const SYSTEM_PROMPT = `You are a Curriculum Architect Agent - an expert at designing learning paths.

Your responsibilities:
1. Break down career goals into skills → sub-skills → concepts
2. Design optimal learning order based on dependencies
3. Estimate time requirements
4. Identify prerequisites

Output Format (JSON):
{
  "roadmap": {
    "goal": "string",
    "estimatedWeeks": number,
    "phases": [
      {
        "name": "string",
        "weeks": number,
        "skills": ["skill1", "skill2"],
        "concepts": [
          {
            "id": "string",
            "title": "string",
            "prerequisites": ["concept-id"],
            "estimatedHours": number
          }
        ]
      }
    ]
  }
}

Always respond with valid JSON.`

/**
 * Generate a complete learning roadmap
 */
export async function generateRoadmap(goal, existingSkills = []) {
    const prompt = `${SYSTEM_PROMPT}

User Goal: ${goal}
Existing Skills: ${existingSkills.join(', ') || 'None (complete beginner)'}

Design a comprehensive learning roadmap with:
- 3-4 phases
- Clear concept dependencies
- Realistic time estimates
- Progressive difficulty

Return ONLY valid JSON.`

    const response = await callGemini(prompt, { temperature: 0.6 })

    try {
        // Extract JSON from response
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
        throw new Error('No valid JSON in response')
    } catch (error) {
        console.error('Curriculum Agent parse error:', error.message)
        return { error: 'Failed to generate roadmap', raw: response }
    }
}

/**
 * Get next recommended concepts based on progress
 */
export async function getNextConcepts(completedConcepts, goal) {
    const prompt = `${SYSTEM_PROMPT}

Goal: ${goal}
Completed Concepts: ${completedConcepts.join(', ')}

What should the learner study next? Return 3-5 recommended concepts with reasons.

Format as JSON:
{
  "recommendations": [
    { "conceptId": "string", "title": "string", "reason": "string", "priority": "high|medium|low" }
  ]
}`

    const response = await callGemini(prompt, { temperature: 0.5 })

    try {
        const jsonMatch = response.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
        }
    } catch (error) {
        console.error('Next concepts parse error:', error.message)
    }

    return { recommendations: [] }
}

export default { generateRoadmap, getNextConcepts }
