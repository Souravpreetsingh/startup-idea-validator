import { z } from 'zod'

export const sendMessageSchema = z.object({
  body: z.object({
    message: z.string().min(1, 'Message is required').max(5000),
    chatId: z.string().optional(),
  }),
})
