<template>
  <div>
    <Navbar/>
    <MasseurProfilePanel/>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '../components/Navbar'
import MasseurProfilePanel from '../components/MasseurProfilePanel'
export default {
  name: 'MasseurProfile_view',
  components: {
    Navbar,
    MasseurProfilePanel
  }
}
</script>