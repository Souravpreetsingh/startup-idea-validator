import { UserMemory, IPreference } from '../models/UserMemory'
import { StartupIdea } from '../models/StartupIdea'

export async function getOrCreateMemory(userId: string) {
  let memory = await UserMemory.findOne({ userId })
  if (!memory) {
    memory = await UserMemory.create({ userId, preferences: [], previousIdeas: [], chatContext: [] })
  }
  return memory
}

export async function updatePreferences(userId: string, preferences: IPreference[]) {
  const memory = await getOrCreateMemory(userId)
  for (const pref of preferences) {
    const idx = memory.preferences.findIndex((p) => p.key === pref.key)
    if (idx >= 0) {
      memory.preferences[idx].value = pref.value
    } else {
      memory.preferences.push(pref)
    }
  }
  await memory.save()
  return memory
}

export async function addChatContext(userId: string, context: string) {
  const memory = await getOrCreateMemory(userId)
  memory.chatContext.push(context)
  if (memory.chatContext.length > 50) {
    memory.chatContext = memory.chatContext.slice(-50)
  }
  await memory.save()
  return memory
}

export async function syncPreviousIdeas(userId: string) {
  const ideas = await StartupIdea.find({ userId }).select('title industry').sort({ createdAt: -1 }).limit(20)
  const titles = ideas.map((i) => `${i.title} (${i.industry})`)

  const memory = await getOrCreateMemory(userId)
  memory.previousIdeas = titles
  await memory.save()
  return memory
}
