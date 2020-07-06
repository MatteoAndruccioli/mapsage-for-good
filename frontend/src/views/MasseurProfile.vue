<template>
  <div>
    <Navbar/>
    <MasseurProfilePanel :masseur_id="masseur_id"/>
  </div>
</template>

<script>
import Navbar from '../components/Navbar'
import MasseurProfilePanel from '../components/profile/MasseurProfilePanel'
export default {
  name: 'MasseurProfile_view',
  components: {
    Navbar,
    MasseurProfilePanel
  },
  data() {
    return {
      masseur_id: this.$route.params.id
    }
  }
}
</script>
