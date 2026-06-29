import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'
import { IStartupIdeaDocument } from '../models/StartupIdea'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)

interface AnalysisResponse {
  ideaScore: number
  marketDemand: string
  competition: string
  swot: {
    strengths: string[]
    weaknesses: string[]
    opportunities: string[]
    threats: string[]
  }
  revenueSuggestions: string[]
  growthStrategy: string
  mvpRoadmap: string[]
  successProbability: number
}

export async function analyzeStartupIdea(idea: IStartupIdeaDocument): Promise<AnalysisResponse> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `You are an expert startup analyst and venture capitalist. Analyze the following startup idea and provide a comprehensive evaluation.

STARTUP IDEA:
Title: ${idea.title}
Description: ${idea.description}
Industry: ${idea.industry}
Target Audience: ${idea.targetAudience || 'Not specified'}
Budget: ${idea.budget || 'Not specified'}
Business Model: ${idea.businessModel || 'Not specified'}
Problem Statement: ${idea.problemStatement || 'Not specified'}
Expected Solution: ${idea.expectedSolution || 'Not specified'}

Provide a JSON response with EXACTLY this structure (no markdown, no formatting, just raw JSON):
{
  "ideaScore": <number between 0-100>,
  "marketDemand": "<brief market demand analysis>",
  "competition": "<competition analysis>",
  "swot": {
    "strengths": ["<strength1>", "<strength2>"],
    "weaknesses": ["<weakness1>", "<weakness2>"],
    "opportunities": ["<opportunity1>", "<opportunity2>"],
    "threats": ["<threat1>", "<threat2>"]
  },
  "revenueSuggestions": ["<suggestion1>", "<suggestion2>", "<suggestion3>"],
  "growthStrategy": "<growth strategy description>",
  "mvpRoadmap": ["<milestone1>", "<milestone2>", "<milestone3>", "<milestone4>"],
  "successProbability": <number between 0-100>
}`

  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text().trim()

  const cleaned = text.replace(/```json?/g, '').replace(/```/g, '').trim()

  return JSON.parse(cleaned) as AnalysisResponse
}

export async function chatWithAI(
  message: string,
  chatHistory: { role: string; content: string }[]
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const historyContext = chatHistory
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n')

  const prompt = `You are Validator AI, an expert startup advisor. You help entrepreneurs validate, refine, and grow their startup ideas. Be concise, practical, and data-driven.

Previous conversation:
${historyContext}

User: ${message}

Assistant:`

  const result = await model.generateContent(prompt)
  const response = result.response
  return response.text().trim()
}
