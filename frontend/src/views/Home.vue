<template>
  <div>
    <Navbar/>
    <Home/>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '../components/Navbar'
import Home from '../components/Home'

export default {
  name: 'Home_view',
  components: {
    Navbar,
    Home
  }
}
</script>