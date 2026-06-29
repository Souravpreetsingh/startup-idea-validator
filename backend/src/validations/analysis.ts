import { z } from 'zod'

export const generateAnalysisSchema = z.object({
  body: z.object({
    ideaId: z.string().min(1, 'Idea ID is required'),
  }),
})
