<template>
  <ul class="list-group">
    <div v-for="news in newsList" :key="news.notification_id">
      <NewsListElement
        :notification_id="news.notification_id"
        :masseur_id="news.masseur_id"
        :masseur_brand="news.masseur_brand"
        :advertisement_title="news.advertisement_title"
        :blink="!news.visualized"
        @openNews="onOpenNews"/>
    </div>
  </ul>
</template>

<script>
import sync from 'css-animation-sync';
import NewsListElement from './NewsListElement'

export default {
  props: ['newsList'],
  components: {
    NewsListElement
  },
  methods: {
    //this method propagates child-generated backToNewsList event to his father
    onOpenNews: function(notification_id) {
      this.$emit('openNews', notification_id)
    },
  },
  mounted() {
    sync('spinner')
    //https://github.com/bealearts/css-animation-sync
    //https://stackoverflow.com/questions/4838972/how-to-sync-css-animations-across-multiple-elements
    const animation = new sync('blinker')
    animation.start()
  }
}
</script>

<style scoped>
  .list-group{
    display: flex;
    margin: auto;
    width: 25em;
    max-height: 300px;
    overflow-y:scroll;
    -webkit-overflow-scrolling: touch;
  }
</style>
