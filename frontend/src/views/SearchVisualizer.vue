<template>
  <MapPanel initType="SEARCH_MAP" :initialCity="city"/>
</template>

<script>
  import MapPanel from '../components/MapPanel'

  export default {
    components: {
      MapPanel
    },
    name: 'SearchVisualizer',
    data() {
      return {
        city: this.$route.params.city
      }
    }
  }
</script>

<style>
html, body {
  height: 100%;
  width: 100%;
}
</style>
