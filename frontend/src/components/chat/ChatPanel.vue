<template>
  <div class="outer-container">
    <header class="container justify-content-start row">
      <span v-on:click.prevent.stop="onBackToChatList" class="my-arrow-button" aria-label="Back to chat list" title="Back to chat list">&#129128;</span>
      <img class="propic" :src="receiver_imagePath" alt="Avatar">
      <h5>{{this.receiver_fullName}}</h5>
    </header>

    <main>
      <ul class="list-group" >
        <div  v-if="messages.length == 0" class="jumbotron-container">
          <div class="jumbotron custom-jumbotron">
            <div class="container">
              <p class="lead">There is still no message to show</p>
            </div>
          </div>
        </div>
        <button ref="previousMessagesButton" v-if="!previousMessagesAvailable()" @click="getPreviousMessages" type="button" class="next-messages-button"><span>Previous messages</span></button>
        <div v-for="msg in messages" :key="msg._id">
          <ChatMessage :messageBody="msg.body" :isUserMessage="isUserMessage(msg.sender)" />
        </div>
      </ul>
    </main>

    <footer class="container row col-12">
      <form class="input-group col-12" v-on:submit.prevent="sendMessage">
        <textarea v-model="messageBody" class="form-control" aria-label="With textarea"></textarea>
        <button class="my-send-button btn" type="submit" aria-label="Send message" title="Send message">
          <span class="fas fa-paper-plane"></span>
        </button>
      </form>
    </footer>
  </div>
</template>

<script>
import ChatMessage from './ChatMessage'

export default {
  props: [
    'receiver_id',
    'receiver_fullName',
    'receiver_imagePath',
    'messages'
  ],
  components: {
    ChatMessage
  },
  data() {
    return {
      messageBody: '',
      oldMessages: [],
      getPreviousMessagesClicked: false,
      oldScrollHeight: 0
    }
  },
  methods: {
    onBackToChatList() {
      this.$emit('backToChatList')
    },
    sendMessage() {
      if (this.messageBody.trim() != '') {
        this.$emit('sendMessage', this.messageBody.trim())
        this.messageBody = ''
      }
    },
    isUserMessage(sender) {
      if (this.$cookies.get('currentUser') && this.$cookies.get('currentUser').logged_in) {
        return sender == this.$cookies.get('currentUser').user_id
      }
    },
    getPreviousMessages() {
      this.getPreviousMessagesClicked = true
      this.oldScrollHeight = this.$el.querySelector(".list-group").scrollHeight
      this.oldMessages = this.messages.slice(0) // array clone
      this.$emit('previousMessagesEvent', this.messages.length)
    },
    previousMessagesAvailable() {
      return this.messages.length < 6 ||
        this.messages.length == this.oldMessages.length
    }
  },
  mounted() {
    this.$watch('messages', function() {
      const scrollbar = this.$el.querySelector(".list-group")
      if(!this.getPreviousMessagesClicked) {
        scrollbar.scrollTop = scrollbar.scrollHeight
      } else {
        scrollbar.scrollTop = scrollbar.scrollHeight - this.oldScrollHeight;
        this.getPreviousMessagesClicked = false;
      }
    })
  }
}
</script>

<style scoped>

  .next-messages-button {
    border: none;
    color: #17a2b8;
    text-decoration: underline;
    transition: all 0.5s;
  }

  .next-messages-button span {
    cursor: pointer;
    display: inline-block;
    position: relative;
    transition: 0.5s;
  }

  .next-messages-button span:after {
    content: '\21A5';
    position: absolute;
    opacity: 0;
    top: 0;
    right: -20px;
    transition: 0.5s;
  }

  .next-messages-button:hover span {
    padding-right: 20px;
  }

  .next-messages-button:hover span:after {
    opacity: 1;
    right: 0;
  }

  .next-messages-button:hover {
    color: #117a8b;
  }

  .custom-jumbotron {
    padding-right: 0;
    padding-left: 0;
    border-radius: 0;
    align-self: stretch!important;
  }

  .jumbotron-container {
    align-self: stretch!important;
    height: 100%;
  }

  .my-send-button {
    display: flex;
    align-items: center;
    padding: .375rem .75rem;
    margin-bottom: 0;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    text-align: center;
    white-space: nowrap;
    border: 1px solid #ced4da;
    border-radius: .25rem;
    cursor: pointer;
    background-color: #e9ecef;
    color: #495057;
    height: 90%;
  }

  .input-group-append {
    height: 90%;
  }

  textarea {
    height: 90%;
    resize: none;
    overflow: hidden;
  }

  textarea:focus {
    box-shadow: none;
  }

  form {
    height: 100%;
  }

  footer {
    height: 40px;
    margin-left: auto;
    margin-right: auto;
    padding-left: 0;
    padding-right: 0;
  }

  header img {
    margin-top: 2px;
    margin-left: 1rem;
  }

  header h5 {
    margin-top: 6px;
    margin-left: 1rem;
    text-align: center;
    color: white;
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
  }

  header {
    height: 40px;
    margin-left: .25rem;
    margin-top: auto;
    margin-bottom: auto;
    flex-wrap: nowrap;
  }

  .outer-container {
    width: 21rem;
  }

  main {
    background-color: #e9ecef;
  }

  .list-group{
    max-height: 300px;
    margin-bottom: 10px;
    overflow-y: scroll;
  }

  .propic {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    border: 1px solid #eee;
  }

  .my-his-message {
    border: 1px solid rgb(191, 101, 194);
    border-radius: 20px 20px 20px 0px;
    width: 80%;
    background-color: white;
    padding: 5px 5px 5px 0px;
    margin-right: auto;
  }

  .my-my-message {
    border: 1px solid rgb(133, 152, 255);
    border-radius: 20px 20px 0px 20px;
    width: 80%;
    background-color: rgb(205, 242, 248);
    padding: 5px 5px 0px 5px;
    margin-left: auto;
  }

  .my-message-container {
    background-color: #efefef;
    padding: 8px 3px;
  }

  .my-message-text {
    margin-bottom: 5px;
    padding-left: 15px;
    padding-right: 10px;
  }

  .my-arrow-button {
    font-size: 24px;
    color: white;
    cursor: pointer;
  }

  .my-arrow-button:hover {
    color: lightblue;
  }

  .my-send-button:hover {
    color: #111;
    background-color: #ccc;
    border-radius: 0.25 rem;
  }

  @media screen and (max-width: 420px) {
    .outer-container {
      width: 15rem;
    }

    header img {
      display: none;
    }
  }

</style>
