import { IdeaVersion } from '../models/IdeaVersion'
import { StartupIdea, type IStartupIdeaDocument } from '../models/StartupIdea'
import logger from '../config/logger'

export async function saveVersion(idea: IStartupIdeaDocument) {
  const lastVersion = await IdeaVersion.findOne({ ideaId: idea._id }).sort({ version: -1 })
  const newVersion = (lastVersion?.version ?? 0) + 1

  const snapshot: Record<string, unknown> = {
    title: idea.title,
    description: idea.description,
    industry: idea.industry,
    targetAudience: idea.targetAudience,
    budget: idea.budget,
    businessModel: idea.businessModel,
    problemStatement: idea.problemStatement,
    expectedSolution: idea.expectedSolution,
  }

  const changes: { field: string; oldValue: unknown; newValue: unknown }[] = []

  if (lastVersion) {
    const prev = lastVersion.snapshot as Record<string, unknown>
    for (const key of Object.keys(snapshot)) {
      const oldVal = prev[key]
      const newVal = snapshot[key]
      if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
        changes.push({ field: key, oldValue: oldVal, newValue: newVal })
      }
    }
  } else {
    for (const key of Object.keys(snapshot)) {
      changes.push({ field: key, oldValue: undefined, newValue: snapshot[key] })
    }
  }

  const version = await IdeaVersion.create({
    ideaId: idea._id,
    userId: idea.userId,
    version: newVersion,
    snapshot,
    changes,
  })

  logger.info(`[Version] Saved v${newVersion} for idea ${idea._id}`)
  return version
}

export async function getVersions(ideaId: string, userId: string) {
  return IdeaVersion.find({ ideaId, userId }).sort({ version: -1 }).lean()
}

export async function getVersion(ideaId: string, version: number, userId: string) {
  return IdeaVersion.findOne({ ideaId, version, userId }).lean()
}

export async function restoreVersion(ideaId: string, version: number, userId: string) {
  const v = await IdeaVersion.findOne({ ideaId, version, userId })
  if (!v) throw new Error('Version not found')

  const snapshot = v.snapshot as Record<string, unknown>
  const update: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(snapshot)) {
    update[key] = value
  }

  await StartupIdea.findOneAndUpdate({ _id: ideaId, userId }, update)
  logger.info(`[Version] Restored idea ${ideaId} to v${version}`)

  const idea = await StartupIdea.findById(ideaId)
  if (idea) await saveVersion(idea)

  return { restored: true, version }
}
