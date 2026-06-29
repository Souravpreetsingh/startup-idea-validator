import { GoogleGenerativeAI } from '@google/generative-ai'
import { env } from '../config/env'

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY)
const TIMEOUT_MS = 30000

const fallbackReply = 'I apologize, but I am unable to process your request at the moment. Please try again in a few moments.'

interface ChatMessage {
  role: string
  content: string
}

function buildChatPrompt(message: string, history: ChatMessage[]): string {
  const historyContext = history
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n')

  return `You are Validator AI, an expert startup advisor and venture coach. You help entrepreneurs validate ideas, refine strategies, and navigate fundraising.

Your expertise covers:
- Startup validation and market analysis
- Business model design and monetization
- Competitor analysis and positioning
- Fundraising, pitch decks, and investor relations
- Product development, MVP planning, and growth
- Industry trends across SaaS, Fintech, HealthTech, EdTech, AI/ML, and more

Be concise, practical, and data-driven. Use examples when helpful. If you don't know something, say so directly.

${historyContext ? `Previous conversation:\n${historyContext}\n` : ''}
User: ${message}

Assistant:`
}

function sanitizeReply(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export async function chatWithAI(
  message: string,
  history: ChatMessage[]
): Promise<string> {
  console.log(`[AI Chat] Processing message: "${message.slice(0, 60)}..."`)

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
  const prompt = buildChatPrompt(message, history)

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const result = await model.generateContent(prompt)
    clearTimeout(timeoutId)

    const response = result.response
    const rawText = response.text()

    if (!rawText || rawText.trim().length === 0) {
      console.warn('[AI Chat] Empty response from Gemini')
      return fallbackReply
    }

    const sanitized = sanitizeReply(rawText)
    console.log(`[AI Chat] Response generated (${sanitized.length} chars)`)
    return sanitized
  } catch (error: unknown) {
    clearTimeout(timeoutId)

    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.error('[AI Chat] Request timed out')
      } else if (error.message.includes('SAFETY')) {
        console.error('[AI Chat] Response blocked by safety filters')
        return 'I cannot provide advice on that topic. Please ask a startup-related question.'
      } else {
        console.error(`[AI Chat] Error: ${error.message}`)
      }
    }

    return fallbackReply
  }
}
