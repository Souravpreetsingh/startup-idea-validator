import { z } from 'zod'

export const signupSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters').max(100),
    email: z.string().email('Please provide a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    startupExperience: z.string().max(500).optional(),
    industryInterest: z.string().max(200).optional(),
  }),
})

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email'),
    password: z.string().min(1, 'Password is required'),
  }),
})

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email('Please provide a valid email'),
  }),
})

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(1, 'Token is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
})
