const mongoose = require("mongoose")
const Schema = mongoose.Schema

const ChatSchema = new Schema({
  //user1 & user2 are the ids of users chatting 
  user1: {
    type: String,
    required: true
  },
  user2: {
    type: String,
    required: true
  },
  //user1 visualized last messages
  visualized_by_user1: {
    type: Boolean,
    required:true
  },
  //user2 visualized last messages
  visualized_by_user2: {
    type: Boolean,
    required:true
  },
  //list of messages sent by both users chatting
  messages: [{
    body: String,
    sender: String,
  }]
})

module.exports = Chat = mongoose.model('chat', ChatSchema)
