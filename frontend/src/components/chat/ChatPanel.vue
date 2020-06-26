<template>
  <div style="width: 21rem;">
    <header>
      <div class="container d-flex justify-content-start row my-auto ml-1">
        <span v-on:click.prevent.stop="onBackToChatList" class="my-arrow-button" style=''>&#129128;</span>
        <img class="propic ml-3" :src="receiver_imagePath" alt="Avatar">
        <h5 class="text-center my-auto  ml-3" style="color: white">{{receiver_fullName}}</h5>
      </div>
    </header>

    <main>
      <ul class="list-group" >
        <div  v-if="this.messages.length == 0" class="align-self-stretch" style="height: 100%;">
          <div class="jumbotron jumbotron-fluid align-self-stretch">
            <div class="container">
              <p class="lead">There is still no message to show :(</p>
            </div>
          </div>
        </div>
        <div v-for="msg in messages" :key="msg._id">
          <ChatMessage :messageBody="msg.body" :isUserMessage="isUserMessage(msg.sender)" />
        </div>
      </ul>
    </main>

    <footer class="container row col-12 px-0 mx-auto">
      <div style="height: 40px; width: 100%;">
        <div class="input-group col-12" style="height: 100%;">
          <textarea v-model="messageBody" class="form-control" aria-label="With textarea" style="height: 90%; resize: none;"></textarea>
          <div class="input-group-append " style="height: 90%">
            <span v-on:click.prevent.stop="sendMessage" class="input-group-text my-send-button" style="cursor: pointer">Send</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import ChatMessage from './ChatMessage'

export default {
  props: [
    //di questi rimarrà solo receiver_id, che per ora è l'unico non utilizzato
    'receiver_id', //è l'id del destinatario e verrà usato con una chiamata axios in initFields per popolare la chat con i messaggi e caricare nome e foto destinatario
    'receiver_fullName',
    'receiver_imagePath',
    'messages'
  ],
  data() {
    return {
      messageBody: ''
    }
  },
  methods: {
    //this method propagates child-generated backToChatList event to his father
    onBackToChatList() {
      this.$emit('backToChatList')
    },
    //questo metodo verrà modificato in produzione:
    //prenderà un id e farà una richiesta axios al server con getbyid per tirar su cose
    //nota in seguito alla richiesta axios il server deve sapere che i messaggi sono stati tutti letti da quell'utente
    initFields() {
      console.log(this.receiver_id, this.receiver_fullName, this.receiver_imagePath)
      //nota devono essere ordinati
      /*
      [
        {
          messageBody: "tuo messaggio piu recente",
          isUserMessage: false,
          _id: 10
        },
      ]
      */
    },
    sendMessage() {
      this.$emit('sendMessage', this.messageBody.trim())
      this.messageBody = ''
    },
    isUserMessage(sender) {
      if (this.$cookies.get('currentUser') && this.$cookies.get('currentUser').logged_in) {
        return sender == this.$cookies.get('currentUser').user_id
      }
    }
  },
  mounted() {
    this.initFields()
  },
  components: {
    ChatMessage
  }
}
</script>

<style scoped>

  header {
    height: 40px;
  }

  .list-group{
    max-height: 300px;
    margin-bottom: 10px;
    overflow-y:scroll;
    -webkit-overflow-scrolling: touch;
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
</style>
