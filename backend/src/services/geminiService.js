// ========================================
// Gemini AI Service
// Wrapper for Google Gemini API
// ========================================

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent'

/**
 * Call Gemini API with a prompt
 * @param {string} prompt - The prompt to send
 * @param {object} options - Generation options
 * @returns {Promise<string>} - The response text
 */
export async function callGemini(prompt, options = {}) {
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY not configured')
    }

    const {
        temperature = 0.7,
        maxTokens = 1024
    } = options

    try {
        const response = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature,
                    maxOutputTokens: maxTokens
                }
            })
        })

        if (!response.ok) {
            const error = await response.text()
            throw new Error(`Gemini API error: ${response.status} - ${error}`)
        }

        const data = await response.json()
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text

        if (!text) {
            throw new Error('No response from Gemini')
        }

        return text
    } catch (error) {
        console.error('Gemini Service Error:', error.message)
        throw error
    }
}

/**
 * Call Gemini with a structured agent prompt
 * @param {string} agentRole - The agent's role description
 * @param {string} task - The specific task
 * @param {object} context - Additional context
 */
export async function callAgent(agentRole, task, context = {}) {
    const prompt = `
You are ${agentRole}.

Context:
${JSON.stringify(context, null, 2)}

Task:
${task}

Respond with well-structured, actionable output.
`
    return callGemini(prompt)
}

export default { callGemini, callAgent }
