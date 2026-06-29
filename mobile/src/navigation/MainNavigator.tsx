import React from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { useAuth } from '../context/AuthContext'
import LoginScreen from '../screens/LoginScreen'
import SignupScreen from '../screens/SignupScreen'
import DashboardScreen from '../screens/DashboardScreen'
import IdeasScreen from '../screens/IdeasScreen'
import ChatScreen from '../screens/ChatScreen'
import ProfileScreen from '../screens/ProfileScreen'

const Stack = createNativeStackNavigator()
const Tab = createBottomTabNavigator()

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
    </Stack.Navigator>
  )
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: '#fcf9f6', borderTopColor: '#e5e2df', paddingBottom: 8, height: 60 },
        tabBarActiveTintColor: '#1c1b1a',
        tabBarInactiveTintColor: '#78776f',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}>
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarIcon: () => null }} />
      <Tab.Screen name="Ideas" component={IdeasScreen} options={{ tabBarIcon: () => null }} />
      <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarIcon: () => null }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: () => null }} />
    </Tab.Navigator>
  )
}

export function MainNavigator() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#1c1b1a" />
      </View>
    )
  }

  return user ? <MainTabs /> : <AuthStack />
}

const styles = StyleSheet.create({
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fcf9f6' },
})
