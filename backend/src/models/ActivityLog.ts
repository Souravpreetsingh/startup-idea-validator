import mongoose, { Document, Schema } from 'mongoose'

export interface IActivityLogDocument extends Document {
  userId: mongoose.Types.ObjectId
  action: string
  category: string
  metadata?: Record<string, unknown>
  ip?: string
  timestamp: Date
}

const activityLogSchema = new Schema<IActivityLogDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    action: { type: String, required: true },
    category: {
      type: String,
      enum: ['auth', 'idea', 'analysis', 'chat', 'upload', 'export'],
      required: true,
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
    ip: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: false }
)

activityLogSchema.index({ userId: 1, timestamp: -1 })
activityLogSchema.index({ category: 1, timestamp: -1 })
activityLogSchema.index({ timestamp: -1 })

export const ActivityLog = mongoose.model<IActivityLogDocument>('ActivityLog', activityLogSchema)
