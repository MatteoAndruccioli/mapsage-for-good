<template>
  <div style="width: 21rem;">
    <div style="height: 40px">
      <ChatPanelHeader 
        :fullName=this.fullName 
        :imagePath=this.imagePath 
        @backToChatList="onBackToChatList()"
      />
    </div>

    

    <div>
      <ul class="list-group" >
        <div v-for="msg in messages" :key="msg._id">
          <ChatMessage :messageBody=msg.messageBody :isUserMessage=msg.isUserMessage /> 
        </div>
      </ul>
    </div>

    <div class="container row col-12 px-0 mx-auto">
      <div style="height: 40px; width: 100%;">
        <ChatPanelFooter />
      </div>
    </div>

  </div>
</template>

<script>
import ChatPanelHeader from './components/ChatPanelHeader'
import ChatPanelFooter from './components/ChatPanelFooter'
import ChatMessage from './components/ChatMessage'

export default {
  props: [
    //di questi rimarrà solo receiver_id, che per ora è l'unico non utilizzato 
    'receiver_id', //è l'id del destinatario e verrà usato con una chiamata axios in initFields per popolare la chat con i messaggi e caricare nome e foto destinatario
    'receiver_FullName', 
    'receiver_imagePath'
  ],
  data () {
    return {
      fullName: '',
      imagePath: '',
      //nota devono essere ordinati
      messages: []
    }
  },
  methods: {
    //this method propagates child-generated backToChatList event to his father
    onBackToChatList: function() {
      this.$emit('backToChatList')
    },

    //questo metodo verrà modificato in produzione: 
    //prenderà un id e farà una richiesta axios al server con getbyid per tirar su cose
    //nota in seguito alla richiesta axios il server deve sapere che i messaggi sono stati tutti letti da quell'utente
    initFields: function(id, receiverFullName, receiverImagePath) {
      console.log(id, receiverFullName, receiverImagePath)
      this.fullName = receiverFullName
      this.imagePath = receiverImagePath
      //nota devono essere ordinati
      this.messages = [
        {
          messageBody: "mio messaggio piu vecchio", 
          isUserMessage: true,
          _id: 1
        },
        {
          messageBody: "tuo messaggio piu vecchio", 
          isUserMessage: false,
          _id: 2
        },
        {
          messageBody: "[mio] Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente, eos.", 
          isUserMessage: true,
          _id: 3
        },
        {
          messageBody: "[tuo] Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente, eos.", 
          isUserMessage: false,
          _id: 4
        },
        {
          messageBody: "[mio] Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente, eos.", 
          isUserMessage: true,
          _id: 5
        },
        {
          messageBody: "[mio] Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente, eos.", 
          isUserMessage: true,
          _id: 6
        },
        {
          messageBody: "[tuo] Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente, eos.", 
          isUserMessage: false,
          _id: 7
        },
        {
          messageBody: "mio messaggio piu recente", 
          isUserMessage: true,
          _id: 8
        },
        {
          messageBody: "[tuo] Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sapiente, eos.", 
          isUserMessage: false,
          _id: 9
        },
        {
          messageBody: "tuo messaggio piu recente", 
          isUserMessage: false,
          _id: 10
        },
      ]
    }
  },
  
  mounted() {
    this.initFields(this.$props.receiver_id ,this.$props.receiver_FullName ,this.$props.receiver_imagePath )
  },

  components: {
    ChatPanelHeader,
    ChatMessage,
    ChatPanelFooter
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

</style>