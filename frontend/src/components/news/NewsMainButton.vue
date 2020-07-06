<template>
  <div class="dropdown" :class="{'show': isOpen}">
    <button type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" :aria-expanded="isOpen">
      News <span class="badge badge-light" v-if="totPendingNotifications>0">{{ totPendingNotifications }}</span>
    </button>

    <main class="dropdown-menu dropdown-menu-right bg-primary" :class="{'show': isOpen}">
      <section v-if="newsList==null || (newsList!=null && newsList.length==0)">
        <p>We will notify you as soon as a news is available!</p>
      </section>
      <NewsListPanel v-if="newsList!=null && newsList.length>0" @openNews="handleOpenNews" @pastNewsEvent="getPastNews" :newsList="newsList"/>
    </main>
  </div>
</template>

<script>
import NewsListPanel from './NewsListPanel'
import axios from 'axios'

import {socket} from '../utils/serverSocket'

export default {
  name: 'NewsMainButton',
  components: {
    NewsListPanel
  },
  data () {
    return {
      newsList: [],
      // Controls the news panel opening and closing
      isOpen: false,
      totPendingNotifications: 0
    }
  },

  methods: {
    // Propagated from newsListPanel child when a chat from the list is selected
    handleOpenNews: function(notif_id) {
      var referredNews = this.newsList.find(news => news.notification_id == notif_id)
      if (!referredNews.visualized) {
        axios.put('http://localhost:3000/notifications/setVisualized',
          {
            masseur_id: referredNews.masseur_id,
            notification_id: referredNews.notification_id
          },
          { withCredentials: true })
          .then(res => {
            if (!res.data.error) {
              referredNews.visualized = true
              this.totPendingNotifications--
            } else {
              alert(res.data.error)
              console.log(res.data.error)
            }
          }).catch(err => {
            alert(err.response.data.error)
            console.log(err.response.data.error)
          })
      }
      this.$router.push({ name: 'MasseurProfile_view', params: { id: referredNews.masseur_id }}, () => {});
    },
    // Handle messages received from socket.io
    handleMessageReceived: function(msg) {
      if (msg.error) {
        alert("Error receiving message: " + msg.error)
        return;
      }
      // Assumes msg is a new notification
      this.newsList.unshift(msg)
      this.totPendingNotifications++
    },
    // Retrieves the next set of news starting from "startIndex" to "stratIndex + N"
    getPastNews: function(startIndex) {
      axios.get('http://localhost:3000/notifications/getSet?firstElement=' + startIndex, { withCredentials: true })
        .then(res => {
          if (!res.data.error) {
            res.data.notifications.forEach(item => {
              this.newsList.push(item)
            });
            this.totPendingNotifications = this.newsList.filter(chat => chat.visualized==false).length;
          } else {
            alert(res.data.error)
            console.log(res.data.error)
          }
        }).catch(err => {
          alert(err.response.data.error)
          console.log(err.response.data.error)
        })
    }
  },
  mounted() {
    if (this.$cookies.get('currentUser') && this.$cookies.get('currentUser').logged_in) {
      socket.on('notification_' + this.$cookies.get('currentUser').user_id, this.handleMessageReceived)
    }
    this.getPastNews(0)
  }
}
</script>

<style scoped>
  button {
    background-color: #343a40 !important;
  }

  button:focus {
    box-shadow: none !important;
  }

  section {
    display: flex;
    margin: auto;
    background-color: #f0f0f0;
    height: 80px;
    width: 25em;
  }

  section > p {
    margin: auto;
    text-align: center;
  }

  main {
    background-color: #f0f0f0 !important;
    padding: 0px;
    margin-top: 10px;
  }

  .my-visibility{
    margin-bottom: 90px;
  }
</style>
