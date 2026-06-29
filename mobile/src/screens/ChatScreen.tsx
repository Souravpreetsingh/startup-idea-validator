import React, { useState, useRef } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native'
import api from '../services/api'

interface Message {
  id: string
  text: string
  isUser: boolean
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '0', text: 'Hello! I\'m your AI startup assistant. Ask me anything about validating your idea.', isUser: false },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const flatListRef = useRef<FlatList>(null)

  async function handleSend() {
    if (!input.trim()) return
    const userMsg: Message = { id: Date.now().toString(), text: input, isUser: true }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await api.post('/chat', { message: input })
      const reply: Message = { id: (Date.now() + 1).toString(), text: res.data.data.reply, isUser: false }
      setMessages(prev => [...prev, reply])
    } catch {
      const errMsg: Message = { id: (Date.now() + 1).toString(), text: 'Sorry, I couldn\'t process that.', isUser: false }
      setMessages(prev => [...prev, errMsg])
    }
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Assistant</Text>
      </View>

      <FlatList ref={flatListRef} data={messages} keyExtractor={item => item.id}
        contentContainerStyle={styles.messages}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.isUser ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.bubbleText, item.isUser ? styles.userText : styles.aiText]}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputRow}>
        <TextInput style={styles.input} placeholder="Ask about your startup..." placeholderTextColor="#a09f98"
          value={input} onChangeText={setInput} multiline />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading || !input.trim()}>
          <Text style={styles.sendText}>{loading ? '...' : 'Send'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f6' },
  header: { padding: 24, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: '#e5e2df' },
  title: { fontSize: 28, fontWeight: '600', color: '#1c1b1a' },
  messages: { padding: 16 },
  bubble: { maxWidth: '80%', borderRadius: 16, padding: 12, marginBottom: 8 },
  userBubble: { backgroundColor: '#1c1b1a', alignSelf: 'flex-end' },
  aiBubble: { backgroundColor: '#fff', alignSelf: 'flex-start', borderWidth: 1, borderColor: '#e5e2df' },
  userText: { color: '#fcf9f6', fontSize: 14 },
  aiText: { color: '#1c1b1a', fontSize: 14 },
  inputRow: { flexDirection: 'row', padding: 12, borderTopWidth: 1, borderTopColor: '#e5e2df', alignItems: 'flex-end' },
  input: { flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 12, fontSize: 14, maxHeight: 80, borderWidth: 1, borderColor: '#e5e2df', marginRight: 8 },
  sendButton: { backgroundColor: '#1c1b1a', borderRadius: 20, paddingHorizontal: 20, paddingVertical: 12, justifyContent: 'center' },
  sendText: { color: '#fcf9f6', fontSize: 14, fontWeight: '600' },
})
