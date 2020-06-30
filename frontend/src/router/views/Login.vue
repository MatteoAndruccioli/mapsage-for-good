<template>
  <div>
    <Navbar/>
    <LoginPanel/>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '../components/Navbar'
import LoginPanel from '../components/LoginPanel'

export default {
  name: 'Login_view',
  components: {
    Navbar,
    LoginPanel
  }
}
</script>
