'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { taskService, type Task } from '@/services/taskService'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'
import toast from 'react-hot-toast'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-500',
}

const priorityIcons: Record<string, string> = {
  low: 'arrow_downward',
  medium: 'remove',
  high: 'arrow_upward',
}

export default function TasksPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [tasks, setTasks] = useState<Task[]>([])
  const [completionPercentage, setCompletionPercentage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    taskService.list().then((r) => {
      setTasks(r.data.tasks || [])
      setCompletionPercentage(r.data.completionPercentage || 0)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  async function handleStatus(task: Task, newStatus: string) {
    try {
      await taskService.update(task._id, { status: newStatus as Task['status'] })
      setTasks((prev) => prev.map((t) => t._id === task._id ? { ...t, status: newStatus as Task['status'] } : t))
      const updated = tasks.map((t) => t._id === task._id ? { ...t, status: newStatus as Task['status'] } : t)
      const completed = updated.filter((t) => t.status === 'completed').length
      setCompletionPercentage(Math.round((completed / updated.length) * 100))
      toast.success(`Task ${newStatus === 'completed' ? 'completed' : 'updated'}`)
    } catch {
      toast.error('Failed to update task')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this task?')) return
    try {
      await taskService.remove(id)
      setTasks((prev) => prev.filter((t) => t._id !== id))
      toast.success('Task deleted')
    } catch {
      toast.error('Failed to delete task')
    }
  }

  const filtered = filter === 'all' ? tasks : tasks.filter((t) => t.status === filter)

  if (authLoading || !user) return null

  const statusCounts = {
    all: tasks.length,
    pending: tasks.filter((t) => t.status === 'pending').length,
    in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    completed: tasks.filter((t) => t.status === 'completed').length,
  }

  return (
    <body className="bg-background text-on-background font-body-md flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen pb-24 md:pb-12">
        <div className="p-6 md:p-8 max-w-[1440px] mx-auto">
          <div className="mb-8 pt-4">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-widest mb-2">Action Plan</p>
            <h2 className="font-display-xl text-[clamp(28px,4vw,48px)] leading-[1.1] tracking-[-0.03em] font-medium text-on-surface">Smart Tasks</h2>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-[32px] p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="font-label-sm text-on-surface">Overall Progress</p>
              <p className="font-label-md text-on-surface">{completionPercentage}%</p>
            </div>
            <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
              <div className="h-full bg-tertiary rounded-full transition-all duration-500" style={{ width: `${completionPercentage}%` }} />
            </div>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {Object.entries(statusCounts).map(([key, count]) => (
              <button key={key} onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-full text-[13px] font-label-md whitespace-nowrap transition-colors ${
                  filter === key ? 'bg-on-surface text-surface' : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-lowest'
                }`}>
                {key === 'all' ? 'All' : key.replace('_', ' ')} ({count})
              </button>
            ))}
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-surface-variant animate-pulse rounded-2xl h-[72px]" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-surface-container-lowest border border-outline-variant rounded-[32px]">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">task_alt</span>
              <p className="text-on-surface-variant text-lg mb-2">No tasks yet</p>
              <p className="text-sm text-on-surface-variant">Tasks are auto-generated when you create a new idea analysis.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((task) => (
                <div key={task._id} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 flex items-center gap-4">
                  <button onClick={() => handleStatus(task, task.status === 'completed' ? 'pending' : 'completed')}
                    className={`w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${
                      task.status === 'completed' ? 'bg-green-600 border-green-600 text-white' : 'border-outline hover:border-on-surface'
                    }`}>
                    {task.status === 'completed' && <span className="material-symbols-outlined text-sm">check</span>}
                  </button>

                  <div className="flex-1 min-w-0">
                    <p className={`font-label-sm text-on-surface ${task.status === 'completed' ? 'line-through text-on-surface-variant' : ''}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${statusColors[task.status] || ''}`}>
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className="material-symbols-outlined text-sm text-on-surface-variant">{priorityIcons[task.priority]}</span>
                      {task.deadline && (
                        <span className="text-[11px] text-on-surface-variant flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          {new Date(task.deadline).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {task.status !== 'completed' && task.status !== 'cancelled' && (
                      <>
                        <select value={task.status} onChange={(e) => handleStatus(task, e.target.value)}
                          className="bg-surface-container-low text-[12px] rounded-lg px-2 py-1 border border-outline-variant outline-none text-on-surface">
                          <option value="pending">Pending</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button onClick={() => handleStatus(task, 'cancelled')}
                          className="material-symbols-outlined text-lg text-on-surface-variant hover:text-red-600">cancel</button>
                      </>
                    )}
                    <button onClick={() => handleDelete(task._id)}
                      className="material-symbols-outlined text-lg text-on-surface-variant hover:text-red-600">delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <MobileNav />
    </body>
  )
}
