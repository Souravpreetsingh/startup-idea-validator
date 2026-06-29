import mongoose, { Document, Schema } from 'mongoose'

export interface IUserBadgeDocument extends Document {
  userId: mongoose.Types.ObjectId
  badgeKey: string
  earnedAt: Date
}

const userBadgeSchema = new Schema<IUserBadgeDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    badgeKey: { type: String, required: true },
    earnedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
)

userBadgeSchema.index({ userId: 1, badgeKey: 1 }, { unique: true })

export const UserBadge = mongoose.model<IUserBadgeDocument>('UserBadge', userBadgeSchema)
