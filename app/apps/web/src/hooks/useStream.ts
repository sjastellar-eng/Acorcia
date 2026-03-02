'use client'

import { useState, useCallback, useRef } from 'react'
import type { StreamEvent, SessionPhase, ProjectDraft } from '@soc/types'

interface UseStreamReturn {
  isStreaming: boolean
  streamMessage: (
    url: string,
    token: string,
    content: string,
    onToken: (token: string) => void,
    onPhaseChange: (phase: SessionPhase) => void,
    onComplete: (summary: string, project: ProjectDraft) => void,
    onDone: () => void
  ) => Promise<void>
  abort: () => void
}

export function useStream(): UseStreamReturn {
  const [isStreaming, setIsStreaming] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const abort = useCallback(() => {
    abortRef.current?.abort()
    setIsStreaming(false)
  }, [])

  const streamMessage = useCallback(
    async (
      url: string,
      token: string,
      content: string,
      onToken: (t: string) => void,
      onPhaseChange: (phase: SessionPhase) => void,
      onComplete: (summary: string, project: ProjectDraft) => void,
      onDone: () => void
    ) => {
      abortRef.current = new AbortController()
      setIsStreaming(true)

      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content }),
          signal: abortRef.current.signal,
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const reader = res.body?.getReader()
        if (!reader) throw new Error('No response body')

        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() ?? ''

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue
            const json = line.slice(6).trim()
            if (!json) continue

            try {
              const event = JSON.parse(json) as StreamEvent

              switch (event.type) {
                case 'token':
                  onToken(event.content)
                  break
                case 'phase_change':
                  onPhaseChange(event.phase)
                  break
                case 'session_complete':
                  onComplete(event.summary, event.projectDraft)
                  break
                case 'done':
                  onDone()
                  break
                case 'error':
                  console.error('[Stream error]', event.message)
                  break
              }
            } catch {}
          }
        }
      } finally {
        setIsStreaming(false)
      }
    },
    []
  )

  return { isStreaming, streamMessage, abort }
}
