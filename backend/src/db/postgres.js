// ========================================
// PostgreSQL Database Connection
// Complete schema for learning platform
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
        if (duration > 100) {
            console.log(`Query executed in ${duration}ms`)
        }
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
    -- 1. Users table (core account)
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email VARCHAR(255) UNIQUE NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- 2. User Profiles (learning state)
    CREATE TABLE IF NOT EXISTS user_profiles (
      user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      
      -- Career Selection
      selected_career VARCHAR(50) DEFAULT 'frontend',
      current_phase VARCHAR(50) DEFAULT 'foundation',
      current_concept VARCHAR(100),
      
      -- Progress Stats
      total_concepts_learned INT DEFAULT 0,
      total_practice_sessions INT DEFAULT 0,
      total_time_minutes INT DEFAULT 0,
      
      -- Streak
      current_streak INT DEFAULT 0,
      longest_streak INT DEFAULT 0,
      last_active_date DATE,
      
      -- Settings
      difficulty_level VARCHAR(20) DEFAULT 'beginner',
      daily_goal_minutes INT DEFAULT 30,
      
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- 3. Learning progress (per concept)
    CREATE TABLE IF NOT EXISTS progress (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      concept_id VARCHAR(100) NOT NULL,
      
      -- Mastery
      mastery INT DEFAULT 0,
      exposures INT DEFAULT 0,
      successes INT DEFAULT 0,
      failures INT DEFAULT 0,
      
      -- Status
      status VARCHAR(20) DEFAULT 'not_started',
      first_seen_at TIMESTAMP,
      mastered_at TIMESTAMP,
      
      -- Spaced Repetition
      last_practiced TIMESTAMP,
      next_review TIMESTAMP,
      
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, concept_id)
    );

    -- 4. Practice sessions (history)
    CREATE TABLE IF NOT EXISTS practice_sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      
      session_type VARCHAR(50) DEFAULT 'mixed',
      started_at TIMESTAMP DEFAULT NOW(),
      ended_at TIMESTAMP,
      duration_minutes INT,
      
      total_questions INT DEFAULT 0,
      correct_answers INT DEFAULT 0,
      concepts_practiced JSONB DEFAULT '[]',
      
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- 5. Concept views (what user has seen)
    CREATE TABLE IF NOT EXISTS concept_views (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      concept_id VARCHAR(100) NOT NULL,
      
      view_count INT DEFAULT 1,
      first_viewed_at TIMESTAMP DEFAULT NOW(),
      last_viewed_at TIMESTAMP DEFAULT NOW(),
      time_spent_seconds INT DEFAULT 0,
      
      source VARCHAR(50) DEFAULT 'learn_page',
      
      UNIQUE(user_id, concept_id)
    );

    -- 6. Daily activity (for analytics)
    CREATE TABLE IF NOT EXISTS daily_activity (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      activity_date DATE NOT NULL,
      
      concepts_practiced INT DEFAULT 0,
      time_spent_minutes INT DEFAULT 0,
      questions_answered INT DEFAULT 0,
      correct_answers INT DEFAULT 0,
      
      streak_maintained BOOLEAN DEFAULT FALSE,
      
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, activity_date)
    );

    -- 7. AI conversations (chat history)
    CREATE TABLE IF NOT EXISTS ai_conversations (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      
      agent_type VARCHAR(50) NOT NULL,
      user_message TEXT NOT NULL,
      ai_response TEXT,
      
      related_concept VARCHAR(100),
      response_time_ms INT,
      
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- 8. Sessions (existing - for agent tracking)
    CREATE TABLE IF NOT EXISTS sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      agent_type VARCHAR(50) NOT NULL,
      input JSONB,
      output JSONB,
      duration_ms INT,
      created_at TIMESTAMP DEFAULT NOW()
    );

    -- Create indexes for performance
    CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_progress_concept ON progress(concept_id);
    CREATE INDEX IF NOT EXISTS idx_practice_user ON practice_sessions(user_id);
    CREATE INDEX IF NOT EXISTS idx_views_user ON concept_views(user_id);
    CREATE INDEX IF NOT EXISTS idx_daily_user ON daily_activity(user_id);
    CREATE INDEX IF NOT EXISTS idx_daily_date ON daily_activity(activity_date);
    CREATE INDEX IF NOT EXISTS idx_conversations_user ON ai_conversations(user_id);
    CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
  `

    try {
        await query(createTables)
        console.log('✅ Database tables initialized (8 tables)')
    } catch (error) {
        console.error('Database init error:', error.message)
    }
}

/**
 * Create user profile when user registers
 */
export async function createUserProfile(userId) {
    const sql = `
      INSERT INTO user_profiles (user_id)
      VALUES ($1)
      ON CONFLICT (user_id) DO NOTHING
      RETURNING *
    `
    const result = await query(sql, [userId])
    return result.rows[0]
}

/**
 * Get user profile
 */
export async function getUserProfile(userId) {
    const sql = `SELECT * FROM user_profiles WHERE user_id = $1`
    const result = await query(sql, [userId])
    return result.rows[0]
}

/**
 * Update user profile
 */
export async function updateUserProfile(userId, updates) {
    const fields = Object.keys(updates)
    const values = Object.values(updates)
    const setClause = fields.map((f, i) => `${f} = $${i + 2}`).join(', ')

    const sql = `
      UPDATE user_profiles 
      SET ${setClause}, updated_at = NOW()
      WHERE user_id = $1
      RETURNING *
    `
    const result = await query(sql, [userId, ...values])
    return result.rows[0]
}

export default { query, initDatabase, pool, createUserProfile, getUserProfile, updateUserProfile }
