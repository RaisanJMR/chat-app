import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import HomeScreen from './screens/HomeScreen'
import FriendsScreen from './screens/FriendsScreen'
import ChatScreen from './screens/ChatScreen'
import ChatMessage from './screens/ChatMessage'

const StackNavigator = () => {
  const Stack = createNativeStackNavigator()
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Login'
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name='Register'
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Friends' component={FriendsScreen} />
        <Stack.Screen name='Chat' component={ChatScreen} />
        <Stack.Screen name='Messages' component={ChatMessage} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default StackNavigator

const styles = StyleSheet.create({})
