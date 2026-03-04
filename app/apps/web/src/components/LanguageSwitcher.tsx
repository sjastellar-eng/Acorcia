'use client'

import { useState, useRef, useEffect } from 'react'
import { LOCALES, LOCALE_LABELS, type Locale } from '../lib/i18n/translations'
import { useLocale } from '../hooks/useLocale'
import { cn } from '../lib/utils'

interface LanguageSwitcherProps {
  variant?: 'sidebar' | 'inline'
}

export function LanguageSwitcher({ variant = 'inline' }: LanguageSwitcherProps) {
  const { locale, setLocale } = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const FLAG: Record<Locale, string> = { uk: '🇺🇦', en: '🇬🇧', ru: '🇷🇺' }
  const SHORT: Record<Locale, string> = { uk: 'УКР', en: 'ENG', ru: 'РУС' }

  if (variant === 'sidebar') {
    return (
      <div ref={ref} className="relative">
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors text-sm"
        >
          <span className="text-base">{FLAG[locale]}</span>
          <span className="font-medium">{LOCALE_LABELS[locale]}</span>
          <svg
            className={cn('ml-auto w-4 h-4 transition-transform', open && 'rotate-180')}
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>

        {open && (
          <div className="absolute bottom-full left-0 mb-1 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
            {LOCALES.map((loc) => (
              <button
                key={loc}
                onClick={() => { setLocale(loc); setOpen(false) }}
                className={cn(
                  'flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors',
                  loc === locale
                    ? 'bg-cobalt-600 text-white'
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                )}
              >
                <span className="text-base">{FLAG[loc]}</span>
                {LOCALE_LABELS[loc]}
              </button>
            ))}
          </div>
        )}
      </div>
    )
  }

  // inline variant — for settings page
  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
      >
        <span className="text-base">{FLAG[locale]}</span>
        {LOCALE_LABELS[locale]}
        <svg
          className={cn('w-4 h-4 text-slate-400 transition-transform', open && 'rotate-180')}
          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50">
          {LOCALES.map((loc) => (
            <button
              key={loc}
              onClick={() => { setLocale(loc); setOpen(false) }}
              className={cn(
                'flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors',
                loc === locale
                  ? 'bg-cobalt-50 text-cobalt-700 font-medium'
                  : 'text-slate-700 hover:bg-slate-50'
              )}
            >
              <span className="text-base">{FLAG[loc]}</span>
              {LOCALE_LABELS[loc]}
              {loc === locale && (
                <svg className="ml-auto w-4 h-4 text-cobalt-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
