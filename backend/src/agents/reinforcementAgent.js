// ========================================
// Agent 5: Reinforcement & Memory Agent
// Prevents forgetting through spaced repetition
// ========================================

import { query } from '../db/postgres.js'

// Spaced repetition intervals (in days)
const REVIEW_INTERVALS = [1, 2, 4, 7, 14, 30, 60]

/**
 * Calculate next review date based on performance
 */
export function calculateNextReview(exposures, mastery) {
    const level = Math.floor(mastery / 15) // 0-6 levels
    const intervalDays = REVIEW_INTERVALS[Math.min(level, 6)]

    const nextDate = new Date()
    nextDate.setDate(nextDate.getDate() + intervalDays)

    return nextDate.toISOString()
}

/**
 * Get concepts that should be reinforced during current lesson
 */
export async function getReinforcementConcepts(userId, currentConceptId) {
    // Get concepts due for review or weak
    const result = await query(
        `SELECT concept_id, mastery, last_practiced, exposures
     FROM progress
     WHERE user_id = $1 
       AND concept_id != $2
       AND (next_review <= NOW() OR mastery < 50)
     ORDER BY mastery ASC, next_review ASC
     LIMIT 3`,
        [userId, currentConceptId]
    )

    return result.rows.map(row => ({
        conceptId: row.concept_id,
        mastery: row.mastery,
        reason: row.mastery < 50 ? 'weak' : 'due-for-review'
    }))
}

/**
 * Select review problems for a mixed practice session
 */
export async function getMixedPractice(userId, count = 5) {
    // Mix of weak concepts (60%) and random review (40%)
    const weakCount = Math.ceil(count * 0.6)
    const randomCount = count - weakCount

    const weakResult = await query(
        `SELECT concept_id, mastery
     FROM progress
     WHERE user_id = $1 AND mastery < 50
     ORDER BY mastery ASC
     LIMIT $2`,
        [userId, weakCount]
    )

    const randomResult = await query(
        `SELECT concept_id, mastery
     FROM progress
     WHERE user_id = $1 AND mastery >= 50
     ORDER BY RANDOM()
     LIMIT $2`,
        [userId, randomCount]
    )

    return {
        weak: weakResult.rows,
        review: randomResult.rows,
        total: weakResult.rows.length + randomResult.rows.length
    }
}

/**
 * Record an exposure and update mastery
 */
export async function recordExposure(userId, conceptId, success) {
    const masteryDelta = success ? 10 : -5
    const nextReview = calculateNextReview(1, success ? 10 : 0)

    const result = await query(
        `INSERT INTO progress (user_id, concept_id, exposures, successes, failures, mastery, last_practiced, next_review)
     VALUES ($1, $2, 1, $3, $4, GREATEST(0, LEAST(100, $5)), NOW(), $6)
     ON CONFLICT (user_id, concept_id)
     DO UPDATE SET
       exposures = progress.exposures + 1,
       successes = progress.successes + $3,
       failures = progress.failures + $4,
       mastery = GREATEST(0, LEAST(100, progress.mastery + $5)),
       last_practiced = NOW(),
       next_review = $6
     RETURNING *`,
        [userId, conceptId, success ? 1 : 0, success ? 0 : 1, masteryDelta, nextReview]
    )

    return result.rows[0]
}

/**
 * Get concepts the user is struggling with
 */
export async function getStrugglingConcepts(userId) {
    const result = await query(
        `SELECT concept_id, mastery, exposures, 
            ROUND(successes::decimal / NULLIF(exposures, 0) * 100) as success_rate
     FROM progress
     WHERE user_id = $1 AND exposures >= 3 AND mastery < 40
     ORDER BY success_rate ASC
     LIMIT 5`,
        [userId]
    )

    return result.rows
}

export default {
    calculateNextReview,
    getReinforcementConcepts,
    getMixedPractice,
    recordExposure,
    getStrugglingConcepts
}
