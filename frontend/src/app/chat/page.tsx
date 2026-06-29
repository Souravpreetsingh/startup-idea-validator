'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { chatService } from '@/services/chatService'
import Sidebar from '@/components/Sidebar'
import MobileNav from '@/components/MobileNav'

interface ChatSession {
  _id: string
  title: string
  updatedAt: string
}

export default function ChatListPage() {
  const { user, loading: authLoading } = useAuth()
  const [chats, setChats] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) router.replace('/login')
  }, [user, authLoading, router])

  useEffect(() => {
    if (!user) return
    chatService.getChatHistory().then((res) => {
      setChats(res.data.chats || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [user])

  if (authLoading || !user) return null

  return (
    <body className="bg-background text-on-background font-body-md flex min-h-screen">
      <Sidebar />
      <main className="flex-1 md:ml-64 relative min-h-screen pb-24 md:pb-12">
        <div className="p-8 max-w-[1440px] mx-auto">
          <div className="flex items-center justify-between mb-8 pt-4">
            <h2 className="font-display-lg text-display-lg text-on-surface">AI Assistant</h2>
            <button
              onClick={() => router.push('/chat/new')}
              className="bg-on-surface text-surface px-6 py-3 rounded-full font-label-md hover:bg-on-surface-variant transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined">add</span>
              New Chat
            </button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-surface-variant rounded-xl h-20" />
              ))}
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-20">
              <span className="material-symbols-outlined text-5xl text-outline mb-4">smart_toy</span>
              <p className="text-on-surface-variant text-lg mb-2">No conversations yet</p>
              <p className="text-sm text-on-surface-variant mb-6">Start a chat with Validator AI.</p>
              <button
                onClick={() => router.push('/chat/new')}
                className="bg-on-surface text-surface px-6 py-3 rounded-full font-label-md hover:bg-on-surface-variant transition-colors"
              >
                Start Chat
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => router.push(`/chat/${chat._id}`)}
                  className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  <h3 className="text-label-md text-on-surface">{chat.title}</h3>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <MobileNav />
    </body>
  )
}
