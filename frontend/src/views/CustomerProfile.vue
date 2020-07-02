<template>
  <div>
    <Navbar/>
    <CustomerProfilePanel/>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '../components/Navbar'
import CustomerProfilePanel from '../components/profile/CustomerProfilePanel'

export default {
  name: 'CustomerProfile_view',
  components: {
    Navbar,
    CustomerProfilePanel
  }
}
</script>
