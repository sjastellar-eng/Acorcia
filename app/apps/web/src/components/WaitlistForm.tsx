'use client'

import { useState, FormEvent } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001'

interface WaitlistFormProps {
  locale?: 'en' | 'uk' | 'ru'
  source?: string
  className?: string
}

const copy = {
  en: {
    heading: 'Join the waitlist',
    sub: 'Be first to know when we launch. No spam, ever.',
    namePlaceholder: 'Your name (optional)',
    emailPlaceholder: 'your@email.com',
    cta: 'Get early access',
    loading: 'Joining…',
    success: "You're on the list! We'll be in touch.",
    alreadyOn: "You're already on the list.",
    error: 'Something went wrong. Please try again.',
  },
  uk: {
    heading: 'Приєднайтесь до черги',
    sub: 'Дізнайтеся першими про запуск. Без спаму.',
    namePlaceholder: "Ваше ім'я (необов'язково)",
    emailPlaceholder: 'your@email.com',
    cta: 'Отримати ранній доступ',
    loading: 'Реєстрація…',
    success: 'Ви в списку! Ми напишемо вам.',
    alreadyOn: 'Ви вже в списку.',
    error: 'Щось пішло не так. Спробуйте ще раз.',
  },
  ru: {
    heading: 'Присоединиться к очереди',
    sub: 'Узнайте первыми о запуске. Без спама.',
    namePlaceholder: 'Ваше имя (необязательно)',
    emailPlaceholder: 'your@email.com',
    cta: 'Получить ранний доступ',
    loading: 'Регистрация…',
    success: 'Вы в списке! Мы напишем вам.',
    alreadyOn: 'Вы уже в списке.',
    error: 'Что-то пошло не так. Попробуйте ещё раз.',
  },
}

export function WaitlistForm({ locale = 'en', source = 'landing', className = '' }: WaitlistFormProps) {
  const t = copy[locale]
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
          {status === 'success' ? t.success : t.alreadyOn}
        </p>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl bg-white border border-slate-200 shadow-sm px-6 py-6 ${className}`}>
      <h3 className="text-lg font-bold text-slate-900 mb-1">{t.heading}</h3>
      <p className="text-sm text-slate-500 mb-4">{t.sub}</p>

      {status === 'error' && (
        <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-2 mb-3 text-sm text-red-700">
          {t.error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          placeholder={t.namePlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
        <Input
          type="email"
          placeholder={t.emailPlaceholder}
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
          {status === 'loading' ? t.loading : t.cta}
        </Button>
      </form>
    </div>
  )
}
