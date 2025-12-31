// ========================================
// PostgreSQL Database Connection
// ========================================

import pg from 'pg'
const { Pool } = pg

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'learnpath',
    user: 'postgres',
    password: 'sj13042005'
})

// Test connection
pool.on('connect', () => {
    console.log('📦 PostgreSQL connected')
})

pool.on('error', (err) => {
    console.error('PostgreSQL error:', err.message)
})

/**
 * Execute a query
 */
export async function query(text, params) {
    const start = Date.now()
    try {
        const result = await pool.query(text, params)
        const duration = Date.now() - start
        console.log(`Query executed in ${duration}ms`)
        return result
    } catch (error) {
        console.error('Query error:', error.message)
        throw error
    }
}

/**
 * Initialize database tables
 */
export async function initDatabase() {
    const createTables = `
    -- Users table
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      current_goal VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Learning progress
    CREATE TABLE IF NOT EXISTS progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      concept_id VARCHAR(100) NOT NULL,
      mastery INT DEFAULT 0,
      exposures INT DEFAULT 0,
      successes INT DEFAULT 0,
      failures INT DEFAULT 0,
      last_practiced TIMESTAMP,
      next_review TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, concept_id)
    );

    -- Agent sessions (for tracking interactions)
    CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      agent_type VARCHAR(50) NOT NULL,
      input JSONB,
      output JSONB,
      duration_ms INT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Create indexes
    CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  `

    try {
        await query(createTables)
        console.log('✅ Database tables initialized')
    } catch (error) {
        console.error('Database init error:', error.message)
    }
}

export default { query, initDatabase, pool }
