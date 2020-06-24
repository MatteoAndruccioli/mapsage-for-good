<template>
    <div class="container ">
        <div class="row pt-5">
            <div class="col-lg-4 d-none d-lg-block ">
              <img class="card image px-auto my-cover" src="../assets/images/copertina.png" alt="Card image">
            </div>
            <div class=" col-md-6 col-lg-4 d-none d-md-block ">
              <img class="card image px-auto my-cover" src="../assets/images/cover.jpg" alt="Card image">
              <img class="card image px-auto my-cover mt-5" src="../assets/images/cover2.jpg" alt="Card image">
            </div>
            <div class="col-sm-12 col-md-6 col-lg-4 my-box">
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
      //axios.post('http://192.168.1.6:3000/users/login', {
      axios.post('http://localhost:3000/users/login', {
        email: this.email,
        password: hex_sha512(this.password)
      }, { withCredentials: true }).then(res => {
        this.email = ''
        this.password = ''
        if (!res.data.error) {
          var currentUser = {
            logged_in: true,
            profile_type: res.data.profile_type,
            user_id: res.data._id
          }
          this.$cookies.set('currentUser', currentUser)
          if (this.$route.params.source == 'from_masseurProfile_view') {
            this.$router.push({ name: 'MasseurProfile_view', params: { id: this.$route.params.masseur_id } })
          } else {
            this.$router.push({ name: 'Home_view' })
          }
        } else {
          alert("Login failed!! try again");
          console.log(res.data.error)
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

img {
  width: 17rem;
}
</style>
