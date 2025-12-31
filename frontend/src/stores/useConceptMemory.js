// ========================================
// Concept Memory Tracker
// Tracks exposures, mastery, and spaced repetition
// ========================================

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Spaced repetition intervals (in days)
const REVIEW_INTERVALS = [1, 3, 7, 14, 30, 60]

// Calculate mastery score based on multiple factors
function calculateMastery(exposures, successRate, daysSinceLastPractice) {
    // Base mastery from exposures (max 40%)
    const exposureMastery = Math.min(exposures * 8, 40)

    // Success rate contribution (max 40%)
    const successMastery = successRate * 40

    // Recency bonus/penalty (max 20%)
    let recencyScore = 20
    if (daysSinceLastPractice > 7) {
        recencyScore = Math.max(0, 20 - (daysSinceLastPractice - 7) * 2)
    }

    return Math.round(exposureMastery + successMastery + recencyScore)
}

// Determine next review date based on mastery
function getNextReviewDate(mastery, lastPracticed) {
    const masteryLevel = Math.floor(mastery / 20) // 0-5 levels
    const intervalDays = REVIEW_INTERVALS[Math.min(masteryLevel, 5)]

    const nextDate = new Date(lastPracticed)
    nextDate.setDate(nextDate.getDate() + intervalDays)

    return nextDate.toISOString()
}

// Concept Memory Store
export const useConceptMemory = create(
    persist(
        (set, get) => ({
            // Memory for each concept
            concepts: {},

            // Record exposure to a concept
            recordExposure: (conceptId, success = true) => {
                const now = new Date().toISOString()

                set((state) => {
                    const existing = state.concepts[conceptId] || {
                        exposures: 0,
                        successes: 0,
                        failures: 0,
                        lastPracticed: null,
                        firstSeen: now
                    }

                    const updated = {
                        ...existing,
                        exposures: existing.exposures + 1,
                        successes: success ? existing.successes + 1 : existing.successes,
                        failures: success ? existing.failures : existing.failures + 1,
                        lastPracticed: now
                    }

                    // Calculate success rate
                    const successRate = updated.successes / updated.exposures

                    // Calculate days since last practice
                    const daysSinceLastPractice = existing.lastPracticed
                        ? Math.floor((new Date(now) - new Date(existing.lastPracticed)) / (1000 * 60 * 60 * 24))
                        : 0

                    // Calculate mastery
                    updated.mastery = calculateMastery(
                        updated.exposures,
                        successRate,
                        daysSinceLastPractice
                    )

                    // Set next review date
                    updated.nextReview = getNextReviewDate(updated.mastery, now)

                    return {
                        concepts: {
                            ...state.concepts,
                            [conceptId]: updated
                        }
                    }
                })
            },

            // Get memory for a concept
            getConceptMemory: (conceptId) => {
                return get().concepts[conceptId] || null
            },

            // Get mastery percentage for a concept
            getMastery: (conceptId) => {
                const memory = get().concepts[conceptId]
                return memory?.mastery || 0
            },

            // Get concepts due for review
            getDueForReview: () => {
                const now = new Date()
                const due = []

                for (const [id, memory] of Object.entries(get().concepts)) {
                    if (memory.nextReview && new Date(memory.nextReview) <= now) {
                        due.push({ id, ...memory })
                    }
                }

                // Sort by urgency (oldest first)
                return due.sort((a, b) =>
                    new Date(a.nextReview) - new Date(b.nextReview)
                )
            },

            // Get weak concepts (mastery < 50%)
            getWeakConcepts: () => {
                const weak = []

                for (const [id, memory] of Object.entries(get().concepts)) {
                    if (memory.mastery < 50) {
                        weak.push({ id, ...memory })
                    }
                }

                // Sort by mastery (lowest first)
                return weak.sort((a, b) => a.mastery - b.mastery)
            },

            // Get strong concepts (mastery >= 70%)
            getStrongConcepts: () => {
                const strong = []

                for (const [id, memory] of Object.entries(get().concepts)) {
                    if (memory.mastery >= 70) {
                        strong.push({ id, ...memory })
                    }
                }

                return strong.sort((a, b) => b.mastery - a.mastery)
            },

            // Get total concepts practiced
            getTotalPracticed: () => {
                return Object.keys(get().concepts).length
            },

            // Get average mastery
            getAverageMastery: () => {
                const concepts = Object.values(get().concepts)
                if (concepts.length === 0) return 0

                const total = concepts.reduce((sum, c) => sum + c.mastery, 0)
                return Math.round(total / concepts.length)
            },

            // Reset all memory
            reset: () => set({ concepts: {} })
        }),
        {
            name: 'concept-memory-storage'
        }
    )
)

// Hook to get overall learning stats
export function useLearningStats() {
    const {
        getTotalPracticed,
        getAverageMastery,
        getWeakConcepts,
        getStrongConcepts,
        getDueForReview
    } = useConceptMemory()

    return {
        totalPracticed: getTotalPracticed(),
        averageMastery: getAverageMastery(),
        weakCount: getWeakConcepts().length,
        strongCount: getStrongConcepts().length,
        dueForReview: getDueForReview().length
    }
}
