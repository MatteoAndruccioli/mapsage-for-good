<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6 mt-5 mx-auto">
        <form v-on:submit.prevent="register">
          <h1 class="h3 mb-3 font-weight-normal">Register</h1>
          <div class="form-group my_centered">
                <img style="" :src="propic" alt="" name="propic" class="propic">
                <input @change="handleImage" class="my_custom-input" type="file" accept="image/*" name="propic_input">
          </div>
          <div class="form-group">
            <label for="first_name">First Name</label>
            <input type="text" v-model="first_name" class="form-control" name="first_name" placeholder="Enter Fist Name">
          </div>
          <div class="form-group">
            <label for="last_name">Last Name</label>
            <input type="text" v-model="last_name" class="form-control" name="last_name" placeholder="Enter Last Name">
          </div>
          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" v-model="email" class="form-control" name="email" placeholder="Enter Email">
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" v-model="password" class="form-control" name="password" placeholder="Enter Password">
          </div>
          <button class="btn btn-lg btn-primary btn-block" type="submit">Register</button>
        </form>
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
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      propic: '',
    }
  },

  methods: {
    register () {
      axios.post('http://localhost:3000/customers/register', {
        first_name: this.first_name,
        last_name: this.last_name,
        email: this.email,
        password: hex_sha512(this.password),
        profile_picture: this.propic
      }, { withCredentials: true }).then(res => {
        console.log(res)
        if (!res.data.error) {
          this.$cookies.set('logged-in', true);
          this.$router.push({ name: 'Home_view' })
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * metodo invocato quando si triggera l'evento '@change' in input, ovvero quando
     * viene aggiunta una immagine:
     * - prende la prima immagine (e.target recupera l'oggetto input e
     *      files è l'array in cui sono memorizzate le immagini)
     * - invoca sull'immagine createBase64Image
     */
    handleImage(e) {
      const selectedImage = e.target.files[0]
      this.createBase64Image(selectedImage)
    },

    /**
     * invoca metodo readAsBinaryString sul blob costituito dal fileObject passato
     *    (in questo caso l'immagine caricata)
     *
     * - quando l'operazione read è terminata:
     *    - 'readyState' diventa 'DONE'
     *    - viene triggerato l'evento 'loadend'
     *    - l'attributo 'result' contiene la versione raw binary data del file
     *
     * - ritorna quindi un oggetto con una proprietà 'result'
     *    contentente in 'data' un URL che rappresenta i dati del file
     */
    createBase64Image(fileObject) {
      const reader = new FileReader();

      reader.onload = (e) => {
        this.propic = e.target.result;
        //console.log(reader.result);
        //this.uploadImage()
        //console.log("this.uploadImage() chiamato")
      };

      reader.readAsDataURL(fileObject)
    },

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
