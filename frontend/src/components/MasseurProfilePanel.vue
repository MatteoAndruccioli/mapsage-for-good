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
              <p class="card-text">{{expertise}}</p>
            </div>
          </div>

          <div class="row col-12 mx-auto pt-3">
            <div class="mx-3 col-md-4 justify-content-sm-center justify-content-md-start">
               <h3 class="text-center">{{brand_name}}</h3>
            </div>
            <div class="col-md-7 d-flex flex-row justify-content-center justify-content-sm-center justify-content-md-end">
              <button v-if="isMasseur" type="button" class="btn btn-info btn-sm my-btn mx-1" >edit profile</button>
              <button v-if="isCustomer" type="button" class="btn btn-info btn-sm my-btn mx-1" >Send Message</button>
              <button v-if="isCustomer" type="button" class="btn btn-info btn-sm my-btn mx-1" >Follow</button>
            </div>
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
      isAdvertisementListEmpty: true
    }
  },
  methods: {
    addAdvertisement () {
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