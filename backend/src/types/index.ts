import { Request } from 'express'

export interface AuthRequest extends Request {
  userId?: string
}

export interface SignupBody {
  fullName: string
  email: string
  password: string
  startupExperience?: string
  industryInterest?: string
}

export interface LoginBody {
  email: string
  password: string
}

export interface IdeaBody {
  title: string
  description: string
  industry: string
  targetAudience?: string
  budget?: string
  businessModel?: string
  problemStatement?: string
  expectedSolution?: string
}

export interface ChatBody {
  message: string
  chatId?: string
}

export interface IUser {
  _id: string
  fullName: string
  email: string
  password: string
  startupExperience?: string
  industryInterest?: string
  profileImage?: string
  createdAt: Date
  updatedAt: Date
}

export interface IStartupIdea {
  _id: string
  userId: string
  title: string
  description: string
  industry: string
  targetAudience?: string
  budget?: string
  businessModel?: string
  problemStatement?: string
  expectedSolution?: string
  createdAt: Date
  updatedAt: Date
}

export interface IAnalysisResult {
  _id: string
  ideaId: string
  userId: string
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
  createdAt: Date
}

export interface IChatHistory {
  _id: string
  userId: string
  messages: { role: 'user' | 'assistant'; content: string; timestamp: Date }[]
  createdAt: Date
  updatedAt: Date
}
