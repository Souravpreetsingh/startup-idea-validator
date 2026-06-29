import mongoose, { Document, Schema } from 'mongoose'

export interface IFavoriteDocument extends Document {
  userId: mongoose.Types.ObjectId
  ideaId: mongoose.Types.ObjectId
  createdAt: Date
}

const favoriteSchema = new Schema<IFavoriteDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    ideaId: {
      type: Schema.Types.ObjectId,
      ref: 'StartupIdea',
      required: true,
    },
  },
  { timestamps: true }
)

favoriteSchema.index({ userId: 1, ideaId: 1 }, { unique: true })

export const Favorite = mongoose.model<IFavoriteDocument>('Favorite', favoriteSchema)
