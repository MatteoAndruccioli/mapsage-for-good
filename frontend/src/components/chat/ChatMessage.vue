<template>
  <li v-on:click.prevent.stop class="my-message-container">
    <div :class="{ 'my-my-message': isUserMessage, 'my-his-message': !isUserMessage }">
      <p class="my-message-text">{{messageBody}}</p>
    </div>
  </li>
</template>

<script>
export default {
  props: [
    'messageBody',
    'isUserMessage'
  ]
}
</script>

<style scoped>
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
