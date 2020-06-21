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
  data () {
    return {
      fullName: "Tal Dei Tali",
      imagePath: "http://localhost:3000/static/uploads/defaultImg.png",
      //nota devono essere ordinati
      messages: [
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
  methods: {
    //this method propagates child-generated backToChatList event to his father
    onBackToChatList: function() {
      this.$emit('backToChatList')
    }
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