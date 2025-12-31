// ========================================
// Learn Routes
// Learning progress and concept tracking
// ========================================

import express from 'express'
import { query } from '../db/postgres.js'
import { authMiddleware } from './auth.js'

const router = express.Router()

/**
 * GET /api/learn/progress
 * Get all learning progress for user
 */
router.get('/progress', authMiddleware, async (req, res) => {
    try {
        const result = await query(
            `SELECT concept_id, mastery, exposures, successes, failures, 
              last_practiced, next_review 
       FROM progress 
       WHERE user_id = $1
       ORDER BY last_practiced DESC`,
            [req.userId]
        )

        res.json({ progress: result.rows })
    } catch (error) {
        console.error('Get progress error:', error)
        res.status(500).json({ error: 'Failed to get progress' })
    }
})

/**
 * POST /api/learn/record
 * Record a learning exposure
 */
router.post('/record', authMiddleware, async (req, res) => {
    try {
        const { conceptId, success } = req.body

        if (!conceptId) {
            return res.status(400).json({ error: 'conceptId required' })
        }

        // Upsert progress
        const result = await query(
            `INSERT INTO progress (user_id, concept_id, exposures, successes, failures, last_practiced, next_review)
       VALUES ($1, $2, 1, $3, $4, NOW(), NOW() + INTERVAL '1 day')
       ON CONFLICT (user_id, concept_id) 
       DO UPDATE SET 
         exposures = progress.exposures + 1,
         successes = progress.successes + $3,
         failures = progress.failures + $4,
         last_practiced = NOW(),
         mastery = LEAST(100, progress.mastery + CASE WHEN $5 THEN 8 ELSE -5 END),
         next_review = NOW() + INTERVAL '1 day' * POWER(2, LEAST(progress.exposures / 3, 5))
       RETURNING *`,
            [req.userId, conceptId, success ? 1 : 0, success ? 0 : 1, success]
        )

        res.json({
            message: 'Progress recorded',
            progress: result.rows[0]
        })
    } catch (error) {
        console.error('Record progress error:', error)
        res.status(500).json({ error: 'Failed to record progress' })
    }
})

/**
 * GET /api/learn/stats
 * Get learning statistics
 */
router.get('/stats', authMiddleware, async (req, res) => {
    try {
        const result = await query(
            `SELECT 
         COUNT(*) as total_concepts,
         ROUND(AVG(mastery)) as avg_mastery,
         SUM(exposures) as total_exposures,
         COUNT(*) FILTER (WHERE mastery >= 70) as strong_count,
         COUNT(*) FILTER (WHERE mastery < 50) as weak_count,
         COUNT(*) FILTER (WHERE next_review <= NOW()) as due_for_review
       FROM progress 
       WHERE user_id = $1`,
            [req.userId]
        )

        res.json({ stats: result.rows[0] })
    } catch (error) {
        console.error('Get stats error:', error)
        res.status(500).json({ error: 'Failed to get stats' })
    }
})

/**
 * GET /api/learn/due
 * Get concepts due for review
 */
router.get('/due', authMiddleware, async (req, res) => {
    try {
        const result = await query(
            `SELECT concept_id, mastery, last_practiced, next_review
       FROM progress 
       WHERE user_id = $1 AND next_review <= NOW()
       ORDER BY mastery ASC
       LIMIT 5`,
            [req.userId]
        )

        res.json({ dueForReview: result.rows })
    } catch (error) {
        console.error('Get due error:', error)
        res.status(500).json({ error: 'Failed to get due concepts' })
    }
})

export default router
