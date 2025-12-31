// ========================================
// Agent 8: Orchestrator Agent
// Brain of the system - routes and coordinates
// ========================================

import curriculumAgent from './curriculumAgent.js'
import explainerAgent from './explainerAgent.js'
import scenarioAgent from './scenarioAgent.js'
import projectAgent from './projectAgent.js'
import reinforcementAgent from './reinforcementAgent.js'
import debugAgent from './debugAgent.js'
import evaluatorAgent from './evaluatorAgent.js'

// Agent registry
const agents = {
    curriculum: curriculumAgent,
    explainer: explainerAgent,
    scenario: scenarioAgent,
    project: projectAgent,
    reinforcement: reinforcementAgent,
    debug: debugAgent,
    evaluator: evaluatorAgent
}

/**
 * Route a request to the appropriate agent
 */
export async function route(agentName, action, params = {}) {
    const agent = agents[agentName]

    if (!agent) {
        throw new Error(`Unknown agent: ${agentName}. Available: ${Object.keys(agents).join(', ')}`)
    }

    if (!agent[action]) {
        throw new Error(`Unknown action: ${action} for agent ${agentName}`)
    }

    console.log(`[Orchestrator] Routing to ${agentName}.${action}`)

    const startTime = Date.now()
    const result = await agent[action](...Object.values(params))
    const duration = Date.now() - startTime

    console.log(`[Orchestrator] ${agentName}.${action} completed in ${duration}ms`)

    return {
        agent: agentName,
        action,
        result,
        duration_ms: duration
    }
}

/**
 * Decide which agent to use based on user intent
 */
export function decideAgent(userIntent) {
    const intentMap = {
        'explain': { agent: 'explainer', action: 'explainConcept' },
        'why': { agent: 'explainer', action: 'answerWhy' },
        'compare': { agent: 'explainer', action: 'compareConcepts' },
        'debug': { agent: 'debug', action: 'debugCode' },
        'fix': { agent: 'debug', action: 'debugCode' },
        'project': { agent: 'project', action: 'generateProject' },
        'challenge': { agent: 'project', action: 'generateProgressiveChallenges' },
        'scenario': { agent: 'scenario', action: 'generateScenario' },
        'real-world': { agent: 'scenario', action: 'generateScenario' },
        'roadmap': { agent: 'curriculum', action: 'generateRoadmap' },
        'next': { agent: 'curriculum', action: 'getNextConcepts' },
        'practice': { agent: 'reinforcement', action: 'getMixedPractice' },
        'review': { agent: 'reinforcement', action: 'getReinforcementConcepts' },
        'progress': { agent: 'evaluator', action: 'getDetailedStats' },
        'readiness': { agent: 'evaluator', action: 'calculateReadiness' },
        'gaps': { agent: 'evaluator', action: 'identifyGaps' }
    }

    const lowerIntent = userIntent.toLowerCase()

    for (const [keyword, routing] of Object.entries(intentMap)) {
        if (lowerIntent.includes(keyword)) {
            return routing
        }
    }

    // Default to explainer for general questions
    return { agent: 'explainer', action: 'answerWhy' }
}

/**
 * Handle a complete learning session step
 */
export async function handleLearningStep(userId, conceptId, action) {
    const results = {}

    switch (action) {
        case 'start':
            // Get concept explanation
            results.explanation = await route('explainer', 'explainConcept', {
                concept: conceptId,
                level: 'beginner'
            })

            // Get reinforcement from previous concepts
            results.reinforcement = await route('reinforcement', 'getReinforcementConcepts', {
                userId,
                currentConceptId: conceptId
            })
            break

        case 'practice':
            // Generate a scenario
            results.scenario = await route('scenario', 'generateScenario', {
                concept: conceptId
            })

            // Generate a mini project
            results.project = await route('project', 'generateProject', {
                concepts: [conceptId]
            })
            break

        case 'complete':
            // Record success
            results.progress = await reinforcementAgent.recordExposure(userId, conceptId, true)

            // Get next recommendations
            results.next = await route('curriculum', 'getNextConcepts', {
                completedConcepts: [conceptId],
                goal: 'frontend developer'
            })

            // Update stats
            results.stats = await route('evaluator', 'getDetailedStats', { userId })
            break
    }

    return results
}

/**
 * Get all available agents and their capabilities
 */
export function getAgentCatalog() {
    return {
        curriculum: {
            description: 'Designs learning paths and skill trees',
            actions: ['generateRoadmap', 'getNextConcepts']
        },
        explainer: {
            description: 'Deep concept explanations like a senior mentor',
            actions: ['explainConcept', 'answerWhy', 'compareConcepts']
        },
        scenario: {
            description: 'Creates industry-grade problem scenarios',
            actions: ['generateScenario', 'generateBreakageScenario']
        },
        project: {
            description: 'Designs hands-on coding challenges',
            actions: ['generateProject', 'generateProgressiveChallenges']
        },
        reinforcement: {
            description: 'Manages spaced repetition and memory',
            actions: ['getReinforcementConcepts', 'getMixedPractice', 'recordExposure']
        },
        debug: {
            description: 'Senior engineer debugging assistance',
            actions: ['debugCode', 'explainProductionBug', 'compareApproaches', 'explainExecution']
        },
        evaluator: {
            description: 'Measures progress and job readiness',
            actions: ['getDetailedStats', 'calculateReadiness', 'getSkillRadar', 'identifyGaps']
        }
    }
}

export default {
    route,
    decideAgent,
    handleLearningStep,
    getAgentCatalog,
    agents
}
