import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'
import { IStartupIdeaDocument } from '../models/StartupIdea'
import logger from '../config/logger'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
const TIMEOUT_MS = 30000

export interface Competitor {
  name: string
  strengths: string
  weaknesses: string
}

export interface Swot {
  strengths: string[]
  weaknesses: string[]
  opportunities: string[]
  threats: string[]
}

export interface AnalysisOutput {
  ideaScore: number
  marketDemand: string
  competition: string
  competitors: Competitor[]
  swot: Swot
  revenueSuggestions: string[]
  growthStrategy: string
  mvpRoadmap: string[]
  successProbability: number
}

function sanitizeJson(text: string): string {
  logger.debug('[AI Analysis] Sanitizing raw AI response', { originalLength: text.length })

  let cleaned = text.replace(/```json?/gi, '').replace(/```/g, '').trim()

  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1) {
    cleaned = cleaned.slice(firstBrace, lastBrace + 1)
  }

  const trailingComma = /,(\s*[}\]])/g
  cleaned = cleaned.replace(trailingComma, '$1')

  logger.debug('[AI Analysis] Sanitized response', { sanitizedLength: cleaned.length })
  return cleaned
}

function validateAnalysisOutput(data: Record<string, unknown>): AnalysisOutput {
  const errors: string[] = []

  if (typeof data.ideaScore !== 'number' || data.ideaScore < 0 || data.ideaScore > 100) {
    errors.push('ideaScore must be a number between 0-100')
  }
  if (typeof data.successProbability !== 'number' || data.successProbability < 0 || data.successProbability > 100) {
    errors.push('successProbability must be a number between 0-100')
  }
  if (!data.marketDemand || typeof data.marketDemand !== 'string') {
    errors.push('marketDemand is required and must be a string')
  }
  if (!data.competition || typeof data.competition !== 'string') {
    errors.push('competition is required and must be a string')
  }
  if (!data.swot || typeof data.swot !== 'object') {
    errors.push('swot is required and must be an object')
  } else {
    const swot = data.swot as Record<string, unknown>
    for (const key of ['strengths', 'weaknesses', 'opportunities', 'threats']) {
      if (!Array.isArray(swot[key])) {
        errors.push(`swot.${key} must be an array`)
      }
    }
  }
  if (!Array.isArray(data.revenueSuggestions)) {
    errors.push('revenueSuggestions must be an array')
  }
  if (!data.growthStrategy || typeof data.growthStrategy !== 'string') {
    errors.push('growthStrategy is required and must be a string')
  }
  if (!Array.isArray(data.mvpRoadmap)) {
    errors.push('mvpRoadmap must be an array')
  }
  if (data.competitors !== undefined && !Array.isArray(data.competitors)) {
    errors.push('competitors must be an array')
  }

  if (errors.length > 0) {
    throw new Error(`AI response validation failed: ${errors.join('; ')}`)
  }

  return {
    ideaScore: data.ideaScore as number,
    marketDemand: data.marketDemand as string,
    competition: data.competition as string,
    competitors: (data.competitors as Competitor[]) || [],
    swot: {
      strengths: (data.swot as Swot).strengths || [],
      weaknesses: (data.swot as Swot).weaknesses || [],
      opportunities: (data.swot as Swot).opportunities || [],
      threats: (data.swot as Swot).threats || [],
    },
    revenueSuggestions: data.revenueSuggestions as string[],
    growthStrategy: data.growthStrategy as string,
    mvpRoadmap: data.mvpRoadmap as string[],
    successProbability: data.successProbability as number,
  }
}

function buildPrompt(idea: IStartupIdeaDocument): string {
  return `You are a world-class startup analyst and venture capitalist. Analyze the following startup idea and produce a rigorous, data-driven evaluation.

STARTUP IDEA:
Title: ${idea.title}
Description: ${idea.description}
Industry: ${idea.industry}
Target Audience: ${idea.targetAudience || 'Not specified'}
Budget: ${idea.budget || 'Not specified'}
Business Model: ${idea.businessModel || 'Not specified'}
Problem Statement: ${idea.problemStatement || 'Not specified'}
Expected Solution: ${idea.expectedSolution || 'Not specified'}

Return ONLY a valid JSON object. No markdown, no code fences, no commentary.

{
  "ideaScore": <integer 0-100>,
  "marketDemand": "<2-3 sentence analysis of market size, trends, and demand signals>",
  "competition": "<2-3 sentence competitive landscape summary>",
  "competitors": [
    { "name": "<competitor name>", "strengths": "<key strengths>", "weaknesses": "<key weaknesses>" }
  ],
  "swot": {
    "strengths": ["<strength 1>", "<strength 2>"],
    "weaknesses": ["<weakness 1>", "<weakness 2>"],
    "opportunities": ["<opportunity 1>", "<opportunity 2>"],
    "threats": ["<threat 1>", "<threat 2>"]
  },
  "revenueSuggestions": ["<monetization strategy 1>", "<monetization strategy 2>", "<monetization strategy 3>"],
  "growthStrategy": "<2-3 sentence go-to-market and scaling strategy>",
  "mvpRoadmap": ["<milestone 1: timeline>", "<milestone 2: timeline>", "<milestone 3: timeline>", "<milestone 4: timeline>"],
  "successProbability": <integer 0-100>
}`
}

const fallbackResult: AnalysisOutput = {
  ideaScore: 50,
  marketDemand: 'Analysis temporarily unavailable. Please try again.',
  competition: 'Analysis temporarily unavailable.',
  competitors: [],
  swot: {
    strengths: ['Unable to determine strengths at this time'],
    weaknesses: ['Unable to determine weaknesses at this time'],
    opportunities: ['Unable to determine opportunities at this time'],
    threats: ['Unable to determine threats at this time'],
  },
  revenueSuggestions: ['Unable to generate revenue suggestions at this time'],
  growthStrategy: 'Analysis temporarily unavailable.',
  mvpRoadmap: ['Unable to generate roadmap at this time'],
  successProbability: 50,
}

export async function analyzeStartupIdea(idea: IStartupIdeaDocument): Promise<AnalysisOutput> {
  logger.info('[AI Analysis] Starting analysis', { title: idea.title, industry: idea.industry })

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const prompt = buildPrompt(idea)

  logger.info('[AI Analysis] Generated prompt', { promptLength: prompt.length })
  logger.debug('[AI Analysis] Sending to AI', { prompt })

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const result = await model.generateContent(prompt)
    clearTimeout(timeoutId)

    const response = result.response
    const rawText = response.text()

    logger.info('[AI Analysis] Raw AI response received', { responseLength: rawText?.length || 0 })
    logger.debug('[AI Analysis] AI response', { response: rawText })

    if (!rawText || rawText.trim().length === 0) {
      logger.warn('[AI Analysis] Empty response from Gemini API')
      return fallbackResult
    }

    const sanitized = sanitizeJson(rawText)

    logger.debug('[AI Analysis] Parsing sanitized JSON')
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(sanitized)
      logger.info('[AI Analysis] JSON parsed successfully')
    } catch (parseError: unknown) {
      const message = parseError instanceof Error ? parseError.message : 'Parse error'
      logger.error('[AI Analysis] Failed to parse AI JSON response', { error: message, sanitized })
      return fallbackResult
    }

    const validated = validateAnalysisOutput(parsed)
    logger.info('[AI Analysis] Analysis validated successfully', {
      score: validated.ideaScore,
      probability: validated.successProbability,
    })

    return validated
  } catch (error: unknown) {
    clearTimeout(timeoutId)

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        logger.error('[AI Analysis] Request timed out after 30s')
      } else if (error.message.includes('SAFETY')) {
        logger.error('[AI Analysis] Response blocked by safety filters')
      } else if (error.message.includes('validation failed')) {
        logger.error('[AI Analysis] Validation error', { error: error.message })
      } else if (error.message.includes('API_KEY')) {
        logger.error('[AI Analysis] Invalid or missing Gemini API key')
      } else {
        logger.error('[AI Analysis] Unexpected error', { error: error.message, stack: error.stack })
      }
    }

    return fallbackResult
  }
}
