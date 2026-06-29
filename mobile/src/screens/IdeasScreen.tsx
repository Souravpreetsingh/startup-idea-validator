import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native'
import api from '../services/api'

export default function IdeasScreen() {
  const [ideas, setIdeas] = useState<any[]>([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [industry, setIndustry] = useState('')

  useEffect(() => {
    api.get('/ideas?limit=50').then(r => setIdeas(r.data.data || [])).catch(() => {})
  }, [])

  async function handleCreate() {
    if (!title || !description || !industry) { Alert.alert('Error', 'Fill in all fields'); return }
    try {
      const res = await api.post('/ideas', { title, description, industry })
      setIdeas(prev => [res.data.data.idea, ...prev])
      setShowForm(false)
      setTitle(''); setDescription(''); setIndustry('')
      Alert.alert('Success', 'Idea created')
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed')
    }
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Ideas</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setShowForm(!showForm)}>
          <Text style={styles.addButtonText}>{showForm ? 'Cancel' : 'New Idea'}</Text>
        </TouchableOpacity>
      </View>

      {showForm && (
        <View style={styles.form}>
          <TextInput style={styles.input} placeholder="Title" placeholderTextColor="#a09f98" value={title} onChangeText={setTitle} />
          <TextInput style={[styles.input, styles.textArea]} placeholder="Description" placeholderTextColor="#a09f98" value={description} onChangeText={setDescription} multiline />
          <TextInput style={styles.input} placeholder="Industry" placeholderTextColor="#a09f98" value={industry} onChangeText={setIndustry} />
          <TouchableOpacity style={styles.button} onPress={handleCreate}><Text style={styles.buttonText}>Create</Text></TouchableOpacity>
        </View>
      )}

      {ideas.map((idea: any) => (
        <TouchableOpacity key={idea._id} style={styles.ideaCard} onPress={() => {}}>
          <Text style={styles.ideaTitle}>{idea.title}</Text>
          <Text style={styles.ideaIndustry}>{idea.industry}</Text>
          <Text style={styles.ideaDesc} numberOfLines={2}>{idea.description}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f6' },
  content: { padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '600', color: '#1c1b1a' },
  addButton: { backgroundColor: '#1c1b1a', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  addButtonText: { color: '#fcf9f6', fontSize: 14, fontWeight: '600' },
  form: { backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e5e2df', marginBottom: 20 },
  input: { backgroundColor: '#f5f3f0', borderRadius: 12, padding: 12, fontSize: 14, color: '#1c1b1a', marginBottom: 8 },
  textArea: { height: 80, textAlignVertical: 'top' },
  button: { backgroundColor: '#1c1b1a', borderRadius: 20, padding: 12, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fcf9f6', fontSize: 14, fontWeight: '600' },
  ideaCard: { backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e5e2df', marginBottom: 12 },
  ideaTitle: { fontSize: 16, fontWeight: '600', color: '#1c1b1a', marginBottom: 4 },
  ideaIndustry: { fontSize: 12, color: '#6a5778', marginBottom: 8, fontWeight: '500' },
  ideaDesc: { fontSize: 13, color: '#78776f', lineHeight: 18 },
})
