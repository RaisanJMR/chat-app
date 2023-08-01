import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { UserType } from '../UserContext'

const UserChat = ({ item }) => {
  const { userId, setUserId } = useContext(UserType)
  const [messages, setMessages] = useState([])
  const navigation = useNavigation()
  return (
    <Pressable
      onPress={() =>
        navigation.navigate('Messages', {
          recepientId: item._id,
        })
      }
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        borderWidth: 0.7,
        borderColor: '#D0D0D0',
        borderTopWidth: 0,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        padding: 10,
      }}>
      <Image
        style={{ width: 50, height: 50, borderRadius: 25, resizeMode: 'cover' }}
        source={{ uri: item?.image }}
      />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '500' }}>{item?.name}</Text>
        <Text style={{ marginTop: 3, color: 'gray', fontWeight: '500' }}>
          last message goes here
        </Text>
      </View>
      <View>
        <Text style={{ fontSize: 11, fontWeight: '400', color: '#585858' }}>
          3:00pm
        </Text>
      </View>
    </Pressable>
  )
}

export default UserChat

const styles = StyleSheet.create({})
