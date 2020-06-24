<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-bottom" >
    <div class="container d-flex justify-content-end">

      <div class="btn-group dropup">
        <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          Chat
        </button>

        <div v-if="this.showChatList" class="dropdown-menu dropdown-menu-right bg-primary">
          <ChatList @openChat="onOpenChat" :chats="chats"/>
        </div>
        <div v-if="!this.showChatList" class="dropdown-menu dropdown-menu-right bg-primary">
          <ChatPanel @backToChatList="onBackToChatList" @sendMessage="sendMessage"
            :receiver_id="chatReceiverId" :receiver_fullName="chatReceiverFullName "
            :receiver_imagePath="chatReceiverImgPath" :messages="messages"/>
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
  props: ['isMasseurProfile'],
  data () {
    //const loggedUser = this.$cookies.get('current-user')
    return {
      showChatList: !this.isMasseurProfile,
      chats: null,
      messages: [],
      socket: null,

      actual_c_id: '',
      actualChatReceiverId: '',
      actualChatReceiverFullName: '',
      actualChatReceiverImgPath: 'http://localhost:3000/static/uploads/defaultImg.png'
    }
  },

  methods: {
    //this method propagates child-generated backToChatList event to his father
    onBackToChatList: function() {
      this.showChatList = true
    },

    onOpenChat: function(c_id, receiver_id, receiver_fullName, receiver_imgPath) {
      this.actual_c_id = c_id
      this.actualChatReceiverId = receiver_id
      this.actualChatReceiverFullName = receiver_fullName
      this.actualChatReceiverImgPath = receiver_imgPath
      this.showChatList = false

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
      if (this.chats.filter(chat => chat.chat_id == newChat.chat_id).length == 0) {
        this.chats.push(newChat)
      }
      // FORZARE ESPANSIONE ChatMainButton, REDNERE VISIBILE ChatPanel
    }
  },

  mounted() {
    this.socket = io('http://localhost:3000')
    axios.get('http://localhost:3000/chat/chatInfo/allOfUser', { withCredentials: true })
      .then(res => {
        if (!res.data.error) {
          this.chats = res.data.chats
          if (this.$cookies.get('currentUser') && this.$cookies.get('currentUser').logged_in) {
            var vm = this;
            this.socket.on(this.$cookies.get('currentUser').user_id, function(msg) {
              // visualization of messages sent by other users to this one
              if (msg.error != null) {
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
    EventBus.$on('sendMessageClicked', this.addChat)
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
