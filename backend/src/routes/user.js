// ========================================
// User Routes
// Profile, progress, activity tracking
// ========================================

import express from 'express'
import { query } from '../db/postgres.js'
import { authMiddleware } from './auth.js'

const router = express.Router()

// All routes require authentication
router.use(authMiddleware)

// ========================================
// Profile
// ========================================

/**
 * GET /api/user/profile
 * Get user profile with stats
 */
router.get('/profile', async (req, res) => {
    try {
        const profile = await query(
            'SELECT * FROM user_profiles WHERE user_id = $1',
            [req.userId]
        )

        res.json({ profile: profile.rows[0] || null })
    } catch (error) {
        console.error('Get profile error:', error)
        res.status(500).json({ error: 'Failed to get profile' })
    }
})

/**
 * PUT /api/user/profile
 * Update profile (career, phase, settings)
 */
router.put('/profile', async (req, res) => {
    try {
        const { selectedCareer, currentPhase, currentConcept, difficultyLevel, dailyGoalMinutes } = req.body

        const updates = []
        const values = [req.userId]
        let paramIndex = 2

        if (selectedCareer !== undefined) {
            updates.push(`selected_career = $${paramIndex++}`)
            values.push(selectedCareer)
        }
        if (currentPhase !== undefined) {
            updates.push(`current_phase = $${paramIndex++}`)
            values.push(currentPhase)
        }
        if (currentConcept !== undefined) {
            updates.push(`current_concept = $${paramIndex++}`)
            values.push(currentConcept)
        }
        if (difficultyLevel !== undefined) {
            updates.push(`difficulty_level = $${paramIndex++}`)
            values.push(difficultyLevel)
        }
        if (dailyGoalMinutes !== undefined) {
            updates.push(`daily_goal_minutes = $${paramIndex++}`)
            values.push(dailyGoalMinutes)
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'No updates provided' })
        }

        updates.push('updated_at = NOW()')

        const result = await query(`
            UPDATE user_profiles 
            SET ${updates.join(', ')}
            WHERE user_id = $1
            RETURNING *
        `, values)

        res.json({ profile: result.rows[0] })
    } catch (error) {
        console.error('Update profile error:', error)
        res.status(500).json({ error: 'Failed to update profile' })
    }
})

// ========================================
// Concept Views (tracking what user sees)
// ========================================

/**
 * POST /api/user/view-concept
 * Record that user viewed a concept
 */
router.post('/view-concept', async (req, res) => {
    try {
        const { conceptId, source, timeSpentSeconds } = req.body

        if (!conceptId) {
            return res.status(400).json({ error: 'conceptId required' })
        }

        // Upsert concept view
        const result = await query(`
            INSERT INTO concept_views (user_id, concept_id, source, time_spent_seconds)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (user_id, concept_id) 
            DO UPDATE SET 
                view_count = concept_views.view_count + 1,
                last_viewed_at = NOW(),
                time_spent_seconds = concept_views.time_spent_seconds + $4
            RETURNING *
        `, [req.userId, conceptId, source || 'learn_page', timeSpentSeconds || 0])

        // Update progress if first view
        await query(`
            INSERT INTO progress (user_id, concept_id, status, first_seen_at)
            VALUES ($1, $2, 'in_progress', NOW())
            ON CONFLICT (user_id, concept_id) DO NOTHING
        `, [req.userId, conceptId])

        res.json({ view: result.rows[0] })
    } catch (error) {
        console.error('View concept error:', error)
        res.status(500).json({ error: 'Failed to record view' })
    }
})

/**
 * GET /api/user/viewed-concepts
 * Get all concepts user has viewed
 */
router.get('/viewed-concepts', async (req, res) => {
    try {
        const result = await query(`
            SELECT concept_id, view_count, first_viewed_at, last_viewed_at, time_spent_seconds
            FROM concept_views
            WHERE user_id = $1
            ORDER BY last_viewed_at DESC
        `, [req.userId])

        res.json({ views: result.rows })
    } catch (error) {
        console.error('Get views error:', error)
        res.status(500).json({ error: 'Failed to get views' })
    }
})

// ========================================
// Daily Activity (for analytics)
// ========================================

/**
 * POST /api/user/record-activity
 * Record daily activity
 */
router.post('/record-activity', async (req, res) => {
    try {
        const { conceptsPracticed, timeSpentMinutes, questionsAnswered, correctAnswers } = req.body
        const today = new Date().toISOString().split('T')[0]

        const result = await query(`
            INSERT INTO daily_activity (user_id, activity_date, concepts_practiced, time_spent_minutes, questions_answered, correct_answers, streak_maintained)
            VALUES ($1, $2, $3, $4, $5, $6, true)
            ON CONFLICT (user_id, activity_date) 
            DO UPDATE SET 
                concepts_practiced = daily_activity.concepts_practiced + $3,
                time_spent_minutes = daily_activity.time_spent_minutes + $4,
                questions_answered = daily_activity.questions_answered + $5,
                correct_answers = daily_activity.correct_answers + $6,
                streak_maintained = true
            RETURNING *
        `, [req.userId, today, conceptsPracticed || 0, timeSpentMinutes || 0, questionsAnswered || 0, correctAnswers || 0])

        // Update user profile totals
        await query(`
            UPDATE user_profiles
            SET total_time_minutes = total_time_minutes + $1
            WHERE user_id = $2
        `, [timeSpentMinutes || 0, req.userId])

        res.json({ activity: result.rows[0] })
    } catch (error) {
        console.error('Record activity error:', error)
        res.status(500).json({ error: 'Failed to record activity' })
    }
})

/**
 * GET /api/user/activity
 * Get activity for last N days
 */
router.get('/activity', async (req, res) => {
    try {
        const days = parseInt(req.query.days) || 7

        const result = await query(`
            SELECT activity_date, concepts_practiced, time_spent_minutes, questions_answered, correct_answers, streak_maintained
            FROM daily_activity
            WHERE user_id = $1 AND activity_date >= CURRENT_DATE - INTERVAL '${days} days'
            ORDER BY activity_date DESC
        `, [req.userId])

        res.json({ activity: result.rows })
    } catch (error) {
        console.error('Get activity error:', error)
        res.status(500).json({ error: 'Failed to get activity' })
    }
})

// ========================================
// Practice Sessions
// ========================================

/**
 * POST /api/user/practice-session/start
 * Start a new practice session
 */
router.post('/practice-session/start', async (req, res) => {
    try {
        const { sessionType } = req.body

        const result = await query(`
            INSERT INTO practice_sessions (user_id, session_type, started_at)
            VALUES ($1, $2, NOW())
            RETURNING *
        `, [req.userId, sessionType || 'mixed'])

        res.json({ session: result.rows[0] })
    } catch (error) {
        console.error('Start session error:', error)
        res.status(500).json({ error: 'Failed to start session' })
    }
})

/**
 * PUT /api/user/practice-session/:id/end
 * End a practice session
 */
router.put('/practice-session/:id/end', async (req, res) => {
    try {
        const { id } = req.params
        const { totalQuestions, correctAnswers, conceptsPracticed } = req.body

        const result = await query(`
            UPDATE practice_sessions
            SET ended_at = NOW(),
                duration_minutes = EXTRACT(EPOCH FROM (NOW() - started_at)) / 60,
                total_questions = $1,
                correct_answers = $2,
                concepts_practiced = $3
            WHERE id = $4 AND user_id = $5
            RETURNING *
        `, [totalQuestions || 0, correctAnswers || 0, JSON.stringify(conceptsPracticed || []), id, req.userId])

        // Update profile stats
        await query(`
            UPDATE user_profiles
            SET total_practice_sessions = total_practice_sessions + 1
            WHERE user_id = $1
        `, [req.userId])

        res.json({ session: result.rows[0] })
    } catch (error) {
        console.error('End session error:', error)
        res.status(500).json({ error: 'Failed to end session' })
    }
})

/**
 * GET /api/user/practice-sessions
 * Get practice history
 */
router.get('/practice-sessions', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10

        const result = await query(`
            SELECT id, session_type, started_at, ended_at, duration_minutes, total_questions, correct_answers, concepts_practiced
            FROM practice_sessions
            WHERE user_id = $1
            ORDER BY started_at DESC
            LIMIT $2
        `, [req.userId, limit])

        res.json({ sessions: result.rows })
    } catch (error) {
        console.error('Get sessions error:', error)
        res.status(500).json({ error: 'Failed to get sessions' })
    }
})

// ========================================
// All Progress Data
// ========================================

/**
 * GET /api/user/all-progress
 * Get comprehensive user data for dashboard
 */
router.get('/all-progress', async (req, res) => {
    try {
        // Get profile
        const profile = await query('SELECT * FROM user_profiles WHERE user_id = $1', [req.userId])

        // Get progress
        const progress = await query('SELECT * FROM progress WHERE user_id = $1', [req.userId])

        // Get recent activity (7 days)
        const activity = await query(`
            SELECT * FROM daily_activity 
            WHERE user_id = $1 AND activity_date >= CURRENT_DATE - INTERVAL '7 days'
            ORDER BY activity_date DESC
        `, [req.userId])

        // Get concept views
        const views = await query(`
            SELECT concept_id, view_count, time_spent_seconds
            FROM concept_views 
            WHERE user_id = $1
        `, [req.userId])

        // Calculate stats
        const stats = {
            totalConcepts: progress.rows.length,
            avgMastery: progress.rows.length > 0
                ? Math.round(progress.rows.reduce((a, b) => a + b.mastery, 0) / progress.rows.length)
                : 0,
            masteredCount: progress.rows.filter(p => p.mastery >= 80).length,
            inProgressCount: progress.rows.filter(p => p.mastery > 0 && p.mastery < 80).length,
            weakCount: progress.rows.filter(p => p.mastery > 0 && p.mastery < 50).length,
            dueForReview: progress.rows.filter(p => p.next_review && new Date(p.next_review) <= new Date()).length
        }

        res.json({
            profile: profile.rows[0] || null,
            progress: progress.rows,
            activity: activity.rows,
            views: views.rows,
            stats
        })
    } catch (error) {
        console.error('Get all progress error:', error)
        res.status(500).json({ error: 'Failed to get progress' })
    }
})

export default router
