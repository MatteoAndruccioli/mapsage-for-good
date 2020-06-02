<template>
  <div>
    <Navbar/>
    <Login/>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '../components/Navbar'
import Login from '../components/Login'

export default {
  name: 'Login_view',
  components: {
    Navbar,
    Login
  }
}
</script>