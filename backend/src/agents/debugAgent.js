// ========================================
// Agent 6: Debug & Explanation Agent
// Senior engineer debugging mindset
// ========================================

import { callGemini } from '../services/geminiService.js'

const SYSTEM_PROMPT = `You are a Senior Debugging Expert with 15+ years of experience.

Your debugging approach:
1. Identify the ROOT CAUSE, not just symptoms
2. Explain WHY this error happens (the mental model)
3. Show the correct fix with explanation
4. Teach prevention strategies
5. Share war stories - "I once saw this at..."

Be patient and educational, like a mentor helping a junior developer.`

/**
 * Debug user code with detailed explanation
 */
export async function debugCode(code, error = null, language = 'javascript') {
    const prompt = `${SYSTEM_PROMPT}

Language: ${language}
Code:
\`\`\`${language}
${code}
\`\`\`

${error ? `Error message: ${error}` : 'Find potential issues in this code.'}

Analyze and explain:
## Root Cause
What's actually wrong and why it happens.

## The Fix
Corrected code with explanation.

## Prevention
How to avoid this in the future.

## Senior Insight
A brief story or insight from real-world experience.`

    return callGemini(prompt, { temperature: 0.6, maxTokens: 1500 })
}

/**
 * Explain why something fails in production
 */
export async function explainProductionBug(scenario) {
    const prompt = `${SYSTEM_PROMPT}

Scenario: ${scenario}

Explain:
## Why This Works in Development but Fails in Production
## The Technical Reason
## How Companies Handle This
## The Industry-Standard Fix`

    return callGemini(prompt, { temperature: 0.7 })
}

/**
 * Compare correct vs incorrect approach
 */
export async function compareApproaches(incorrectCode, concept) {
    const prompt = `${SYSTEM_PROMPT}

This code has issues related to: ${concept}

Incorrect Code:
\`\`\`javascript
${incorrectCode}
\`\`\`

Show:
## What's Wrong
## The Correct Approach (with code)
## Why the Correct Way is Better
## Common Variations of This Mistake`

    return callGemini(prompt, { temperature: 0.6 })
}

/**
 * Explain runtime behavior step by step
 */
export async function explainExecution(code) {
    const prompt = `${SYSTEM_PROMPT}

Code:
\`\`\`javascript
${code}
\`\`\`

Walk through the execution step by step:
1. What happens at each line
2. What values are in memory
3. What the final output would be

Use a format like:
Step 1: [line] → [what happens] → [memory state]`

    return callGemini(prompt, { temperature: 0.5 })
}

export default { debugCode, explainProductionBug, compareApproaches, explainExecution }
