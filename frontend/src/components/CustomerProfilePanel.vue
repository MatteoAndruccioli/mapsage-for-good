<template>
    <div class="container">
        <div class="mt-3 my-box col-12 col-sm-8 col-md-6 col-lg-5 mx-auto">
            <div class="col-md-10 col-lg-8 mx-auto ">
                <img class="propic responsive" :src="profile_picture" alt="">
            </div>
            <table class="table col-md-10 mt-5 mx-auto text-center">
                <tbody>
                    <tr>
                        <th>First Name</th>
                        <td>{{first_name}}</td>
                    </tr>
                    <tr>
                        <th>Last Name</th>
                        <td>{{last_name}}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>{{email}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      first_name: '',
      last_name: '',
      email: '',
      profile_picture: ''
    }
  },
  methods: {
    init: function() {
      var vm = this;
      axios.get('http://localhost:3000/customers/profile', { withCredentials: true })
        .then(res => {
          if (!res.data.error) {
            //console.log(res.data)
            vm.first_name = res.data.first_name
            vm.last_name = res.data.last_name
            vm.email = res.data.email
            vm.profile_picture = res.data.profile_picture
          } else {
            console.log(res.data.error)
          }
        }).catch(err => {
          console.log(err)
        })
    }
  },
  mounted() {
    this.init();
  }
}
</script>

<style scoped>
.propic {
    width: 17rem;
    border-radius: 5px;
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

</style>
