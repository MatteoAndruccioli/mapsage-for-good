<template>
  <li v-on:click.prevent.stop="showChat" class="list-group-item container my-list-item">
    <div class="container row col-12 father-panel justify-content-between">
      <img class="propic ml-2" :src="imagePath" alt="Avatar"/>
      <div class="username pt-1 ml-4">{{fullName}}</div>
      <span class="new-message-dot my-auto ml-4" :class="{ 'my-dot-color-blue': blink, 'my-blink-me': blink }"></span>
    </div>
  </li>
</template>

<script>
export default {
  props: [
    'fullName',
    'imagePath',
    'chat_id',
    'blink',
    'receiver_id'
  ],
  methods: {
    showChat: function() {
      this.$emit('openChat', this.chat_id, this.receiver_id, this.fullName, this.imagePath)
    }
  }
}
</script>

<style scoped>
  .father-panel {
    flex-wrap: nowrap;
  }

  .username {
    white-space: nowrap;
    overflow: hidden !important;
    text-overflow: ellipsis;
  }

  li {
    cursor: pointer;
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

  @media screen and (max-width: 420px) {
    img {
      display: none;
    }

    .new-message-dot {
      display: none;
    }
  }

</style>
