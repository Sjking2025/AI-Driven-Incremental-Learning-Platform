// ========================================
// Auth Context
// Global authentication state
// ========================================

import { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem('learnpath_token')
    if (token) {
      authAPI.getMe()
        .then(data => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('learnpath_token')
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    setError(null)
    try {
      const data = await authAPI.login(email, password)
      setUser(data.user)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const register = async (email, password, name) => {
    setError(null)
    try {
      const data = await authAPI.register(email, password, name)
      setUser(data.user)
      return data
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const logout = () => {
    authAPI.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default AuthContext
