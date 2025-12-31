// ========================================
// Agent Routes
// Multi-agent AI interface
// ========================================

import express from 'express'
import { callGemini, callAgent } from '../services/geminiService.js'
import { authMiddleware } from './auth.js'
import { query } from '../db/postgres.js'

const router = express.Router()

// Agent system prompts
const AGENT_PROMPTS = {
    explainer: `You are a Senior Developer Mentor. Explain concepts like teaching a junior developer.
    - Explain the "WHY" not just the "WHAT"
    - Use real-world analogies
    - Include practical code examples
    - Mention where this is used in production
    - Point out common mistakes`,

    debugger: `You are a Senior Debugging Expert. Help debug code like a patient mentor.
    - Identify the root cause
    - Explain why this error happens
    - Provide the correct fix
    - Suggest prevention strategies`,

    scenario: `You are a Real-World Scenario Designer. Create industry-grade problem statements.
    - Based on actual production use cases
    - Include realistic constraints
    - Map to specific concepts being learned`,

    project: `You are a Project Architecture Expert. Design practical mini-projects.
    - Gradually increasing complexity
    - Reinforce specific concepts
    - Include requirements, hints, and solution approach`
}

/**
 * POST /api/agent/ask
 * Generic agent query endpoint
 */
router.post('/ask', authMiddleware, async (req, res) => {
    const startTime = Date.now()

    try {
        const { agent, question, context = {} } = req.body

        if (!agent || !question) {
            return res.status(400).json({ error: 'Agent and question required' })
        }

        const agentPrompt = AGENT_PROMPTS[agent]
        if (!agentPrompt) {
            return res.status(400).json({
                error: 'Invalid agent',
                validAgents: Object.keys(AGENT_PROMPTS)
            })
        }

        const fullPrompt = `${agentPrompt}

User Question: ${question}

${context.conceptId ? `Current Concept: ${context.conceptId}` : ''}
${context.code ? `Code:\n\`\`\`\n${context.code}\n\`\`\`` : ''}
${context.error ? `Error: ${context.error}` : ''}

Provide a thorough, helpful response:`

        const response = await callGemini(fullPrompt)
        const duration = Date.now() - startTime

        // Log session
        await query(
            `INSERT INTO sessions (user_id, agent_type, input, output, duration_ms)
       VALUES ($1, $2, $3, $4, $5)`,
            [req.userId, agent, { question, context }, { response }, duration]
        )

        res.json({
            agent,
            response,
            duration_ms: duration
        })
    } catch (error) {
        console.error('Agent error:', error)
        res.status(500).json({ error: 'Agent failed to respond' })
    }
})

/**
 * POST /api/agent/explain
 * Explainer agent - explain a concept
 */
router.post('/explain', authMiddleware, async (req, res) => {
    try {
        const { concept, level = 'beginner' } = req.body

        const prompt = `${AGENT_PROMPTS.explainer}

Explain "${concept}" for a ${level} learner.

Format your response with:
## What is ${concept}?
## Why does it exist?
## Where is it used in production?
## Common Mistakes
## Code Example`

        const response = await callGemini(prompt)

        res.json({ concept, explanation: response })
    } catch (error) {
        console.error('Explain error:', error)
        res.status(500).json({ error: 'Failed to explain concept' })
    }
})

/**
 * POST /api/agent/debug
 * Debug agent - analyze code
 */
router.post('/debug', authMiddleware, async (req, res) => {
    try {
        const { code, error: errorMessage } = req.body

        if (!code) {
            return res.status(400).json({ error: 'Code required' })
        }

        const prompt = `${AGENT_PROMPTS.debugger}

Analyze this code:
\`\`\`
${code}
\`\`\`

${errorMessage ? `Error message: ${errorMessage}` : 'Find potential issues.'}

Provide:
1. Root cause analysis
2. Step-by-step fix
3. Prevention tips`

        const response = await callGemini(prompt)

        res.json({ analysis: response })
    } catch (error) {
        console.error('Debug error:', error)
        res.status(500).json({ error: 'Failed to debug code' })
    }
})

/**
 * GET /api/agent/status
 * Check agent system status
 */
router.get('/status', (req, res) => {
    res.json({
        status: 'operational',
        agents: Object.keys(AGENT_PROMPTS),
        version: '1.0.0'
    })
})

export default router
