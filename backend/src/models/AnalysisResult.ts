import mongoose, { Document, Schema } from 'mongoose'

export interface ICompetitor {
  name: string
  strengths: string
  weaknesses: string
}

export interface IAnalysisResultDocument extends Document {
  ideaId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  ideaScore: number
  marketDemand: string
  competition: string
  competitors: ICompetitor[]
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

const analysisResultSchema = new Schema<IAnalysisResultDocument>(
  {
    ideaId: {
      type: Schema.Types.ObjectId,
      ref: 'StartupIdea',
      required: [true, 'Idea ID is required'],
      unique: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    ideaScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    marketDemand: {
      type: String,
      required: true,
    },
    competition: {
      type: String,
      required: true,
    },
    competitors: {
      type: [{ name: String, strengths: String, weaknesses: String }],
      default: [],
    },
    swot: {
      strengths: { type: [String], default: [] },
      weaknesses: { type: [String], default: [] },
      opportunities: { type: [String], default: [] },
      threats: { type: [String], default: [] },
    },
    revenueSuggestions: {
      type: [String],
      default: [],
    },
    growthStrategy: {
      type: String,
      default: '',
    },
    mvpRoadmap: {
      type: [String],
      default: [],
    },
    successProbability: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
)

export const AnalysisResult = mongoose.model<IAnalysisResultDocument>('AnalysisResult', analysisResultSchema)
