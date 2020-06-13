<template>
  <div>
    <Navbar/>
    <ProfilePanel/>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '../components/Navbar'
import ProfilePanel from '../components/ProfilePanel'

export default {
  name: 'Profile_view',
  components: {
    Navbar,
    ProfilePanel
  }
}
</script>
