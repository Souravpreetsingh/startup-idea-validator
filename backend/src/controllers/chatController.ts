import { Response } from 'express'
import { ChatHistory } from '../models/ChatHistory'
import { chatWithAI } from '../services/aiChatService'
import { sendSuccess } from '../utils/apiResponse'
import { asyncHandler } from '../utils/asyncHandler'
import { NotFoundError, AppError } from '../utils/errors'
import type { AuthRequest } from '../types'

export const sendMessage = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { message, chatId } = req.body

  if (!message || message.trim().length === 0) {
    throw new AppError('Message is required', 400)
  }

  let chat

  if (chatId) {
    chat = await ChatHistory.findById(chatId)
    if (!chat) {
      throw new NotFoundError('Chat session')
    }
    if (chat.userId.toString() !== req.userId) {
      throw new AppError('Not authorized to access this chat', 403)
    }
  } else {
    chat = await ChatHistory.create({
      userId: req.userId,
      title: message.slice(0, 100),
      messages: [],
    })
    console.log(`[Chat] Created new chat session: ${chat._id}`)
  }

  const history = chat.messages.map((m) => ({
    role: m.role,
    content: m.content,
  }))

  chat.messages.push({ role: 'user', content: message, timestamp: new Date() })

  console.log(`[Chat] Sending to AI (history: ${history.length} prior messages)`)
  const aiResponse = await chatWithAI(message, history)

  chat.messages.push({ role: 'assistant', content: aiResponse, timestamp: new Date() })
  await chat.save()

  sendSuccess(res, {
    chat: {
      _id: chat._id,
      title: chat.title,
      messages: chat.messages,
    },
    reply: aiResponse,
  })
})

export const getChatHistory = asyncHandler(async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 20
  const skip = (page - 1) * limit

  const [chats, total] = await Promise.all([
    ChatHistory.find({ userId: req.userId })
      .select('title updatedAt createdAt')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit),
    ChatHistory.countDocuments({ userId: req.userId }),
  ])

  sendSuccess(res, {
    chats,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  })
})

export const getChatById = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chat = await ChatHistory.findById(req.params.id)
  if (!chat) {
    throw new NotFoundError('Chat session')
  }
  if (chat.userId.toString() !== req.userId) {
    throw new AppError('Not authorized to access this chat', 403)
  }

  sendSuccess(res, { chat: chat.toJSON() })
})

export const deleteChat = asyncHandler(async (req: AuthRequest, res: Response) => {
  const chat = await ChatHistory.findById(req.params.id)
  if (!chat) {
    throw new NotFoundError('Chat session')
  }
  if (chat.userId.toString() !== req.userId) {
    throw new AppError('Not authorized to delete this chat', 403)
  }

  await chat.deleteOne()
  console.log(`[Chat] Deleted chat: ${req.params.id}`)

  sendSuccess(res, null, 'Chat deleted successfully')
})
