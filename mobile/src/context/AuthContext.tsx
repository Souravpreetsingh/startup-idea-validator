import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import api from '../services/api'

interface User {
  _id: string
  fullName: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  loading: boolean
  signup: (data: { fullName: string; email: string; password: string }) => Promise<void>
  login: (data: { email: string; password: string }) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      const storedToken = await AsyncStorage.getItem('token')
      const storedUser = await AsyncStorage.getItem('user')
      if (storedToken && storedUser) {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
      setLoading(false)
    })()
  }, [])

  const signup = useCallback(async (data: { fullName: string; email: string; password: string }) => {
    const res = await api.post('/auth/signup', data)
    const { user: userData, token: newToken } = res.data
    await AsyncStorage.setItem('token', newToken)
    await AsyncStorage.setItem('user', JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
  }, [])

  const login = useCallback(async (data: { email: string; password: string }) => {
    const res = await api.post('/auth/login', data)
    const { user: userData, token: newToken } = res.data
    await AsyncStorage.setItem('token', newToken)
    await AsyncStorage.setItem('user', JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
  }, [])

  const logout = useCallback(async () => {
    await AsyncStorage.multiRemove(['token', 'user'])
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
