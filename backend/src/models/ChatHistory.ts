import mongoose, { Document, Schema } from 'mongoose'

export interface IMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface IChatHistoryDocument extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  messages: IMessage[]
  createdAt: Date
  updatedAt: Date
}

const messageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
)

const chatHistorySchema = new Schema<IChatHistoryDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
      index: true,
    },
    title: {
      type: String,
      default: 'New Chat',
      maxlength: [200, 'Title must be at most 200 characters'],
    },
    messages: {
      type: [messageSchema],
      default: [],
    },
  },
  { timestamps: true }
)

chatHistorySchema.index({ userId: 1, updatedAt: -1 })

export const ChatHistory = mongoose.model<IChatHistoryDocument>('ChatHistory', chatHistorySchema)
