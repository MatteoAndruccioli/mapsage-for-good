<template>
  <li v-on:click.prevent.stop="showChat" class="list-group-item container my-list-item" style="cursor: pointer">
    <div class="container row d-flex flex-row col-12 my-blinker-father justify-content-between">
      <img class="propic ml-2" :src="imagePath" alt="Avatar">
      <div class="pt-1 ml-4">{{fullName}}</div>
      <span class="new-message-dot my-auto ml-4" :class="{ 'my-dot-color-blue': blink, 'my-blink-me': blink }"></span>
    </div>
  </li>
</template>

<script>
export default {
  props: [
    'fullName', 
    'imagePath',
    '_id',
    'blink'
  ],
  methods: {
    showChat: function() {
      alert("user wants to chat with _id == " + this.$props._id)
    }
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

  .my-list-item:hover {
    color: #222;
    background-color: #efefef;
  }

  .new-message-dot {
    width: 0.5rem;
    height: 0.5rem;
    background-color: #efefef;
    border-radius: 50%;
    display: inline-block;
  }

  .my-dot-color-blue {
    background-color: blue;
  }


  .my-blink-me {
    animation: blinker 2s linear infinite;
  }

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
  
</style>