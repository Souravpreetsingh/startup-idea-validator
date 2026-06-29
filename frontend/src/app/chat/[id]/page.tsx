'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useChat } from '@/hooks/useChat'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'

export default function ChatSessionPage() {
  const { id } = useParams<{ id: string }>()
  const { user, loading: authLoading } = useAuth()
  const { messages, sending, send, loadChat } = useChat()
  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (user && id) loadChat(id)
  }, [user, id, loadChat])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || sending) return
    const msg = input
    setInput('')
    await send(msg)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (authLoading || !user) return null

  return (
    <body className="flex h-screen w-full bg-surface text-on-surface overflow-hidden">
      <Sidebar />
      <main className="flex-1 md:ml-64 flex flex-col h-full relative bg-surface">
        <header className="sticky top-0 w-full p-6 flex items-center justify-between z-10 bg-surface/80 backdrop-blur-md border-b border-outline-variant/50">
          <button onClick={() => router.push('/chat')} className="text-on-surface-variant hover:text-on-surface flex items-center gap-1">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-sm">Back</span>
          </button>
          <h2 className="font-headline-md text-[20px] text-on-surface">Chat</h2>
          <div className="w-20" />
        </header>

        <div className="flex-1 overflow-y-auto px-6 md:px-8 pt-6 pb-4 flex flex-col gap-4 max-w-4xl mx-auto w-full">
          {messages.length === 0 && (
            <div className="flex gap-4 self-start max-w-[75%]">
              <div className="w-8 h-8 rounded-full bg-tertiary-fixed border border-tertiary-fixed-dim flex items-center justify-center shrink-0 mt-1">
                <span className="material-symbols-outlined text-tertiary text-[18px]">smart_toy</span>
              </div>
              <div className="bg-surface-container-lowest border border-tertiary-fixed rounded-2xl rounded-tl-sm p-5 shadow-sm">
                <p className="text-body-md text-on-surface">Continue your conversation with Validator AI.</p>
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-4 max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                  msg.role === 'user'
                    ? 'bg-surface-container-high border border-outline-variant'
                    : 'bg-tertiary-fixed border border-tertiary-fixed-dim'
                }`}
              >
                <span className={`material-symbols-outlined text-[18px] ${msg.role === 'user' ? 'text-on-surface-variant' : 'text-tertiary'}`}>
                  {msg.role === 'user' ? 'person' : 'smart_toy'}
                </span>
              </div>
              <div
                className={`p-4 shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-surface-container-lowest border border-outline-variant rounded-2xl rounded-tr-sm'
                    : 'bg-surface-container-lowest border border-tertiary-fixed rounded-2xl rounded-tl-sm'
                }`}
              >
                <p className="text-body-md text-on-surface whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {sending && (
            <div className="flex gap-4 self-start max-w-[75%]">
              <div className="w-8 h-8 rounded-full bg-tertiary-fixed border border-tertiary-fixed-dim flex items-center justify-center shrink-0 mt-1">
                <span className="material-symbols-outlined text-tertiary text-[18px]">smart_toy</span>
              </div>
              <div className="bg-surface-container-lowest border border-tertiary-fixed rounded-2xl rounded-tl-sm px-5 py-4 shadow-sm flex items-center gap-1 h-[42px]">
                <div className="w-1.5 h-1.5 bg-tertiary rounded-full animate-[typing_1.4s_infinite_ease-in-out_-0.32s]" />
                <div className="w-1.5 h-1.5 bg-tertiary rounded-full animate-[typing_1.4s_infinite_ease-in-out_-0.16s]" />
                <div className="w-1.5 h-1.5 bg-tertiary rounded-full animate-[typing_1.4s_infinite_ease-in-out]" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        <div className="sticky bottom-0 w-full bg-gradient-to-t from-surface via-surface to-transparent pt-8 pb-4 px-6 md:px-8 flex flex-col items-center">
          <div className="max-w-4xl w-full">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-[14px] p-2 flex items-end shadow-sm focus-within:border-on-surface">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 px-2 text-body-md text-on-surface placeholder:text-outline outline-none"
                placeholder="Message Validator AI..."
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || sending}
                className="p-3 bg-tertiary hover:bg-on-tertiary-fixed text-on-tertiary rounded-[10px] transition-colors ml-2 shadow-sm flex items-center justify-center disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_upward</span>
              </button>
            </div>
            <p className="text-center text-[12px] text-on-surface-variant mt-3">
              Validator AI can make mistakes. Verify critical information.
            </p>
          </div>
        </div>
      </main>
      <MobileNav />
    </body>
  )
}
