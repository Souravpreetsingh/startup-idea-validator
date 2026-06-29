import mongoose, { Document, Schema } from 'mongoose'

export interface ITeamDocument extends Document {
  name: string
  ownerId: mongoose.Types.ObjectId
  createdAt: Date
  updatedAt: Date
}

const teamSchema = new Schema<ITeamDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
)

export const Team = mongoose.model<ITeamDocument>('Team', teamSchema)
