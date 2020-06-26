<template>
  <li v-on:click.prevent.stop="openNews" class="list-group-item">
    <div class="container justify-content-between">
      <div class="row">
        <section class="col-9">
          {{masseur_brand}} has publish a new advertisement:
          <br/>
          <b>{{advertisement_title}}</b>
        </section>
        <span class="container col-3">
          <div id="message-dot" class="m-auto" :class="{ 'blue-message-dot': blink, 'blink': blink }"></div>
        </span>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: [
    'notification_id',
    'masseur_id',
    'masseur_brand',
    'advertisement_title',
    'blink'
  ],
  methods: {
    openNews: function() {
      console.log("dentro element: ",this.notification_id,this.masseur_id,this.masseur_brand,this.advertisement_title,this.blink)
      this.$emit('openNews', this.notification_id)
    }
  }
}
</script>

<style lang="scss" scoped>
  li {
    cursor: pointer;
    :hover {
      color: #222;
      background-color: #efefef;
    }
  }
  #message-dot {
    width: 10px;
    height: 10px;
    background-color: #efefef;
    border-radius: 50%;
  }
  .blue-message-dot {
    background-color: blue !important;
  }
  .blink {
    animation: blinker 2s linear infinite;
  }
  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
</style>
