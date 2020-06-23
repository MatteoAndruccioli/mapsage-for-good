<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-bottom" >
    <div class="container d-flex justify-content-end">

      <div class="btn-group dropup">
        <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          I'm Fucking Chat
        </button>

        <div v-if="this.showChatList" class="dropdown-menu dropdown-menu-right bg-primary">
          <Chatlist
            @openChat="onOpenChat"
            :chats="this.chats"
            />
        </div>
        <div v-if="!this.showChatList" class="dropdown-menu dropdown-menu-right bg-primary">
          <ChatPanel
            @backToChatList="onBackToChatList"
            @sendMessage="sendMessage"
            :receiver_id = "this.chatReceiverId"
            :receiver_FullName = "this.chatReceiverFullName "
            :receiver_imagePath = "this.chatReceiverImgPath"
            />
        </div>
      </div>

    </div>
  </nav>
</template>

<script>
import Chatlist from './chatListPanel/Chatlist'
import ChatPanel from './chatPanel/ChatPanel'
import axios from 'axios'
import io from 'socket.io-client'

export default {
  props: ['isMasseurProfile'],
  data () {
    //const loggedUser = this.$cookies.get('current-user')
    return {
      showChatList: !this.isMasseurProfile,

      chats: null,

      socket: null,

      chatReceiverId: '',
      chatReceiverFullName: '',
      chatReceiverImgPath: 'http://localhost:3000/static/uploads/defaultImg.png'
    }
  },

  methods: {
    //this method propagates child-generated backToChatList event to his father
    onBackToChatList: function() {
      this.showChatList = true
    },

    onOpenChat: function(receiver_id, receiver_fullName, receiver_imgPath) {
      this.chatReceiverId = receiver_id
      this.chatReceiverFullName = receiver_fullName
      this.chatReceiverImgPath = receiver_imgPath
      this.showChatList = false

      /*
      axios.get('http://localhost:3000/chat/testSocketIO')
        .then(res => {
          console.log(res)
        }).catch(err => {
          alert(err)
          console.log(err)
        })
        */
    },

    sendMessage: function(message) {
      this.socket.emit("message", {
        sender_id: this.$cookies.get('currentUser').user_id,
        receiver_id: this.chatReceiverId,
        payload: message
      })
    }
  },

  mounted() {
    this.socket = io('http://localhost:3000')
    axios.get('http://localhost:3000/chat/allUserChat', { withCredentials: true })
      .then(res => {
        if (!res.data.error) {
          this.chats = res.data
          /*
          this.chats.forEach(chat => {
            console.log("registering: " + chat._id)
            this.socket.on(chat._id, function(msg) {
              console.log("chat: " + chat._id + " received: " + msg)
              // TODO
            })
          });
          */
          if (this.$cookies.get('currentUser') && this.$cookies.get('currentUser').logged_in) {
            var vm = this;
            this.socket.on(this.$cookies.get('currentUser').user_id, function(msg) {
              console.log("user: " + vm.$cookies.get('currentUser').user_id + " received: " + msg.payload)
              // TODO
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

  components: {
    Chatlist,
    ChatPanel
  },
}
</script>


<style scoped>
.my-visibility{
  margin-bottom: 90px;
}
</style>
