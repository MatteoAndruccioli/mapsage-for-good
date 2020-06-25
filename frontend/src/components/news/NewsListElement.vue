<template>
  <li v-on:click.prevent.stop="openNews" class="list-group-item container my-list-item">
    <div class="container row d-flex flex-row col-12 my-blinker-father justify-content-between">
      <div class="pt-1 ml-4">{{masseur_name}} has publish a new advertisement:</div>
      <div> {{advertisement_title}} </div>
      <span class="new-message-dot my-auto ml-4" :class="{ 'my-dot-color-blue': blink, 'my-blink-me': blink }"></span>
    </div>
  </li>
</template>

<script>
export default {
  props: [
    'notification_id',
    'masseur_id',
    'masseur_name',
    'advertisement_title',
    'blink'
  ],
  methods: {
    openNews: function() {
      this.$emit('openNews', this.notification_id)
    }
  }
}
</script>

<style scoped>
  li {
    cursor: pointer;
  }

  .list-group{
    max-height: 300px;
    margin-bottom: 10px;
    overflow-y:scroll;
    -webkit-overflow-scrolling: touch;
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
