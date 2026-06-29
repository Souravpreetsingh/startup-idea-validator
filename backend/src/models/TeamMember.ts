import mongoose, { Document, Schema } from 'mongoose'

export type TeamRole = 'owner' | 'admin' | 'member'

export interface ITeamMemberDocument extends Document {
  teamId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId
  role: TeamRole
  joinedAt: Date
}

const teamMemberSchema = new Schema<ITeamMemberDocument>(
  {
    teamId: { type: Schema.Types.ObjectId, ref: 'Team', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member',
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
)

teamMemberSchema.index({ teamId: 1, userId: 1 }, { unique: true })

export const TeamMember = mongoose.model<ITeamMemberDocument>('TeamMember', teamMemberSchema)
