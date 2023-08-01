import {
  Alert,
  KeyboardAvoidingView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import axios from 'axios'

const RegisterScreen = () => {
  const navigation = useNavigation()

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [image, setImage] = useState('')

  const handleRegister = () => {
    const user = {
      name,
      email,
      password,
      image,
    }

    axios
      .post('http://192.168.103.232:8000/register', user)
      .then((res) => {
        console.log(res)
        Alert.alert(
          'Registration successfully',
          'You have been registered successfully'
        )
        setName('')
        setEmail('')
        setPassword('')
        setImage('')
      })
      .catch((err) => {
        Alert.alert('Registration Error', 'Error occoured')
        console.log('registration failed', err)
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
            Register
          </Text>
          <Text style={{ fontSize: 17, fontWeight: 600, marginTop: 15 }}>
            Register to your account
          </Text>
        </View>

        <View style={{ marginTop: 50 }}>
          {/* name */}
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#888' }}>
              Name
            </Text>
            <TextInput
              value={name}
              onChangeText={(text) => setName(text)}
              style={{
                fontSize: email ? 18 : 18,
                borderBottomColor: 'gray',
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={'#000000'}
              placeholder='enter your name'
            />
          </View>

          {/* email */}
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

          {/* Image */}
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#888' }}>
              Image
            </Text>
            <TextInput
              value={image}
              onChangeText={(text) => setImage(text)}
              style={{
                fontSize: email ? 18 : 18,
                borderBottomColor: 'gray',
                borderBottomWidth: 1,
                marginVertical: 10,
                width: 300,
              }}
              placeholderTextColor={'#000000'}
              placeholder='insert image'
            />
          </View>

          <Pressable
            onPress={handleRegister}
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
              Register
            </Text>
          </Pressable>
          <Pressable
            onPress={() => navigation.goBack()}
            style={{
              marginTop: 15,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: 'gray',
                fontSize: 16,
              }}>
              Have an account? Sign In
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  )
}

export default RegisterScreen

const styles = StyleSheet.create({})
