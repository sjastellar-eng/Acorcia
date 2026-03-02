'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@soc/types'
import { auth as authApi, ApiError } from '../lib/api'

interface AuthState {
  user: User | null
  accessToken: string | null
  isLoading: boolean
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, name?: string) => Promise<void>
  logout: () => Promise<void>
  getToken: () => Promise<string | null>
}

// Store tokens in memory (access) and localStorage (refresh)
let _accessToken: string | null = null

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  accessToken: null,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  getToken: async () => null,
})

export function useAuth() {
  return useContext(AuthContext)
}

export function useAuthProvider(): AuthContextValue {
  const router = useRouter()
  const [state, setState] = useState<AuthState>({
    user: null,
    accessToken: null,
    isLoading: true,
  })

  // Restore session on mount
  useEffect(() => {
    const restore = async () => {
      const refreshToken = localStorage.getItem('soc_refresh_token')
      if (!refreshToken) {
        setState((s) => ({ ...s, isLoading: false }))
        return
      }

      try {
        const { tokens } = await authApi.refresh(refreshToken)
        _accessToken = tokens.accessToken
        localStorage.setItem('soc_refresh_token', tokens.refreshToken)

        const { user } = await authApi.me(tokens.accessToken)
        setState({ user, accessToken: tokens.accessToken, isLoading: false })
      } catch {
        localStorage.removeItem('soc_refresh_token')
        setState({ user: null, accessToken: null, isLoading: false })
      }
    }

    restore()
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { user, tokens } = await authApi.login(email, password)
    _accessToken = tokens.accessToken
    localStorage.setItem('soc_refresh_token', tokens.refreshToken)
    setState({ user, accessToken: tokens.accessToken, isLoading: false })
    router.push('/dashboard')
  }, [router])

  const register = useCallback(async (email: string, password: string, name?: string) => {
    const { user, tokens } = await authApi.register(email, password, name)
    _accessToken = tokens.accessToken
    localStorage.setItem('soc_refresh_token', tokens.refreshToken)
    setState({ user, accessToken: tokens.accessToken, isLoading: false })
    router.push('/session/new')
  }, [router])

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem('soc_refresh_token')
    if (refreshToken) {
      try { await authApi.logout(refreshToken) } catch {}
    }
    _accessToken = null
    localStorage.removeItem('soc_refresh_token')
    setState({ user: null, accessToken: null, isLoading: false })
    router.push('/')
  }, [router])

  // Auto-refresh access token when needed
  const getToken = useCallback(async (): Promise<string | null> => {
    if (_accessToken) return _accessToken

    const refreshToken = localStorage.getItem('soc_refresh_token')
    if (!refreshToken) return null

    try {
      const { tokens } = await authApi.refresh(refreshToken)
      _accessToken = tokens.accessToken
      localStorage.setItem('soc_refresh_token', tokens.refreshToken)
      return tokens.accessToken
    } catch {
      localStorage.removeItem('soc_refresh_token')
      setState({ user: null, accessToken: null, isLoading: false })
      return null
    }
  }, [])

  return { ...state, login, register, logout, getToken }
}
