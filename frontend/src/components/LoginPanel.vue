<template>
    <div class="container ">
        <div class="row login-elements-container">
            <aside class="col-lg-4 d-none d-lg-block ">
              <img class="card my-cover lone-image" src="../assets/images/copertina.png" alt="Cover massage image 1">
            </aside>

            <aside class="col-md-6 col-lg-4 d-none d-md-block ">
              <img class="card my-cover" src="../assets/images/cover.jpg" alt="Cover massage image 2 up">
              <img class="card my-cover bottom-image" src="../assets/images/cover2.jpg" alt="Cover massage image 2 down">
            </aside>

            <main class="col-sm-12 col-md-6 col-lg-4 my-box">
                <h3 class="main-header">Mapsage</h3>

                <form v-on:submit.prevent="login">
                    <div class="form-group">
                        <input type="email" v-model="email" class="form-control" name="email" placeholder="Enter Email">
                    </div>
                    <div class="form-group">
                        <input type="password" v-model="password" class="form-control" name="password" placeholder="Enter Password">
                    </div>
                    <button class="btn submit-button" type="submit">Log in</button>
                </form>

                <hr class="dividing-element">

                <footer>
                  <p>Don't have an account?
                    <router-link class="signup-style" to="/register">Sign up</router-link>
                  </p>
                </footer>
            </main>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { hex_sha512 } from './utils/sha512.js'

export default {
  data () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login () {
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
        alert("Login failed!! try again");
        console.log(err.response.data.error)
      })
    }
  }
}
</script>

<style scoped>
.submit-button:hover {
    color: #fff;
    background-color: #138496;
    border-color: #117a8b;
}

.submit-button {
  display: block;
  width: 100%;
  padding: .5rem 1rem;
  font-size: 1.25rem;
  line-height: 1.5;
  border-radius: .3rem;
  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8;
}

form {
  margin-left: 3rem;
  margin-right: 3rem;
  margin-top: 3rem;
}

footer {
  margin-top: 1.5rem;
  text-align: center;
}

.main-header {
  text-align: center;
  margin-top: 3rem;
  margin-bottom: 1rem;
}

.dividing-element {
  margin-right: 1rem;
  margin-left: 1rem;
  margin-top: 3rem;
}

.lone-image {
  height:420px;
}

.bottom-image {
  margin-top: 3rem;
}

.login-elements-container {
  padding-top: 3rem!important;
}

.signup-style {
  color: #17a2b8;
  font-weight: 500;
}

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
