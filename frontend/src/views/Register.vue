<template>
  <div>
    <Navbar/>
    <RegisterPanel class="my-visibility"/>
  </div>
</template>

<script>
import Navbar from '../components/Navbar'
import RegisterPanel from '../components/registration/RegisterPanel'

export default {
  name: 'Register_view',
  components: {
    Navbar,
    RegisterPanel
  }
}
</script>


<style scoped>
.my-visibility{
  margin-bottom: 90px;
}
</style>
