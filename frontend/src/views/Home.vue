<template>
  <div id="app-home">
    <Navbar/>
    <SearchPanel/>
    <ChatFooterButton v-if="showChatFooterButton" :isMasseurProfile="false"/>
    <CookiesBanner v-if="showCookiesBanner" v-on:hideMe="showCookiesBanner=false"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '../components/Navbar'
import SearchPanel from '../components/SearchPanel'
import ChatFooterButton from '../components/chat/ChatFooterButton'
import CookiesBanner from '../components/CookiesBanner'

export default {
  name: 'Home_view',
  data() {
    return {
      showCookiesBanner: true,
      showChatFooterButton: false
    }
  },
  components: {
    Navbar,
    SearchPanel,
    ChatFooterButton,
    CookiesBanner
  },
  mounted() {
    if (this.$cookies.get('cookiePolicy')) {
      this.showCookiesBanner = false;
    }
    if (this.$cookies.get('currentUser') && this.$cookies.get('currentUser').logged_in) {
      this.showChatFooterButton = true;
    }
  }
}
</script>
