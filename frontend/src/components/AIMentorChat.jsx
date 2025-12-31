// ========================================
// AI Mentor Chat Component
// Interactive chat with AI explanations
// ========================================

import { useState, useRef, useEffect } from 'react'
import { askMentor } from '../services/aiMentor'
import ReactMarkdown from 'react-markdown'

const suggestedQuestions = [
  "Why do closures exist in JavaScript?",
  "When should I use async/await vs .then()?",
  "Why does 'this' behave differently in arrow functions?",
  "What's the difference between == and ===?",
  "Why do we need useEffect in React?"
]

function AIMentorChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `👋 Hi! I'm your AI mentor. I explain programming concepts like a senior developer would.

Ask me anything about:
- **Why** something works (not just how)
- **Where** concepts are used in production
- **What** mistakes to avoid

Try asking: "Why do closures exist?"`,
      timestamp: new Date().toISOString()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async (question = input) => {
    if (!question.trim() || isLoading) return

    const userMessage = {
      role: 'user',
      content: question,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await askMentor(question)
      
      const assistantMessage = {
        role: 'assistant',
        content: response.answer,
        timestamp: response.timestamp,
        error: !response.success
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        error: true
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex flex-col h-[600px] max-h-[80vh]">
      {/* Chat Header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-800">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          🧠
        </div>
        <div>
          <h3 className="font-semibold">AI Mentor</h3>
          <span className="text-xs text-slate-400">Powered by Gemini</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-slate-400">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div 
            key={i}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[80%] rounded-2xl p-4 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-sm' 
                  : 'bg-slate-800 text-slate-100 rounded-bl-sm'
              } ${msg.error ? 'border border-rose-500/50' : ''}`}
            >
              {msg.role === 'assistant' ? (
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      code: ({ inline, children }) => 
                        inline ? (
                          <code className="bg-slate-700 px-1 rounded">{children}</code>
                        ) : (
                          <pre className="bg-slate-900 p-3 rounded-lg overflow-x-auto">
                            <code>{children}</code>
                          </pre>
                        )
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p>{msg.content}</p>
              )}
              <span className="text-xs opacity-50 mt-2 block">
                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}
              </span>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-800 rounded-2xl rounded-bl-sm p-4">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-slate-500 mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 3).map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="text-xs px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-full text-slate-300 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about programming..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 resize-none focus:outline-none focus:border-indigo-500 transition-colors"
            rows={1}
            disabled={isLoading}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isLoading}
            className="btn btn-primary px-6 disabled:opacity-50"
          >
            {isLoading ? '...' : '→'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AIMentorChat
