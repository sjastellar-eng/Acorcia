'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useAuthProvider, AuthContext } from '../../../hooks/useAuth'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { ApiError } from '../../../lib/api'

function RegisterForm() {
  const { register } = useAuthProvider()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setIsLoading(true)
    try {
      await register(email, password, name || undefined)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cobalt-600 to-violet-600 flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
            <span className="text-xl font-bold text-slate-900">Source Constructor</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Start for free</h1>
          <p className="text-slate-500 mb-6 text-sm">
            No credit card required · 7-day trial on Pro
          </p>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Your name (optional)"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex"
            />
            <Input
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              required
              hint="At least 8 characters"
            />
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              Create Account & Start Discovery →
            </Button>
          </form>

          <p className="text-xs text-slate-400 mt-4 text-center">
            By signing up you agree to our{' '}
            <Link href="/terms" className="underline">Terms</Link> and{' '}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>

        <p className="text-center mt-6 text-sm text-slate-500">
          Already have an account?{' '}
          <Link href="/login" className="text-cobalt-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  const auth = useAuthProvider()
  return (
    <AuthContext.Provider value={auth}>
      <RegisterForm />
    </AuthContext.Provider>
  )
}
