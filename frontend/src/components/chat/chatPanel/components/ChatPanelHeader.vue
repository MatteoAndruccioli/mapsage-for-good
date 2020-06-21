<template>
  <div class="container d-flex justify-content-start row my-auto ml-1">
    <span v-on:click.prevent.stop="goBackToChatList" class="my-arrow-button" style=''>&#129128;</span>
    <img class="propic ml-3" :src="imagePath" alt="Avatar">
    <h5 class="text-center my-auto  ml-3" style="color: white">{{fullName}}</h5>
  </div>
</template>

<script>
export default {
  props: [
    'fullName', 
    'imagePath'
  ],
  methods: {
    goBackToChatList: function() {
      this.$emit('backToChatList')
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

  .my-arrow-button {
    font-size: 24px; 
    color: white; 
    cursor: pointer;
  }

  .my-arrow-button:hover {
    color: lightblue;
  }
  
</style>