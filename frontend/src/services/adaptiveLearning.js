// ========================================
// Adaptive Learning Engine
// Adjusts difficulty based on performance
// ========================================

import { frontendSkillGraph, getNextConcepts } from '../data/skillGraph'

// Difficulty levels
export const DIFFICULTY = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
    EXPERT: 'expert'
}

// Calculate user's current difficulty level based on mastery
export function calculateDifficultyLevel(masteryData) {
    const masteries = Object.values(masteryData)
    if (masteries.length === 0) return DIFFICULTY.EASY

    const avgMastery = masteries.reduce((sum, m) => sum + (m.mastery || 0), 0) / masteries.length
    const successRate = masteries.reduce((sum, m) => {
        const total = (m.successes || 0) + (m.failures || 0)
        return total > 0 ? sum + (m.successes / total) : sum
    }, 0) / masteries.length

    // Combined score
    const score = avgMastery * 0.6 + successRate * 100 * 0.4

    if (score >= 80) return DIFFICULTY.EXPERT
    if (score >= 60) return DIFFICULTY.HARD
    if (score >= 40) return DIFFICULTY.MEDIUM
    return DIFFICULTY.EASY
}

// Get personalized learning recommendations
export function getRecommendations(masteryData, completedConcepts) {
    const recommendations = []

    // 1. Find weak concepts to review
    const weakConcepts = Object.entries(masteryData)
        .filter(([_, data]) => data.mastery < 50)
        .sort((a, b) => a[1].mastery - b[1].mastery)
        .slice(0, 3)
        .map(([id, data]) => ({
            type: 'review',
            conceptId: id,
            title: frontendSkillGraph[id]?.title || id,
            reason: `Mastery at ${data.mastery}% - needs practice`,
            priority: 'high',
            icon: '⚠️'
        }))

    recommendations.push(...weakConcepts)

    // 2. Find concepts due for spaced repetition
    const now = new Date()
    const dueForReview = Object.entries(masteryData)
        .filter(([_, data]) => data.nextReview && new Date(data.nextReview) <= now)
        .slice(0, 2)
        .map(([id, data]) => ({
            type: 'spaced-review',
            conceptId: id,
            title: frontendSkillGraph[id]?.title || id,
            reason: 'Due for spaced repetition review',
            priority: 'medium',
            icon: '🔄'
        }))

    recommendations.push(...dueForReview)

    // 3. Suggest next concepts to learn
    const nextToLearn = getNextConcepts(completedConcepts)
        .slice(0, 2)
        .map(concept => ({
            type: 'new',
            conceptId: concept.id,
            title: concept.title,
            reason: `Next in your learning path (${concept.estimatedHours}h)`,
            priority: 'normal',
            icon: '📚'
        }))

    recommendations.push(...nextToLearn)

    // 4. Suggest practice if many concepts learned
    if (completedConcepts.length >= 3) {
        recommendations.push({
            type: 'practice',
            conceptId: null,
            title: 'Mixed Practice Session',
            reason: 'Reinforce multiple concepts together',
            priority: 'normal',
            icon: '🎯'
        })
    }

    return recommendations.slice(0, 5)
}

// Calculate learning streak and consistency
export function getLearningStats(masteryData) {
    const entries = Object.values(masteryData)

    if (entries.length === 0) {
        return {
            totalPracticed: 0,
            averageMastery: 0,
            strongCount: 0,
            weakCount: 0,
            totalExposures: 0,
            successRate: 0
        }
    }

    const totalExposures = entries.reduce((sum, e) => sum + (e.exposures || 0), 0)
    const totalSuccesses = entries.reduce((sum, e) => sum + (e.successes || 0), 0)
    const totalAttempts = entries.reduce((sum, e) => sum + (e.successes || 0) + (e.failures || 0), 0)

    return {
        totalPracticed: entries.length,
        averageMastery: Math.round(entries.reduce((sum, e) => sum + (e.mastery || 0), 0) / entries.length),
        strongCount: entries.filter(e => (e.mastery || 0) >= 70).length,
        weakCount: entries.filter(e => (e.mastery || 0) < 50).length,
        totalExposures,
        successRate: totalAttempts > 0 ? Math.round((totalSuccesses / totalAttempts) * 100) : 0
    }
}

// Get mastery trend (last 7 days simulated)
export function getMasteryTrend(masteryData) {
    // Simulate trend data based on current mastery
    const avgMastery = Object.values(masteryData).length > 0
        ? Object.values(masteryData).reduce((sum, m) => sum + (m.mastery || 0), 0) / Object.values(masteryData).length
        : 0

    // Create realistic trend showing improvement
    const baseValue = Math.max(0, avgMastery - 15)
    return [
        { day: 'Mon', value: Math.round(baseValue + Math.random() * 5) },
        { day: 'Tue', value: Math.round(baseValue + 3 + Math.random() * 5) },
        { day: 'Wed', value: Math.round(baseValue + 5 + Math.random() * 5) },
        { day: 'Thu', value: Math.round(baseValue + 7 + Math.random() * 5) },
        { day: 'Fri', value: Math.round(baseValue + 10 + Math.random() * 5) },
        { day: 'Sat', value: Math.round(baseValue + 12 + Math.random() * 5) },
        { day: 'Sun', value: Math.round(avgMastery) }
    ]
}

// Get skill distribution for radar chart
export function getSkillRadar(masteryData) {
    const categories = {
        'Foundation': ['design-principles', 'layout-reasoning', 'ux-thinking'],
        'HTML/CSS': ['html-semantic', 'css-box-model', 'flexbox', 'css-grid', 'responsive-design'],
        'JS Basics': ['js-variables', 'js-operators', 'js-conditions', 'js-loops'],
        'JS Functions': ['js-functions', 'js-closures', 'js-arrays', 'js-objects'],
        'DOM & Async': ['dom-basics', 'events', 'async-js']
    }

    return Object.entries(categories).map(([name, conceptIds]) => {
        const masteries = conceptIds
            .map(id => masteryData[id]?.mastery || 0)
            .filter(m => m > 0)

        const value = masteries.length > 0
            ? Math.round(masteries.reduce((a, b) => a + b, 0) / masteries.length)
            : 0

        return { name, value, fullMark: 100 }
    })
}

export default {
    calculateDifficultyLevel,
    getRecommendations,
    getLearningStats,
    getMasteryTrend,
    getSkillRadar,
    DIFFICULTY
}
