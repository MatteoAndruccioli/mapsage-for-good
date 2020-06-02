<template>
  <div>
    <Navbar/>
    <Register/>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '../components/Navbar'
import Register from '../components/Register'

export default {
  name: 'Register_view',
  components: {
    Navbar,
    Register
  }
}
</script>