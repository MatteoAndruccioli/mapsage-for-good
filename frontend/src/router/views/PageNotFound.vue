<template>
  <div id="page-not-found">
    <Navbar/>
    <PageNotFoundImage/>
  </div>
</template>

<script>
import Navbar from '../components/Navbar'
import PageNotFoundImage from "../components/404/PageNotFoundImage.vue"

export default {
  components: {
    Navbar,
    PageNotFoundImage
  },
  name: 'PageNotFound_view'
}
</script>
