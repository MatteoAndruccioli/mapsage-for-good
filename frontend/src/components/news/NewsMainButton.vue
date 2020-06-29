<template>
  <div class="dropdown" :class="{'show': isOpen}">
    <button type="button" class="btn btn-dark dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" :aria-expanded="isOpen"> 
      News <span class="badge badge-light" v-if="totPendingNotifications>0">{{ totPendingNotifications }}</span>
    </button>

    <main class="dropdown-menu dropdown-menu-right bg-primary" :class="{'show': isOpen}">
      <section v-if="newsList==null || (newsList!=null && newsList.length==0)">
        <p>You've seen all news</p>
      </section>
      
      <NewsListPanel v-if="newsList!=null && newsList.length>0" @openNews="handleOpenNews" :newsList="newsList"/>
    </main>
  </div>
</template>

<script>
import NewsListPanel from './NewsListPanel'
import axios from 'axios'

import {socket} from '../socket/serverSocket'

export default {
  name: 'NewsMainButton',
  components: {
    NewsListPanel
  },
  data () {
    return {
      newsList: null,
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
            alert(err)
            console.log(err)
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
    }
  },
  mounted() {
    if (this.$cookies.get('currentUser') && this.$cookies.get('currentUser').logged_in) {
      socket.on('notification_' + this.$cookies.get('currentUser').user_id, this.handleMessageReceived)
    }
    axios.get('http://localhost:3000/notifications/getSet?firstElement=0', { withCredentials: true })
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
  }
}
</script>


<style scoped>

button {
  background-color: #343a40!important;
}

section > p {
  text-align: center;
  padding-top: 1.5rem;
}

section {
  background-color:#f0f0f0; 
  height: 80px; 
  width: 300px
}

.my-visibility{
  margin-bottom: 90px;
}
</style>
