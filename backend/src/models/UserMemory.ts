import mongoose, { Document, Schema } from 'mongoose'

export interface IPreference {
  key: string
  value: string
}

export interface IUserMemoryDocument extends Document {
  userId: mongoose.Types.ObjectId
  preferences: IPreference[]
  previousIdeas: string[]
  chatContext: string[]
  createdAt: Date
  updatedAt: Date
}

const preferenceSchema = new Schema<IPreference>(
  { key: String, value: String },
  { _id: false }
)

const userMemorySchema = new Schema<IUserMemoryDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    preferences: { type: [preferenceSchema], default: [] },
    previousIdeas: { type: [String], default: [] },
    chatContext: { type: [String], default: [], maxlength: 50 },
  },
  { timestamps: true }
)

export const UserMemory = mongoose.model<IUserMemoryDocument>('UserMemory', userMemorySchema)
