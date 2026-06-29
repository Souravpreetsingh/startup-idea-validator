import { Team } from '../models/Team'
import { TeamMember } from '../models/TeamMember'
import { TeamInvite } from '../models/TeamInvite'
import { User } from '../models/User'
import { AppError } from '../utils/errors'
import mongoose from 'mongoose'

export async function createTeam(name: string, ownerId: string) {
  const team = await Team.create({ name, ownerId })
  await TeamMember.create({ teamId: team._id, userId: ownerId, role: 'owner' })
  return team
}

export async function getTeam(teamId: string) {
  const team = await Team.findById(teamId)
  if (!team) throw new AppError('Team not found', 404)
  const members = await TeamMember.find({ teamId }).populate('userId', 'fullName email').lean()
  const invites = await TeamInvite.find({ teamId, status: 'pending' }).lean()
  return { team, members, invites }
}

export async function getUserTeams(userId: string) {
  const memberships = await TeamMember.find({ userId }).populate('teamId').lean()
  return memberships.map((m) => m.teamId as any)
}

export async function inviteMember(teamId: string, email: string, invitedBy: string) {
  const membership = await TeamMember.findOne({ teamId, userId: invitedBy })
  if (!membership || (membership.role !== 'owner' && membership.role !== 'admin')) {
    throw new AppError('Not authorized to invite members', 403)
  }

  const existing = await TeamInvite.findOne({ teamId, email, status: 'pending' })
  if (existing) throw new AppError('Invite already sent', 409)

  const targetUser = await User.findOne({ email })
  if (targetUser) {
    const alreadyMember = await TeamMember.findOne({ teamId, userId: targetUser._id })
    if (alreadyMember) throw new AppError('User is already a member', 409)
  }

  return TeamInvite.create({ teamId, email, invitedBy })
}

export async function acceptInvite(inviteId: string, userId: string) {
  const invite = await TeamInvite.findById(inviteId)
  if (!invite || invite.status !== 'pending') throw new AppError('Invalid or expired invite', 400)
  if (invite.expiresAt < new Date()) throw new AppError('Invite expired', 410)

  const user = await User.findById(userId)
  if (!user || user.email !== invite.email) throw new AppError('This invite is not for you', 403)

  await TeamMember.create({ teamId: invite.teamId, userId, role: 'member' })
  invite.status = 'accepted'
  await invite.save()

  return invite
}

export async function updateMemberRole(teamId: string, targetUserId: string, newRole: string, requesterId: string) {
  const requester = await TeamMember.findOne({ teamId, userId: requesterId })
  if (!requester || requester.role !== 'owner') throw new AppError('Only owners can change roles', 403)

  const target = await TeamMember.findOne({ teamId, userId: targetUserId })
  if (!target) throw new AppError('Member not found', 404)

  target.role = newRole as any
  await target.save()
  return target
}

export async function removeMember(teamId: string, targetUserId: string, requesterId: string) {
  const requester = await TeamMember.findOne({ teamId, userId: requesterId })
  if (!requester || (requester.role !== 'owner' && requester.role !== 'admin')) {
    throw new AppError('Not authorized', 403)
  }
  if (requester.role === 'admin' && requester.userId.toString() !== targetUserId) {
    const target = await TeamMember.findOne({ teamId, userId: targetUserId })
    if (target && target.role === 'owner') throw new AppError('Cannot remove the owner', 403)
  }

  await TeamMember.deleteOne({ teamId, userId: targetUserId })
}
