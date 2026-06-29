import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

export interface PitchOutput {
  elevatorPitch: string
  oneMinutePitch: string
  detailedPitch: string
  problemStatement: string
  visionStatement: string
}

export async function generatePitch(idea: {
  title: string
  description: string
  industry: string
  problemStatement?: string
  expectedSolution?: string
}): Promise<PitchOutput> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `You are a pitch coach and storytelling expert. Generate compelling pitch materials for this startup.

STARTUP:
Title: ${idea.title}
Description: ${idea.description}
Industry: ${idea.industry}
Problem: ${idea.problemStatement || 'Not specified'}
Solution: ${idea.expectedSolution || 'Not specified'}

Return ONLY a valid JSON object. No markdown.

{
  "elevatorPitch": "One sentence, under 30 words",
  "oneMinutePitch": "A compelling 60-second pitch (150 words max)",
  "detailedPitch": "A 3-minute pitch with problem, solution, market, traction, ask",
  "problemStatement": "Clear articulation of the problem being solved",
  "visionStatement": "Inspiring long-term vision for the company"
}`

  const result = await model.generateContent(prompt)
  const text = result.response.text().trim()
  const cleaned = text.replace(/```json?/gi, '').replace(/```/g, '').trim()
  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')
  const json = cleaned.slice(firstBrace, lastBrace + 1)

  return JSON.parse(json) as PitchOutput
}
