import mongoose, { Document, Schema } from 'mongoose'

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'

export interface ITaskDocument extends Document {
  userId: mongoose.Types.ObjectId
  title: string
  description?: string
  status: TaskStatus
  priority: 'low' | 'medium' | 'high'
  deadline?: Date
  completedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const taskSchema = new Schema<ITaskDocument>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 500 },
  description: { type: String, trim: true, maxlength: 2000 },
  status: { type: String, enum: ['pending', 'in_progress', 'completed', 'cancelled'], default: 'pending' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  deadline: Date,
  completedAt: Date,
}, { timestamps: true })

taskSchema.index({ userId: 1, status: 1 })
taskSchema.index({ userId: 1, deadline: 1 })

export const Task = mongoose.model<ITaskDocument>('Task', taskSchema)
