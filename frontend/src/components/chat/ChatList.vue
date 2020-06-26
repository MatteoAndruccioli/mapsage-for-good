<template>
  <div style="width: 21rem;">

    <h5 class="text-center" style="color:white">Your chat</h5>

    <div>
      <ul class="list-group">
        <div  v-if="this.chats.length == 0" class="align-self-stretch" style="height: 100%;">
          <div class="jumbotron jumbotron-fluid align-self-stretch">
            <div class="container">
              <p class="lead">There is still no chat to show :(</p>
            </div>
          </div>
        </div>


        <div v-for="chat in chats" :key="chat._id" >
          <ChatListElement
            :fullName="chat.receiver_fullName"
            :imagePath="chat.receiver_imgPath"
            :chat_id="chat.chat_id"
            :blink="!chat.visualized"
            :receiver_id="chat.receiver_id"
            @openChat="onOpenChat"
          />
        </div>
      </ul>
    </div>

  </div>
</template>

<script>
import sync from 'css-animation-sync';
import ChatListElement from './ChatListElement'

export default {
  props: ['chats'],

  methods: {
    //this method propagates child-generated backToChatList event to his father
    onOpenChat: function(chat_id, receiver_id, receiver_fullName, receiver_imgPath) {
      this.$emit('openChat', chat_id, receiver_id, receiver_fullName, receiver_imgPath)
    },
  },

  mounted() {
    sync('spinner')
    //https://github.com/bealearts/css-animation-sync
    //https://stackoverflow.com/questions/4838972/how-to-sync-css-animations-across-multiple-elements
    const animation = new sync('blinker')
    animation.start()
  },
  components: {
    ChatListElement
  }
}
</script>

<style scoped>
  .list-group{
    max-height: 300px;
    margin-bottom: 10px;
    overflow-y:scroll;
    -webkit-overflow-scrolling: touch;
  }
</style>
