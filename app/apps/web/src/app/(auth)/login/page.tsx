'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useAuthProvider, AuthContext } from '../../../hooks/useAuth'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { ApiError } from '../../../lib/api'

function LoginForm() {
  const { login } = useAuthProvider()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Something went wrong. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cobalt-600 to-violet-600 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="text-xl font-bold text-slate-900">Source Constructor</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-slate-500 mb-6 text-sm">Sign in to continue your journey</p>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-slate-500">
          Don't have an account?{' '}
          <Link href="/register" className="text-cobalt-600 font-medium hover:underline">
            Start free
          </Link>
        </p>
      </div>
    </div>
  )
}

// Wrap with auth provider
export default function LoginPage() {
  const auth = useAuthProvider()
  return (
    <AuthContext.Provider value={auth}>
      <LoginForm />
    </AuthContext.Provider>
  )
}
