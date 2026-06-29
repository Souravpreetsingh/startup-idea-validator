import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

export interface InvestorMatch {
  investorType: string
  fundingStage: string
  estimatedFunding: string
  expectations: string
}

export interface InvestorOutput {
  investors: InvestorMatch[]
  fundingStage: string
  estimatedFunding: string
  pitchSuggestions: string[]
}

export async function matchInvestors(idea: {
  title: string
  description: string
  industry: string
  businessModel?: string
  budget?: string
}): Promise<InvestorOutput> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `You are a venture capital matchmaker. Analyze this startup and recommend investors.

STARTUP:
Title: ${idea.title}
Description: ${idea.description}
Industry: ${idea.industry}
Business Model: ${idea.businessModel || 'Not specified'}
Budget: ${idea.budget || 'Not specified'}

Return ONLY a valid JSON object. No markdown.

{
  "investors": [
    { "investorType": "Angel Investors / Micro VCs interested in <industry>", "fundingStage": "Pre-seed / Seed", "estimatedFunding": "$100K - $500K", "expectations": "Traction, MVP, team background" }
  ],
  "fundingStage": "Recommended funding stage",
  "estimatedFunding": "Estimated range",
  "pitchSuggestions": ["Suggestion 1", "Suggestion 2", "Suggestion 3"]
}`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()
  const cleaned = text.replace(/```json?/gi, '').replace(/```/g, '').trim()
  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')
  const json = cleaned.slice(firstBrace, lastBrace + 1)

  return JSON.parse(json) as InvestorOutput
}
