<template>
  <div id="app-home">
    <Navbar/>
    <SearchPanel/>
    <CookiesBanner v-if="showCookiesBanner" v-on:hideMe="showCookiesBanner=false"/>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '../components/Navbar'
import SearchPanel from '../components/SearchPanel'
import CookiesBanner from '../components/CookiesBanner'

export default {
  name: 'Home_view',
  data() {
    return {
      showCookiesBanner: true
    }
  },
  components: {
    Navbar,
    SearchPanel,
    CookiesBanner
  },
  mounted() {
    if (this.$cookies.get('cookiePolicy')) {
      this.showCookiesBanner = false;
    }
  }
}
</script>
