import { cn } from '../../lib/utils'

interface ChatBubbleProps {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

export function ChatBubble({ role, content, isStreaming }: ChatBubbleProps) {
  const isAI = role === 'assistant'

  return (
    <div className={cn('flex gap-3 animate-fade-in', !isAI && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 self-end',
          isAI
            ? 'bg-gradient-to-br from-cobalt-600 to-violet-600 text-white'
            : 'bg-cobalt-600 text-white'
        )}
      >
        {isAI ? 'AI' : 'You'}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[75%] px-4 py-3 text-sm leading-relaxed',
          isAI
            ? 'bg-slate-100 text-slate-900 rounded-tr-2xl rounded-br-2xl rounded-tl-sm rounded-bl-2xl'
            : 'bg-cobalt-600 text-white rounded-tl-2xl rounded-bl-2xl rounded-tr-sm rounded-br-2xl'
        )}
      >
        {content}
        {isStreaming && (
          <span className="inline-block w-1 h-4 ml-0.5 bg-current animate-pulse" />
        )}
      </div>
    </div>
  )
}

export function TypingIndicator() {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cobalt-600 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
        AI
      </div>
      <div className="bg-slate-100 rounded-2xl px-4 py-3 flex gap-1 items-center">
        <span className="w-2 h-2 rounded-full bg-slate-400 animate-typing" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-slate-400 animate-typing" style={{ animationDelay: '200ms' }} />
        <span className="w-2 h-2 rounded-full bg-slate-400 animate-typing" style={{ animationDelay: '400ms' }} />
      </div>
    </div>
  )
}
