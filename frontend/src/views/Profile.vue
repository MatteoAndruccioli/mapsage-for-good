<template>
  <div>
    <Navbar/>
    <Profile/>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '../components/Navbar'
import Profile from '../components/Profile'

export default {
  name: 'Profile_view',
  components: {
    Navbar,
    Profile
  }
}
</script>