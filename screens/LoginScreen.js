import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'
const LoginScreen = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigation = useNavigation()
  //  useEffect(() => {
  //   const checkLoginStatus = async () => {
  //     try {
  //       const token = await AsyncStorage.getItem('authToken')
  //       if (token) {
  //         navigation.navigate('Home')
  //       } else {
  //       }
  //     } catch (error) {
  //       console.log('error', error)
  //     }
  //   }
  //   checkLoginStatus()
  //  }, [])
  const handleLogin = () => {
    const user = {
      email,
      password,
    }
    axios
      .post('http://192.168.51.232:8000/login', user)
      .then((res) => {
        console.log(res)
        const token = res.data.token
        AsyncStorage.setItem('authToken', token)
        navigation.replace('Home')
      })
      .catch((error) => {
        Alert.alert('Login error', 'Invalid email or password')
        console.log('Login Error', error)
      })
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 10,
        alignItems: 'center',
      }}>
      <KeyboardAvoidingView>
        <View
          style={{
            marginTop: 100,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{ color: '#4A55A2', fontSize: 17, fontWeight: 600 }}>
            Sign In
          </Text>
          <Text style={{ fontSize: 17, fontWeight: 600, marginTop: 15 }}>
            Sign In to your account
          </Text>
        </View>
        {/* email */}
        <View style={{ marginTop: 50 }}>
          <View>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#888' }}>
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              style={{
                fontSize: email ? 18 : 18,
                borderBottomColor: 'gray',
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={'#000000'}
              placeholder='enter your email'
            />
          </View>
          {/* password */}
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#888' }}>
              Password
            </Text>
            <TextInput
              secureTextEntry={true}
              value={password}
              onChangeText={(text) => setPassword(text)}
              style={{
                fontSize: email ? 18 : 18,
                borderBottomColor: 'gray',
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={'#000000'}
              placeholder='enter your password'
            />
          </View>

          <Pressable
            onPress={handleLogin}
            style={{
              width: 200,
              backgroundColor: '#4A55A2',
              padding: 15,
              marginTop: 50,
              marginLeft: 'auto',
              marginRight: 'auto',
              borderRadius: 6,
            }}>
            <Text
              style={{
                color: '#fff',
                fontSize: 16,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
              Login
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.navigate('Register')}
            style={{
              marginTop: 15,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'gray',
                fontSize: 16,
              }}>
              Dont have an account? Sign Up
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default LoginScreen

const styles = StyleSheet.create({})
