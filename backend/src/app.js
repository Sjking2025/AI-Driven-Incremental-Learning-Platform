// ========================================
// LearnPath Backend - Main Entry Point
// Multi-Agent AI Learning Platform
// ========================================

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

// Routes
import authRoutes from './routes/auth.js'
import learnRoutes from './routes/learn.js'
import agentRoutes from './routes/agent.js'
import userRoutes from './routes/user.js'

// Database
import { initDatabase } from './db/postgres.js'

// Initialize
dotenv.config()
const app = express()
const PORT = process.env.PORT || 3001

// Initialize database tables
initDatabase().catch(console.error)

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true
}))
app.use(express.json())

// Request logging
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
    next()
})

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/learn', learnRoutes)
app.use('/api/agent', agentRoutes)
app.use('/api/user', userRoutes)

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' })
})

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message)
    res.status(500).json({ error: 'Internal server error' })
})

// Start server
app.listen(PORT, () => {
    console.log(`
  ┌─────────────────────────────────────┐
  │  🧠 LearnPath Backend Running       │
  │  Port: ${PORT}                         │
  │  Mode: ${process.env.NODE_ENV || 'development'}                 │
  └─────────────────────────────────────┘
  `)
})

export default app
