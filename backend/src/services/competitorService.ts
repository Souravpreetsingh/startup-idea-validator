import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'
import { CompetitorInsight, type ICompetitorDetail } from '../models/CompetitorInsight'
import type { IStartupIdeaDocument } from '../models/StartupIdea'
import logger from '../config/logger'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
const TIMEOUT_MS = 30000

interface CompetitorOutput {
  competitors: Omit<ICompetitorDetail, '_id'>[]
  marketPosition: string
}

export async function analyzeCompetitors(idea: IStartupIdeaDocument): Promise<ICompetitorDetail[]> {
  const existing = await CompetitorInsight.findOne({ ideaId: idea._id })
  if (existing && Date.now() - existing.generatedAt.getTime() < 3600000) {
    return existing.competitors
  }

  const prompt = `You are a competitive intelligence analyst. Analyze the following startup idea and identify its top competitors.

Startup: "${idea.title}"
Industry: ${idea.industry}
Description: ${idea.description}
Target Audience: ${idea.targetAudience || 'N/A'}
Business Model: ${idea.businessModel || 'N/A'}

Return ONLY valid JSON (no markdown) with this exact structure:
{
  "competitors": [
    {
      "name": "Competitor Name",
      "funding": "Estimated total funding with currency",
      "strengths": ["strength1", "strength2"],
      "weaknesses": ["weakness1", "weakness2"],
      "marketPosition": "market leader / challenger / niche player / emerging",
      "pricingStrategy": "freemium / subscription / one-time / per-unit",
      "estimatedUserBase": "estimated number of users (e.g. 10M+)"
    }
  ],
  "marketPosition": "Overall market position description for this startup relative to competitors"
}`

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  const result = await Promise.race([
    model.generateContent(prompt),
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Competitor analysis timed out')), TIMEOUT_MS)),
  ]) as Awaited<ReturnType<typeof model.generateContent>>

  const text = result.response.text()
  const cleaned = text.replace(/```json?/gi, '').replace(/```/g, '').trim()
  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')
  const jsonStr = firstBrace !== -1 && lastBrace !== -1 ? cleaned.slice(firstBrace, lastBrace + 1) : cleaned

  let parsed: CompetitorOutput
  try {
    parsed = JSON.parse(jsonStr)
  } catch {
    logger.warn('[CompetitorService] Failed to parse AI response, using fallback')
    parsed = {
      competitors: [{ name: 'Unknown', strengths: [], weaknesses: [], marketPosition: 'Unknown' }],
      marketPosition: 'Unable to determine market position',
    }
  }

  if (!parsed.competitors?.length) {
    parsed.competitors = [{ name: 'Unknown', strengths: [], weaknesses: [], marketPosition: 'Unknown' }]
  }

  const insight = await CompetitorInsight.findOneAndUpdate(
    { ideaId: idea._id },
    {
      ideaId: idea._id,
      userId: idea.userId,
      competitors: parsed.competitors,
      marketPosition: parsed.marketPosition,
      generatedAt: new Date(),
    },
    { upsert: true, new: true }
  )

  return insight.competitors
}

export async function getCompetitorInsight(ideaId: string) {
  return CompetitorInsight.findOne({ ideaId })
}
