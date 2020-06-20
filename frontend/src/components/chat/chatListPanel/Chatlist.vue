<template>
  <div style="width: 21rem;">

    <h5 class="text-center" style="color:white">Le tue chat</h5>

    <div>
      <ul class="list-group" >
        <div v-for="chat in chats" :key="chat._id">
          <ChatListElement :fullName=chat.fullName 
          :imagePath=chat.imagePath 
          :_id=chat._id 
          :blink=chat.blink /> 
        </div>
      </ul>
    </div>

    <!--
    <div class="container">
      <div class="row">
        <div class="input-group col-12">
          <textarea class="form-control" aria-label="With textarea"></textarea>
          <div class="input-group-append">
            <span class="input-group-text">Send</span>
          </div>
        </div>
      </div>
    </div>
    -->
  </div>
</template>

<script>
import sync from 'css-animation-sync';
import ChatListElement from './ChatListElement'

export default {
  data () {
    return {
      chats: [
        {
          fullName: "Gino Pippo1",
          imagePath: "http://localhost:3000/static/uploads/defaultImg.png",
          _id: 'gp1',
          blink: true
        },
        {
          fullName: "Gino Pippo 2",
          imagePath: "http://localhost:3000/static/uploads/defaultImg.png",
          _id: 'gp2',
          blink: true
        },
        {
          fullName: "Gino Pippo 3",
          imagePath: "http://localhost:3000/static/uploads/defaultImg.png",
          _id: 'gp3',
          blink: false
        },
        {
          fullName: "Gino Pippo 4",
          imagePath: "http://localhost:3000/static/uploads/defaultImg.png",
          _id: 'gp4',
          blink: false
        },
        {
          fullName: "Gino Pippo 5",
          imagePath: "http://localhost:3000/static/uploads/defaultImg.png",
          _id: 'gp5',
          blink: false
        },
        {
          fullName: "Gino Pippo 6",
          imagePath: "http://localhost:3000/static/uploads/defaultImg.png",
          _id: 'gp6',
          blink: false
        },
        {
          fullName: "Gino Pippo 7",
          imagePath: "http://localhost:3000/static/uploads/defaultImg.png",
          _id: 'gp7',
          blink: true
        },
        {
          fullName: "Gino Pippo 8",
          imagePath: "http://localhost:3000/static/uploads/defaultImg.png",
          _id: 'gp8',
          blink: true
        },
      
      ]
    }
  },

  mounted() {
    sync('spinner')
    //bliker è il nome della animazione presente in ChatListElem
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