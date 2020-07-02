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
    <button v-if="!pastNewsAvailable()" @click="getPastNews" type="button" class="next-messages-button"><span>Load past news</span></button>
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
  data() {
    return {
      oldNewsList: []
    }
  },
  methods: {
    //this method propagates child-generated backToNewsList event to his father
    onOpenNews: function(notification_id) {
      this.$emit('openNews', notification_id)
    },
    pastNewsAvailable: function() {
      return this.newsList.length < 4 ||
        this.newsList.length == this.oldNewsList.length
    },
    getPastNews: function() {
      this.oldNewsList = this.newsList.slice(0) // array clone
      console.log(this.newsList.length)
      this.$emit('pastNewsEvent', this.newsList.length)
    }
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

  .next-messages-button {
    border: none;
    color: #17a2b8;
    text-decoration: underline;
    transition: all 0.5s;
  }

  .next-messages-button span {
    cursor: pointer;
    display: inline-block;
    position: relative;
    transition: 0.5s;
  }

  .next-messages-button span:after {
    content: '\21A7';
    position: absolute;
    opacity: 0;
    top: 0;
    right: -20px;
    transition: 0.5s;
  }

  .next-messages-button:hover span {
    padding-right: 20px;
  }

  .next-messages-button:hover span:after {
    opacity: 1;
    right: 0;
  }

  .next-messages-button:hover {
    color: #117a8b;
  }
</style>
