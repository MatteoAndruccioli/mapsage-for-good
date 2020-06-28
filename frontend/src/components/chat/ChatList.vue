<template>
  <div class="outer-container">

    <h5 class="text-header">Your chat</h5>

    <main>
      <ul class="list-group">
        <div v-if="!anyChatIsPresent()" class="jumbotron-container">
          <div class="jumbotron custom-jumbotron">
            <div class="jumbotron-content">
              <p>There is still no chat to show :(</p>
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
    </main>

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
    anyChatIsPresent: function() {
      return this.chats != null && this.chats.length > 0
    }
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
  .text-header {
    color:white;
    text-align: center;
  }

  .outer-container {
    width: 21rem;
  }

  p {
    font-size: 1.25rem;
    font-weight: 300;
    margin: auto;
  }

  .jumbotron-content {
    display: flex;
  }

  main {
    background-color: #e9ecef !important;
    text-align: center;
  }

  .jumbotron-container {
    height: 100%; 
    align-self: stretch!important;
  }

  .custom-jumbotron {
    padding-right: 0;
    padding-left: 0;
    border-radius: 0;
    align-self: stretch!important;
  }

  .list-group{
    max-height: 300px;
    margin-bottom: 10px;
    overflow-y:scroll;
    -webkit-overflow-scrolling: touch;
  }

  @media screen and (max-width: 420px) {
    .outer-container {
      width: 15rem;
    }
  }
</style>
