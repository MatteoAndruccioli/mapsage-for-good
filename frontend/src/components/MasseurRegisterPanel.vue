<template>
  <form v-on:submit.prevent="register">
    <h1 class="h3 mb-3 font-weight-normal">Signing up as Masseur</h1>
    <div class="form-group my_centered">
          <img style="" :src="masseur_propic" alt="" name="masseur-propic" class="propic propic-border">
          <input @change="handleImage" class="my_custom-input" type="file" accept="image/*" name="masseur-propic_input" style="margin-top: 5px; ">
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
      <label for="masseur_phoneNumber">Phone Number</label>
      <input type="tel" v-model="masseur_phoneNumber" id="masseur_phoneNumber" class="form-control" name="masseur_phoneNumber" placeholder="Enter Phone Number" pattern="[0-9]{10}" required>
    </div>
    <div class="form-group">
      <label for="masseur-location">Location</label>
      <div id="mapContainer">
        <MapPanel name="masseur-location" @locationEvent="locationChosed" initType="REGISTER_PANEL_MAP"/>
      </div>
    </div>
    <div class="form-group">
      <label for="masseur-expertise">Espertise</label>
      <textarea  type="text" v-model="masseur_expertise" class="form-control" name="masseur-expertise" cols="30" rows="4"
        placeholder="Here you can write a short text to describe yourself to your costumers" />
    </div>
    <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
  </form>
</template>

<script>
import axios from 'axios'
import { hex_sha512 } from "../assets/js/sha512.js"
import MapPanel  from "./map/MapPanel"

export default {
  components: {
    MapPanel
  },
  data () {
    return {
      masseur_propic: '',
      masseur_profileImage: null,
      masseur_email: '',
      masseur_password: '',
      masseur_brandName:'',
      masseur_location_latlgn: null,
      masseur_phoneNumber:'',
      masseur_expertise: '',
    }
  },
  methods: {
    register () {
      if (this.masseur_location_latlgn == null) {
        alert("Insert user location")
        return;
      }
      const formData = new FormData();
      formData.append('brand_name', this.masseur_brandName)
      formData.append('email', this.masseur_email)
      formData.append('password', hex_sha512(this.masseur_password))
      formData.append('phone_number', this.masseur_phoneNumber)
      formData.append('expertise', this.masseur_expertise)
      formData.append('profile_picture', this.masseur_profileImage)
      formData.append('coordinates', JSON.stringify(this.masseur_location_latlgn))
      axios.post('http://localhost:3000/masseurs/register', formData, { withCredentials: true })
          .then(res => {
            if (!res.data.error) {
              var currentUser = {
                logged_in: true,
                profile_type: 'Masseur',
                user_id: res.data._id
              }
              this.$cookies.set('currentUser', currentUser);
              this.$router.push({ name: 'Home_view' })
            } else {
              console.log(res.data.error)
            }
      }).catch(err => {
        console.log(err)
      })
    },
    handleImage(e) {
      const selectedImage = e.target.files[0]
      this.masseur_profileImage = selectedImage
      this.createBase64Image(selectedImage)
    },
    createBase64Image(fileObject) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.masseur_propic = e.target.result;
      };
      reader.readAsDataURL(fileObject)
    },
    locationChosed(location) {
      this.masseur_location_latlgn = location;
      console.log(this.masseur_location_latlgn)
    }
  }
}
</script>

<style scoped>
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

#mapContainer {
  width: 100%;
  height: 300px;
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
