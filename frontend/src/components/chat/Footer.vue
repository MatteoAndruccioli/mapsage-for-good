<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-bottom" >
    <div class="container d-flex justify-content-end">

      <div class="btn-group dropup">
        <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          I'm Fucking Chat
        </button>

        <div v-if="this.showChatList" class="dropdown-menu dropdown-menu-right bg-primary">
          <Chatlist @openChat="onOpenChat" />
        </div>
        <div v-if="!this.showChatList" class="dropdown-menu dropdown-menu-right bg-primary">
          <ChatPanel 
            @backToChatList="onBackToChatList" 
            :receiver_id = this.chatReceiverId
            :receiver_FullName = this.chatReceiverFullName 
            :receiver_imagePath = this.chatReceiverImgPath
            />
        </div>
      </div>

    </div>
  </nav>
</template>

<script>
// @ is an alias to /src

import Chatlist from './chatListPanel/Chatlist'
import ChatPanel from './chatPanel/ChatPanel'

export default {
  data () {
    //const loggedUser = this.$cookies.get('current-user')
    return {
      showChatList: false,

      chatReceiverId: 'id_destinatario',
      chatReceiverFullName: 'Nome Cognome',
      chatReceiverImgPath: "http://localhost:3000/static/uploads/defaultImg.png"
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
    },
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