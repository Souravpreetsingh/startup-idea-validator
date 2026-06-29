import mongoose, { Document, Schema } from 'mongoose'

export type InviteStatus = 'pending' | 'accepted' | 'declined'

export interface ITeamInviteDocument extends Document {
  teamId: mongoose.Types.ObjectId
  email: string
  invitedBy: mongoose.Types.ObjectId
  status: InviteStatus
  expiresAt: Date
  createdAt: Date
}

const teamInviteSchema = new Schema<ITeamInviteDocument>(
  {
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  },
  { timestamps: true }
)

teamInviteSchema.index({ email: 1, teamId: 1 })

export const TeamInvite = mongoose.model<ITeamInviteDocument>('TeamInvite', teamInviteSchema)
