import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function DashboardScreen() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ ideas: 0, analyses: 0, avgScore: 0 })

  useEffect(() => {
    Promise.all([
      api.get('/ideas?limit=100').then(r => setStats(s => ({ ...s, ideas: r.data.data?.length || 0 }))).catch(() => {}),
      api.get('/analysis?limit=100').then(r => {
        const analyses = r.data.data?.analyses || []
        const avg = analyses.length ? Math.round(analyses.reduce((s: number, a: any) => s + a.ideaScore, 0) / analyses.length) : 0
        setStats(s => ({ ...s, analyses: analyses.length, avgScore: avg }))
      }).catch(() => {}),
    ])
  }, [])

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Welcome{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}</Text>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.cardRow}>
        <View style={styles.card}><Text style={styles.cardLabel}>Ideas</Text><Text style={styles.cardValue}>{stats.ideas}</Text></View>
        <View style={styles.card}><Text style={styles.cardLabel}>Analyses</Text><Text style={styles.cardValue}>{stats.analyses}</Text></View>
        <View style={styles.card}><Text style={styles.cardLabel}>Avg Score</Text><Text style={styles.cardValue}>{stats.avgScore}</Text></View>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>New Analysis</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f6' },
  content: { padding: 24 },
  greeting: { fontSize: 14, color: '#78776f', marginBottom: 4, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 32, fontWeight: '600', color: '#1c1b1a', marginBottom: 24 },
  cardRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  card: { flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 16, borderWidth: 1, borderColor: '#e5e2df' },
  cardLabel: { fontSize: 11, color: '#78776f', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  cardValue: { fontSize: 28, fontWeight: '600', color: '#1c1b1a' },
  button: { backgroundColor: '#1c1b1a', borderRadius: 24, padding: 16, alignItems: 'center' },
  buttonText: { color: '#fcf9f6', fontSize: 16, fontWeight: '600' },
})
