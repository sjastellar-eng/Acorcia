'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuth } from '../../../../hooks/useAuth'
import { projects as projectsApi, checkins as checkinsApi } from '../../../../lib/api'
import { Card } from '../../../../components/ui/card'
import { Badge } from '../../../../components/ui/badge'
import { Button } from '../../../../components/ui/button'

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const { getToken } = useAuth()
  const [project, setProject] = useState<any>(null)
  const [checkin, setCheckin] = useState<any>(null)
  const [checkinGreeting, setCheckinGreeting] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [checkinStep, setCheckinStep] = useState<'idle' | 'started' | 'completing' | 'done'>('idle')
  const [taskResult, setTaskResult] = useState<string>('')
  const [taskNote, setTaskNote] = useState('')

  useEffect(() => {
    const load = async () => {
      const token = await getToken()
      if (!token) return
      try {
        const [{ project: p }, { checkin: c }] = await Promise.all([
          projectsApi.get(token, id),
          checkinsApi.today(token, id),
        ])
        setProject(p)
        setCheckin(c)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [id, getToken])

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    const token = await getToken()
    if (!token) return

    const newStatus = currentStatus === 'done' ? 'todo' : 'done'
    const { task } = await projectsApi.updateTask(token, id, taskId, { status: newStatus })

    setProject((p: any) => ({
      ...p,
      tasks: p.tasks.map((t: any) => (t.id === taskId ? task : t)),
    }))
  }

  const handleStartCheckin = async () => {
    const token = await getToken()
    if (!token) return

    setCheckinStep('started')
    const { checkin: c, greeting } = await checkinsApi.start(token, id)
    setCheckin(c)
    setCheckinGreeting(greeting)
  }

  const handleCompleteCheckin = async () => {
    if (!checkin || !taskResult) return
    const token = await getToken()
    if (!token) return

    setCheckinStep('completing')
    const { aiResponse } = await checkinsApi.complete(token, checkin.id, {
      taskResult: taskResult as any,
      taskResultNote: taskNote,
      userMessage: taskNote || `Task result: ${taskResult}`,
    })

    setCheckinGreeting(aiResponse)
    setCheckinStep('done')
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center h-64">
        <div className="text-slate-400 text-sm">Loading project…</div>
      </div>
    )
  }

  if (!project) return <div className="p-8 text-slate-400">Project not found</div>

  const todoTasks = project.tasks?.filter((t: any) => t.status === 'todo') ?? []
  const doneTasks = project.tasks?.filter((t: any) => t.status === 'done') ?? []
  const projectDay = Math.floor(
    (Date.now() - new Date(project.createdAt).getTime()) / 86400000
  )

  return (
    <div className="p-8 max-w-5xl">
      {/* Project header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">{project.name}</h1>
            <p className="text-slate-500 mt-1">{project.tagline}</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="success" dot>Active</Badge>
            <span className="text-sm text-slate-500">Day {projectDay}</span>
            {project.currentStreak > 0 && (
              <span className="text-sm font-semibold text-amber-600">🔥 {project.currentStreak}</span>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-slate-500">Overall progress</span>
            <span className="font-semibold text-cobalt-600">{project.progressPercent}%</span>
          </div>
          <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cobalt-600 to-violet-500 rounded-full"
              style={{ width: `${project.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Tasks column */}
        <div className="col-span-2 space-y-6">
          {/* Daily checkin card */}
          <Card variant="highlight">
            <h3 className="font-semibold text-slate-900 mb-3">Daily Check-In</h3>

            {checkinStep === 'idle' && !checkin?.completedAt && (
              <div>
                <p className="text-sm text-slate-500 mb-3">
                  Take 3 minutes to check in with your AI companion.
                </p>
                <Button onClick={handleStartCheckin} size="sm">
                  Start Today's Check-In
                </Button>
              </div>
            )}

            {(checkinStep === 'started' || checkinStep === 'completing') && checkinGreeting && (
              <div className="space-y-4">
                <div className="bg-cobalt-50 rounded-xl p-4 text-sm text-slate-700">
                  {checkinGreeting}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 mb-2">How did it go?</p>
                  <div className="flex gap-2 flex-wrap">
                    {['done', 'partial', 'missed', 'skipped'].map((r) => (
                      <button
                        key={r}
                        onClick={() => setTaskResult(r)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                          taskResult === r
                            ? 'bg-cobalt-600 text-white border-cobalt-600'
                            : 'bg-white text-slate-600 border-slate-200 hover:border-cobalt-400'
                        }`}
                      >
                        {r === 'done' ? '✓ Done' : r === 'partial' ? '~ Partial' : r === 'missed' ? '✗ Missed' : '→ Skip'}
                      </button>
                    ))}
                  </div>
                  {taskResult && (
                    <textarea
                      value={taskNote}
                      onChange={(e) => setTaskNote(e.target.value)}
                      placeholder="Anything to add? (optional)"
                      rows={2}
                      className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-cobalt-600 resize-none"
                    />
                  )}
                  {taskResult && (
                    <Button
                      onClick={handleCompleteCheckin}
                      size="sm"
                      className="mt-3"
                      isLoading={checkinStep === 'completing'}
                    >
                      Submit
                    </Button>
                  )}
                </div>
              </div>
            )}

            {checkinStep === 'done' && checkinGreeting && (
              <div className="bg-cobalt-50 rounded-xl p-4 text-sm text-slate-700">
                {checkinGreeting}
              </div>
            )}

            {checkin?.completedAt && checkinStep === 'idle' && (
              <div className="text-sm text-emerald-600 font-medium">
                ✓ Check-in complete for today
              </div>
            )}
          </Card>

          {/* Tasks */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Tasks</h3>
              <span className="text-xs text-slate-400">
                {doneTasks.length} / {project.tasks?.length ?? 0} done
              </span>
            </div>

            <div className="space-y-2">
              {todoTasks.slice(0, 8).map((task: any) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer group"
                  onClick={() => handleToggleTask(task.id, task.status)}
                >
                  <div className="w-5 h-5 rounded border-2 border-slate-300 flex-shrink-0 group-hover:border-cobalt-500 transition-colors" />
                  <span className="text-sm text-slate-700 flex-1">{task.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    task.priority === 'high'
                      ? 'bg-red-50 text-red-600'
                      : task.priority === 'medium'
                      ? 'bg-amber-50 text-amber-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}

              {doneTasks.slice(0, 3).map((task: any) => (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer opacity-60"
                  onClick={() => handleToggleTask(task.id, task.status)}
                >
                  <div className="w-5 h-5 rounded bg-emerald-500 flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" className="w-3 h-3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-sm text-slate-400 line-through">{task.title}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Phases */}
          <Card>
            <h3 className="font-semibold text-slate-900 mb-3 text-sm">Roadmap</h3>
            <div className="space-y-3">
              {project.phases?.map((phase: any, idx: number) => (
                <div key={phase.id} className="flex gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-2 ${
                    phase.status === 'completed'
                      ? 'bg-emerald-500'
                      : phase.status === 'in_progress'
                      ? 'bg-cobalt-600'
                      : 'bg-slate-200'
                  }`} />
                  <div>
                    <div className={`text-sm font-medium ${
                      phase.status === 'in_progress' ? 'text-slate-900' : 'text-slate-500'
                    }`}>
                      {phase.title}
                    </div>
                    <div className="text-xs text-slate-400">
                      Weeks {phase.startWeek}–{phase.endWeek}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Insights */}
          {project.insights?.length > 0 && (
            <Card>
              <h3 className="font-semibold text-slate-900 mb-3 text-sm">Why this project</h3>
              <div className="space-y-2">
                {project.insights.slice(0, 3).map((insight: any) => (
                  <div key={insight.id} className="flex gap-2 bg-cobalt-50 rounded-lg p-3">
                    <div className="w-0.5 h-full min-h-4 bg-cobalt-400 rounded-full flex-shrink-0" />
                    <p className="text-xs text-slate-600 italic leading-relaxed">{insight.content}</p>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
