// ========================================
// Auth Routes
// JWT-based authentication
// ========================================

import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { query } from '../db/postgres.js'

const router = express.Router()

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body

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
 * Login existing user
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

        // Generate token
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.json({
            message: 'Login successful',
            user: { id: user.id, email: user.email, name: user.name },
            token
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ error: 'Login failed' })
    }
})

/**
 * GET /api/auth/me
 * Get current user (requires auth)
 */
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const result = await query(
            'SELECT id, email, name, current_goal, created_at FROM users WHERE id = $1',
            [req.userId]
        )

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' })
        }

        res.json({ user: result.rows[0] })
    } catch (error) {
        console.error('Get user error:', error)
        res.status(500).json({ error: 'Failed to get user' })
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
