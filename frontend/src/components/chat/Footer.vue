<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark fixed-bottom" >
    <div class="container d-flex justify-content-end">

      <div class="btn-group dropup">
        <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          I'm Fucking Chat
        </button>
        <!--
        <div v-if="this.showChatList" class="dropdown-menu dropdown-menu-right">
            <a class="dropdown-item" href="#">Action</a>
            <a class="dropdown-item" href="#">Another action</a>
            <a class="dropdown-item" href="#">Something else here</a>
        </div>
        -->
        <div v-if="this.showChatList" class="dropdown-menu dropdown-menu-right bg-primary">
          <Chatlist />
        </div>
        <div v-if="!this.showChatList" class="dropdown-menu dropdown-menu-right bg-primary">
          <ChatPanel />
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

  components: {
    Chatlist,
    ChatPanel
  },

  data () {
    //const loggedUser = this.$cookies.get('current-user')
    return {
      showChatList: false,
    }
  },
}
</script>


<style scoped>
.my-visibility{
  margin-bottom: 90px; 
}
</style>