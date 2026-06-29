import { UserBadge } from '../models/UserBadge'
import { BADGE_DEFINITIONS } from '../models/Badge'
import { StartupIdea } from '../models/StartupIdea'
import { AnalysisResult } from '../models/AnalysisResult'
import { ChatHistory } from '../models/ChatHistory'
import { TeamMember } from '../models/TeamMember'

export async function checkAndAwardBadges(userId: string) {
  const awarded = await UserBadge.find({ userId }).lean()
  const awardedKeys = new Set(awarded.map((b) => b.badgeKey))
  const newBadges: string[] = []

  const [ideaCount, analysisCount, chatCount, teamCount, industryCount] = await Promise.all([
    StartupIdea.countDocuments({ userId }),
    AnalysisResult.countDocuments({ userId }),
    ChatHistory.countDocuments({ userId }),
    TeamMember.countDocuments({ userId }),
    AnalysisResult.distinct('competition', { userId }),
  ])

  const checks: Record<string, boolean> = {
    first_idea: ideaCount >= 1,
    ten_analyses: analysisCount >= 10,
    ai_expert: analysisCount >= 25,
    market_pro: industryCount.length >= 5,
    chat_master: chatCount >= 50,
    team_player: teamCount >= 1,
    serial_founder: ideaCount >= 5,
    early_adopter: analysisCount >= 1,
  }

  for (const badge of BADGE_DEFINITIONS) {
    if (!awardedKeys.has(badge.key) && checks[badge.key]) {
      await UserBadge.create({ userId, badgeKey: badge.key })
      newBadges.push(badge.key)
    }
  }

  return newBadges
}

export async function getUserBadges(userId: string) {
  const earned = await UserBadge.find({ userId }).lean()
  const earnedKeys = new Set(earned.map((b) => b.badgeKey))

  return BADGE_DEFINITIONS.map((badge) => ({
    ...badge,
    earned: earnedKeys.has(badge.key),
    earnedAt: earned.find((b) => b.badgeKey === badge.key)?.earnedAt || null,
  }))
}
