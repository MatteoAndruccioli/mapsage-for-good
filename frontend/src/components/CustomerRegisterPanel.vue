<template>
  <form v-on:submit.prevent="register">
    <h3 class="header-text">Signing up as Customer</h3>
    <div class="form-group my_centered">
      <img :src="customer_propic" alt="" name="customer-propic" class="propic propic-border">
      <input @change="handleImage" class="propic-input" type="file" accept="image/*" name="customer-propic_input" >
    </div>
    <div class="form-group">
      <label for="customer-first_name">First Name</label>
      <input type="text" v-model="customer_first_name" class="form-control" name="customer-first_name" placeholder="Enter Fist Name" required>
    </div>
    <div class="form-group">
      <label for="customer-last_name">Last Name</label>
      <input type="text" v-model="customer_last_name" class="form-control" name="customer-last_name" placeholder="Enter Last Name" required>
    </div>
    <div class="form-group">
      <label for="customer-email">Email Address</label>
      <input type="email" v-model="customer_email" class="form-control" name="customer-email" placeholder="Enter Email" required>
    </div>
    <div class="form-group">
      <label for="customer-password">Password</label>
      <input type="password" v-model="customer_password" class="form-control" name="customer-password" placeholder="Enter Password" required>
    </div>
    <button class="btn submit-button" type="submit">Register</button>
  </form>
</template>

<script>
import axios from 'axios'
import { hex_sha512 } from "../assets/js/sha512.js"

export default {
  data() {
    return {
      customer_first_name: '',
      customer_last_name: '',
      customer_email: '',
      customer_password: '',
      customer_propic: '',
      customer_profileImage: null,
    }
  },
  methods: {
    register () {
      const formData = new FormData();
      formData.append('first_name', this.customer_first_name)
      formData.append('last_name', this.customer_last_name)
      formData.append('email', this.customer_email)
      formData.append('password', hex_sha512(this.customer_password))
      formData.append('profile_picture', this.customer_profileImage)
      axios.post('http://localhost:3000/customers/register', formData, { withCredentials: true })
          .then(res => {
            if (!res.data.error) {
              var currentUser = {
                logged_in: true,
                profile_type: 'Customer',
                user_id: res.data._id
              }
              this.$cookies.set('currentUser', currentUser);
              this.$router.push({ name: 'Home_view' })
            } else {
              alert(res.data.error)
            }
      }).catch(err => {
        console.log(err)
      })
    },
    handleImage(e) {
      const selectedImage = e.target.files[0]
      this.customer_profileImage = selectedImage
      this.createBase64Image(selectedImage)
    },
    createBase64Image(fileObject) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.customer_propic = e.target.result;
      };
      reader.readAsDataURL(fileObject)
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

.header-text{
  font-weight: 400;
  margin-bottom: 1rem;
  font-size: 1.75rem;
}

.my_centered {
  text-align: center;
}

.propic-input {
  display: flex;
  justify-content: center;
  margin-top: 5px;
}

.propic {
  width: 20rem;
  height: 20rem;
}

.propic-border {
  border-radius: 50%;
  border: 2px solid #fff;
}

@media screen and (max-width: 720px) {
  .propic {
    width: 15rem;
    height: 15rem;
  }
}

@media screen and (max-width: 420px) {
  .propic {
    width: 10rem;
    height: 10rem;
  }
}

@media screen and (max-width: 200px) {
  .propic {
    width: 7rem;
    height: 7rem;
  }
}
</style>
