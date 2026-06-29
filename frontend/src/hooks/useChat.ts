import { useState, useCallback } from 'react'
import { chatService, type Chat, type ChatMessage } from '@/services/chatService'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [sending, setSending] = useState(false)
  const [chatId, setChatId] = useState<string | null>(null)

  const send = useCallback(async (message: string) => {
    if (!message.trim()) return
    setSending(true)

    const userMsg: ChatMessage = { role: 'user', content: message, timestamp: new Date().toISOString() }
    setMessages((prev) => [...prev, userMsg])

    try {
      const res = await chatService.sendMessage(message, chatId || undefined)
      const reply: ChatMessage = {
        role: 'assistant',
        content: res.data.reply,
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, reply])
      if (!chatId) setChatId(res.data.chat._id)
    } catch {
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setSending(false)
    }
  }, [chatId])

  const loadChat = useCallback(async (id: string) => {
    try {
      const res = await chatService.getChatById(id)
      setChatId(id)
      setMessages(res.data.chat.messages || [])
    } catch {
      setMessages([])
    }
  }, [])

  const reset = useCallback(() => {
    setMessages([])
    setChatId(null)
  }, [])

  return { messages, sending, chatId, send, loadChat, reset }
}
