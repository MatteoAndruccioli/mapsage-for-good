const mongoose = require("mongoose")
const { ObjectId } = require("mongodb")
const Schema = mongoose.Schema

const ChatSchema = new Schema({
    user1: {
      type: String,
      required: true
    },

    user2: {
      type: String,
      required: true
    },

    //indica se gli ultimi messaggi sono stati visualizzati da user1
    visualized_by_user1: {
      type: Boolean,
      required:true
    },

    //indica se gli ultimi messaggi sono stati visualizzati da user2
    visualized_by_user2: {
      type: Boolean,
      required:true
    },

    messages: [{
      body: String,
      sender: String,
    }]
})

module.exports = Chat = mongoose.model('chat', ChatSchema)
