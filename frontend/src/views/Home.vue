<template>
  <div id="app-home">
    <Navbar/>
    <SearchPanel/>
  </div>
</template>

<script>
// @ is an alias to /src
import Navbar from '../components/Navbar'
import SearchPanel from '../components/SearchPanel'

export default {
  name: 'Home_view',
  components: {
    Navbar,
    SearchPanel
  }
}
</script>
