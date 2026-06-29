import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcryptjs'

export interface IUserDocument extends Document {
  fullName: string
  email: string
  password: string
  startupExperience?: string
  industryInterest?: string
  profileImage?: string
  comparePassword(candidatePassword: string): Promise<boolean>
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUserDocument>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name must be at most 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    startupExperience: {
      type: String,
      trim: true,
      maxlength: [500, 'Startup experience must be at most 500 characters'],
    },
    industryInterest: {
      type: String,
      trim: true,
      maxlength: [200, 'Industry interest must be at most 200 characters'],
    },
    profileImage: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

userSchema.set('toJSON', {
  transform(_doc: any, ret: any) {
    delete ret.password
    delete ret.__v
    return ret
  },
})

export const User = mongoose.model<IUserDocument>('User', userSchema)
