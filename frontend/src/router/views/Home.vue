<template>
  <div id="app-home">
    <Navbar/>
    <SearchPanel/>
    <ChatMainButton v-if="showChatMainButton"/>
    <CookiesBanner v-if="showCookiesBanner" v-on:hideMe="showCookiesBanner=false"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '../components/Navbar'
import SearchPanel from '../components/SearchPanel'
import ChatMainButton from '../components/chat/ChatMainButton'
import CookiesBanner from '../components/CookiesBanner'

export default {
  name: 'Home_view',
  data() {
    return {
      showCookiesBanner: true,
      showChatMainButton: false
    }
  },
  components: {
    Navbar,
    SearchPanel,
    ChatMainButton,
    CookiesBanner
  },
  mounted() {
    if (this.$cookies.get('cookiePolicy')) {
      this.showCookiesBanner = false;
    }
    if (this.$cookies.get('currentUser') && this.$cookies.get('currentUser').logged_in) {
      this.showChatMainButton = true;
    }
  }
}
</script>
