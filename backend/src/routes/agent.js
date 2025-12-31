// ========================================
// Agent Routes (Updated with Orchestrator)
// Multi-agent AI interface
// ========================================

import express from 'express'
import { authMiddleware } from './auth.js'
import orchestrator from '../agents/orchestrator.js'
import { query } from '../db/postgres.js'

const router = express.Router()

/**
 * POST /api/agent/route
 * Route request through orchestrator
 */
router.post('/route', authMiddleware, async (req, res) => {
    const startTime = Date.now()

    try {
        const { agent, action, params = {} } = req.body

        if (!agent || !action) {
            return res.status(400).json({
                error: 'Agent and action required',
                catalog: orchestrator.getAgentCatalog()
            })
        }

        // Add userId to params for agents that need it
        params.userId = req.userId

        const result = await orchestrator.route(agent, action, params)

        // Log session
        await query(
            `INSERT INTO sessions (user_id, agent_type, input, output, duration_ms)
       VALUES ($1, $2, $3, $4, $5)`,
            [req.userId, agent, { action, params }, result, result.duration_ms]
        )

        res.json(result)
    } catch (error) {
        console.error('Agent route error:', error)
        res.status(500).json({ error: error.message })
    }
})

/**
 * POST /api/agent/ask
 * Smart routing based on user intent
 */
router.post('/ask', authMiddleware, async (req, res) => {
    try {
        const { question, context = {} } = req.body

        if (!question) {
            return res.status(400).json({ error: 'Question required' })
        }

        // Decide which agent to use
        const routing = orchestrator.decideAgent(question)

        // Route to agent
        const result = await orchestrator.route(
            routing.agent,
            routing.action,
            { question, ...context }
        )

        res.json({
            routing,
            ...result
        })
    } catch (error) {
        console.error('Ask error:', error)
        res.status(500).json({ error: error.message })
    }
})

/**
 * POST /api/agent/learn/:conceptId
 * Handle a learning step
 */
router.post('/learn/:conceptId', authMiddleware, async (req, res) => {
    try {
        const { conceptId } = req.params
        const { action = 'start' } = req.body

        const result = await orchestrator.handleLearningStep(
            req.userId,
            conceptId,
            action
        )

        res.json({ conceptId, action, ...result })
    } catch (error) {
        console.error('Learn step error:', error)
        res.status(500).json({ error: error.message })
    }
})

/**
 * GET /api/agent/catalog
 * Get all available agents
 */
router.get('/catalog', (req, res) => {
    res.json({
        agents: orchestrator.getAgentCatalog(),
        version: '2.0.0'
    })
})

/**
 * GET /api/agent/status
 * Health check
 */
router.get('/status', (req, res) => {
    res.json({
        status: 'operational',
        agents: Object.keys(orchestrator.getAgentCatalog()),
        version: '2.0.0'
    })
})

export default router
