'use client'

import { useState, FormEvent } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useLocale } from '../hooks/useLocale'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

interface WaitlistFormProps {
  source?: string
  className?: string
}

export function WaitlistForm({ source = 'landing', className = '' }: WaitlistFormProps) {
  const { locale, t } = useLocale()
  const wt = t.waitlist
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'already' | 'error'>('idle')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const res = await fetch(`${API_BASE}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || undefined, source, locale }),
      })
      const json = await res.json()

      if (!res.ok) {
        setStatus('error')
        return
      }

      setStatus(json.message === 'already_registered' ? 'already' : 'success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success' || status === 'already') {
    return (
      <div className={`rounded-2xl bg-emerald-50 border border-emerald-200 px-6 py-5 text-center ${className}`}>
        <div className="text-2xl mb-2">🎉</div>
        <p className="text-emerald-800 font-medium text-sm">
          {status === 'success' ? wt.success : wt.alreadyOn}
        </p>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl bg-white border border-slate-200 shadow-sm px-6 py-6 ${className}`}>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{wt.heading}</h3>
      <p className="text-sm text-slate-500 mb-4">{wt.sub}</p>

      {status === 'error' && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-2 mb-3 text-sm text-red-700">
          {wt.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder={wt.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
        <Input
          type="email"
          placeholder={wt.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />
        <Button
          type="submit"
          variant="gradient"
          size="lg"
          className="w-full"
          isLoading={status === 'loading'}
        >
          {status === 'loading' ? wt.loading : wt.cta}
        </Button>
      </form>
    </div>
  )
}
