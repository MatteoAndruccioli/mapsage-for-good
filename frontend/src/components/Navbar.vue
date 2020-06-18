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
                    <router-link class="nav-link" to="/masseurProfile">Masseur Profile</router-link>
                </li>
                <li v-if="isUserLoggedIn" class="nav-item">
                    <a class="nav-link" href="/" v-on:click="logout">Logout</a>
                </li>
                <li v-if="isUserLoggedIn" class="nav-item">  <!-- TEST ONLY -->
                    <a class="nav-link" v-on:click="getUserInfo">GetUserInfo</a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import axios from 'axios'

export default {
  data () {
    return {
      isUserLoggedIn: false,
      isCustomer: false,
      isMasseur:false,
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
        axios.get('http://localhost:3000/users/profile', { withCredentials: true })
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
