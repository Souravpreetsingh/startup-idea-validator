import { Response } from 'express'
import { sendSuccess } from '../../utils/apiResponse'
import { asyncHandler } from '../../utils/asyncHandler'
import * as teamService from '../../services/teamService'
import { checkAndAwardBadges } from '../../services/badgeService'
import type { AuthRequest } from '../../types'

export const create = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { name } = req.body
  const team = await teamService.createTeam(name, req.userId!)
  sendSuccess(res, { team }, 'Team created', 201)
})

export const getOne = asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await teamService.getTeam(req.params.id as string)
  sendSuccess(res, data)
})

export const list = asyncHandler(async (req: AuthRequest, res: Response) => {
  const teams = await teamService.getUserTeams(req.userId!)
  sendSuccess(res, { teams })
})

export const invite = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { email } = req.body
  const invite = await teamService.inviteMember(req.params.id as string, email, req.userId!)
  sendSuccess(res, { invite }, 'Invite sent', 201)
})

export const acceptInvite = asyncHandler(async (req: AuthRequest, res: Response) => {
  const invite = await teamService.acceptInvite(req.params.inviteId as string, req.userId!)
  const newBadges = await checkAndAwardBadges(req.userId!)
  sendSuccess(res, { invite, newBadges }, 'Joined team')
})

export const updateRole = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { role } = req.body
  const member = await teamService.updateMemberRole(req.params.id as string, req.params.userId as string, role, req.userId!)
  sendSuccess(res, { member }, 'Role updated')
})

export const remove = asyncHandler(async (req: AuthRequest, res: Response) => {
  await teamService.removeMember(req.params.id as string, req.params.userId as string, req.userId!)
  sendSuccess(res, null, 'Member removed')
})
