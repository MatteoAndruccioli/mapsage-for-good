<template>
  <form v-on:submit.prevent="register">
    <h3 class="header-text">Signing up as Masseur</h3>

    <div class="image-chooser-panel">
      <ImageCropper :src="profileImage" @cropEvent="handleCropEvent"/>
      <p v-if="profileImage==null">No image specified</p>
      <label for="imageChooser" class="custom-image-chooser">Upload Image</label>
      <input id="imageChooser" @change="handleImage" type="file" accept="image/*" name="masseur-propic_input">
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
      <label for="masseur-location">Choose your location</label>
      <div id="mapContainer">
        <MapPanel name="masseur-location" @locationEvent="handleLocationChosedEvent" initType="REGISTER_PANEL_MAP"/>
      </div>
    </div>
    <div class="form-group">
      <label for="masseur-expertise">Espertise</label>
      <textarea  type="text" v-model="masseur_expertise" class="form-control" name="masseur-expertise" cols="30" rows="4"
        placeholder="Here you can write a short text to describe yourself to your costumers" />
    </div>
    <button class="btn submit-button" type="submit">Register</button>
  </form>
</template>

<script>
import axios from 'axios'
import { hex_sha512 } from "../assets/js/sha512.js"
import MapPanel  from "./map/MapPanel"
import ImageCropper from './ImageCropper'

export default {
  components: {
    MapPanel,
    ImageCropper
  },
  data () {
    return {
      masseur_propic: '',
      masseur_croppedProfileImage: null,
      masseur_email: '',
      masseur_password: '',
      masseur_brandName:'',
      masseur_location_latlgn: null,
      masseur_phoneNumber:'',
      masseur_expertise: '',

      profileImage: null
    }
  },
  methods: {
    register () {
      let userData = {
        brand_name: this.masseur_brandName,
        email: this.masseur_email,
        password: hex_sha512(this.masseur_password),
        phone_number: this.masseur_phoneNumber,
        expertise: this.masseur_expertise,
        coordinates: this.masseur_location_latlgn
      }
      if (this.masseur_croppedProfileImage != null) {
        userData.profile_picture = this.masseur_croppedProfileImage
      }
      if (this.masseur_location_latlgn == null) {
        alert("Insert user location")
        return;
      }
      axios.post('http://localhost:3000/masseurs/register', userData, { withCredentials: true })
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
      this.masseur_croppedProfileImage = croppedImage
    },
    handleLocationChosedEvent(location) {
      this.masseur_location_latlgn = location;
      console.log(this.masseur_location_latlgn)
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

.header-text {
  font-weight: 400;
  margin-bottom: 1rem;
  font-size: 1.75rem;
}

#mapContainer {
  width: 100%;
  height: 300px;
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
