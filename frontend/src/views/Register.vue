<template>
  <div>
    <Navbar/>
    <RegisterPanel/>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '../components/Navbar'
import RegisterPanel from '../components/RegisterPanel'

export default {
  name: 'Register_view',
  components: {
    Navbar,
    RegisterPanel
  }
}
</script>
