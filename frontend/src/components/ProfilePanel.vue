<template>
    <div class="container">
        <div class="jumbotron mt-5">
            <div class="col-sm-8 mx-auto myCentering">
                <h1 class="text-center">PROFILE</h1>
                <img class="propic" :src="propic" alt="">
            </div>
            <table class="table col-md-6 mx-auto">
                <tbody>
                    <tr>
                        <td>First Name</td>
                        <td>{{first_name}}</td>
                    </tr>
                    <tr>
                        <td>Last Name</td>
                        <td>{{last_name}}</td>
                    </tr>
                    <tr>
                        <td>Email</td>
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
}

.myCentering {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>