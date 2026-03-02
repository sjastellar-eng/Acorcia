'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AuthContext, useAuthProvider } from '../../hooks/useAuth'
import { Sidebar } from '../../components/layout/Sidebar'

function AppShell({ children }: { children: React.ReactNode }) {
  const auth = useAuthProvider()
  const router = useRouter()

  useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      router.replace('/login')
    }
  }, [auth.isLoading, auth.user, router])

  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading…
        </div>
      </div>
    )
  }

  if (!auth.user) return null

  return (
    <AuthContext.Provider value={auth}>
      <div className="flex h-screen overflow-hidden bg-slate-50">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AuthContext.Provider>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
