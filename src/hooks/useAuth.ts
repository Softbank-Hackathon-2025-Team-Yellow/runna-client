import { useState, useCallback } from 'react'
import { api } from '@/api/services'
import type { UserLogin, UserCreate, User } from '@/api/types'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const login = useCallback(async (credentials: UserLogin) => {
    try {
      setLoading(true)
      setError(null)
      
      const tokenData = await api.users.login(credentials)
      localStorage.setItem('token', tokenData.access_token)
      
      // Fetch current user after login
      const userData = await api.users.getCurrentUser()
      setUser(userData)
      
      return userData
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Login failed')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async (userData: UserCreate) => {
    try {
      setLoading(true)
      setError(null)
      
      const newUser = await api.users.register(userData)
      
      // Auto-login after registration
      await login({ username: userData.username, password: userData.password })
      
      return newUser
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Registration failed')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [login])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  const getCurrentUser = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const userData = await api.users.getCurrentUser()
      setUser(userData)
      
      return userData
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch user')
      setError(error)
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  return { user, loading, error, login, register, logout, getCurrentUser }
}
