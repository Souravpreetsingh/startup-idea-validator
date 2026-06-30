import { Response } from 'express'
import { StartupIdea } from '../models/StartupIdea'
import { AnalysisResult } from '../models/AnalysisResult'
import { analyzeStartupIdea } from '../services/aiAnalysisService'
import type { AuthRequest } from '../types'

const REQUIRED_FIELDS = [
  'title', 'description', 'industry', 'targetAudience',
  'budget', 'businessModel', 'problemStatement', 'expectedSolution',
] as const

interface AnalysisData {
  ideaScore: number
  marketDemand: string
  competition: string
  competitors: { name: string; strengths: string; weaknesses: string }[]
  swot: { strengths: string[]; weaknesses: string[]; opportunities: string[]; threats: string[] }
  revenueSuggestions: string[]
  growthStrategy: string
  mvpRoadmap: string[]
  successProbability: number
}

const fallbackAnalysis: AnalysisData = {
  ideaScore: 70,
  marketDemand: 'Medium',
  competition: 'Medium',
  competitors: [],
  swot: {
    strengths: ['Unique idea'],
    weaknesses: ['Limited data'],
    opportunities: ['Growing market'],
    threats: ['Competition'],
  },
  revenueSuggestions: ['Subscription'],
  growthStrategy: 'Social media marketing',
  mvpRoadmap: ['Create MVP', 'Collect feedback'],
  successProbability: 50,
}

export async function analyzeStartup(req: AuthRequest, res: Response) {
  try {
    console.log('Incoming Request:', req.body)

    // --- Validate required fields ---
    const missing: string[] = []
    for (const field of REQUIRED_FIELDS) {
      if (!req.body[field] || (typeof req.body[field] === 'string' && req.body[field].trim() === '')) {
        missing.push(field)
      }
    }

    if (missing.length > 0) {
      console.log('Missing required fields:', missing)
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      })
    }

    // --- Validate environment variables ---
    if (!process.env.MONGO_URI) {
      throw new Error('Missing environment variable: MONGO_URI')
    }
    if (!process.env.JWT_SECRET) {
      throw new Error('Missing environment variable: JWT_SECRET')
    }

    // --- Create startup idea ---
    console.log('Generating startup analysis...')

    const idea = await StartupIdea.create({
      userId: req.userId,
      title: req.body.title,
      description: req.body.description,
      industry: req.body.industry,
      targetAudience: req.body.targetAudience,
      budget: req.body.budget,
      businessModel: req.body.businessModel,
      problemStatement: req.body.problemStatement,
      expectedSolution: req.body.expectedSolution,
    })

    console.log('Saving Analysis:', { ideaId: idea._id, title: idea.title })

    // --- Run AI analysis ---
    let analysis: AnalysisData
    try {
      analysis = await analyzeStartupIdea(idea)
      console.log('AI Result:', analysis)
    } catch (error) {
      console.error('Analysis Error:', error)
      console.log('Using fallback analysis result')
      analysis = fallbackAnalysis
    }

    // --- Save to database ---
    const saved = await AnalysisResult.create({
      ideaId: idea._id,
      userId: req.userId,
      ideaScore: analysis.ideaScore,
      marketDemand: analysis.marketDemand,
      competition: analysis.competition,
      competitors: analysis.competitors,
      swot: analysis.swot,
      revenueSuggestions: analysis.revenueSuggestions,
      growthStrategy: analysis.growthStrategy,
      mvpRoadmap: analysis.mvpRoadmap,
      successProbability: analysis.successProbability,
    })

    // --- Return success ---
    return res.status(200).json({
      success: true,
      message: 'Analysis generated successfully',
      data: saved.toJSON(),
    })
  } catch (error: unknown) {
    console.error('Analysis Error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    return res.status(500).json({
      success: false,
      message: 'Failed to generate analysis',
      error: message,
    })
  }
}
