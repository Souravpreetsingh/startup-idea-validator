import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native'
import { useAuth } from '../context/AuthContext'

export default function ProfileScreen() {
  const { user, logout, token } = useAuth()

  function handleLogout() {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout },
    ])
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.fullName?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={styles.name}>{user?.fullName || 'User'}</Text>
        <Text style={styles.email}>{user?.email}</Text>

        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>Account Status</Text>
          <Text style={styles.statsValue}>Active</Text>
        </View>
        <View style={styles.statsCard}>
          <Text style={styles.statsLabel}>Session</Text>
          <Text style={styles.statsValue}>Token: {token?.slice(0, 12)}...</Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f6' },
  content: { padding: 24, alignItems: 'center', paddingTop: 60 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#6a5778', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#fff' },
  name: { fontSize: 22, fontWeight: '600', color: '#1c1b1a', marginBottom: 4 },
  email: { fontSize: 14, color: '#78776f', marginBottom: 32 },
  statsCard: { width: '100%', backgroundColor: '#fff', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#e5e2df', marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between' },
  statsLabel: { fontSize: 14, color: '#78776f' },
  statsValue: { fontSize: 14, fontWeight: '600', color: '#1c1b1a' },
  logoutButton: { width: '100%', backgroundColor: '#1c1b1a', borderRadius: 24, padding: 16, alignItems: 'center', marginTop: 24 },
  logoutText: { color: '#fcf9f6', fontSize: 16, fontWeight: '600' },
})
