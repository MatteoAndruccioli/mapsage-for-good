<template>

  <div>
    <div class="container outer-container">
      <div class="row d-flex align-items-stretch">
        <main class="col-lg-8 col-md-12">

          <section class="masseur-info-upper my-box col-12" >

            <div class="row">

              <section class="left-upper-card card col-lg-5">
                <img class="card-img-top" :src="profile_picture" alt="Avatar">
                <ul class="list-group list-group-flush">

                  <li class="list-group-item d-flex justify-content-between brand-group-small-screen row">
                    <h5 class="text-center my-auto">{{brand_name}}</h5>
                    
                    <div class="d-flex justify-content-between row info-button-container mx-1">
                      <button v-if="isMyProfile" type="button" class="btn info-button" data-toggle="modal" data-target="#modalLoginForm">Edit profile</button>
                      <button v-if="!isMyProfile" @click="openChatWithThisMasseur" type="button" class="btn info-button">Send Message</button>
                      <button v-if="!isMyProfile && !isFollow" @click="followThisMasseur" type="button" class="btn info-button">Follow</button>
                      <button v-if="!isMyProfile && isFollow" @click="unfollowThisMasseur" type="button" class="btn info-button">Unfollow</button>
                    </div>
                  </li>
                  
                
                  <li class="list-group-item brand-group-no-sm-screen">
                    <h5 class="brand-name">{{brand_name}}</h5>
                  </li>
                  <li class="list-group-item brand-group-md-screen">
                    <div v-if="!isMyProfile" class="d-flex justify-content-around row">
                      <button @click="openChatWithThisMasseur" type="button" class="btn info-button send-message-btn">Send Message</button>
                      <button v-if="!isFollow" @click="followThisMasseur" type="button" class="btn info-button follow-button-style">Follow</button>
                      <button v-if="isFollow" @click="unfollowThisMasseur" type="button" class="btn info-button follow-button-style">Unfollow</button>
                    </div>
                    
                    <div v-if="isMyProfile" class="d-flex justify-content-center row">
                      <button type="button" class="btn info-button large-edit-profile" data-toggle="modal" data-target="#modalLoginForm">Edit profile</button>
                    </div>
                  </li>
                </ul>
              </section>


              <!-- MODAL STARTS HERE -->
              <div class="modal fade" id="modalLoginForm" tabindex="-1" role="dialog" aria-labelledby="myModalLabel"
                aria-hidden="true">
                <div class="modal-dialog" role="document">
                  <div class="modal-content">

                    <header class="modal-header">
                      <h4 class="modal-title w-100 font-weight-bold">Update your profile</h4>
                      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                      </button>
                    </header>

                    <main class="modal-body mx-3">
                      <div class="form-group">
                        <label for="masseur-brandName">Brand Name</label>
                        <input type="text" v-model="edit_brand_name" class="form-control" name="masseur-brandName" placeholder="Enter New Brand Name">
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
                    </main>

                    <footer class="modal-footer d-flex justify-content-center">
                      <button class="btn btn-info" v-on:click="editMasseurInfo" data-dismiss="modal">Update</button>
                    </footer>
                  </div>
                </div>
              </div>
              <!-- MODAL ENDS HERE -->


              <section class="card col-lg-5 right-upper-card col">
                <div class="expertise-container">
                  <h5 class="card-title">Why you'll choose me</h5>
                  <p class="card-text" >{{expertise}}</p>
                </div>


                <ul class="list-group list-group-flush bottom-right-masseur-info">
                  <li class="list-group-item"><b>Phone Number:</b> {{phone_number}}</li>
                  <li class="list-group-item"><b>Email:</b> {{email}}</li>
                  
                  <li class="list-group-item brand-group-lg-screen">
                    <div v-if="!isMyProfile" class="d-flex justify-content-around row">
                      <button @click="openChatWithThisMasseur" type="button" class="btn info-button send-message-btn">Send Message</button>
                      <button v-if="!isFollow" @click="followThisMasseur" type="button" class="btn info-button follow-button-style">Follow</button>
                      <button v-if="isFollow" @click="unfollowThisMasseur" type="button" class="btn info-button follow-button-style">Unfollow</button>
                    </div>
                    
                    <div v-if="isMyProfile" class="d-flex justify-content-center row">
                      <button type="button" class="btn info-button large-edit-profile" data-toggle="modal" data-target="#modalLoginForm">Edit profile</button>
                    </div>
                  </li>
                </ul>
              </section>

            </div>
          </section>

          <section id="map-container">
            <MapPanel @locationEvent="editMasseurLocation" initType="PROFILE_MAP" :initialLocation="location" :enableEditLocationButton="isMyProfile"/>
          </section>
        </main>

        <aside class="my-box col-lg-4 col-md-12">
          
          <h5>Last advertisements</h5>
        
          <div :class="{ voidBackgroundColor: this.isAdvertisementListEmpty && !isMyProfile }" class="col-12 aside-main">
            <!--mostri questo in caso non ci siano adv (si potrebbe fare che la frase cambia se l'utente è il masseur) -->
            <div  v-if="this.isAdvertisementListEmpty" class="jumbotron-container">
              <div class="jumbotron custom-jumbotron">
                <p>There is still no advertisement to show :(</p>
              </div>
            </div>

            <!--Questo va mostrato solo se c'è almeno un advertisement-->
            <div v-if="!this.isAdvertisementListEmpty" class="adv-list-container">
              <ul :class="{ list_group_height_masseur: isMyProfile, list_group_height_customer: !isMyProfile }" class="list-group">
                <div v-for="adv in advertisements" :key="adv.title" id="advList">
                  <Advertisement :title="adv.title" :body="adv.body"> </Advertisement>
                </div>
              </ul>
            </div>

            <div v-if="isMyProfile" class="col-12 form-container">
              <form v-on:submit.prevent="addAdvertisement">
                <h5 class="text-center mb-3">Add a new advertisement</h5>
                <div class="form-group">
                  <input type="text" v-model="advertisementTitle" class="form-control" name="advertisementTitle" placeholder="Advertisement Title" required>
                </div>
                <div class="form-group">
                  <textarea  type="text" v-model="advertisementBody" class="form-control" name="advertisementBody" cols="30" rows="4"
                    placeholder="Here you can write a short text for the advertisement" required/>
                </div>
                <button class="btn submit-button" type="submit">Add advertisement</button>
              </form>
            </div>
          </div>

        </aside>
      </div>
    </div>
    <ChatMainButton v-if="isCurrentUserLoggedIn"/>
  </div>

</template>

<script>
import axios from 'axios'
import Advertisement from './Advertisement'
import MapPanel from './map/MapPanel'
import ChatMainButton from './chat/ChatMainButton'
import {EventBus} from './EventBus'
import {socket} from './socket/serverSocket'

export default {
  props: ['masseur_id'],
  components: {
    Advertisement,
    MapPanel,
    ChatMainButton
  },
  data () {
    return {
      isMyProfile: false,
      isCurrentUserLoggedIn: false,

      brand_name:'',
      profile_picture: '',
      email: "",
      location: '',
      phone_number:'',
      expertise: '',
      advertisements: [],
      followers: [],

      advertisementTitle: '',
      advertisementBody: '',
      isAdvertisementListEmpty: true,

      edit_brand_name: '',
      edit_phone_number: '',
      edit_expertise: '',

      isFollow: false
    }
  },
  methods: {
    //retrieves info from server about the actual masseur
    initProfile: function() {
      var vm = this;
      var call;
      // QUESTO IF VA SOSTITUITO CON UN UNICA CHIAMATA A http://localhost:3000/masseurs/
      // NON APPENA SARA' DISPONIBILE IL CLIENT COOKIE CHE MEMEORIZZA L'ID DEL MASSEUR LOGGATO
      if (this.isMyProfile) {
        call = axios.get('http://localhost:3000/masseurs/profile', { withCredentials: true })
      } else {
        call = axios.get('http://localhost:3000/masseurs/' + this.masseur_id)
      }
      call.then(res => {
        console.log(res.data)
        if (!res.data.error) {
          vm.brand_name = res.data.brand_name
          vm.profile_picture = res.data.profile_picture
          vm.email = res.data.email
          vm.location = res.data.location
          vm.phone_number = res.data.phone_number
          vm.expertise = res.data.expertise
          vm.advertisements = res.data.advertisements.reverse()
          vm.followers = res.data.followers

          vm.isAdvertisementListEmpty = res.data.advertisements.length == 0

          if (vm.isCurrentUserLoggedIn && !vm.isMyProfile
              && vm.followers.map(f => f.follower_id).includes(this.$cookies.get('currentUser').user_id)) {
            vm.isFollow = true
          }
          //aggiungere campi in base a necessità !!!
        } else {
          console.log(res.data.error)
        }
      }).catch(err => {
        console.log(err)
      })
    },

    editMasseurInfo: function() {
      if (this.isMyProfile) {
        var vm = this;
        axios.post('http://localhost:3000/masseurs/edit', {
          edit_brand_name: vm.edit_brand_name,
          edit_phone_number: vm.edit_phone_number,
          edit_expertise: vm.edit_expertise
        }, { withCredentials: true }).then(res => {
          if (!res.data.error) {
            vm.edit_brand_name = ''
            vm.edit_phone_number = ''
            vm.edit_expertise = ''

            vm.brand_name = res.data.updatedUser.brand_name
            vm.phone_number = res.data.updatedUser.phone_number
            vm.expertise = res.data.updatedUser.expertise
          } else {
            alert("Login failed!! try again");
            console.log(res.data.error)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },

    addAdvertisement: function() {
      if (this.isMyProfile) {
        socket.emit("advertisement", {
          advertisement_title: this.advertisementTitle,
          advertisement_body: this.advertisementBody,
          masseur_id: this.masseur_id
        })
      }
      this.advertisementTitle = ''
      this.advertisementBody = ''
      // The visualization of the advertisement just sent will be performed when the server
      // will propagate back that advertisement using Socket.IO
    },

    editMasseurLocation: function(location) {
      if (this.isMyProfile) {
        const vm = this;
        axios.put('http://localhost:3000/masseurs/editLocation', {
          new_coordinates: location
        }, { withCredentials: true }).then(res => {
          if (!res.data.error) {
            vm.location = location
          } else {
            console.log(res.data.error)
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },

    openChatWithThisMasseur: function() {
      if (!this.isCurrentUserLoggedIn) {
        this.$router.push({ name: 'Login_view',
          params: { source: 'from_masseurProfile_view', masseur_id: this.masseur_id } })
        return
      }

      if (!this.isMyProfile) {
        axios.put('http://localhost:3000/chat/chatInfo', { receiver: this.masseur_id }, { withCredentials: true })
          .then(res => {
            if (!res.data.error) {
              EventBus.$emit('sendMsgClickMasseurProfile', res.data)
            } else {
              alert(res.data.error)
              console.log(res.data.error)
            }
          }).catch(err => {
            alert(err)
            console.log(err)
          })
      }
    },

    followThisMasseur: function() {
      axios.put('http://localhost:3000/follow/add', { masseur_id: this.masseur_id }, { withCredentials: true })
        .then(res => {
          if (!res.data.error) {
            this.isFollow = true
          } else {
            alert(res.data.error)
            console.log(res.data.error)
          }
        }).catch(err => {
          alert(err)
          console.log(err)
        })
    },

    unfollowThisMasseur: function() {
      axios.put('http://localhost:3000/follow/remove', { masseur_id: this.masseur_id }, { withCredentials: true })
        .then(res => {
          if (!res.data.error) {
            this.isFollow = false
          } else {
            alert(res.data.error)
            console.log(res.data.error)
          }
        }).catch(err => {
          alert(err)
          console.log(err)
        })
    },

    handleMessageReceived: function(msg) {
      if (msg.error) {
        alert("Error receiving message: " + msg.error)
        return;
      }
      this.advertisements.unshift(msg)
    }
  },

  mounted() {
    if (this.$cookies.get('currentUser') != null && this.$cookies.get('currentUser').logged_in) {
      this.isCurrentUserLoggedIn = true;
      if (this.masseur_id == this.$cookies.get('currentUser').user_id) {
        this.isMyProfile = true
      }
    }
    this.initProfile();
    socket.on('new_advertisement', this.handleMessageReceived)
  }
}
</script>

<style scoped>

header {
  text-align: center;
}

.bottom-right-masseur-info {
  margin-bottom: .5rem;
  overflow: auto;
}

.expertise-container {
  margin-top: 1rem;
}

.expertise-container > h5 {
  text-align: center;
}

.expertise-container > p {
  margin-top: 1rem;
}

.right-upper-card {
  margin-left: auto;
  margin-right: auto;
  margin-top: .25rem;
  justify-content: space-between;
  display: flex;
}

.large-edit-profile {
  margin-left: auto;
  margin-right: auto;
  width: 100%;
}

.send-message-btn {
  width: 108px;
}

.follow-button-style {
  width: 70px;
}

.brand-name {
  text-align: center
}

.info-button-container {
  margin-left: .25rem;
}

.info-button:hover {
  color: #fff;
  background-color: #138496;
  border-color: #117a8b;
}

.info-button {
  max-height: 35px;
  margin-left: .25rem;
  margin-right: .25rem;
  display: block;

  padding: .25rem .5rem;
  font-size: .875rem;
  line-height: 1.5;
  border-radius: .2rem;

  color: #fff;
  background-color: #17a2b8;
  border-color: #17a2b8;
}

.left-upper-card > ul {
  margin-top: 1rem;
  overflow: auto;
}

.left-upper-card > img {
  margin-left: auto;
  margin-right: auto;
  margin-top: .5rem;
}

.left-upper-card {
  margin-left: auto;
  margin-right: auto;
  margin-top: .25rem;
}

.masseur-info-upper {
  background-color: #f0f0f0 !important;
  margin-left: auto;
  margin-right: auto;
}

.adv-list-container ul {
  height: 100%;
  align-self: stretch;
}

.adv-list-container {
  height: 100%;
  align-self: stretch;
}

.form-container {
  display: table;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
  align-self: flex-end;
}

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

.jumbotron p {
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  font-size: 1.25rem;
  font-weight: 300;
}

.custom-jumbotron {
  padding-right: 0;
  padding-left: 0;
  border-radius: 0;
  align-self: stretch;
}

.jumbotron-container {
  height: 100%;
  align-self: stretch;
}

.aside-main {
  height: 90%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
  justify-content: space-between;
  display: flex;
  flex-direction: column;
}

.outer-container {
  padding-bottom: 80px
}

aside > h5 {
  text-align: center;
  margin-left: auto;
  margin-right: auto;
  margin-top: 0.5rem;

  background-color: #fff;
  margin-left: 15px;
  margin-right: 15px;
  border-radius: 3px;
  border: 1px solid #ccc;
  padding: 2px;
}

main {
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;
}

aside {
  margin-left: auto;
  margin-right: auto;
  margin-top: 1rem;

  background-color: #f0f0f0 !important;
  margin-bottom: 0px!important;
}

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

.list-group {
  margin-bottom: 10px;
  overflow-y:scroll;
  -webkit-overflow-scrolling: touch;
}

.list_group_height_masseur {
  max-height: 250px;
}

.list_group_height_customer {
  max-height: 550px;
}


#map-container {
  width: 100%;
  height: 300px;
}

.voidBackgroundColor {
  background-color: #e9ecef;
  border: #fff 3px solid;
}

::-webkit-scrollbar {
    width: 0px;
}


@media screen and (min-width: 992px) {
  .brand-group-small-screen {
    display: none !important;
  }
}



@media screen and (min-width: 1200px) {
  .brand-group-md-screen {
    display: none;
  }

  .brand-group-lg-screen {
    display: block;
  }

  .brand-group-no-sm-screen{
    display: block;
  }
}

@media screen and (max-width: 1200px) {
  .brand-group-md-screen {
    display: block;
  }

  .brand-group-lg-screen {
    display: none;
  }

  .brand-group-no-sm-screen{
    display: block;
  }
}


@media screen and (max-width: 992px) {
  .brand-group-md-screen {
    display: none;
  }

  .brand-group-lg-screen {
    display: none;
  }

  .brand-group-no-sm-screen{
    display: none;
  }
}


@media screen and (max-width: 420px) {
  .brand-group-small-screen {
    display: none !important;
  }

  .brand-group-no-sm-screen{
    display: block;
  }

  .brand-group-md-screen {
    display: block;
  }
}

</style>
