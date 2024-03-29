<template>
  <aside class="aside-flex-container">
    <div class="btn-group dropup ml-auto" :class="{'show': isOpen}">
      <button @click="handleChatButtonClick" type="button" class="btn btn-primary dropdown-toggle chat" aria-haspopup="true" :aria-expanded="isOpen">
        Chat <span class="fas fa-comment-alt"></span> <span class="badge badge-light" v-if="totPendingNotifications>0">{{ totPendingNotifications }}</span>
      </button>

      <div v-if="this.showChatList" class="dropdown-menu dropdown-menu-right bg-primary" :class="{'show': isOpen}">
        <ChatList @openChat="handleOpenChat" :chats="chats"/>
      </div>
      <div v-if="!this.showChatList" class="dropdown-menu dropdown-menu-right bg-primary" :class="{'show': isOpen}">
        <ChatPanel @backToChatList="resetConfiguration" @sendMessage="handleSendMessage"
          @previousMessagesEvent="getPreviousSetOfMessages" :receiver_id="actualChatReceiverId"
          :receiver_fullName="actualChatReceiverFullName" :receiver_imagePath="actualChatReceiverImgPath"
          :messages="messages"/>
      </div>
    </div>
  </aside>
</template>

<script>
import ChatList from './ChatList'
import ChatPanel from './ChatPanel'
import axios from 'axios'

import {EventBus} from '../utils/eventBus'
import {socket} from '../utils/serverSocket'

export default {
  name: 'ChatMainButton',
  components: {
    ChatList,
    ChatPanel
  },
  data () {
    return {
      showChatList: true,
      chats: null,

      // Filled with chat info when a chat from the list is selected
      messages: [],
      actual_c_id: '',
      actualChatReceiverId: '',
      actualChatReceiverFullName: '',
      actualChatReceiverImgPath: 'http://localhost:3000/static/uploads/defaultImg.png',

      // Controls the chat opening and closing
      isOpen: false,

      totPendingNotifications: 0
    }
  },

  methods: {
    // Propagated from ChatPanel child when back button in pressed or when the chat is closed
    resetConfiguration: function() {
      this.showChatList = true

      this.actual_c_id = ''
      this.actualChatReceiverId = ''
      this.actualChatReceiverFullName = ''
      this.actualChatReceiverImgPath = ''
    },
    // Propagated from ChatList child when a chat from the list is selected
    handleOpenChat: function(c_id, receiver_id, receiver_fullName, receiver_imgPath) {
      this.actual_c_id = c_id
      this.actualChatReceiverId = receiver_id
      this.actualChatReceiverFullName = receiver_fullName
      this.actualChatReceiverImgPath = receiver_imgPath
      this.showChatList = false // Stop showing chat list, start showing chat panel

      // Handling of "visualized" flag. It causes stop blinking and delete notification.
      var actualChat = this.chats.filter(chat => chat.chat_id == c_id)
      if (actualChat.length == 1 && !actualChat[0].visualized) {
        actualChat[0].visualized = true
        this.totPendingNotifications--
      }

      this.messages = []
      this.getPreviousSetOfMessages(0)
    },
    // Retrieves the next set of messages for the actual chat starting
    // from "startIndex" to "stratIndex + N"
    getPreviousSetOfMessages: function(startIndex) {
      axios.put('http://localhost:3000/chat/lastMessages',
          {
            chat_id: this.actual_c_id,
            firstElement: startIndex
          },
          { withCredentials: true })
        .then(res => {
          if (!res.data.error) {
            var tmp = this.messages.reverse()
            res.data.messages.forEach(item => {
              tmp.push(item)
            });
            this.messages = tmp.reverse()
          } else {
            alert(res.data.error)
            console.log(res.data.error)
          }
        }).catch(err => {
          alert(err.response.data.error)
          console.log(err.response.data.error)
        })
    },
    // Propagated from ChatPanel child when send button in pressed
    handleSendMessage: function(message) {
      if (this.$cookies.get('currentUser') && this.$cookies.get('currentUser').logged_in) {
        const user_id = this.$cookies.get('currentUser').user_id;
        socket.emit("message", {
          sender: user_id,
          receiver: this.actualChatReceiverId,
          chat_id: this.actual_c_id,
          payload: message
        })
        // The visualization of the user message just sent will be performed when the server
        // will propagate back that message using Socket.IO
      }
    },
    // Handles events arriving from event bus. The sender is MasseurProfilePanel
    handleExternalOpenChat: function(newChat) {
      // If the new chat was not already in the chat list, then it pushes that chat to the chat list
      if (this.chats.filter(chat => chat.chat_id == newChat.chat_id).length == 0) {
        this.chats.push(newChat)
      }
      // Forces chat to open
      this.isOpen = true
      // Forces the specific chat panel to open
      this.handleOpenChat(newChat.chat_id, newChat.receiver_id,
        newChat.receiver_fullName, newChat.receiver_imgPath)
    },
    // Handles stardard clicks occurring on chat button
    handleChatButtonClick: function() {
      this.isOpen = !this.isOpen
      if (!this.isOpen) {
        this.resetConfiguration()
      }
    },
    // Handle messages received from socket.io
    handleMessageReceived: function(msg) {
      if (msg.error) {
        alert("Error receiving message: " + msg.error)
        return;
      }

      const chatReferredByMsg = this.chats.find(chat => chat.chat_id == msg.chat_id)
      if (chatReferredByMsg == null) {
        // The chat referred by the message is not in the chat list - downloads the chat from server
        axios.put('http://localhost:3000/chat/chatInfo', { receiver: msg.sender }, { withCredentials: true })
          .then(res => {
            if (!res.data.error) {
              this.chats.push(res.data)
              this.totPendingNotifications++
            } else {
              alert(res.data.error)
              console.log(res.data.error)
            }
          }).catch(err => {
            alert(err.response.data.error)
            console.log(err.response.data.error)
          })
      } else if (chatReferredByMsg != null && chatReferredByMsg.chat_id == this.actual_c_id) {
        // The chat referred by the message is in the chat list and it is the actual opened
        this.messages.push({ body: msg.payload, sender: msg.sender})
      } else {
        // The chat referred by the message is in the chat list - updating existing chat
        if (chatReferredByMsg.visualized) {
          chatReferredByMsg.visualized = false
          this.totPendingNotifications++
        }
        // If chat has already a pending notification ('visualized'=false) then do nothing
      }
    }
  },
  mounted() {
    EventBus.$on('sendMsgClickMasseurProfile', this.handleExternalOpenChat)
    if (this.$cookies.get('currentUser') && this.$cookies.get('currentUser').logged_in) {
      socket.on('message_' + this.$cookies.get('currentUser').user_id, this.handleMessageReceived)
    }
    axios.get('http://localhost:3000/chat/chatInfo/allOfUser', { withCredentials: true })
      .then(res => {
        if (!res.data.error) {
          this.chats = res.data.chats
          this.totPendingNotifications = this.chats.filter(chat => chat.visualized==false).length;
        } else {
          alert(res.data.error)
          console.log(res.data.error)
        }
      }).catch(err => {
        alert(err.response.data.error)
        console.log(err.response.data.error)
      })
  }
}
</script>

<style scoped>
.chat {
  width: 120px;
  height: 40px;
  border-radius: 2px 2px 0 0;
}

aside {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1030;
  display: flex;
  flex-direction: row-reverse;
  flex-wrap: nowrap;
  align-items: flex-end;
  padding-right: 10%;
}

.my-visibility{
  margin-bottom: 90px;
}
</style>
