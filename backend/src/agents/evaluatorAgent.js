// ========================================
// Agent 7: Progress & Skill Evaluator Agent
// Measures readiness and skill levels
// ========================================

import { query } from '../db/postgres.js'

/**
 * Get comprehensive learning stats
 */
export async function getDetailedStats(userId) {
    const result = await query(
        `SELECT 
       COUNT(*) as total_concepts,
       COALESCE(ROUND(AVG(mastery)), 0) as avg_mastery,
       COALESCE(SUM(exposures), 0) as total_exposures,
       COALESCE(SUM(successes), 0) as total_successes,
       COALESCE(SUM(failures), 0) as total_failures,
       COUNT(*) FILTER (WHERE mastery >= 80) as mastered_count,
       COUNT(*) FILTER (WHERE mastery >= 60 AND mastery < 80) as proficient_count,
       COUNT(*) FILTER (WHERE mastery >= 40 AND mastery < 60) as learning_count,
       COUNT(*) FILTER (WHERE mastery < 40) as struggling_count,
       COUNT(*) FILTER (WHERE next_review <= NOW()) as due_for_review
     FROM progress
     WHERE user_id = $1`,
        [userId]
    )

    const stats = result.rows[0]
    const totalAttempts = Number(stats.total_successes) + Number(stats.total_failures)

    return {
        ...stats,
        success_rate: totalAttempts > 0
            ? Math.round((stats.total_successes / totalAttempts) * 100)
            : 0
    }
}

/**
 * Calculate job readiness score (0-100)
 */
export async function calculateReadiness(userId, targetRole = 'frontend') {
    const stats = await getDetailedStats(userId)

    // Readiness factors
    const masteryWeight = 0.4
    const coverageWeight = 0.3
    const consistencyWeight = 0.3

    // Expected concepts per role
    const roleExpectations = {
        frontend: 20,
        backend: 25,
        fullstack: 40
    }

    const expectedConcepts = roleExpectations[targetRole] || 20

    // Calculate scores
    const masteryScore = Math.min(100, stats.avg_mastery || 0)
    const coverageScore = Math.min(100, (stats.total_concepts / expectedConcepts) * 100)
    const consistencyScore = stats.success_rate || 0

    const readiness = Math.round(
        masteryScore * masteryWeight +
        coverageScore * coverageWeight +
        consistencyScore * consistencyWeight
    )

    return {
        overall: Math.min(100, readiness),
        breakdown: {
            mastery: Math.round(masteryScore),
            coverage: Math.round(coverageScore),
            consistency: Math.round(consistencyScore)
        },
        level: readiness >= 80 ? 'Ready' :
            readiness >= 60 ? 'Almost Ready' :
                readiness >= 40 ? 'In Progress' : 'Just Started'
    }
}

/**
 * Get skill radar data
 */
export async function getSkillRadar(userId) {
    const result = await query(
        `SELECT concept_id, mastery FROM progress WHERE user_id = $1`,
        [userId]
    )

    // Group by category
    const categories = {
        'Foundation': ['design-principles', 'layout-reasoning', 'ux-thinking'],
        'HTML/CSS': ['html-semantic', 'css-box-model', 'flexbox', 'css-grid', 'responsive-design'],
        'JS Basics': ['js-variables', 'js-operators', 'js-conditions', 'js-loops'],
        'JS Advanced': ['js-functions', 'js-closures', 'js-arrays', 'js-objects'],
        'DOM & Async': ['dom-basics', 'events', 'async-js']
    }

    const masteryMap = {}
    result.rows.forEach(row => {
        masteryMap[row.concept_id] = row.mastery
    })

    return Object.entries(categories).map(([name, concepts]) => {
        const masteries = concepts.map(c => masteryMap[c] || 0)
        const avg = masteries.length > 0
            ? Math.round(masteries.reduce((a, b) => a + b, 0) / masteries.length)
            : 0

        return { category: name, value: avg }
    })
}

/**
 * Identify skill gaps
 */
export async function identifyGaps(userId) {
    const radar = await getSkillRadar(userId)

    const gaps = radar
        .filter(cat => cat.value < 50)
        .sort((a, b) => a.value - b.value)

    return {
        gaps,
        recommendation: gaps.length > 0
            ? `Focus on ${gaps[0].category} first - currently at ${gaps[0].value}%`
            : 'No major gaps identified!'
    }
}

export default {
    getDetailedStats,
    calculateReadiness,
    getSkillRadar,
    identifyGaps
}
