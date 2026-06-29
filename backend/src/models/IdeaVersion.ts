import mongoose, { Document, Schema } from 'mongoose'

export interface IIdeaVersionDocument extends Document {
  ideaId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  version: number
  snapshot: Record<string, unknown>
  changes: {
    field: string
    oldValue: unknown
    newValue: unknown
  }[]
  createdAt: Date
}

const ideaVersionSchema = new Schema<IIdeaVersionDocument>({
  ideaId: { type: Schema.Types.ObjectId, ref: 'StartupIdea', required: true, index: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  version: { type: Number, required: true },
  snapshot: { type: Schema.Types.Mixed, required: true },
  changes: [{
    field: String,
    oldValue: Schema.Types.Mixed,
    newValue: Schema.Types.Mixed,
  }],
  createdAt: { type: Date, default: Date.now },
})

ideaVersionSchema.index({ ideaId: 1, version: -1 })

export const IdeaVersion = mongoose.model<IIdeaVersionDocument>('IdeaVersion', ideaVersionSchema)
