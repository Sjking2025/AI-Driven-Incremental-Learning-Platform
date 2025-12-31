// ========================================
// Redis Connection
// For caching and real-time data
// ========================================

import { createClient } from 'redis'

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379'

const client = createClient({ url: redisUrl })

client.on('connect', () => {
    console.log('⚡ Redis connected')
})

client.on('error', (err) => {
    console.error('Redis error:', err.message)
})

/**
 * Connect to Redis
 */
export async function connect() {
    try {
        await client.connect()
    } catch (error) {
        console.error('Redis connection failed:', error.message)
    }
}

/**
 * Set a value with optional TTL
 */
export async function set(key, value, ttlSeconds = null) {
    const stringValue = typeof value === 'object' ? JSON.stringify(value) : value

    if (ttlSeconds) {
        await client.setEx(key, ttlSeconds, stringValue)
    } else {
        await client.set(key, stringValue)
    }
}

/**
 * Get a value
 */
export async function get(key) {
    const value = await client.get(key)
    try {
        return JSON.parse(value)
    } catch {
        return value
    }
}

/**
 * Delete a key
 */
export async function del(key) {
    await client.del(key)
}

/**
 * Store user session data
 */
export async function setUserSession(userId, data, ttlSeconds = 3600) {
    await set(`session:${userId}`, data, ttlSeconds)
}

/**
 * Get user session data
 */
export async function getUserSession(userId) {
    return get(`session:${userId}`)
}

/**
 * Cache agent response
 */
export async function cacheAgentResponse(agentType, inputHash, response, ttlSeconds = 300) {
    await set(`agent:${agentType}:${inputHash}`, response, ttlSeconds)
}

/**
 * Get cached agent response
 */
export async function getCachedAgentResponse(agentType, inputHash) {
    return get(`agent:${agentType}:${inputHash}`)
}

export default {
    client,
    connect,
    set,
    get,
    del,
    setUserSession,
    getUserSession,
    cacheAgentResponse,
    getCachedAgentResponse
}
