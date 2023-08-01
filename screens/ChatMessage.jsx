import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Text,
  TextInput,
  View,
  Pressable,
  Image,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { Entypo } from '@expo/vector-icons'
import { Ionicons } from '@expo/vector-icons'
import React, { useContext, useEffect, useLayoutEffect, useState } from 'react'
import EmojiSelector from 'react-native-emoji-selector'
import { UserType } from '../UserContext'
import { useNavigation, useRoute } from '@react-navigation/native'

const ChatMessage = () => {
  const { userId, setUserId } = useContext(UserType)
  const [selectedImage, setSelectedImage] = useState('')
  const navigation = useNavigation()
  const route = useRoute()
  const { recepientId } = route.params
  const [recepientData, setRecepientData] = useState()
  const [showEmojiSelector, setShowEmojiSelector] = useState(false)
  const [message, setMessage] = useState('')

  const handleEmojiPress = () => {
    setShowEmojiSelector(!showEmojiSelector)
  }

  useEffect(() => {
    const fetchRecepientsData = async () => {
      try {
        const response = await fetch(
          `http://192.168.103.232:8000/user/${recepientId}`
        )
        const data = await response.json()
        setRecepientData(data)
      } catch (error) {
        console.log('first retrieving details', error)
      }
    }
    fetchRecepientsData()
  }, [])

  console.log('recepientData', recepientData)

  const handleSend = async (messageType, imageUri) => {
    try {
      const formData = new FormData()
      formData.append('senderId', userId)
      formData.append('recepientId', recepientId)

      //if the message type id image or a normal text
      if (messageType === 'image') {
        formData.append('messageType', 'image')
        formData.append('imageFile', {
          uri: imageUri,
          name: 'image.jpg',
          type: 'image/jpeg',
        })
      } else {
        formData.append('messageType', 'text')
        formData.append('messageText', message)
      }
      const response = await fetch('http://192.168.103.232:8000/messages', {
        method: 'POST',
        body: formData,
      })
      if (response.ok) {
        setMessage('')
        setSelectedImage('')
      }
    } catch (error) {
      console.log('error insending message', error)
    }
  }

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      headerLeft: () => {
        return (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons
              onPress={() => navigation.goBack()}
              name='arrow-back'
              size={24}
              color='black'
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  resizeMode: 'cover',
                }}
                source={{ uri: recepientData?.image }}
              />

              <Text style={{ marginLeft: 5, fontSize: 15, fontWeight: 'bold' }}>
                {recepientData?.name}
              </Text>
            </View>
          </View>
        )
      },
    })
  }, [recepientData])

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#F0F0F0' }}>
      <ScrollView>{/* All the chat messages goes here */}</ScrollView>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: '#dddddd',
          marginBottom: showEmojiSelector ? 0 : 25,
        }}>
        <Entypo
          onPress={handleEmojiPress}
          style={{ marginRight: 6 }}
          name='emoji-happy'
          size={24}
          color='gray'
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: '#dddddd',
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder='Type Your message...'
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 7,
            marginHorizontal: 8,
          }}>
          <Entypo
            style={{ marginLeft: 6 }}
            name='camera'
            size={24}
            color='gray'
          />
          <Feather name='mic' size={24} color='black' />
        </View>
        <Pressable
          onPress={() => handleSend('text')}
          style={{
            backgroundColor: '#007bff',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 20,
          }}>
          <Text style={{ color: '#ffffff', fontWeight: 'bold' }}>send</Text>
        </Pressable>
      </View>
      {showEmojiSelector && (
        <EmojiSelector
          onEmojiSelected={(emoji) => {
            setMessage((prevMessage) => prevMessage + emoji)
          }}
          style={{ height: 250 }}
        />
      )}
    </KeyboardAvoidingView>
  )
}

export default ChatMessage

const styles = StyleSheet.create({})
