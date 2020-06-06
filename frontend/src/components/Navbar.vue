<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark rounded">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar1" aria-controls="navbar1"
            aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse justify-content-md-center" id="navbar1">
            <ul class="navbar-nav">
                <li class="nav-item">
                    <router-link class="nav-link" to="/">Home</router-link>
                </li>
                <li v-if="auth==''" class="nav-item">
                    <router-link class="nav-link" to="/login">Login</router-link>
                </li>
                <li v-if="auth==''" class="nav-item">
                    <router-link class="nav-link" to="/register">Register</router-link>
                </li>
                <li v-if="auth=='loggedin'" class="nav-item"> <!-- loggedin viene da login emitMethod() -->
                    <router-link class="nav-link" to="/profile">Profile</router-link>
                </li>
                <li v-if="auth=='loggedin'" class="nav-item">
                    <a class="nav-link" href="/login" v-on:click="logout">Logout</a>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
export default {
  data () {
    return {
      auth: '', //nota che controllando questo la navbar sopra mostra login e register se non sei loggato, se sei loggato il profilo e loggedin
      user: ''
    }
  },

  //al logout rimuovi lo usertoken
  methods: {
    logout () {
      localStorage.removeItem('usertoken')
    },

    checktoken() {
      if(localStorage.getItem('usertoken') !== null)
        this.auth = 'loggedin'
    }
  },

  mounted () {
    this.checktoken()
  }
}
</script>
