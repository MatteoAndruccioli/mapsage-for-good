<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar1" aria-controls="navbar1"
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-md-center" id="navbar1">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <router-link class="nav-link" to="/">Home</router-link>
                </li>
                <li v-if="!isUserLoggedIn" class="nav-item">
                    <router-link class="nav-link" to="/login">Login</router-link>
                </li>
                <li v-if="!isUserLoggedIn" class="nav-item">
                    <router-link class="nav-link" to="/register">Register</router-link>
                </li>
                <li v-if="isCustomer" class="nav-item">
                    <router-link class="nav-link" to="/customerProfile">Customer Profile</router-link>
                </li>
                <li v-if="isMasseur" class="nav-item">
                    <router-link class="nav-link" :to="'/masseurProfile/' + this.currentUserId">Masseur Profile</router-link>
                </li>
                <li v-if="isUserLoggedIn" class="nav-item">
                    <a class="nav-link" href="/" v-on:click="logout">Logout</a>
                </li>
                <li v-if="isUserLoggedIn" class="nav-item">  <!-- TEST ONLY -->
                    <a class="nav-link" v-on:click="getUserInfo">GetUserInfo</a>
                </li>
                <li>
                  <NewsMainButton v-if="showNewsMainButton"/>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import axios from 'axios'
import NewsMainButton from '../components/news/NewsMainButton'

export default {
  components: {
    NewsMainButton
  },
  data () {
    return {
      isUserLoggedIn: false,
      isCustomer: false,
      isMasseur: false,

      currentUserId: '',

      showNewsMainButton: false
    }
  },
  methods: {
    logout() {
      if (this.$cookies.get('currentUser')) {
        this.$cookies.remove('currentUser')
        this.isUserLoggedIn = false
        this.isCustomer = false
        this.isMasseur = false
      }
    },
    checkUserLogin() {
      if (this.$cookies.get('currentUser')) {
        this.isUserLoggedIn = this.$cookies.get('currentUser').logged_in
        if (this.isUserLoggedIn) {
          this.showNewsMainButton = true
        }
        this.currentUserId = this.$cookies.get('currentUser').user_id
        if (this.$cookies.get('currentUser').profile_type == "Customer"){
          this.isCustomer = true
          this.isMasseur = false
        }else{
          this.isCustomer = false
          this.isMasseur = true
        }
      }
    },
    getUserInfo() {
      if (this.isUserLoggedIn) {
        var route;
        if(this.isCustomer) {
          route = 'http://localhost:3000/customers/profile'
        } else {
          route = 'http://localhost:3000/masseurs/profile'
        }
        axios.get(route, { withCredentials: true })
          .then(res => {
            if (!res.data.error) {
              console.log(res.data)
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
  },
  mounted () {
    this.checkUserLogin()
  }
}
</script>
