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
                <li v-if="isUserLoggedIn" class="nav-item"> <!-- loggedin viene da login emitMethod() -->
                    <router-link class="nav-link" to="/profile">Profile</router-link>
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
      user: ''
    }
  },
  methods: {
    logout() {
      if (this.$cookies.get('logged-in')) {
        this.$cookies.remove('logged-in');
      }
    },
    checkUserLogin() {
      if (this.$cookies.get('logged-in')) {
        this.isUserLoggedIn = true;
      }
    },
    getUserInfo() {
      if (this.isUserLoggedIn) {
        axios.get('http://localhost:3000/customers/profile', { withCredentials: true })
          .then(res => {
            console.log(res.data);
          }).catch(err => {
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
