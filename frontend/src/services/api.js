// ========================================
// API Client
// Connects frontend to backend + user data
// ========================================

const API_BASE = 'http://localhost:3001/api'

// Get token from localStorage
function getToken() {
    return localStorage.getItem('learnpath_token')
}

// API request helper
async function request(endpoint, options = {}) {
    const token = getToken()

    const config = {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers
        }
    }

    const response = await fetch(`${API_BASE}${endpoint}`, config)

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Request failed' }))
        throw new Error(error.error || `HTTP ${response.status}`)
    }

    return response.json()
}

// ========================================
// Auth API
// ========================================

export const authAPI = {
    async register(email, password, name, selectedCareer) {
        const data = await request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name, selectedCareer })
        })
        if (data.token) {
            localStorage.setItem('learnpath_token', data.token)
        }
        return data
    },

    async login(email, password) {
        const data = await request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        })
        if (data.token) {
            localStorage.setItem('learnpath_token', data.token)
        }
        return data
    },

    async getMe() {
        return request('/auth/me')
    },

    async updateProfile(updates) {
        return request('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify(updates)
        })
    },

    logout() {
        localStorage.removeItem('learnpath_token')
    }
}

// ========================================
// User API (Profile, Activity, Sessions)
// ========================================

export const userAPI = {
    // Profile
    async getProfile() {
        return request('/user/profile')
    },

    async updateProfile(updates) {
        return request('/user/profile', {
            method: 'PUT',
            body: JSON.stringify(updates)
        })
    },

    // Concept views
    async viewConcept(conceptId, source = 'learn_page', timeSpentSeconds = 0) {
        return request('/user/view-concept', {
            method: 'POST',
            body: JSON.stringify({ conceptId, source, timeSpentSeconds })
        })
    },

    async getViewedConcepts() {
        return request('/user/viewed-concepts')
    },

    // Daily activity
    async recordActivity(data) {
        return request('/user/record-activity', {
            method: 'POST',
            body: JSON.stringify(data)
        })
    },

    async getActivity(days = 7) {
        return request(`/user/activity?days=${days}`)
    },

    // Practice sessions
    async startPracticeSession(sessionType = 'mixed') {
        return request('/user/practice-session/start', {
            method: 'POST',
            body: JSON.stringify({ sessionType })
        })
    },

    async endPracticeSession(sessionId, results) {
        return request(`/user/practice-session/${sessionId}/end`, {
            method: 'PUT',
            body: JSON.stringify(results)
        })
    },

    async getPracticeSessions(limit = 10) {
        return request(`/user/practice-sessions?limit=${limit}`)
    },

    // All progress data
    async getAllProgress() {
        return request('/user/all-progress')
    }
}

// ========================================
// Agent API
// ========================================

export const agentAPI = {
    // Get all available agents
    async getCatalog() {
        return request('/agent/catalog')
    },

    // Route request to specific agent
    async route(agent, action, params = {}) {
        return request('/agent/route', {
            method: 'POST',
            body: JSON.stringify({ agent, action, params })
        })
    },

    // Smart ask - auto-routes based on intent
    async ask(question, context = {}) {
        return request('/agent/ask', {
            method: 'POST',
            body: JSON.stringify({ question, context })
        })
    },

    // Learning step handler
    async learnStep(conceptId, action = 'start') {
        return request(`/agent/learn/${conceptId}`, {
            method: 'POST',
            body: JSON.stringify({ action })
        })
    }
}

// ========================================
// Learn API
// ========================================

export const learnAPI = {
    async getProgress() {
        return request('/learn/progress')
    },

    async getStats() {
        return request('/learn/stats')
    },

    async recordProgress(conceptId, success) {
        return request('/learn/record', {
            method: 'POST',
            body: JSON.stringify({ conceptId, success })
        })
    },

    async getDueForReview() {
        return request('/learn/due')
    }
}

// ========================================
// Convenience Agent Wrappers
// ========================================

export const agents = {
    // Curriculum Agent
    async generateRoadmap(goal, existingSkills = []) {
        return agentAPI.route('curriculum', 'generateRoadmap', { goal, existingSkills })
    },

    async getNextConcepts(completedConcepts, goal) {
        return agentAPI.route('curriculum', 'getNextConcepts', { completedConcepts, goal })
    },

    // Explainer Agent
    async explain(concept, level = 'beginner') {
        return agentAPI.route('explainer', 'explainConcept', { concept, level })
    },

    async answerWhy(question) {
        return agentAPI.route('explainer', 'answerWhy', { question })
    },

    async compare(concept1, concept2) {
        return agentAPI.route('explainer', 'compareConcepts', { concept1, concept2 })
    },

    // Scenario Agent
    async generateScenario(concept, difficulty = 'medium') {
        return agentAPI.route('scenario', 'generateScenario', { concept, difficulty })
    },

    // Project Agent
    async generateProject(concepts, difficulty = 'medium') {
        return agentAPI.route('project', 'generateProject', { concepts, difficulty })
    },

    async generateChallenges(concept, count = 3) {
        return agentAPI.route('project', 'generateProgressiveChallenges', { concept, count })
    },

    // Debug Agent
    async debug(code, error = null) {
        return agentAPI.route('debug', 'debugCode', { code, error })
    },

    async explainExecution(code) {
        return agentAPI.route('debug', 'explainExecution', { code })
    },

    // Evaluator Agent
    async getReadiness(targetRole = 'frontend') {
        return agentAPI.route('evaluator', 'calculateReadiness', { targetRole })
    },

    async getSkillRadar() {
        return agentAPI.route('evaluator', 'getSkillRadar', {})
    },

    async getGaps() {
        return agentAPI.route('evaluator', 'identifyGaps', {})
    }
}

export default { authAPI, agentAPI, learnAPI, userAPI, agents }
