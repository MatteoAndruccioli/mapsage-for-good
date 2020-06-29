<template>
  <div class="outer-container">
 
    <header class="container d-flex justify-content-start row">
      <span v-on:click.prevent.stop="onBackToChatList" class="my-arrow-button">&#129128;</span>
      <img class="propic" :src="receiver_imagePath" alt="Avatar">
      <h5>{{receiver_fullName}}</h5>
    </header>
    

    <main>
      <ul class="list-group" >
        <div  v-if="this.messages.length == 0" class="jumbotron-container">
          <div class="jumbotron custom-jumbotron">
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

    <footer class="container row col-12">
      <form class="input-group col-12" v-on:submit.prevent="sendMessage">
        <textarea v-model="messageBody" class="form-control" aria-label="With textarea"></textarea>
        <button class="my-send-button btn" type="submit">Send</button>
      </form>  
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
  }

  header {
    height: 40px;
    margin-left: .25rem;
    margin-top: auto;
    margin-bottom: auto;
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



  @media screen and (max-width: 420px) {
    .outer-container {
      width: 15rem;
    }

    header img {
      display: none;
    }
  }

</style>
