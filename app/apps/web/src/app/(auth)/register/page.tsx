'use client'

import { useState, FormEvent } from 'react'
import Link from 'next/link'
import { useAuthProvider, AuthContext } from '../../../hooks/useAuth'
import { useLocale } from '../../../hooks/useLocale'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { ApiError } from '../../../lib/api'
import { LanguageSwitcher } from '../../../components/LanguageSwitcher'
import { AcorciaLogo } from '../../../components/AcorciaLogo'

function RegisterForm() {
  const { register } = useAuthProvider()
  const { t } = useLocale()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError(t.auth.passwordTooShort)
      return
    }
    setIsLoading(true)
    try {
      await register(email, password, name || undefined)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : t.auth.errorShort)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo + lang switcher */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/"><AcorciaLogo size={28} dark={false} /></Link>
          <LanguageSwitcher />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{t.auth.registerTitle}</h1>
          <p className="text-slate-500 mb-6 text-sm">{t.auth.registerSub}</p>

          {error && (
            <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3 mb-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t.auth.yourName}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Alex"
            />
            <Input
              label={t.auth.email}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <Input
              label={t.auth.password}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.auth.minPassword}
              required
              hint={t.auth.passwordHint}
            />
            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full"
              isLoading={isLoading}
            >
              {t.auth.createAccount}
            </Button>
          </form>

          <p className="text-xs text-slate-400 mt-4 text-center">
            {t.auth.bySigningUp}{' '}
            <Link href="/terms" className="underline">{t.auth.terms}</Link>{' '}
            {t.auth.and}{' '}
            <Link href="/privacy" className="underline">{t.auth.privacy}</Link>
          </p>
        </div>

        <p className="text-center mt-6 text-sm text-slate-500">
          {t.auth.alreadyAccount}{' '}
          <Link href="/login" className="text-cobalt-600 font-medium hover:underline">
            {t.auth.signInLink}
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
