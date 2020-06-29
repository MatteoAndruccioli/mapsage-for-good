<template>
  <form v-on:submit.prevent="register">
    <h3 class="header-text">Signing up as Customer</h3>

    <div class="image-chooser-panel">
      <ImageCropper :src="profileImage" @cropEvent="handleCropEvent"/>
      <p v-if="profileImage==null">No image specified</p>
      <label for="imageChooser" class="custom-image-chooser">Upload Image</label>
      <input id="imageChooser" @change="handleImage" type="file" accept="image/*" name="customer-propic_input">
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
import { hex_sha512 } from '../assets/js/sha512.js'
import ImageCropper from './ImageCropper'

export default {
  components: {
    ImageCropper
  },
  data() {
    return {
      customer_first_name: '',
      customer_last_name: '',
      customer_email: '',
      customer_password: '',
      customer_propic: '',
      customer_croppedProfileImage: null,

      profileImage: null
    }
  },
  methods: {
    register () {
      let userData = {
        first_name: this.customer_first_name,
        last_name: this.customer_last_name,
        email: this.customer_email,
        password: hex_sha512(this.customer_password)
      }
      if (this.customer_croppedProfileImage != null) {
        userData.profile_picture = this.customer_croppedProfileImage
      }
      axios.post('http://localhost:3000/customers/register', userData, { withCredentials: true })
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
            console.log(res.data.error)
          }
        }).catch(err => {
          console.log(err)
        })
    },
    handleImage(input) {
      var vm = this
      if (input.target.files && input.target.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
          vm.profileImage = e.target.result;
        }
        reader.readAsDataURL(input.target.files[0]); // convert to base64 string
      }
    },
    handleCropEvent(croppedImage) {
      this.customer_croppedProfileImage = croppedImage
    }
  }
}
</script>

<style lang="scss" scoped>
.submit-button {
  display: block;
  width: 100%;
  padding: .5rem 1rem;
  font-size: 1.25rem;
  line-height: 1.5;
  border-radius: .3rem;
  color: #fff;
  background-color: #17a2b8;
  &:hover {
    color: #fff;
    background-color: #138496;
    border-color: #117a8b;
  }
}

.header-text{
  font-weight: 400;
  margin-bottom: 1rem;
  font-size: 1.75rem;
}

.image-chooser-panel {
  display: flex;
  flex-direction: column;
  #imageChooser {
    display: none
  }
  p {
    margin: auto;
  }
  .custom-image-chooser {
    border: 1px solid #ccc;
    border-radius: .3rem;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
    margin: auto;
    margin-top: 10px;
    &:hover {
      color: #fff;
      background-color: #138496;
      border-color: #117a8b;
    }
  }
}

</style>
