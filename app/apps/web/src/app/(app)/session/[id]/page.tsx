'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '../../../../hooks/useAuth'
import { useStream } from '../../../../hooks/useStream'
import { sessions as sessionsApi } from '../../../../lib/api'
import { ChatBubble, TypingIndicator } from '../../../../components/chat/ChatBubble'
import { ChatInput } from '../../../../components/chat/ChatInput'
import { Badge } from '../../../../components/ui/badge'
import type { SessionPhase, ProjectDraft } from '@soc/types'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

const PHASE_LABELS: Record<SessionPhase, string> = {
  context: 'Context',
  values: 'Values',
  desires: 'Desires',
  constraints: 'Constraints',
  synthesis: 'Synthesis',
  complete: 'Complete',
}

const PHASES: SessionPhase[] = ['context', 'values', 'desires', 'constraints', 'synthesis']

export default function SessionPage() {
  const { id } = useParams<{ id: string }>()
  const { getToken } = useAuth()
  const router = useRouter()
  const { isStreaming, streamMessage } = useStream()

  const [messages, setMessages] = useState<Message[]>([])
  const [currentPhase, setCurrentPhase] = useState<SessionPhase>('context')
  const [isLoading, setIsLoading] = useState(true)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [projectDraft, setProjectDraft] = useState<ProjectDraft | null>(null)
  const [elapsed, setElapsed] = useState(0)

  const bottomRef = useRef<HTMLDivElement>(null)
  const startTimeRef = useRef(Date.now())

  // Load existing session
  useEffect(() => {
    const load = async () => {
      const token = await getToken()
      if (!token) return router.push('/login')

      try {
        const { session } = await sessionsApi.get(token, id)
        setCurrentPhase(session.currentPhase)

        if (session.messages?.length > 0) {
          setMessages(
            session.messages.map((m: any) => ({
              id: m.id,
              role: m.role,
              content: m.content,
            }))
          )
        } else {
          // Fresh session — show greeting
          setMessages([
            {
              id: 'welcome',
              role: 'assistant',
              content:
                "Welcome. I'm your Source Constructor companion. I'm here to help you discover what you truly want to build — not what sounds good, but what genuinely excites you.\n\nThis session will take about 25–35 minutes. There are no right or wrong answers. Ready to start?\n\nLet's begin: What's been on your mind lately that you keep coming back to?",
            },
          ])
        }

        if (session.status === 'completed') {
          setSessionComplete(true)
        }
      } finally {
        setIsLoading(false)
      }
    }

    load()
  }, [id, getToken, router])

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  const handleSend = async (content: string) => {
    const token = await getToken()
    if (!token || isStreaming) return

    // Add user message
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content }
    setMessages((prev) => [...prev, userMsg])

    // Add streaming AI placeholder
    const aiId = `ai-${Date.now()}`
    setMessages((prev) => [
      ...prev,
      { id: aiId, role: 'assistant', content: '', isStreaming: true },
    ])

    const url = `${process.env.NEXT_PUBLIC_API_URL}/api/sessions/${id}/message`
    let aiContent = ''

    await streamMessage(
      url,
      token,
      content,
      (token) => {
        aiContent += token
        setMessages((prev) =>
          prev.map((m) => (m.id === aiId ? { ...m, content: aiContent } : m))
        )
      },
      (phase) => {
        setCurrentPhase(phase)
      },
      (summary, draft) => {
        setProjectDraft(draft)
      },
      () => {
        setMessages((prev) =>
          prev.map((m) => (m.id === aiId ? { ...m, isStreaming: false } : m))
        )

        if (projectDraft || sessionComplete) {
          setSessionComplete(true)
        }
      }
    )
  }

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-slate-400 text-sm">Loading session…</div>
      </div>
    )
  }

  if (sessionComplete && projectDraft) {
    return <SessionComplete projectDraft={projectDraft} sessionId={id} />
  }

  const currentPhaseIdx = PHASES.indexOf(currentPhase)

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto">
      {/* Session header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-white">
        <div>
          <h1 className="font-semibold text-slate-900 text-sm">Discovery Session</h1>
          <p className="text-xs text-slate-400">{formatTime(elapsed)}</p>
        </div>
        <div className="flex gap-1">
          {PHASES.map((phase, idx) => (
            <div
              key={phase}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all ${
                idx < currentPhaseIdx
                  ? 'bg-emerald-50 text-emerald-600'
                  : idx === currentPhaseIdx
                  ? 'bg-cobalt-600 text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              {idx < currentPhaseIdx && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
              {PHASE_LABELS[phase]}
            </div>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            isStreaming={msg.isStreaming}
          />
        ))}
        {isStreaming && messages[messages.length - 1]?.role === 'user' && (
          <TypingIndicator />
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSend}
        disabled={isStreaming || sessionComplete}
        placeholder="Share your thoughts… (⌘Enter to send)"
      />
    </div>
  )
}

// ── SESSION COMPLETE ──────────────────────────────────────────

function SessionComplete({
  projectDraft,
  sessionId,
}: {
  projectDraft: ProjectDraft
  sessionId: string
}) {
  const { getToken } = useAuth()
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const { projects } = require('../../../../lib/api')

  const handleCreateProject = async () => {
    setIsCreating(true)
    try {
      const token = await getToken()
      if (!token) return

      const { project } = await projects.create(token, {
        sessionId,
        projectDraft,
      })

      router.push(`/project/${project.id}`)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 animate-slide-up">
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cobalt-600 to-violet-600 flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Your project is ready.</h1>
        <p className="text-slate-500 mt-2">Here's what we discovered about what you truly want to build.</p>
      </div>

      {/* Project preview */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">{projectDraft.name}</h2>
        <p className="text-slate-500 mb-4">{projectDraft.tagline}</p>
        <p className="text-slate-700 text-sm leading-relaxed mb-4">{projectDraft.description}</p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs text-slate-400 mb-1">Timeline</div>
            <div className="font-semibold text-slate-900">{projectDraft.timelineWeeks} weeks</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-xs text-slate-400 mb-1">Time commitment</div>
            <div className="font-semibold text-slate-900">{projectDraft.timeCommitmentWeekly} hrs/week</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Key insights</div>
          {projectDraft.coreInsights.slice(0, 3).map((insight, i) => (
            <div key={i} className="flex gap-3 bg-cobalt-50 rounded-xl px-4 py-3">
              <div className="w-1 h-full min-h-4 rounded-full bg-cobalt-400 flex-shrink-0" />
              <p className="text-sm text-slate-700 italic">{insight.content}</p>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleCreateProject}
        disabled={isCreating}
        className="w-full h-14 rounded-xl bg-gradient-to-r from-cobalt-600 to-violet-600 text-white font-semibold text-lg transition-all hover:opacity-90 hover:-translate-y-0.5 disabled:opacity-50"
      >
        {isCreating ? 'Creating your project…' : 'Create Project & Start Building →'}
      </button>
    </div>
  )
}
