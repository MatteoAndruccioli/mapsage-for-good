<template>
  <div class="container">

    <div class="row">
      <div class="mx-auto mt-3 col-lg-8 col-md-12">
        <div class="mx-auto mt-1 my-box col-12">

          <div class="row col-12 mx-auto">
            <div class="col-lg-3 col-md-12 col-12 mx-auto mt-1 d-flex justify-content-center">
              <img class="propic mx-auto" :src="profile_picture" alt="Avatar">
            </div>
            <div class="col-lg-8 col-md-12 mx-auto mt-4">
              <h6 class="card-title text-center">Why you'll choose me</h6>
              <p class="card-text" >{{expertise}}</p>
            </div>
          </div>

          <div class="row col-12 mx-auto pt-3">
            <div class="mx-3 col-md-4 justify-content-sm-center justify-content-md-start">
               <h3 class="text-center">{{brand_name}}</h3>
            </div>
            <div class="col-md-7 d-flex flex-row justify-content-center justify-content-sm-center justify-content-md-end">
              <button v-if="isMasseur" type="button" class="btn btn-info btn-sm my-btn mx-1" data-toggle="modal" data-target="#modalLoginForm" >edit profile</button>
              <button v-if="isCustomer" type="button" class="btn btn-info btn-sm my-btn mx-1" >Send Message</button>
              <button v-if="isCustomer" type="button" class="btn btn-info btn-sm my-btn mx-1" >Follow</button>
            </div>

            <!-- INIZIA QUI -->
            <div class="modal fade" id="modalLoginForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
              aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">

                  <div class="modal-header text-center">
                    <h4 class="modal-title w-100 font-weight-bold">Update your profile</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>

                  <div class="modal-body mx-3">
                    <div class="form-group">
                      <label for="masseur-brandName">Brand Name</label>
                      <input type="text" v-model="edit_brand_name" class="form-control" name="masseur-brandName" placeholder="Enter New Brand Name">
                    </div>
                    <div class="form-group">
                      <label for="masseur-mailingAddress">Mailing Address</label>
                      <input type="text" v-model="edit_mailing_address" class="form-control" name="masseur-mailingAddress" placeholder="Enter Mailing Address" >
                    </div>
                    <div class="form-group">
                      <label for="masseur_phoneNumber">Phone Number</label>
                      <input type="tel" v-model="edit_phone_number" id="masseur_phoneNumber" class="form-control" name="masseur_phoneNumber" placeholder="Enter Phone Number" pattern="[0-9]{10}" >
                    </div>
                    <div class="form-group">
                      <label for="masseur-expertise">Espertise</label>
                      <textarea  type="text" v-model="edit_expertise" class="form-control" name="masseur-expertise" cols="30" rows="4"
                        placeholder="Here you can write a short text to describe yourself to your costumers" />
                    </div>
                  </div>

                  <div class="modal-footer d-flex justify-content-center">
                    <button class="btn btn-info" v-on:click="printa" data-dismiss="modal">Update</button>
                  </div>
                </div>
              </div>
            </div>
            <!-- FINISCE QUI -->

          </div>

          <div class="col-11 mx-auto pt-3">
            <div><b>Phone Number:</b> {{phone_number}}</div>
            <div><b>Email:</b> {{email}}</div>
            <div><b>Mailing Address:</b> {{mailing_address}}</div>
          </div>
        </div>

        <div class="mx-auto mt-3 my-box col-12">
          <h5 class="text-center">Locate this masseur</h5>
          <p class="col-12 mx-auto">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero deserunt et aspernatur esse id impedit exercitationem delectus optio ad nihil iste, est sunt eos quas quidem nobis, nemo, molestias possimus.
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero deserunt et aspernatur esse id impedit exercitationem delectus optio ad nihil iste, est sunt eos quas quidem nobis, nemo, molestias possimus.
          </p>
        </div>
      </div>

      <div class="mx-auto mt-3 my-box col-lg-4 col-md-12">
        <div class="col-12 mx-auto mt-2">
          <h5 class="text-center">Last advertisement</h5>
        </div>

        <div class="col-12 mx-auto mt-3 d-flex flex-column justify-content-between" style="height: 90%">
          <!--mostri questo in caso non ci siano adv (si potrebbe fare che la frase cambia se l'utente è il masseur) -->
          <div  v-if="this.isAdvertisementListEmpty" class="align-self-stretch" style="height: 100%;">
            <div class="jumbotron jumbotron-fluid align-self-stretch">
              <div class="container">
                <p class="lead">There is still no advertisement to show :(</p>
              </div>
            </div>
          </div>

          <!--Questo va mostrato solo se c'è almeno un advertisement-->
          <div v-if="!this.isAdvertisementListEmpty" class="panel-body" >
            <ul class="list-group" >
              <div v-for="adv in advertisements" :key="adv._id" id="advList">
                <Advertisement :title=adv.title :body=adv.body> </Advertisement>
              </div>
            </ul>
          </div>

          <div v-if="isMasseur" class="col-12 mx-auto mt-3 align-self-end" style="display: table">
            <form v-on:submit.prevent="addAdvertisement">
              <h5 class="text-center">Add a new advertisement</h5>
              <div class="form-group">
                <input type="text" v-model="advertisementTitle" class="form-control" name="advertisementTitle" placeholder="Advertisement Title" required>
              </div>
              <div class="form-group">
                <textarea  type="text" v-model="advertisementBody" class="form-control" name="advertisementBody" cols="30" rows="4" 
                  placeholder="Here you can write a short text for the advertisement" required/>
              </div>
              <button class="btn btn-lg btn-primary btn-block" type="submit">Add advertisement</button>
            </form>
          </div>
        </div>

        <!--questo va mostrato quando c'è almeno un advertisement-->
        <div class="col-12 mx-auto mt-2" style="display:none">
          <p>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ullam facilis a, cumque aliquam provident laborum. Quidem quia magnam itaque, omnis sunt harum rem delectus consectetur voluptates saepe, provident officia ad.
          </p>
        </div>


      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import Advertisement from './Advertisement'

export default {
  data () {
    //const loggedUser = this.$cookies.get('current-user')
    return {
      isUserLoggedIn: false,
      isCustomer: false,
      isMasseur:false,

      brand_name:'',
      profile_picture: '', 
      email: "",
      mailing_address: '',
      phone_number:'',
      expertise: '',
      advertisements: [],
      advertisementTitle: '',
      advertisementBody: '',
      isAdvertisementListEmpty: true,

      edit_brand_name: '',
      edit_mailing_address: '',
      edit_phone_number: '',
      edit_expertise: '',

    }
  },
  methods: {
    printa: function() {
      var vm = this;

      axios.post('http://localhost:3000/masseurs/edit', {
        edit_brand_name: vm.edit_brand_name,
        edit_mailing_address: vm.edit_mailing_address,
        edit_phone_number: vm.edit_phone_number,
        edit_expertise: vm.edit_expertise
      }, { withCredentials: true }).then(res => {
        if (!res.data.error) {
          vm.edit_brand_name = ''
          vm.edit_mailing_address = ''
          vm.edit_phone_number = ''
          vm.edit_expertise = ''

          console.log(res.data.updatedUser)

          vm.brand_name = res.data.updatedUser.brand_name
          vm.mailing_address = res.data.updatedUser.mailing_address
          vm.phone_number = res.data.updatedUser.phone_number
          vm.expertise = res.data.updatedUser.expertise
        } else {
          alert("Login failed!! try again");
          console.log(res.data.error)
        }
      }).catch(err => {
        console.log(err)
      })
    },

    addAdvertisement: function() {
      axios.post('http://localhost:3000/masseurs/adverisement', {
        advertisementTitle: this.advertisementTitle,
        advertisementBody: this.advertisementBody
      }, { withCredentials: true }).then(res => {
        if (!res.data.error) {
          this.advertisementTitle = ''
          this.advertisementBody = ''
          console.log(res.data.advertisements)
          this.advertisements = res.data.advertisements
          this.isAdvertisementListEmpty = res.data.advertisements.length == 0
        } else {
          alert("Login failed!! try again");
          console.log(res.data.error)
        }
      }).catch(err => {
        console.log(err)
      })
    },

    //retrieves info from server about current user,
    //used when masseur is on his own profile 
    initWithCurrentUserInfo: function() {
      var vm = this;
      axios.get('http://localhost:3000/masseurs/profile', { withCredentials: true })
        .then(res => {
          if (!res.data.error) {
            console.log(res.data)
            vm.brand_name = res.data.brand_name
            vm.profile_picture = res.data.profile_picture
            vm.email = res.data.email
            vm.mailing_address = res.data.mailing_address
            vm.phone_number = res.data.phone_number
            vm.expertise = res.data.expertise
            vm.advertisements = res.data.advertisements

            vm.isAdvertisementListEmpty = res.data.advertisements.length == 0
            console.log(vm.isAdvertisementListEmpty)
            //aggiungere campi in base a necessità !!!
          } else {
            console.log(res.data.error)
          }
        }).catch(err => {
          console.log(err)
        })
    }

  },
  
  mounted() {
    if (this.$cookies.get('currentUser')) {
      this.isUserLoggedIn = this.$cookies.get('currentUser').logged_in
      if (this.$cookies.get('currentUser').profile_type == "Customer"){
        this.isCustomer = true
        this.isMasseur = false
      }else{
        this.isCustomer = false
        this.isMasseur = true 
        
        //non fare questa chiamata quando stai visitando la pagina di un masseur
        //essendo loggato con il profilo di un utente
        this.initWithCurrentUserInfo();
      }
    }
  },
  components: {
    Advertisement
  }
}
</script>

<style scoped>
.propic {
    width: 10rem;
    height: 10rem;
    border-radius: 50%;
    border: 1px solid #eee;
}

.responsive {
  width: 100%;
  height: auto;
}

.my-box {
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 10px 0;
  background-color: #fff;
  margin-bottom: 5px;
}

th {
    font-weight: 600 !important;
}

.my-btn{
  max-height: 35px;
}

b {
  font-weight: 500;
}

.list-group{
    max-height: 400px;
    margin-bottom: 10px;
    overflow-y:scroll;
    -webkit-overflow-scrolling: touch;
}

</style>