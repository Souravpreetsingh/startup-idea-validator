import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'
import type { IStartupIdeaDocument } from '../models/StartupIdea'
import type { IAnalysisResultDocument } from '../models/AnalysisResult'
import logger from '../config/logger'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

export interface MentorRecommendation {
  mentorType: string
  expertise: string[]
  skillsNeeded: string[]
  guidanceTopics: string[]
  suggestedBackground: string
}

export async function recommendMentors(
  idea: IStartupIdeaDocument,
  analysis?: IAnalysisResultDocument | null,
  userGoals?: string,
): Promise<MentorRecommendation> {
  const prompt = `You are an AI startup mentor matchmaker. Recommend the ideal mentor for this startup founder.

Startup: "${idea.title}"
Industry: ${idea.industry}
Description: ${idea.description}
Target Audience: ${idea.targetAudience || 'N/A'}
Business Model: ${idea.businessModel || 'N/A'}
${analysis ? `Idea Score: ${analysis.ideaScore}/100\nWeaknesses: ${analysis.swot.weaknesses.join(', ')}\nGrowth Strategy: ${analysis.growthStrategy}` : ''}
${userGoals ? `Founder Goals: ${userGoals}` : ''}

Return ONLY valid JSON (no markdown):
{
  "mentorType": "e.g. Serial Tech Entrepreneur / SaaS Growth Expert / Industry Veteran",
  "expertise": ["expertise area 1", "expertise area 2"],
  "skillsNeeded": ["skill to develop 1", "skill to develop 2"],
  "guidanceTopics": ["topic 1", "topic 2", "topic 3"],
  "suggestedBackground": "Description of ideal mentor background and why they fit"
}

Be specific and actionable. Recommend real mentor archetypes based on the startup stage and industry.`

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const cleaned = text.replace(/```json?/gi, '').replace(/```/g, '').trim()
    const firstBrace = cleaned.indexOf('{')
    const lastBrace = cleaned.lastIndexOf('}')
    const jsonStr = firstBrace !== -1 && lastBrace !== -1 ? cleaned.slice(firstBrace, lastBrace + 1) : cleaned
    const parsed: MentorRecommendation = JSON.parse(jsonStr)
    return parsed
  } catch (err) {
    logger.warn('[Mentor] AI generation failed, using fallback:', err)
    return {
      mentorType: 'Experienced Industry Founder',
      expertise: [idea.industry, 'Startup Growth', 'Fundraising'],
      skillsNeeded: ['Product-Market Fit', 'Go-to-Market Strategy', 'Team Building'],
      guidanceTopics: ['Validating your business model', 'Finding product-market fit', 'Raising your first round'],
      suggestedBackground: `A founder who has built and scaled a company in the ${idea.industry} space, ideally with exit experience.`,
    }
  }
}
