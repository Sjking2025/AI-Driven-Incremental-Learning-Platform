// ========================================
// Auth Routes
// JWT-based authentication + Profile creation
// ========================================

import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query, createUserProfile, getUserProfile } from '../db/postgres.js'

const router = express.Router()

/**
 * POST /api/auth/register
 * Register a new user + create profile
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, name, selectedCareer } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' })
        }

        // Check if user exists
        const existing = await query('SELECT id FROM users WHERE email = $1', [email])
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' })
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10)

        // Create user
        const result = await query(
            'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name',
            [email, passwordHash, name || null]
        )

        const user = result.rows[0]

        // Create user profile with selected career
        await createUserProfile(user.id)
        if (selectedCareer) {
            await query(
                'UPDATE user_profiles SET selected_career = $1 WHERE user_id = $2',
                [selectedCareer, user.id]
            )
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: user.id, email: user.email, name: user.name },
            token
        })
    } catch (error) {
        console.error('Register error:', error)
        res.status(500).json({ error: 'Registration failed' })
    }
})

/**
 * POST /api/auth/login
 * Login existing user + return profile
 */
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' })
        }

        // Find user
        const result = await query(
            'SELECT id, email, name, password_hash FROM users WHERE email = $1',
            [email]
        )

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const user = result.rows[0]

        // Verify password
        const valid = await bcrypt.compare(password, user.password_hash)
        if (!valid) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        // Get or create profile
        let profile = await getUserProfile(user.id)
        if (!profile) {
            profile = await createUserProfile(user.id)
        }

        // Update last active and streak
        const today = new Date().toISOString().split('T')[0]
        if (profile && profile.last_active_date !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
            const newStreak = profile.last_active_date === yesterday
                ? profile.current_streak + 1
                : 1

            await query(`
                UPDATE user_profiles 
                SET last_active_date = $1, 
                    current_streak = $2,
                    longest_streak = GREATEST(longest_streak, $2)
                WHERE user_id = $3
            `, [today, newStreak, user.id])

            profile.current_streak = newStreak
        }

        // Generate token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({
            message: 'Login successful',
            user: { id: user.id, email: user.email, name: user.name },
            profile: profile,
            token
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Login failed' })
    }
})

/**
 * GET /api/auth/me
 * Get current user + profile
 */
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const result = await query(
            'SELECT id, email, name, created_at FROM users WHERE id = $1',
            [req.userId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' })
        }

        const profile = await getUserProfile(req.userId)

        res.json({
            user: result.rows[0],
            profile: profile || null
        })
    } catch (error) {
        console.error('Get user error:', error)
        res.status(500).json({ error: 'Failed to get user' })
    }
})

/**
 * PUT /api/auth/profile
 * Update user profile
 */
router.put('/profile', authMiddleware, async (req, res) => {
    try {
        const { selectedCareer, currentPhase, currentConcept, dailyGoalMinutes } = req.body

        const updates = {}
        if (selectedCareer) updates.selected_career = selectedCareer
        if (currentPhase) updates.current_phase = currentPhase
        if (currentConcept) updates.current_concept = currentConcept
        if (dailyGoalMinutes) updates.daily_goal_minutes = dailyGoalMinutes

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ error: 'No updates provided' })
        }

        const fields = Object.keys(updates)
        const values = Object.values(updates)
        const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ')

        const result = await query(`
            UPDATE user_profiles 
            SET ${setClause}, updated_at = NOW()
            WHERE user_id = $1
            RETURNING *
        `, [req.userId, ...values])

        res.json({
            message: 'Profile updated',
            profile: result.rows[0]
        })
    } catch (error) {
        console.error('Update profile error:', error)
        res.status(500).json({ error: 'Failed to update profile' })
    }
})

/**
 * Auth middleware - verify JWT
 */
export function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        req.userEmail = decoded.email
        next()
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' })
    }
}

export default router
