import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Main application store
export const useAppStore = create(
    persist(
        (set, get) => ({
            // User's selected career path
            selectedCareer: null,
            setCareer: (careerId) => set({ selectedCareer: careerId }),

            // Current position in learning path
            currentPhase: 1,
            setPhase: (phase) => set({ currentPhase: phase }),

            // Completed concepts with mastery scores
            conceptMastery: {},
            updateConceptMastery: (conceptId, score) =>
                set((state) => ({
                    conceptMastery: {
                        ...state.conceptMastery,
                        [conceptId]: {
                            score,
                            exposures: (state.conceptMastery[conceptId]?.exposures || 0) + 1,
                            lastPracticed: new Date().toISOString()
                        }
                    }
                })),

            // Completed projects
            completedProjects: [],
            completeProject: (projectId) =>
                set((state) => ({
                    completedProjects: [...state.completedProjects, projectId]
                })),

            // Learning streak
            streak: 0,
            lastActiveDate: null,
            updateStreak: () => {
                const today = new Date().toDateString()
                const lastActive = get().lastActiveDate

                if (lastActive === today) return

                const yesterday = new Date()
                yesterday.setDate(yesterday.getDate() - 1)

                if (lastActive === yesterday.toDateString()) {
                    set({ streak: get().streak + 1, lastActiveDate: today })
                } else {
                    set({ streak: 1, lastActiveDate: today })
                }
            },

            // Reset progress
            reset: () => set({
                selectedCareer: null,
                currentPhase: 1,
                conceptMastery: {},
                completedProjects: [],
                streak: 0,
                lastActiveDate: null
            })
        }),
        {
            name: 'career-path-storage'
        }
    )
)

// Calculate overall readiness percentage
export const useReadiness = () => {
    const { conceptMastery, completedProjects } = useAppStore()
    const totalConcepts = 25 // Target concepts
    const totalProjects = 5   // Target projects

    const conceptScores = Object.values(conceptMastery)
    const avgConceptMastery = conceptScores.length
        ? conceptScores.reduce((sum, c) => sum + c.score, 0) / totalConcepts
        : 0

    const projectProgress = completedProjects.length / totalProjects

    return Math.round((avgConceptMastery * 0.6 + projectProgress * 0.4) * 100)
}
