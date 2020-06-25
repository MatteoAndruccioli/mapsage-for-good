<template>
  <div class="dropdown" :class="{'show': isOpen}">
    <button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" :aria-expanded="isOpen">
      News <span class="badge badge-light" v-if="totPendingNotifications>0">{{ totPendingNotifications }}</span>
    </button>

    <div class="dropdown-menu dropdown-menu-right bg-primary" :class="{'show': isOpen}">
      <NewsListPanel @openNews="handleOpenNews" :newsList="newsList"/>
    </div>
  </div>
</template>

<script>
import NewsListPanel from './NewsListPanel'
import axios from 'axios'

import {openSocket, closeSocket} from '../socket/serverSocket'

export default {
  name: 'NewsMainButton',
  components: {
    NewsListPanel
  },
  data () {
    return {
      newsList: null,
      socket: null,
      // Controls the news panel opening and closing
      isOpen: false,
      totPendingNotifications: 0
    }
  },

  methods: {
    // Propagated from newsListPanel child when a chat from the list is selected
    handleOpenNews: function(notif_id) {
      console.log(notif_id)
      console.log(this.newsList)
      var referredNews = this.newsList.find(news => news.notification_id == notif_id)
      if (!referredNews.visualized) {
        axios.put('http://localhost:3000/notifications/remove',
          {
            masseur_id: referredNews.masseur_id,
            notification_id: referredNews.notif_id
          },
          { withCredentials: true })
          .then(res => {
            if (!res.data.error) {
              referredNews.visualized = true
            } else {
              alert(res.data.error)
              console.log(res.data.error)
            }
          }).catch(err => {
            alert(err)
            console.log(err)
          })
      }
      this.$router.push({ name: 'MasseurProfile_view', params: { id: referredNews.masseur_id } })
    },
    // Handle messages received from socket.io
    handleMessageReceived: function(msg) {
      if (msg.error) {
        alert("Error receiving message: " + msg.error)
        return;
      }
      // Assumes msg is a new notification
      this.newList.push(msg.notifications)
      this.totPendingNotifications++
    }
  },
  mounted() {
    this.socket = openSocket()
    if (this.$cookies.get('currentUser') && this.$cookies.get('currentUser').logged_in) {
      this.socket.on('advertisement_' + this.$cookies.get('currentUser').user_id, this.handleMessageReceived)
    }
    axios.get('http://localhost:3000/notifications/getRange/0', { withCredentials: true })
      .then(res => {
        if (!res.data.error) {
          this.newsList = res.data.notifications
          this.totPendingNotifications = this.newsList.filter(chat => chat.visualized==false).length;
        } else {
          alert(res.data.error)
          console.log(res.data.error)
        }
      }).catch(err => {
        alert(err)
        console.log(err)
      })
  },
  beforeDestroy() {
    closeSocket()
  }
}
</script>


<style scoped>
.my-visibility{
  margin-bottom: 90px;
}
</style>
