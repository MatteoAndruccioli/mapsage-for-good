<template>
    <div class="container ">
        <div class="row pt-5">
            <div class="col-md-4 col-sm-6">
              <img class="Card imgage px-auto my-cover" src="../assets/images/copertina.png" alt="Card image">
            </div>
            <div class="col-md-4 col-sm-6">
              <img class="Card imgage px-auto my-cover" src="../assets/images/cover.jpg" alt="Card image">
              <img class="Card imgage px-auto my-cover mt-5" src="../assets/images/cover2.jpg" alt="Card image">
            </div>
            <div class="col-md-4 col-sm-6 my-box">
                <h1 class="h3 mb-3 font-weight-5 text-center mt-5">Mapsage</h1>
                <form v-on:submit.prevent="login" class="mx-5 mt-5">
                    <div class="form-group">
                        <input type="email" v-model="email" class="form-control" name="email" placeholder="Enter Email">
                    </div>
                    <div class="form-group">
                        <input type="password" v-model="password" class="form-control" name="password" placeholder="Enter Password">
                    </div>
                    <button class="btn btn-lg btn-primary btn-block" type="submit">Log in</button>
                </form>


                <hr class="mx-3 mt-5">                  

                <div class="mt-4 text-center">
                  <p>Don't have an account?
                    <router-link class="" to="/register">Sign up</router-link>
                  </p>
                </div>
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


<style scoped>
.my-background{
  background-color: #f5f5f5;
}

.my-box {
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 10px 0;
  background-color: #fff;
}

.my-cover {
  border-radius: 5px;
}

input.form-control{
  background-color: #eee;
}

.btn-primary {
    color: #fff;
    background-color: #007bff;
    border-color: #007bff;

}
</style>