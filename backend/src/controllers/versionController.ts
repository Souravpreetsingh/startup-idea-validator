import { Response } from 'express'
import { StartupIdea } from '../models/StartupIdea'
import { saveVersion, getVersions, getVersion, restoreVersion } from '../services/versionService'
import { sendSuccess } from '../utils/apiResponse'
import { asyncHandler } from '../utils/asyncHandler'
import { NotFoundError, ForbiddenError } from '../utils/errors'
import type { AuthRequest } from '../types'

export const createVersion = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ideaId = req.params.ideaId as string
  const idea = await StartupIdea.findById(ideaId)
  if (!idea) throw new NotFoundError('Startup idea')
  if (idea.userId.toString() !== req.userId) throw new ForbiddenError('Not authorized')

  const version = await saveVersion(idea)
  sendSuccess(res, { version }, `Version ${version.version} saved`, 201)
})

export const listVersions = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ideaId = req.params.ideaId as string
  const idea = await StartupIdea.findById(ideaId)
  if (!idea) throw new NotFoundError('Startup idea')
  if (idea.userId.toString() !== req.userId) throw new ForbiddenError('Not authorized')

  const versions = await getVersions(ideaId, req.userId!)
  sendSuccess(res, { versions })
})

export const getOneVersion = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ideaId = req.params.ideaId as string
  const versionNum = parseInt(req.params.version as string)
  const version = await getVersion(ideaId, versionNum, req.userId!)
  if (!version) throw new NotFoundError('Version')
  sendSuccess(res, { version })
})

export const restore = asyncHandler(async (req: AuthRequest, res: Response) => {
  const ideaId = req.params.ideaId as string
  const versionNum = parseInt(req.params.version as string)
  const result = await restoreVersion(ideaId, versionNum, req.userId!)
  sendSuccess(res, result, `Restored to version ${versionNum}`)
})
