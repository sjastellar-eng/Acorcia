'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../hooks/useAuth'
import { projects as projectsApi, sessions } from '../../../lib/api'
import { Card } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { relativeTime } from '../../../lib/utils'

export default function InsightsPage() {
  const { getToken } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [sessionHistory, setSessionHistory] = useState<any[]>([])
  const [activeProjectId, setActiveProjectId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const token = await getToken()
      if (!token) return

      try {
        const [{ projects }, { sessions: sess }] = await Promise.all([
          projectsApi.list(token),
          sessions.list(token),
        ])

        const active = projects.find((p: any) => p.status === 'active')
        setActiveProjectId(active?.id ?? null)
        setSessionHistory(sess)

        if (active?.id) {
          const { stats: s } = await projectsApi.stats(token, active.id)
          setStats(s)
        }
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [getToken])

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="text-slate-400 text-sm">Loading insights…</div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Progress & Insights</h1>
        <p className="text-slate-500 mt-1">Your journey at a glance</p>
      </div>

      {/* Key stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Sessions', value: stats.totalSessions },
            { label: 'Tasks done', value: stats.totalTasksCompleted },
            { label: 'Current streak', value: `${stats.currentStreak}🔥` },
            { label: 'Progress', value: `${stats.projectProgress}%` },
          ].map((s) => (
            <Card key={s.label} className="text-center py-6">
              <div className="text-3xl font-bold text-cobalt-600 mb-1">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </Card>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        {/* Session history */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-900">Discovery Sessions</h2>
            <Link href="/session/new">
              <Badge variant="primary" className="cursor-pointer hover:bg-cobalt-100">+ New</Badge>
            </Link>
          </div>

          {sessionHistory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400 text-sm mb-3">No sessions yet</p>
              <Link href="/session/new">
                <span className="text-cobalt-600 text-sm font-medium hover:underline">
                  Start your first session →
                </span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sessionHistory.map((session: any) => (
                <Link key={session.id} href={`/session/${session.id}`}>
                  <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                      session.status === 'completed'
                        ? 'bg-emerald-500'
                        : session.status === 'in_progress'
                        ? 'bg-cobalt-500'
                        : 'bg-slate-300'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-slate-900 text-sm truncate">
                        {session.title ?? `Discovery Session`}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {relativeTime(session.startedAt)}
                        {session.durationMinutes && ` · ${session.durationMinutes} min`}
                      </div>
                      {session.summary && (
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {session.summary}
                        </p>
                      )}
                    </div>
                    <Badge variant={session.status === 'completed' ? 'success' : 'default'} className="text-xs flex-shrink-0">
                      {session.status === 'completed' ? 'Done' : session.status === 'in_progress' ? 'Active' : 'Draft'}
                    </Badge>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Top themes */}
        <Card>
          <h2 className="font-semibold text-slate-900 mb-4">Recurring Themes</h2>
          {stats?.topThemes?.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {stats.topThemes.map((t: any) => (
                <div
                  key={t.theme}
                  className="bg-cobalt-50 text-cobalt-700 px-3 py-1.5 rounded-full text-sm font-medium"
                  style={{ fontSize: `${Math.max(11, Math.min(16, 11 + t.count))}px` }}
                >
                  {t.theme} ×{t.count}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400 text-sm text-center py-8">
              Complete more sessions to see your themes
            </p>
          )}

          {/* Weekly tasks chart */}
          {stats?.weeklyTasksCompleted && (
            <div className="mt-6">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-3">
                Tasks completed per week
              </div>
              <div className="flex items-end gap-1.5 h-16">
                {stats.weeklyTasksCompleted.map((count: number, i: number) => {
                  const max = Math.max(...stats.weeklyTasksCompleted, 1)
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full bg-cobalt-500 rounded-t opacity-80 transition-all"
                        style={{ height: `${(count / max) * 100}%`, minHeight: count > 0 ? 4 : 0 }}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between text-xs text-slate-300 mt-1">
                <span>8w ago</span>
                <span>This week</span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
