<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-bottom" >
    <div class="container d-flex justify-content-end">

      <div class="btn-group dropup" :class="{'show': makeChatVisible}">
        <!-- data-toggle="dropdown" -->
        <button @click="chatButtonClicked" type="button" class="btn btn-primary dropdown-toggle" aria-haspopup="true" :aria-expanded="makeChatVisible">
          Chat <span class="badge badge-light" v-if="totPendingNotifications>0">{{ totPendingNotifications }}</span>
        </button>

        <div v-if="this.showChatList" class="dropdown-menu dropdown-menu-right bg-primary" :class="{'show': makeChatVisible}">
          <ChatList @openChat="openChat" :chats="chats"/>
        </div>
        <div v-if="!this.showChatList" class="dropdown-menu dropdown-menu-right bg-primary" :class="{'show': makeChatVisible}">
          <ChatPanel @backToChatList="onBackToChatList" @sendMessage="sendMessage"
            :receiver_id="actualChatReceiverId" :receiver_fullName="actualChatReceiverFullName"
            :receiver_imagePath="actualChatReceiverImgPath" :messages="messages"/>
        </div>
      </div>

    </div>
  </nav>
</template>

<script>
import ChatList from './ChatList'
import ChatPanel from './ChatPanel'
import axios from 'axios'
import io from 'socket.io-client'

import {EventBus} from '../EventBus'

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
      messages: [],
      socket: null,

      actual_c_id: '',
      actualChatReceiverId: '',
      actualChatReceiverFullName: '',
      actualChatReceiverImgPath: 'http://localhost:3000/static/uploads/defaultImg.png',

      makeChatVisible: false,

      totPendingNotifications: 0
    }
  },

  methods: {
    //this method propagates child-generated backToChatList event to his father
    onBackToChatList: function() {
      this.showChatList = true
    },

    openChat: function(c_id, receiver_id, receiver_fullName, receiver_imgPath) {
      this.actual_c_id = c_id
      this.actualChatReceiverId = receiver_id
      this.actualChatReceiverFullName = receiver_fullName
      this.actualChatReceiverImgPath = receiver_imgPath
      this.showChatList = false

      var actualChat = this.chats.filter(chat => chat.chat_id == c_id)
      if (actualChat.length == 1 && !actualChat[0].visualized) {
        actualChat[0].visualized = true
        this.totPendingNotifications--
      }

      axios.put('http://localhost:3000/chat/lastMessages', { chat_id: c_id }
        ,{ withCredentials: true })
        .then(res => {
          if (!res.data.error) {
            this.messages = res.data.messages
          } else {
            alert(res.data.error)
            console.log(res.data.error)
          }
        }).catch(err => {
          alert(err)
          console.log(err)
        })
    },

    sendMessage: function(message) {
      if (this.$cookies.get('currentUser') && this.$cookies.get('currentUser').logged_in) {
        const user_id = this.$cookies.get('currentUser').user_id;
        this.socket.emit("message", {
          sender: user_id,
          receiver: this.actualChatReceiverId,
          chat_id: this.actual_c_id,
          payload: message
        })
        // self-visualization of the user message sent
      }
    },

    addChat: function(newChat) {
      // If the new chat was not already in the chat list, then I push it to the chat list
      if (this.chats.filter(chat => chat.chat_id == newChat.chat_id).length == 0) {
        this.chats.push(newChat)
      }

      this.makeChatVisible = true

      this.openChat(newChat.chat_id, newChat.receiver_id,
        newChat.receiver_fullName, newChat.receiver_imgPath)
    },

    chatButtonClicked: function() {
      this.makeChatVisible = !this.makeChatVisible
      if (!this.makeChatVisible) {
        this.showChatList= true
      }
    }
  },

  mounted() {
    EventBus.$on('sendMessageClicked', this.addChat)
    this.socket = io('http://localhost:3000')
    axios.get('http://localhost:3000/chat/chatInfo/allOfUser', { withCredentials: true })
      .then(res => {
        if (!res.data.error) {
          this.chats = res.data.chats
          console.log(this.chats)
          this.totPendingNotifications = this.chats.filter(chat => chat.visualized==false).length;

          if (this.$cookies.get('currentUser') && this.$cookies.get('currentUser').logged_in) {
            var vm = this;
            this.socket.on(this.$cookies.get('currentUser').user_id, function(msg) {
              // visualization of messages sent by other users to this one
              if (msg.error == null) {
                vm.messages.push({ body: msg.payload, sender: msg.sender})
              } else {
                alert("Error sending message")
              }
            })
          }
        } else {
          alert(res.data.error)
          console.log(res.data.error)
        }
      }).catch(err => {
        alert(err)
        console.log(err)
      })
  },

  beforeDestroy() {
    console.log("destroying socket")
    this.socket.close()
  }
}
</script>


<style scoped>
.my-visibility{
  margin-bottom: 90px;
}
</style>
