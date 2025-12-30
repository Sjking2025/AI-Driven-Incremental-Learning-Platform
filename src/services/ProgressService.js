// ========================================
// Progress Service - Local Storage Persistence
// ========================================

class ProgressService {
    constructor() {
        this.storageKey = 'careerPathProgress';
        this.progress = this.load();
    }

    load() {
        try {
            const saved = localStorage.getItem(this.storageKey);
            return saved ? JSON.parse(saved) : this.getDefaultProgress();
        } catch (e) {
            console.error('Error loading progress:', e);
            return this.getDefaultProgress();
        }
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
        } catch (e) {
            console.error('Error saving progress:', e);
        }
    }

    getDefaultProgress() {
        return {
            selectedCareer: null,
            currentPhase: 1,
            completedConcepts: [],
            completedProjects: [],
            streak: 0,
            lastActiveDate: null,
            skillLevels: {
                html: 0,
                css: 0,
                javascript: 0,
                react: 0
            }
        };
    }

    // Career selection
    setCareer(careerId) {
        this.progress.selectedCareer = careerId;
        this.save();
    }

    getCareer() {
        return this.progress.selectedCareer;
    }

    // Concepts
    completeConcept(conceptId) {
        if (!this.progress.completedConcepts.includes(conceptId)) {
            this.progress.completedConcepts.push(conceptId);
            this.updateStreak();
            this.save();
        }
    }

    isConceptCompleted(conceptId) {
        return this.progress.completedConcepts.includes(conceptId);
    }

    getCompletedConceptsCount() {
        return this.progress.completedConcepts.length;
    }

    // Projects
    completeProject(projectId) {
        if (!this.progress.completedProjects.includes(projectId)) {
            this.progress.completedProjects.push(projectId);
            this.save();
        }
    }

    // Skills
    updateSkillLevel(skill, level) {
        if (this.progress.skillLevels[skill] !== undefined) {
            this.progress.skillLevels[skill] = Math.min(100, Math.max(0, level));
            this.save();
        }
    }

    getSkillLevels() {
        return this.progress.skillLevels;
    }

    // Streak
    updateStreak() {
        const today = new Date().toDateString();
        const lastActive = this.progress.lastActiveDate;

        if (lastActive === today) {
            // Already active today
            return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastActive === yesterday.toDateString()) {
            // Consecutive day
            this.progress.streak++;
        } else if (lastActive !== today) {
            // Streak broken
            this.progress.streak = 1;
        }

        this.progress.lastActiveDate = today;
        this.save();
    }

    getStreak() {
        return this.progress.streak;
    }

    // Calculate overall readiness
    calculateReadiness() {
        const conceptWeight = 0.5;
        const projectWeight = 0.3;
        const skillWeight = 0.2;

        const totalConcepts = 25; // Example total
        const totalProjects = 5;

        const conceptProgress = (this.progress.completedConcepts.length / totalConcepts) * 100;
        const projectProgress = (this.progress.completedProjects.length / totalProjects) * 100;

        const skills = Object.values(this.progress.skillLevels);
        const avgSkill = skills.reduce((a, b) => a + b, 0) / skills.length;

        return Math.round(
            (conceptProgress * conceptWeight) +
            (projectProgress * projectWeight) +
            (avgSkill * skillWeight)
        );
    }

    // Reset (for testing)
    reset() {
        this.progress = this.getDefaultProgress();
        this.save();
    }
}

export const progressService = new ProgressService();
