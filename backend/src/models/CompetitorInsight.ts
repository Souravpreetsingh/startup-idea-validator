import mongoose, { Document, Schema } from 'mongoose'

export interface ICompetitorDetail {
  name: string
  funding?: string
  strengths: string[]
  weaknesses: string[]
  marketPosition?: string
  pricingStrategy?: string
  estimatedUserBase?: string
}

export interface ICompetitorInsightDocument extends Document {
  ideaId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  competitors: ICompetitorDetail[]
  marketPosition: string
  generatedAt: Date
}

const competitorDetailSchema = new Schema<ICompetitorDetail>({
  name: { type: String, required: true },
  funding: String,
  strengths: [String],
  weaknesses: [String],
  marketPosition: String,
  pricingStrategy: String,
  estimatedUserBase: String,
}, { _id: false })

const competitorInsightSchema = new Schema<ICompetitorInsightDocument>({
  ideaId: { type: Schema.Types.ObjectId, ref: 'StartupIdea', required: true, unique: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  competitors: [competitorDetailSchema],
  marketPosition: { type: String, required: true },
  generatedAt: { type: Date, default: Date.now },
}, { timestamps: true })

export const CompetitorInsight = mongoose.model<ICompetitorInsightDocument>('CompetitorInsight', competitorInsightSchema)
