import { z } from 'zod'

export const createIdeaSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters').max(200),
    description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
    industry: z.string().min(1, 'Industry is required').max(100),
    targetAudience: z.string().max(1000).optional(),
    budget: z.string().max(500).optional(),
    businessModel: z.string().max(1000).optional(),
    problemStatement: z.string().max(2000).optional(),
    expectedSolution: z.string().max(2000).optional(),
  }),
})

export const updateIdeaSchema = z.object({
  body: z.object({
    title: z.string().min(3).max(200).optional(),
    description: z.string().min(10).max(5000).optional(),
    industry: z.string().min(1).max(100).optional(),
    targetAudience: z.string().max(1000).optional(),
    budget: z.string().max(500).optional(),
    businessModel: z.string().max(1000).optional(),
    problemStatement: z.string().max(2000).optional(),
    expectedSolution: z.string().max(2000).optional(),
  }),
})
