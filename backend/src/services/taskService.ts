import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'
import { Task } from '../models/Task'
import type { IStartupIdeaDocument } from '../models/StartupIdea'
import type { IAnalysisResultDocument } from '../models/AnalysisResult'
import logger from '../config/logger'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

interface AIActionStep {
  title: string
  description: string
  week: number
  priority: 'low' | 'medium' | 'high'
}

export async function generateTasksFromAnalysis(
  userId: string,
  idea: IStartupIdeaDocument,
  analysis?: IAnalysisResultDocument
) {
  const existingCount = await Task.countDocuments({ userId, status: { $ne: 'cancelled' } })
  if (existingCount > 0) return []

  const prompt = `You are a startup task planner. Generate a 4-week actionable plan for this startup.

Startup: "${idea.title}"
Industry: ${idea.industry}
Description: ${idea.description}
${analysis ? `Idea Score: ${analysis.ideaScore}/100\nSuccess Probability: ${analysis.successProbability}%\nMVP Roadmap: ${analysis.mvpRoadmap.join(', ')}\nGrowth Strategy: ${analysis.growthStrategy}` : ''}

Return ONLY valid JSON (no markdown) — an array of objects:
[
  {
    "title": "Short task title",
    "description": "Detailed instructions for this task",
    "week": 1,
    "priority": "high" | "medium" | "low"
  }
]

Generate exactly 8-12 tasks spread across 4 weeks. Include research, building, testing, and launch tasks.`

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  let steps: AIActionStep[] = []
  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const cleaned = text.replace(/```json?/gi, '').replace(/```/g, '').trim()
    const firstBracket = cleaned.indexOf('[')
    const lastBracket = cleaned.lastIndexOf(']')
    const jsonStr = firstBracket !== -1 && lastBracket !== -1 ? cleaned.slice(firstBracket, lastBracket + 1) : cleaned
    steps = JSON.parse(jsonStr)
  } catch {
    logger.warn('[TaskService] AI generation failed, using defaults')
    steps = [
      { title: 'Research competitors', description: 'Analyse top 5 competitors in your space', week: 1, priority: 'high' },
      { title: 'Define target market', description: 'Identify and segment your target audience', week: 1, priority: 'high' },
      { title: 'Create wireframes', description: 'Sketch core screens and user flows', week: 1, priority: 'medium' },
      { title: 'Build MVP prototype', description: 'Develop a functional MVP with core features', week: 2, priority: 'high' },
      { title: 'User testing round 1', description: 'Test MVP with 10-20 target users', week: 2, priority: 'high' },
      { title: 'Iterate based on feedback', description: 'Prioritise and implement top feedback items', week: 3, priority: 'medium' },
      { title: 'Prepare investor deck', description: 'Create pitch deck with traction and metrics', week: 3, priority: 'high' },
      { title: 'Launch MVP', description: 'Public launch on ProductHunt and social media', week: 4, priority: 'high' },
    ]
  }

  const tasks = steps.map((step) => {
    const deadline = new Date()
    deadline.setDate(deadline.getDate() + (step.week - 1) * 7 + 3)
    return { userId, title: step.title, description: step.description, priority: step.priority, deadline, status: 'pending' as const }
  })

  await Task.insertMany(tasks)
  logger.info(`[TaskService] Generated ${tasks.length} tasks for user ${userId}`)
  return tasks
}

export async function getUserTasks(userId: string) {
  const tasks = await Task.find({ userId }).sort({ deadline: 1, priority: -1 }).lean()
  const total = tasks.length
  const completed = tasks.filter((t) => t.status === 'completed').length
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0
  return { tasks, completionPercentage }
}

export async function updateTask(taskId: string, userId: string, data: Partial<{ status: string; priority: string; deadline: string; title: string; description: string }>) {
  const update: Record<string, unknown> = { ...data }
  if (data.status === 'completed') update.completedAt = new Date()
  if (data.status && data.status !== 'completed') update.completedAt = null
  const task = await Task.findOneAndUpdate({ _id: taskId, userId }, update, { new: true })
  if (!task) throw new Error('Task not found')
  return task
}

export async function deleteTask(taskId: string, userId: string) {
  const task = await Task.findOneAndDelete({ _id: taskId, userId })
  if (!task) throw new Error('Task not found')
  return task
}
