'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../../hooks/useAuth'
import { sessions } from '../../../../lib/api'
import { Button } from '../../../../components/ui/button'

export default function NewSessionPage() {
  const { getToken } = useAuth()
  const router = useRouter()
  const [type, setType] = useState<'open_discovery' | 'focused'>('open_discovery')
  const [focusQuestion, setFocusQuestion] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleStart = async () => {
    setIsLoading(true)
    try {
      const token = await getToken()
      if (!token) return router.push('/login')

      const { session } = await sessions.create(token, {
        type,
        focusQuestion: type === 'focused' ? focusQuestion : undefined,
      })

      router.push(`/session/${session.id}`)
    } catch (err: any) {
      if (err.code === 'SESSION_LIMIT') {
        router.push('/settings?upgrade=true')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cobalt-600 to-violet-600 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
              <path d="M2 12h20" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Start a Discovery Session</h1>
          <p className="text-slate-500 mt-2">
            A 25–35 minute conversation to uncover what you truly want to build.
          </p>
        </div>

        {/* Session type */}
        <div className="space-y-3 mb-8">
          <button
            onClick={() => setType('open_discovery')}
            className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${
              type === 'open_discovery'
                ? 'border-cobalt-600 bg-cobalt-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                type === 'open_discovery'
                  ? 'border-cobalt-600 bg-cobalt-600'
                  : 'border-slate-300'
              }`}>
                {type === 'open_discovery' && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold text-slate-900">Open Discovery</div>
                <div className="text-sm text-slate-500 mt-1">
                  For when you're not sure what to work on. We'll explore freely and let your project emerge.
                </div>
              </div>
            </div>
          </button>

          <button
            onClick={() => setType('focused')}
            className={`w-full text-left rounded-2xl border-2 p-5 transition-all ${
              type === 'focused'
                ? 'border-cobalt-600 bg-cobalt-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-5 h-5 rounded-full border-2 mt-0.5 flex-shrink-0 ${
                type === 'focused'
                  ? 'border-cobalt-600 bg-cobalt-600'
                  : 'border-slate-300'
              }`}>
                {type === 'focused' && (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white" />
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold text-slate-900">Focused Session</div>
                <div className="text-sm text-slate-500 mt-1">
                  You have a specific question or decision you need to work through.
                </div>
              </div>
            </div>
          </button>

          {type === 'focused' && (
            <div className="pl-8">
              <textarea
                value={focusQuestion}
                onChange={(e) => setFocusQuestion(e.target.value)}
                placeholder="What specific question do you want to explore? e.g. 'Should I build for B2C or B2B?'"
                rows={3}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm focus:outline-none focus:border-cobalt-600 focus:ring-2 focus:ring-cobalt-600/20 resize-none"
              />
            </div>
          )}
        </div>

        {/* CTA */}
        <Button
          variant="gradient"
          size="xl"
          className="w-full"
          onClick={handleStart}
          isLoading={isLoading}
          disabled={type === 'focused' && !focusQuestion.trim()}
        >
          Begin Session →
        </Button>

        <p className="text-center text-xs text-slate-400 mt-4">
          Sessions are private. Your responses are never shared.
        </p>
      </div>
    </div>
  )
}
