import mongoose, { Document, Schema } from 'mongoose'

export interface IStartupIdeaDocument extends Document {
  userId: mongoose.Types.ObjectId
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

const startupIdeaSchema = new Schema<IStartupIdeaDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title must be at most 200 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [5000, 'Description must be at most 5000 characters'],
    },
    industry: {
      type: String,
      required: [true, 'Industry is required'],
      trim: true,
      maxlength: [100, 'Industry must be at most 100 characters'],
    },
    targetAudience: {
      type: String,
      trim: true,
      maxlength: [1000, 'Target audience must be at most 1000 characters'],
    },
    budget: {
      type: String,
      trim: true,
      maxlength: [500, 'Budget must be at most 500 characters'],
    },
    businessModel: {
      type: String,
      trim: true,
      maxlength: [1000, 'Business model must be at most 1000 characters'],
    },
    problemStatement: {
      type: String,
      trim: true,
      maxlength: [2000, 'Problem statement must be at most 2000 characters'],
    },
    expectedSolution: {
      type: String,
      trim: true,
      maxlength: [2000, 'Expected solution must be at most 2000 characters'],
    },
  },
  { timestamps: true }
)

startupIdeaSchema.index({ userId: 1, createdAt: -1 })

export const StartupIdea = mongoose.model<IStartupIdeaDocument>('StartupIdea', startupIdeaSchema)
