import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native'
import { useAuth } from '../context/AuthContext'

export default function SignupScreen({ navigation }: any) {
  const { signup } = useAuth()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup() {
    if (!fullName || !email || !password) { Alert.alert('Error', 'Please fill in all fields'); return }
    if (password.length < 8) { Alert.alert('Error', 'Password must be at least 8 characters'); return }
    setLoading(true)
    try {
      await signup({ fullName, email, password })
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Signup failed')
    }
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Start validating your ideas</Text>

        <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="#a09f98"
          value={fullName} onChangeText={setFullName} autoCapitalize="words" />
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#a09f98"
          value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
        <TextInput style={styles.input} placeholder="Password (8+ chars)" placeholderTextColor="#a09f98"
          value={password} onChangeText={setPassword} secureTextEntry />

        <TouchableOpacity style={styles.button} onPress={handleSignup} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Creating...' : 'Create Account'}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fcf9f6' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 32 },
  title: { fontSize: 32, fontWeight: '600', color: '#1c1b1a', textAlign: 'center', marginBottom: 4 },
  subtitle: { fontSize: 14, color: '#78776f', textAlign: 'center', marginBottom: 40 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#e5e2df', borderRadius: 16, padding: 16, fontSize: 16, color: '#1c1b1a', marginBottom: 12 },
  button: { backgroundColor: '#1c1b1a', borderRadius: 24, padding: 16, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#fcf9f6', fontSize: 16, fontWeight: '600' },
  link: { color: '#6a5778', textAlign: 'center', marginTop: 20, fontSize: 14 },
})
