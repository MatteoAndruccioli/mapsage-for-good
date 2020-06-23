<template>
  <div class="input-group col-12" style="height: 100%;">
    <textarea v-model="messageBody" class="form-control" aria-label="With textarea" style="height: 90%; resize: none;"></textarea>
    <div class="input-group-append " style="height: 90%">
      <span v-on:click.prevent.stop="sendMessage" class="input-group-text my-send-button" style="cursor: pointer">Send</span>
    </div>
  </div>
</template>

<script>
export default {
 data () {
    return {
      messageBody:''
    }
  },
  methods: {
    sendMessage: function() {
      this.$emit('sendMessage', this.messageBody.trim())
      this.messageBody = ''
    }
  }
}
</script>

<style scoped>
  .my-send-button:hover {
    color: #111;
    background-color: #ccc;
    border-radius: 0.25 rem;
  }
</style>
