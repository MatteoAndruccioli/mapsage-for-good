<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 mt-5 mx-auto">
        <ul class="nav nav-tabs" id="myTab" role="tablist">
          <li class="nav-item">
            <a v-on:click="profile_type='Customer'" class="nav-link active" id="customer-tab" data-toggle="tab" href="#customer" role="tab" aria-controls="customer" aria-selected="true">Customer</a>
          </li>
          <li class="nav-item">
            <a v-on:click="profile_type='Masseur'" class="nav-link" id="masseur-tab" data-toggle="tab" href="#masseur" role="tab" aria-controls="masseur" aria-selected="false">Masseur</a>
          </li>
        </ul>

        <div class="tab-content" id="myTabContent">
          <div class="tab-pane fade show active" id="customer" role="tabpanel" aria-labelledby="customer-tab">
            <form v-on:submit.prevent="register">
              <h1 class="h3 mb-3 font-weight-normal">Signing up as customer</h1>
              <div class="form-group my_centered">
                    <img style="" :src="customer_propic" alt="" name="customer-propic" class="propic">
                    <input @change="handleImage" class="my_custom-input" type="file" accept="image/*" name="customer-propic_input" >
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
              <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
            </form>
          </div>

          <div class="tab-pane fade" id="masseur" role="tabpanel" aria-labelledby="masseur-tab">
            <form v-on:submit.prevent="register">
              <h1 class="h3 mb-3 font-weight-normal">Signing up as Masseur</h1>
              <div class="form-group my_centered">
                    <img style="" :src="masseur_propic" alt="" name="masseur-propic" class="propic">
                    <input @change="handleImage" class="my_custom-input" type="file" accept="image/*" name="masseur-propic_input">
              </div>
              <div class="form-group">
                <label for="masseur-brandName">Brand Name</label>
                <input type="text" v-model="masseur_brandName" class="form-control" name="masseur-brandName" placeholder="Enter Your Brand Name" required>
              </div>
              <div class="form-group">
                <label for="masseur-email">Email Address</label>
                <input type="email" v-model="masseur_email" class="form-control" name="masseur-email" placeholder="Enter Email" required>
              </div>
              <div class="form-group">
                <label for="masseur-password">Password</label>
                <input type="password" v-model="masseur_password" class="form-control" name="masseur-password" placeholder="Enter Password" required>
              </div>
              <div class="form-group">
                <label for="masseur-mailingAddress">Mailing Address</label>
                <input type="text" v-model="masseur_mailingAddress" class="form-control" name="masseur-mailingAddress" placeholder="Enter Mail Address" required>
              </div>
              <div class="form-group">
                <label for="masseur_phoneNumber">Phone Number</label>
                <input type="tel" v-model="masseur_phoneNumber" id="masseur_phoneNumber" class="form-control" name="masseur_phoneNumber" placeholder="Enter Phone Number" pattern="[0-9]{10}" required>
              </div>
              <div class="form-group">
                <label for="masseur-expertise">Espertise</label>
                <textarea  type="text" v-model="masseur_expertise" class="form-control" name="masseur-expertise" cols="30" rows="4"
                  placeholder="Here you can write a short text to describe yourself to your costumers" />
              </div>
              <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
            </form>
          </div>
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
      profile_type: 'Customer',
      //customer related fields
      customer_first_name: '',
      customer_last_name: '',
      customer_email: '',
      customer_password: '',
      customer_propic: '',
      customer_profileImage: null,
      //masseur related fields
      masseur_propic: '',
      masseur_profileImage: null,
      masseur_email: '',
      masseur_password: '',
      masseur_brandName:'',
      masseur_mailingAddress: '',
      masseur_phoneNumber:'',
      masseur_expertise: '',
    }
  },
  methods: {
    register () {
      var route;
      const formData = new FormData();
      if (this.profile_type === 'Customer') {
        formData.append('first_name', this.customer_first_name)
        formData.append('last_name', this.customer_last_name)
        formData.append('email', this.customer_email)
        formData.append('password', hex_sha512(this.customer_password))
        formData.append('profile_picture', this.customer_profileImage)
        route = 'http://localhost:3000/customers/register'
      } else if (this.profile_type === 'Masseur') {
        formData.append('brand_name', this.masseur_brandName)
        formData.append('email', this.masseur_email)
        formData.append('password', hex_sha512(this.masseur_password))
        formData.append('mailing_address', this.masseur_mailingAddress)
        formData.append('phone_number', this.masseur_phoneNumber)
        formData.append('expertise', this.masseur_expertise)
        formData.append('profile_picture', this.masseur_profileImage)
        formData.append('location', JSON.stringify({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [12.644152, 43.994019]
          }
          // Properties filed will be filled by the server
        }))
        route = 'http://localhost:3000/masseurs/register'
      }
      axios.post(route, formData, { withCredentials: true })
          .then(res => {
            if (!res.data.error) {
              var currentUser = { logged_in: true, profile_type: this.profile_type}
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
      if (this.profile_type == 'Customer') {
        this.customer_profileImage = selectedImage
      } else if (this.profile_type == 'Masseur') {
        this.masseur_profileImage = selectedImage
      }
      this.createBase64Image(selectedImage, this.profile_type)
    },

    //econdes image base64 to show a preview to user signing up
    createBase64Image(fileObject, visitor) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if(visitor == 'Customer'){
          this.customer_propic = e.target.result;
        }else if (visitor == 'Masseur'){
          this.masseur_propic = e.target.result;
        }
      };
      reader.readAsDataURL(fileObject)
    }

  }
}
</script>

<style>
.my_container {
  display: flex;
  justify-content: center;
}

.my_mt-10 {
  margin-top: 10rem;
}

.my_bg-white{
  background: #fff;
}

.my_card {
  height: 10rem;
  width: 20rem;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
}

img {
  width: 17rem;
}

.my_centered {
  text-align: center;
}

.my_custom-input {
  display: flex;
  justify-content: center;
}

</style>
