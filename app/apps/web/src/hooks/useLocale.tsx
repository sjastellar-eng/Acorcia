'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { type Locale, DEFAULT_LOCALE, translations } from '../lib/i18n/translations'

const STORAGE_KEY = 'soc_locale'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: typeof translations[Locale]
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: translations.en,
})

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null
    if (stored && stored in translations) {
      setLocaleState(stored)
    }
  }, [])

  const setLocale = (next: Locale) => {
    setLocaleState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  return useContext(LocaleContext)
}
