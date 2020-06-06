<template>
    <div class="container">
        <div class="row">
            <div class="col-md-6 mt-5 mx-auto">
                <form v-on:submit.prevent="login"><!--nota che chiama il metodo login-->
                    <h1 class="h3 mb-3 font-weight-normal">Please sign in</h1>
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" v-model="email" class="form-control" name="email" placeholder="Enter Email">
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" v-model="password" class="form-control" name="password" placeholder="Enter Password">
                    </div>
                    <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import router from '../router'
import { hex_sha512 } from "../assets/js/sha512.js"

export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },

  methods: {
    login () {
      //axios.post('http://192.168.1.6:3000/customers/login', { 
      axios.post('http://localhost:3000/customers/login', { 
        email: this.email,
        password: hex_sha512(this.password)
      }).then(res => {
        this.email = ''
        this.password = ''
        //se accessToken è settato allora ridirigo alla pagina di profilo
        if (res.data.accessToken != null && res.data.accessToken!=''){
          localStorage.setItem('usertoken', res.data.accessToken)
          router.push({ name: 'Profile_view' })
        } else {
          //accessToken non settato => notifico all'utente che il login è fallito
          alert("Login failed!! try again");
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
