// ========================================
// Practice Session Component
// Saves results to PostgreSQL database
// ========================================

import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { useLearning } from '../contexts/LearningContext'
import { generateMixedPractice } from '../services/reinforcementEngine'
import { useConceptMemory } from '../stores/useConceptMemory'
import { frontendSkillGraph } from '../data/skillGraph'

function PracticeSession() {
  const { isAuthenticated } = useAuth()
  const { recordProgress: saveToDb, loadUserData } = useLearning()
  const { concepts: masteryData, recordExposure } = useConceptMemory()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)
  const [results, setResults] = useState([])
  const [sessionComplete, setSessionComplete] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Get completed concepts
  const completedConcepts = useMemo(() => 
    Object.keys(masteryData).filter(id => masteryData[id]?.exposures > 0),
    [masteryData]
  )
  
  // Generate practice problems
  const problems = useMemo(() => {
    if (completedConcepts.length === 0) {
      return [] // No concepts practiced yet
    }
    return generateMixedPractice(completedConcepts, masteryData, 5)
  }, [completedConcepts, masteryData])
  
  if (problems.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No Practice Available</h2>
        <p className="text-slate-400 mb-6">
          Complete some concepts first to unlock practice sessions.
        </p>
        <Link to="/roadmap" className="btn btn-primary">
          Start Learning →
        </Link>
      </div>
    )
  }
  
  const currentProblem = problems[currentIndex]
  const conceptTitle = frontendSkillGraph[currentProblem?.conceptId]?.title || ''
  
  const handleAnswer = async (correct) => {
    // Record locally
    recordExposure(currentProblem.conceptId, correct)
    
    // Save to database if authenticated
    if (isAuthenticated) {
      setSaving(true)
      try {
        await saveToDb(currentProblem.conceptId, correct)
        console.log(`✅ Saved to DB: ${currentProblem.conceptId} - ${correct ? 'success' : 'failure'}`)
      } catch (err) {
        console.error('Failed to save to DB:', err)
      } finally {
        setSaving(false)
      }
    }
    
    // Track results
    setResults([...results, { 
      conceptId: currentProblem.conceptId, 
      correct,
      savedToDb: isAuthenticated
    }])
    
    // Move to next or complete
    if (currentIndex < problems.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowAnswer(false)
    } else {
      setSessionComplete(true)
      // Refresh data after session
      if (isAuthenticated) {
        loadUserData()
      }
    }
  }
  
  if (sessionComplete) {
    const correctCount = results.filter(r => r.correct).length
    const savedToDB = results.filter(r => r.savedToDb).length
    
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <div className="text-6xl mb-6">
          {correctCount === problems.length ? '🎉' : correctCount >= problems.length / 2 ? '👍' : '💪'}
        </div>
        <h2 className="text-3xl font-bold mb-4">Session Complete!</h2>
        <p className="text-xl text-slate-400 mb-4">
          You got {correctCount} out of {problems.length} correct
        </p>
        
        {isAuthenticated ? (
          <p className="text-sm text-emerald-400 mb-8">
            ✅ {savedToDB} results saved to your account
          </p>
        ) : (
          <p className="text-sm text-amber-400 mb-8">
            ⚠️ Results not saved - Login to track your progress
          </p>
        )}
        
        <div className="grid grid-cols-5 gap-2 mb-8">
          {results.map((r, i) => (
            <div 
              key={i}
              className={`h-2 rounded-full ${r.correct ? 'bg-emerald-500' : 'bg-rose-500'}`}
            />
          ))}
        </div>
        
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => {
              setCurrentIndex(0)
              setResults([])
              setSessionComplete(false)
              setShowAnswer(false)
            }}
            className="btn btn-secondary"
          >
            Practice Again
          </button>
          <Link to="/dashboard" className="btn btn-primary">
            View Progress →
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">
          Question {currentIndex + 1} of {problems.length}
          {isAuthenticated && <span className="text-emerald-400 ml-2">● Saving to DB</span>}
        </span>
        <div className="flex gap-1">
          {problems.map((_, i) => (
            <div 
              key={i}
              className={`w-8 h-1 rounded-full ${
                i < currentIndex 
                  ? results[i]?.correct ? 'bg-emerald-500' : 'bg-rose-500'
                  : i === currentIndex 
                    ? 'bg-indigo-500' 
                    : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
      
      {/* Problem Card */}
      <div className="card">
        {/* Concept Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`badge ${
            currentProblem.priority === 'weak' 
              ? 'bg-amber-500/20 text-amber-400' 
              : 'badge-primary'
          }`}>
            {currentProblem.priority === 'weak' ? '⚠️ Weak Area' : '📚 Review'}
          </span>
          <span className="text-sm text-slate-400">{conceptTitle}</span>
        </div>
        
        {/* Question */}
        <h3 className="text-xl font-semibold mb-4">{currentProblem.title}</h3>
        
        {currentProblem.description && (
          <p className="text-slate-400 mb-4">{currentProblem.description}</p>
        )}
        
        {/* Code Block */}
        {currentProblem.code && (
          <pre className="bg-slate-800 p-4 rounded-lg overflow-x-auto mb-6">
            <code className="text-sm text-slate-300">{currentProblem.code}</code>
          </pre>
        )}
        
        {/* Multiple Choice */}
        {currentProblem.options && !showAnswer && (
          <div className="grid grid-cols-2 gap-3">
            {currentProblem.options.map((option, i) => (
              <button
                key={i}
                onClick={() => {
                  setShowAnswer(true)
                }}
                className="btn btn-secondary text-left"
              >
                {option}
              </button>
            ))}
          </div>
        )}
        
        {/* Show Answer Button */}
        {!currentProblem.options && !showAnswer && (
          <button 
            onClick={() => setShowAnswer(true)}
            className="btn btn-secondary w-full"
          >
            Show Answer
          </button>
        )}
        
        {/* Answer Section */}
        {showAnswer && (
          <div className="space-y-4">
            <div className="bg-emerald-900/30 border border-emerald-800 rounded-lg p-4">
              <h4 className="font-semibold text-emerald-400 mb-2">Answer</h4>
              <p>{currentProblem.answer}</p>
              {currentProblem.explanation && (
                <p className="text-sm text-slate-400 mt-2">{currentProblem.explanation}</p>
              )}
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => handleAnswer(false)}
                disabled={saving}
                className="btn btn-secondary flex-1 disabled:opacity-50"
              >
                {saving ? '...' : '❌ Got it Wrong'}
              </button>
              <button 
                onClick={() => handleAnswer(true)}
                disabled={saving}
                className="btn btn-primary flex-1 disabled:opacity-50"
              >
                {saving ? '...' : '✅ Got it Right'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PracticeSession
