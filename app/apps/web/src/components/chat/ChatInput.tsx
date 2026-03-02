'use client'

import { useState, useRef, KeyboardEvent } from 'react'
import { cn } from '../../lib/utils'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
  placeholder?: string
}

const QUICK_RESPONSES = [
  "I'm not sure",
  'Tell me more',
  'Can we go back?',
  "I don't know",
]

export function ChatInput({ onSend, disabled, placeholder }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className="border-t border-slate-100 p-4 bg-white">
      {/* Quick responses */}
      <div className="flex gap-2 mb-3 flex-wrap">
        {QUICK_RESPONSES.map((r) => (
          <button
            key={r}
            onClick={() => onSend(r)}
            disabled={disabled}
            className="text-xs text-slate-500 border border-slate-200 rounded-full px-3 py-1 hover:border-cobalt-600 hover:text-cobalt-600 transition-colors disabled:opacity-40"
          >
            {r}
          </button>
        ))}
      </div>

      {/* Input row */}
      <div className="flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          disabled={disabled}
          placeholder={placeholder ?? 'Type your response… (⌘Enter to send)'}
          rows={1}
          className={cn(
            'flex-1 resize-none rounded-xl border border-slate-200 px-4 py-2.5 text-sm',
            'placeholder:text-slate-400 text-slate-900',
            'focus:outline-none focus:border-cobalt-600 focus:ring-2 focus:ring-cobalt-600/20',
            'transition-all disabled:opacity-50 disabled:cursor-not-allowed',
            'max-h-40 overflow-y-auto'
          )}
        />
        <button
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0',
            'bg-cobalt-600 text-white transition-all',
            'hover:bg-cobalt-700 hover:-translate-y-px',
            'disabled:opacity-40 disabled:translate-y-0 disabled:cursor-not-allowed'
          )}
          aria-label="Send message"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z" />
          </svg>
        </button>
      </div>
    </div>
  )
}
