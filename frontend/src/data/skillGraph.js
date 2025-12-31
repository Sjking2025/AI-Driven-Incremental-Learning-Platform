// ========================================
// Skill Dependency Graph
// Defines concept prerequisites and learning order
// ========================================

// Frontend Developer skill tree
export const frontendSkillGraph = {
    // Foundation (No prerequisites)
    'design-principles': {
        id: 'design-principles',
        title: 'Design Principles',
        phase: 'foundation',
        prerequisites: [],
        unlocks: ['layout-reasoning', 'ux-thinking'],
        skills: ['visual-hierarchy', 'color-theory', 'typography'],
        estimatedHours: 2
    },
    'layout-reasoning': {
        id: 'layout-reasoning',
        title: 'Layout Reasoning',
        phase: 'foundation',
        prerequisites: ['design-principles'],
        unlocks: ['css-box-model', 'flexbox'],
        skills: ['box-model-thinking', 'responsive-mindset'],
        estimatedHours: 2
    },
    'ux-thinking': {
        id: 'ux-thinking',
        title: 'UX Thinking',
        phase: 'foundation',
        prerequisites: ['design-principles'],
        unlocks: ['user-flow', 'accessibility'],
        skills: ['user-flow-mapping', 'affordances', 'feedback-loops'],
        estimatedHours: 2
    },

    // HTML & CSS
    'html-semantic': {
        id: 'html-semantic',
        title: 'Semantic HTML',
        phase: 'html-css',
        prerequisites: ['layout-reasoning'],
        unlocks: ['css-box-model'],
        skills: ['semantic-tags', 'document-structure', 'accessibility'],
        estimatedHours: 3
    },
    'css-box-model': {
        id: 'css-box-model',
        title: 'CSS Box Model',
        phase: 'html-css',
        prerequisites: ['html-semantic', 'layout-reasoning'],
        unlocks: ['flexbox', 'css-grid'],
        skills: ['margin', 'padding', 'border', 'sizing'],
        estimatedHours: 3
    },
    'flexbox': {
        id: 'flexbox',
        title: 'Flexbox',
        phase: 'html-css',
        prerequisites: ['css-box-model'],
        unlocks: ['responsive-design'],
        skills: ['flex-direction', 'justify-content', 'align-items'],
        estimatedHours: 4
    },
    'css-grid': {
        id: 'css-grid',
        title: 'CSS Grid',
        phase: 'html-css',
        prerequisites: ['css-box-model'],
        unlocks: ['responsive-design'],
        skills: ['grid-template', 'grid-areas', 'auto-fit'],
        estimatedHours: 4
    },
    'responsive-design': {
        id: 'responsive-design',
        title: 'Responsive Design',
        phase: 'html-css',
        prerequisites: ['flexbox', 'css-grid'],
        unlocks: ['js-variables'],
        skills: ['media-queries', 'mobile-first', 'viewport'],
        estimatedHours: 4
    },

    // JavaScript Core
    'js-variables': {
        id: 'js-variables',
        title: 'Variables & Types',
        phase: 'javascript',
        prerequisites: ['responsive-design'],
        unlocks: ['js-conditions', 'js-operators'],
        skills: ['let', 'const', 'types', 'scope'],
        estimatedHours: 3,
        reinforces: [] // First JS concept
    },
    'js-operators': {
        id: 'js-operators',
        title: 'Operators',
        phase: 'javascript',
        prerequisites: ['js-variables'],
        unlocks: ['js-conditions'],
        skills: ['arithmetic', 'comparison', 'increment'],
        estimatedHours: 2,
        reinforces: ['js-variables']
    },
    'js-conditions': {
        id: 'js-conditions',
        title: 'Conditions',
        phase: 'javascript',
        prerequisites: ['js-variables', 'js-operators'],
        unlocks: ['js-loops'],
        skills: ['if-else', 'switch', 'ternary'],
        estimatedHours: 3,
        reinforces: ['js-variables', 'js-operators']
    },
    'js-loops': {
        id: 'js-loops',
        title: 'Loops',
        phase: 'javascript',
        prerequisites: ['js-conditions'],
        unlocks: ['js-functions', 'js-arrays'],
        skills: ['for', 'while', 'break', 'continue'],
        estimatedHours: 3,
        reinforces: ['js-variables', 'js-conditions']
    },
    'js-functions': {
        id: 'js-functions',
        title: 'Functions',
        phase: 'javascript',
        prerequisites: ['js-loops'],
        unlocks: ['js-closures', 'dom-basics'],
        skills: ['parameters', 'return', 'arrow-functions', 'scope'],
        estimatedHours: 4,
        reinforces: ['js-variables', 'js-conditions', 'js-loops']
    },
    'js-arrays': {
        id: 'js-arrays',
        title: 'Arrays',
        phase: 'javascript',
        prerequisites: ['js-loops'],
        unlocks: ['js-objects', 'array-methods'],
        skills: ['push', 'pop', 'slice', 'iteration'],
        estimatedHours: 4,
        reinforces: ['js-variables', 'js-loops']
    },
    'js-objects': {
        id: 'js-objects',
        title: 'Objects',
        phase: 'javascript',
        prerequisites: ['js-arrays', 'js-functions'],
        unlocks: ['dom-basics'],
        skills: ['properties', 'methods', 'destructuring'],
        estimatedHours: 4,
        reinforces: ['js-variables', 'js-functions', 'js-arrays']
    },
    'js-closures': {
        id: 'js-closures',
        title: 'Closures',
        phase: 'javascript',
        prerequisites: ['js-functions'],
        unlocks: ['async-js'],
        skills: ['lexical-scope', 'private-state', 'callbacks'],
        estimatedHours: 4,
        reinforces: ['js-variables', 'js-functions']
    },
    'dom-basics': {
        id: 'dom-basics',
        title: 'DOM Manipulation',
        phase: 'javascript',
        prerequisites: ['js-functions', 'js-objects'],
        unlocks: ['events'],
        skills: ['querySelector', 'createElement', 'innerHTML'],
        estimatedHours: 4,
        reinforces: ['js-functions', 'js-objects']
    },
    'events': {
        id: 'events',
        title: 'Events',
        phase: 'javascript',
        prerequisites: ['dom-basics'],
        unlocks: ['async-js'],
        skills: ['addEventListener', 'event-object', 'delegation'],
        estimatedHours: 4,
        reinforces: ['js-functions', 'dom-basics']
    },
    'async-js': {
        id: 'async-js',
        title: 'Async JavaScript',
        phase: 'javascript',
        prerequisites: ['js-closures', 'events'],
        unlocks: ['react-basics'],
        skills: ['promises', 'async-await', 'fetch'],
        estimatedHours: 6,
        reinforces: ['js-functions', 'js-closures', 'events']
    }
}

// Get all concepts in topological order (respecting dependencies)
export function getTopologicalOrder(graph = frontendSkillGraph) {
    const visited = new Set()
    const order = []

    function visit(nodeId) {
        if (visited.has(nodeId)) return
        visited.add(nodeId)

        const node = graph[nodeId]
        if (!node) return

        // Visit all prerequisites first
        for (const prereq of node.prerequisites) {
            visit(prereq)
        }

        order.push(nodeId)
    }

    // Visit all nodes
    for (const nodeId of Object.keys(graph)) {
        visit(nodeId)
    }

    return order
}

// Check if a concept can be unlocked
export function canUnlock(conceptId, completedConcepts, graph = frontendSkillGraph) {
    const concept = graph[conceptId]
    if (!concept) return false

    // All prerequisites must be completed
    return concept.prerequisites.every(prereq =>
        completedConcepts.includes(prereq)
    )
}

// Get next available concepts based on completed ones
export function getNextConcepts(completedConcepts, graph = frontendSkillGraph) {
    const next = []

    for (const [id, concept] of Object.entries(graph)) {
        // Skip if already completed
        if (completedConcepts.includes(id)) continue

        // Check if can unlock
        if (canUnlock(id, completedConcepts, graph)) {
            next.push(concept)
        }
    }

    return next
}

// Get concepts that should be reinforced when learning a new concept
export function getReinforcementConcepts(conceptId, graph = frontendSkillGraph) {
    const concept = graph[conceptId]
    if (!concept) return []

    return concept.reinforces || concept.prerequisites
}

// Calculate progress percentage
export function calculateProgress(completedConcepts, graph = frontendSkillGraph) {
    const total = Object.keys(graph).length
    const completed = completedConcepts.length
    return Math.round((completed / total) * 100)
}

// Get concepts grouped by phase
export function getConceptsByPhase(graph = frontendSkillGraph) {
    const phases = {}

    for (const concept of Object.values(graph)) {
        if (!phases[concept.phase]) {
            phases[concept.phase] = []
        }
        phases[concept.phase].push(concept)
    }

    return phases
}
