<template>
    <div class="container">
        <div class="mt-3 my-box col-sm-5 col-md-5 mx-auto">
            <div class="col-md-8 col-sm-8 mx-auto ">
                <img class="propic responsive" :src="propic" alt="">
            </div>
            <table class="table col-md-8 col-sm-10 mt-5 mx-auto text-center">
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
export default {
  data () {
    const loggedUser = this.$cookies.get('current-user')
    return {
      first_name: loggedUser.first_name,
      last_name: loggedUser.last_name,
      email: loggedUser.email,
      propic: 'http://localhost:3000/'+ loggedUser.folder +'/'+ loggedUser.imgName
    }
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