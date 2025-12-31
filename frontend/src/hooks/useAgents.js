// ========================================
// Agent Hooks
// React hooks for using backend agents
// ========================================

import { useState, useCallback } from 'react'
import { agents, agentAPI, learnAPI } from '../services/api'

/**
 * Generic hook for agent calls with loading/error state
 */
export function useAgent() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const call = useCallback(async (agentFn, ...args) => {
        setLoading(true)
        setError(null)
        try {
            const result = await agentFn(...args)
            return result
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { call, loading, error }
}

/**
 * Hook for smart ask (auto-routing)
 */
export function useAskAgent() {
    const [response, setResponse] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const ask = useCallback(async (question, context = {}) => {
        setLoading(true)
        setError(null)
        try {
            const data = await agentAPI.ask(question, context)
            setResponse(data)
            return data
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { ask, response, loading, error }
}

/**
 * Hook for concept explanation
 */
export function useExplainer() {
    const [explanation, setExplanation] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const explain = useCallback(async (concept, level = 'beginner') => {
        setLoading(true)
        setError(null)
        try {
            const data = await agents.explain(concept, level)
            setExplanation(data.result)
            return data
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    const answerWhy = useCallback(async (question) => {
        setLoading(true)
        setError(null)
        try {
            const data = await agents.answerWhy(question)
            setExplanation(data.result)
            return data
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { explain, answerWhy, explanation, loading, error }
}

/**
 * Hook for debugging
 */
export function useDebugger() {
    const [analysis, setAnalysis] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const debug = useCallback(async (code, errorMsg = null) => {
        setLoading(true)
        setError(null)
        try {
            const data = await agents.debug(code, errorMsg)
            setAnalysis(data.result)
            return data
        } catch (err) {
            setError(err.message)
            throw err
        } finally {
            setLoading(false)
        }
    }, [])

    return { debug, analysis, loading, error }
}

/**
 * Hook for progress tracking
 */
export function useProgress() {
    const [stats, setStats] = useState(null)
    const [progress, setProgress] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchStats = useCallback(async () => {
        setLoading(true)
        try {
            const data = await learnAPI.getStats()
            setStats(data.stats)
            return data.stats
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchProgress = useCallback(async () => {
        setLoading(true)
        try {
            const data = await learnAPI.getProgress()
            setProgress(data.progress)
            return data.progress
        } finally {
            setLoading(false)
        }
    }, [])

    const recordProgress = useCallback(async (conceptId, success) => {
        try {
            await learnAPI.recordProgress(conceptId, success)
            await fetchStats() // Refresh stats
        } catch (err) {
            console.error('Failed to record progress:', err)
        }
    }, [fetchStats])

    return { stats, progress, loading, fetchStats, fetchProgress, recordProgress }
}

/**
 * Hook for job readiness
 */
export function useReadiness() {
    const [readiness, setReadiness] = useState(null)
    const [skillRadar, setSkillRadar] = useState([])
    const [gaps, setGaps] = useState(null)
    const [loading, setLoading] = useState(false)

    const fetchReadiness = useCallback(async (role = 'frontend') => {
        setLoading(true)
        try {
            const data = await agents.getReadiness(role)
            setReadiness(data.result)
            return data.result
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchSkillRadar = useCallback(async () => {
        setLoading(true)
        try {
            const data = await agents.getSkillRadar()
            setSkillRadar(data.result)
            return data.result
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchGaps = useCallback(async () => {
        setLoading(true)
        try {
            const data = await agents.getGaps()
            setGaps(data.result)
            return data.result
        } finally {
            setLoading(false)
        }
    }, [])

    return { readiness, skillRadar, gaps, loading, fetchReadiness, fetchSkillRadar, fetchGaps }
}

export default {
    useAgent,
    useAskAgent,
    useExplainer,
    useDebugger,
    useProgress,
    useReadiness
}
