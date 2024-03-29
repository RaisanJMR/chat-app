const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const localStrategy = require('passport-local').Strategy



const app = express()
const port = 8000
const cors = require('cors')

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize())

const jwt = require('jsonwebtoken')

mongoose
  .connect('mongodb+srv://raisan:raisan@cluster0.ymf4fe8.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('connected to DB')
  })
  .catch((error) => {
    console.log('error connecting DB', error)
  })

app.listen(port, () => {
  console.log('server running on port', port)
})

const User = require('./models/user')
const Message = require('./models/message')

// end point to reegistration of user
app.post('/register', (req, res) => {
  const { name, email, password, image } = req.body
  const newUser = new User({
    name,
    email,
    password,
    image,
  })

  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: 'User registered successfully' })
    })
    .catch((err) => {
      console.log('Error registering user', err)
      res.status(500).json({ message: 'Error registering user' })
    })
})

const createToken = (userId) => {
  const payload = {
    userId: userId,
  }
  const token = jwt.sign(payload, 'amazonmonkey', { expiresIn: '1hr' })
  return token
}

app.post('/login', (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(404).json({ message: 'email and password are required' })
  }
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'user not found' })
      }
      if (user.password !== password) {
        return res.status(404).json({ message: 'password missmatch' })
      }

      const token = createToken(user._id)
      res.status(200).json({ token })
    })
    .catch((error) => {
      console.log('error logging in', error)
      res.status(500).json({ message: 'Internal server error' })
    })
})

//endpoint to access all the users except the user who's is currently logged in!
app.get('/users/:userId', (req, res) => {
  const loggedInUserId = req.params.userId

  User.find({ _id: { $ne: loggedInUserId } })
    .then((users) => {
      res.status(200).json(users)
    })
    .catch((err) => {
      console.log('Error retrieving users', err)
      res.status(500).json({ message: 'Error retrieving users' })
    })
})

//endpoint to send a request to a user
app.post('/friend-request', async (req, res) => {
  const { currentUserId, selectedUserId } = req.body

  try {
    //update the recepient's friendRequestsArray!
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequest: currentUserId },
    })

    //update the sender's sentFriendRequests array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sendFriendRequests: selectedUserId },
    })

    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(500)
  }
})

//endpoint to show all the friend-requests of a particular user
app.get('/friend-request/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    console.log(userId)
    //fetch the user document based on the User id
    const user = await User.findById(userId)
      .populate('friendRequest', 'name email image')
      .lean()
    const friendRequests = user.friendRequest
    console.log('friend requests', friendRequests)

    res.json(friendRequests)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

//endpoint to accept a friend-request of a particular person
app.post('/friend-request/accept', async (req, res) => {
  try {
    const { senderId, recepientId } = req.body

    //retrieve the documents of sender and the recipient
    const sender = await User.findById(senderId)
    const recepient = await User.findById(recepientId)

    sender.friends.push(recepientId)
    recepient.friends.push(senderId)

    recepient.friendRequest = recepient.friendRequest.filter(
      (request) => request.toString() !== senderId.toString()
    )

    sender.sendFriendRequests = sender.sendFriendRequests.filter(
      (request) => request.toString() !== recepientId.toString()
    )

    await sender.save()
    await recepient.save()

    res.status(200).json({ message: 'Friend Request accepted successfully' })
  } catch (error) {
    s
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
})

//  end point to access all the friends of logged in user
app.get('/accepted-friends/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const user = await User.findById(userId).populate(
      'friends',
      'name email image'
    )
    const acceptedFriends = user.friends
    res.json(acceptedFriends)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})
const multer = require('multer')

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'files/') // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, uniqueSuffix + '-' + file.originalname)
  },
})
const upload = multer({ storage: storage })
// end point to post messages
app.post('/messages', upload.single('imageFile'), async (req, res) => {
  try {
    const { senderId, recepientId, messageType, messageText } = req.body

    const newMessage = new Message({
      senderId,
      recepientId,
      messageType,
      messageText,
      timeStamp: new Date(),
      imageUrl: messageType === 'image',
    })
    await newMessage.save()
    res.status(200).json({ message: 'Message sent Successfully' })
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

///endpoint to get the userDetails to design the chat Room header
app.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    //fetch the user data from the user ID
    const recepientId = await User.findById(userId)

    res.json(recepientId)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})
//endpoint to fetch the messages between two users in the chatRoom
app.get('/messages/:senderId/:recepientId', async (req, res) => {
  try {
    const { senderId, recepientId } = req.params

    const messages = await Message.find({
      $or: [
        { senderId: senderId, recepientId: recepientId },
        { senderId: recepientId, recepientId: senderId },
      ],
    }).populate('senderId', '_id name')

    res.json(messages)
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})
