'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '../../../hooks/useAuth'
import { projects as projectsApi } from '../../../lib/api'
import { Card } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { Button } from '../../../components/ui/button'
import { formatDate } from '../../../lib/utils'

export default function DashboardPage() {
  const { user, getToken } = useAuth()
  const [projects, setProjects] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const token = await getToken()
      if (!token) return
      try {
        const { projects: data } = await projectsApi.list(token)
        setProjects(data)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [getToken])

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  const activeProject = projects.find((p) => p.status === 'active')

  return (
    <div className="p-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {greeting}{user?.name ? `, ${user.name}` : ''}.
        </h1>
        <p className="text-slate-500 mt-1">
          {activeProject
            ? `You're on Day ${Math.floor((Date.now() - new Date(activeProject.createdAt).getTime()) / 86400000)} of ${activeProject.name}.`
            : "Let's find out what you're building."}
        </p>
      </div>

      {/* No projects → CTA */}
      {!isLoading && projects.length === 0 && (
        <div className="bg-gradient-to-br from-cobalt-600 to-violet-600 rounded-2xl p-8 text-center text-white mb-8">
          <div className="text-4xl mb-3">🧭</div>
          <h2 className="text-2xl font-bold mb-2">Start your first Discovery Session</h2>
          <p className="text-cobalt-100 mb-6 max-w-md mx-auto">
            A 25-minute AI conversation that uncovers what you truly want to build — and turns it into a 90-day plan.
          </p>
          <Link href="/session/new">
            <Button variant="secondary" size="lg" className="bg-white text-cobalt-700 hover:bg-cobalt-50">
              Start Free Session →
            </Button>
          </Link>
        </div>
      )}

      {/* Active project */}
      {activeProject && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Active Project</h2>
          <Link href={`/project/${activeProject.id}`}>
            <Card variant="interactive" className="p-0 overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-cobalt-600 to-violet-600" />
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{activeProject.name}</h3>
                    <p className="text-slate-500 text-sm mt-1">{activeProject.tagline}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge variant="success" dot>Active</Badge>
                    {activeProject.currentStreak > 0 && (
                      <span className="text-xs text-amber-600 font-semibold">🔥 {activeProject.currentStreak} day streak</span>
                    )}
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-slate-500">Progress</span>
                    <span className="font-semibold text-cobalt-600">{activeProject.progressPercent}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-cobalt-600 to-violet-500 rounded-full transition-all"
                      style={{ width: `${activeProject.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Current tasks */}
                {activeProject.tasks?.slice(0, 3).map((task: any) => (
                  <div key={task.id} className="flex items-center gap-3 py-2 border-t border-slate-50 first:border-t-0">
                    <div className={`w-4 h-4 rounded border-2 flex-shrink-0 ${
                      task.status === 'done'
                        ? 'bg-emerald-500 border-emerald-500'
                        : 'border-slate-300'
                    }`}>
                      {task.status === 'done' && (
                        <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-full h-full p-0.5">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-sm ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                      {task.title}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </Link>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-4">
        <Link href="/session/new">
          <Card variant="interactive" className="text-center py-8">
            <div className="text-2xl mb-2">🧭</div>
            <div className="font-semibold text-slate-900 text-sm">New Session</div>
            <div className="text-xs text-slate-400 mt-1">Explore or get unstuck</div>
          </Card>
        </Link>
        {activeProject && (
          <Link href={`/project/${activeProject.id}`}>
            <Card variant="interactive" className="text-center py-8">
              <div className="text-2xl mb-2">📋</div>
              <div className="font-semibold text-slate-900 text-sm">My Project</div>
              <div className="text-xs text-slate-400 mt-1">View tasks & roadmap</div>
            </Card>
          </Link>
        )}
        <Link href="/insights">
          <Card variant="interactive" className="text-center py-8">
            <div className="text-2xl mb-2">💡</div>
            <div className="font-semibold text-slate-900 text-sm">Insights</div>
            <div className="text-xs text-slate-400 mt-1">Patterns & progress</div>
          </Card>
        </Link>
      </div>
    </div>
  )
}
