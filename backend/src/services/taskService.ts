import { Task } from '../models/Task'
import type { IStartupIdeaDocument } from '../models/StartupIdea'
import type { IAnalysisResultDocument } from '../models/AnalysisResult'
import logger from '../config/logger'

interface ActionStep {
  title: string
  description: string
  week: number
  priority: 'low' | 'medium' | 'high'
}

const industryTaskTemplates: Record<string, Partial<ActionStep>[]> = {
  'Healthcare': [
    { title: 'Research HIPAA compliance requirements', description: 'Document all regulatory requirements for handling protected health information in your specific use case', week: 1, priority: 'high' },
    { title: 'Identify clinical pilot partners', description: 'Reach out to 5-10 healthcare providers or hospitals for potential pilot programs', week: 2, priority: 'high' },
    { title: 'Create clinical validation protocol', description: 'Design a study or pilot protocol to measure clinical effectiveness of your solution', week: 3, priority: 'high' },
  ],
  'Fintech': [
    { title: 'Research regulatory licensing requirements', description: 'Determine if you need money transmitter licenses, state lending licenses, or other regulatory approvals', week: 1, priority: 'high' },
    { title: 'Evaluate banking-as-a-service partners', description: 'Research and compare BaaS providers (Synapse, Unit, Column, etc.) for partnership', week: 2, priority: 'high' },
    { title: 'Build compliance framework', description: 'Document KYC/AML procedures, fraud detection rules, and data security protocols', week: 3, priority: 'high' },
  ],
  'EdTech': [
    { title: 'Research school district procurement processes', description: 'Understand the buying cycle, budget timelines, and decision-makers for your target districts', week: 1, priority: 'high' },
    { title: 'Develop content partnership strategy', description: 'Identify potential content partners, curriculum developers, or subject matter experts', week: 2, priority: 'medium' },
    { title: 'Create pilot measurement framework', description: 'Design metrics and assessment methods to demonstrate learning outcomes', week: 3, priority: 'high' },
  ],
  'AI & Machine Learning': [
    { title: 'Define model evaluation metrics', description: 'Establish clear success criteria and evaluation metrics for your ML model performance', week: 1, priority: 'high' },
    { title: 'Build data pipeline for training', description: 'Set up data collection, cleaning, and labeling pipeline for model training', week: 1, priority: 'high' },
    { title: 'Create model card and documentation', description: 'Document model architecture, training data, limitations, and ethical considerations', week: 3, priority: 'medium' },
  ],
  'SaaS': [
    { title: 'Define ideal customer profile (ICP)', description: 'Create detailed personas of your target customers including company size, role, budget, and pain points', week: 1, priority: 'high' },
    { title: 'Build pricing page and tier structure', description: 'Design pricing tiers, feature breakdown, and upgrade paths based on competitor research', week: 2, priority: 'high' },
    { title: 'Set up analytics infrastructure', description: 'Implement product analytics (Mixpanel/Amplitude), CRM (HubSpot/Salesforce), and BI tools', week: 3, priority: 'medium' },
  ],
  'E-commerce': [
    { title: 'Research supply chain and logistics partners', description: 'Evaluate fulfillment options (in-house, 3PL, dropshipping) and negotiate preliminary terms', week: 1, priority: 'high' },
    { title: 'Build initial customer acquisition channels', description: 'Set up social media profiles, create content calendar, and launch targeted ads for testing', week: 2, priority: 'high' },
    { title: 'Calculate unit economics', description: 'Determine COGS, CAC, AOV, LTV, and margin for each product or service offering', week: 3, priority: 'high' },
  ],
  'Food & Beverage': [
    { title: 'Research food safety and licensing requirements', description: 'Document all local, state, and federal regulations for food production and handling', week: 1, priority: 'high' },
    { title: 'Develop supply chain relationships', description: 'Identify and contact suppliers, distributors, and potential manufacturing partners', week: 2, priority: 'high' },
    { title: 'Conduct taste tests and product refinement', description: 'Organize blind taste tests with target demographic and iterate based on feedback', week: 3, priority: 'medium' },
  ],
  'Real Estate': [
    { title: 'Research local real estate regulations', description: 'Understand licensing requirements, commission structures, and property laws in target markets', week: 1, priority: 'high' },
    { title: 'Build agent/partner network', description: 'Identify and establish relationships with real estate agents, brokers, and property managers', week: 2, priority: 'high' },
    { title: 'Create property data aggregation plan', description: 'Determine data sources for property listings, valuations, and market analytics', week: 3, priority: 'medium' },
  ],
  'Sustainability & CleanTech': [
    { title: 'Research available grants and incentives', description: 'Identify government grants, tax incentives, and sustainability programs applicable to your solution', week: 1, priority: 'high' },
    { title: 'Build carbon impact measurement framework', description: 'Develop methodology for measuring and verifying the environmental impact of your solution', week: 2, priority: 'high' },
    { title: 'Identify corporate sustainability partners', description: 'Research companies with ESG commitments that could become pilot customers or partners', week: 3, priority: 'high' },
  ],
  'Gaming': [
    { title: 'Create game design document', description: 'Document core mechanics, art style, progression systems, and monetization model', week: 1, priority: 'high' },
    { title: 'Build vertical slice prototype', description: 'Develop a playable demo showcasing core gameplay loop and visual style', week: 2, priority: 'high' },
    { title: 'Start community building', description: 'Create Discord server, social media presence, and begin sharing development updates', week: 3, priority: 'medium' },
  ],
  'Social Media': [
    { title: 'Define community guidelines and moderation system', description: 'Create content policies, moderation workflows, and user reporting mechanisms', week: 1, priority: 'high' },
    { title: 'Build onboarding and discovery experience', description: 'Design user onboarding flow that drives engagement and content discovery', week: 2, priority: 'high' },
    { title: 'Develop viral loop mechanics', description: 'Design features that encourage sharing, invitations, and organic growth', week: 3, priority: 'high' },
  ],
}

const defaultTasks: ActionStep[] = [
  { title: 'Research target market and competitors', description: 'Analyse top 5 competitors in your space, identify their strengths and weaknesses, and document market gaps', week: 1, priority: 'high' },
  { title: 'Define ideal customer profile', description: 'Create detailed personas of your target customers including demographics, pain points, and buying behavior', week: 1, priority: 'high' },
  { title: 'Build MVP prototype', description: 'Develop a functional minimum viable product with core features that address the primary user need', week: 2, priority: 'high' },
  { title: 'Conduct user testing', description: 'Test the MVP with 10-20 target users, gather feedback, and identify critical improvements', week: 2, priority: 'high' },
  { title: 'Create go-to-market strategy', description: 'Define marketing channels, sales approach, and launch timeline based on customer research', week: 3, priority: 'high' },
  { title: 'Prepare investor materials', description: 'Create a compelling pitch deck, financial model, and data room for fundraising conversations', week: 3, priority: 'medium' },
  { title: 'Refine product based on feedback', description: 'Prioritise and implement the most critical user feedback into your product roadmap', week: 3, priority: 'medium' },
  { title: 'Soft launch to early users', description: 'Launch to a small group of early adopters, monitor usage patterns, and collect testimonials', week: 4, priority: 'high' },
  { title: 'Set up analytics and success metrics', description: 'Implement product analytics, define KPIs, and create dashboards to track progress', week: 4, priority: 'medium' },
  { title: 'Public launch and marketing push', description: 'Execute launch campaign across selected channels and begin scaling customer acquisition', week: 4, priority: 'high' },
]

export async function generateTasksFromAnalysis(
  userId: string,
  idea: IStartupIdeaDocument,
  analysis?: IAnalysisResultDocument
) {
  const existingCount = await Task.countDocuments({ userId, status: { $ne: 'cancelled' } })
  if (existingCount > 0) return []

  logger.info('[TaskService] Generating tasks from analysis', { title: idea.title, industry: idea.industry })

  const industryTasks = industryTaskTemplates[idea.industry] || []

  const steps: ActionStep[] = [
    ...(industryTasks.length > 0
      ? industryTasks as ActionStep[]
      : defaultTasks.slice(0, 3).map(t => ({ ...t }))),
    { title: 'Conduct 20 customer discovery interviews', description: 'Interview potential customers to validate problem hypothesis and understand willingness to pay', week: 1, priority: 'high' },
    { title: 'Define core metrics and OKRs', description: 'Establish key metrics for tracking progress including acquisition, activation, retention, and revenue goals', week: 1, priority: 'medium' },
    { title: 'Set up development environment and CI/CD', description: 'Configure development tools, version control, automated testing, and deployment pipeline', week: 2, priority: 'high' },
    { title: 'Build core feature implementation', description: 'Develop the primary features that deliver core value to users based on validated requirements', week: 2, priority: 'high' },
    { title: 'Create feedback collection system', description: 'Implement in-app feedback, NPS surveys, and user interview scheduling', week: 3, priority: 'medium' },
    { title: 'Develop content marketing strategy', description: 'Create a content plan including blog posts, case studies, and thought leadership pieces', week: 3, priority: 'medium' },
    { title: 'Launch and monitor initial KPIs', description: 'Execute launch plan, monitor key performance indicators, and establish regular review cadence', week: 4, priority: 'high' },
  ]

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
