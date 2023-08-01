import { StyleSheet, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { UserType } from '../UserContext'
import axios from 'axios'
import FriendRequest from '../components/FriendRequest'

const FriendsScreen = () => {
  const { userId, setUserId } = useContext(UserType)
  const [friendRequests, setFriendRequests] = useState([])

  useEffect(() => {
    fetchFriendRequests()
  }, [])

  const fetchFriendRequests = async () => {
    try {
      const response = await axios.get(
        `http://192.168.103.232:8000/friend-request/${userId}`
      )
      if (response.status === 200) {
        console.log(response.data)
        const friendRequestsData = response.data.map((friendRequest) => ({
          _id: friendRequest._id,
          name: friendRequest.name,
          email: friendRequest.email,
          image: friendRequest.image,
        }))

        setFriendRequests(friendRequestsData)
      }
    } catch (err) {
      console.log('friend request failed', err)
    }
  }

  console.log(friendRequests)

  return (
    <View style={{ padding: 10, marginHorizontal: 12 }}>
      {friendRequests.length > 0 && <Text>Your friend requests</Text>}
      {friendRequests.map((item, index) => {
        return (
          <FriendRequest
            key={index}
            item={item}
            friendRequests={friendRequests}
            setFriendRequests={setFriendRequests}
          />
        )
      })}
    </View>
  )
}

export default FriendsScreen

const styles = StyleSheet.create({})
