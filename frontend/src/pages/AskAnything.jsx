import { useState } from 'react'

const questions = [
  {
    category: 'JavaScript Core',
    items: [
      {
        id: 'closures',
        question: 'Why do closures exist in JavaScript?',
        short: 'Closures allow functions to remember their lexical environment, enabling data privacy and stateful functions.',
        answer: `
          <h3>Why Closures Exist</h3>
          <p>Closures solve a fundamental problem: <strong>how do you give a function private state?</strong></p>
          
          <h4>Without Closures (Bad)</h4>
          <pre><code>// Global state - anyone can modify!
let count = 0;
function increment() { return ++count; }
count = 1000; // 😱 Corrupted!</code></pre>

          <h4>With Closures (Good)</h4>
          <pre><code>function createCounter() {
    let count = 0; // Private!
    return () => ++count;
}
const increment = createCounter();
// count = 1000; // Error! Can't access</code></pre>

          <h4>Industry Context</h4>
          <p>React's useState uses closures internally. Every event handler you write uses closures.</p>
        `
      },
      {
        id: 'async',
        question: 'When should I use async/await vs .then()?',
        short: 'Use async/await for sequential code, .then() for parallel operations.',
        answer: `
          <h3>Async/Await vs Promises</h3>
          
          <h4>Use async/await when:</h4>
          <ul>
            <li>You have sequential operations</li>
            <li>Code readability is priority</li>
            <li>You need try/catch error handling</li>
          </ul>

          <h4>Use .then() when:</h4>
          <ul>
            <li>You need parallel execution</li>
            <li>Working with Promise.all</li>
          </ul>

          <pre><code>// Sequential (slow)
const user = await getUser();
const posts = await getPosts();

// Parallel (fast!)
const [user, posts] = await Promise.all([
    getUser(), getPosts()
]);</code></pre>
        `
      }
    ]
  },
  {
    category: 'CSS & Layout',
    items: [
      {
        id: 'flexbox-grid',
        question: 'When should I use Flexbox vs CSS Grid?',
        short: 'Flexbox for 1D layouts (row OR column), Grid for 2D layouts (rows AND columns).',
        answer: `
          <h3>Flexbox vs Grid</h3>
          
          <h4>1 dimension → Flexbox</h4>
          <pre><code>.nav { display: flex; justify-content: space-between; }
.card-footer { display: flex; gap: 8px; }</code></pre>

          <h4>2 dimensions → Grid</h4>
          <pre><code>.dashboard { 
    display: grid;
    grid-template-columns: 250px 1fr;
}</code></pre>

          <h4>Senior Pattern</h4>
          <p>Use Grid for page layout, Flexbox for component internals.</p>
        `
      }
    ]
  }
]

function AskAnything() {
  const [search, setSearch] = useState('')
  const [selectedQuestion, setSelectedQuestion] = useState(null)

  const filteredQuestions = questions.map(cat => ({
    ...cat,
    items: cat.items.filter(q => 
      q.question.toLowerCase().includes(search.toLowerCase()) ||
      q.short.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0)

  return (
    <div className="space-y-8">
      <div className="text-center animate-fade-in-up">
        <h1 className="text-4xl font-bold mb-4">Ask Anything 💬</h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Get industry-context answers to your coding questions. 
          Not just "how" — but "why" and "where it's used."
        </p>
      </div>

      {/* Search */}
      <div className="max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
        <div className="glass rounded-xl p-4 flex items-center gap-4">
          <span className="text-xl">🔍</span>
          <input
            type="text"
            placeholder="Ask anything... e.g., 'Why do closures exist?'"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-lg"
          />
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {filteredQuestions.map((category) => (
          <div key={category.category}>
            <h3 className="text-lg font-semibold text-indigo-400 mb-4">{category.category}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {category.items.map((q) => (
                <div 
                  key={q.id}
                  className="card cursor-pointer hover:border-indigo-500"
                  onClick={() => setSelectedQuestion(q)}
                >
                  <h4 className="font-semibold mb-2">{q.question}</h4>
                  <p className="text-sm text-slate-400">{q.short}</p>
                  <button className="btn btn-secondary w-full mt-4">
                    See Full Answer →
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedQuestion && (
        <div 
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50"
          onClick={() => setSelectedQuestion(null)}
        >
          <div 
            className="bg-slate-900 rounded-2xl max-w-2xl max-h-[80vh] overflow-y-auto p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-xl font-bold">{selectedQuestion.question}</h2>
              <button 
                onClick={() => setSelectedQuestion(null)}
                className="text-slate-500 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div 
              className="prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: selectedQuestion.answer }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default AskAnything
