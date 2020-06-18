<template>
  <div class="container">

    <div class="row">
      <div class="mx-auto mt-3 col-lg-8 col-md-12">
        <div class="mx-auto mt-1 my-box col-12">

          <div class="row col-12 mx-auto">
            <div class="col-lg-3 col-md-12 col-12 mx-auto mt-1 d-flex justify-content-center">
              <img class="propic mx-auto" :src="propic" alt="Avatar">
            </div>
            <div class="col-lg-8 col-md-12 mx-auto mt-4">
              <h6 class="card-title text-center">Why you'll choose me</h6>
              <p class="card-text">{{expertise}}</p>
            </div>
          </div>

          <div class="row col-12 mx-auto pt-3">
            <div class="mx-3 col-md-4 justify-content-sm-center justify-content-md-start">
               <h3 class="text-center">{{brandName}}</h3>
            </div>
            <div class="col-md-7 d-flex flex-row justify-content-center justify-content-sm-center justify-content-md-end">
              <button type="button" class="btn btn-info btn-sm my-btn mx-1" >edit profile</button>
              <button type="button" class="btn btn-info btn-sm my-btn mx-1" style="display:none">Send Message</button>
              <button type="button" class="btn btn-info btn-sm my-btn mx-1" style="display:none">Follow</button>
            </div>
          </div>

          <div class="col-11 mx-auto pt-3">
            <div><b>Phone Number:</b> {{phoneNumber}}</div>
            <div><b>Email:</b> {{email}}</div>
            <div><b>Mailing Address:</b> {{mailingAddress}}</div>
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
          <div class="align-self-stretch" style="height: 100%;">
            <div class="jumbotron jumbotron-fluid align-self-stretch">
              <div class="container">
                <p class="lead">There is still no advertisement to show :(</p>
              </div>
            </div>
          </div>

          <!--Questo va mostrato solo se c'è almeno un advertisement-->
          <div class="panel-body" style=" display:none">
            <ul class="list-group">
              <li class="list-group-item">
                <div class="card bg-light mb-3 ">
                  <div class="card-header">Header</div>
                  <div class="card-body">
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  </div>
                </div>
              </li>
              <li class="list-group-item">
                <div class="card bg-light mb-3 ">
                  <div class="card-header">Header</div>
                  <div class="card-body">
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  </div>
                </div>
              </li>
              <li class="list-group-item">
                <div class="card bg-light mb-3 ">
                  <div class="card-header">Header</div>
                  <div class="card-body">
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  </div>
                </div>
              </li>
              <li class="list-group-item">
                <div class="card bg-light mb-3 ">
                  <div class="card-header">Header</div>
                  <div class="card-body">
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  </div>
                </div>
              </li>
              <li class="list-group-item">
                <div class="card bg-light mb-3 ">
                  <div class="card-header">Header</div>
                  <div class="card-body">
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  </div>
                </div>
              </li>
              <li class="list-group-item">
                <div class="card bg-light mb-3 ">
                  <div class="card-header">Header</div>
                  <div class="card-body">
                    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                  </div>
                </div>
              </li>
            </ul>
          </div>



          <div class="col-12 mx-auto mt-3 align-self-end" style="display: table">
            <form v-on:submit.prevent="addAdvertisement">
              <h5 class="text-center">Signing up as Masseur</h5>
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
export default {
  data () {
    //const loggedUser = this.$cookies.get('current-user')
    return {
      brandName:'Tocco felice',
      propic: 'http://localhost:3000/static/uploads/defaultImg.png', 
      email: "toccofelice@gmail.com",
      mailingAddress: 'via gianguaca 22, San Trolle, PN',
      phoneNumber:'5548796231',
      expertise: 'Tutte cose che so fare, Tutte cose che so fare, Tutte cose che so fare Tutte cose che so fare,  Tutte cose che so fare,  Tutte cose che so fare .',
      
      advertisement: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
      , "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."],
      advertisementTitle: '',
      advertisementBody: ''
    }
  },
  methods: {
    addAdvertisement () {
      console.log(
        "nuovo advertisement: ",
        "titolo = " + this.advertisementTitle,
        "corpo = " + this.advertisementBody
      )
      
      alert("nuovo advertisement: " +
        " titolo = " + this.advertisementTitle +
        " corpo = " + this.advertisementBody)
      
      this.advertisementTitle = ''
      this.advertisementBody = ''
    },

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