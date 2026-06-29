import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { AuthProvider } from './src/context/AuthContext'
import { NavigationContainer } from '@react-navigation/native'
import { MainNavigator } from './src/navigation/MainNavigator'

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <MainNavigator />
      </NavigationContainer>
    </AuthProvider>
  )
}
