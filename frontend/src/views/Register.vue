<template>
  <div>
    <Navbar/>
    <RegisterPanel class="my-visibility"/>
    <Footer/>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '../components/Navbar'
import Footer from '../components/chat/Footer'
import RegisterPanel from '../components/RegisterPanel'

export default {
  name: 'Register_view',
  components: {
    Navbar,
    RegisterPanel,
    Footer
  }
}
</script>


<style scoped>
.my-visibility{
  margin-bottom: 90px; 
}
</style>