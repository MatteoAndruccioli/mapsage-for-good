<template>
  <div class="container text-muted">
    <div class="row justify-content-center">
      <form class="text-center col-4">
        <div class="form-group">
          <label for="searchCity" class="hidden">Città</label>
          <input @keyup="getSuggestions" v-model="city" type="search" id="searchCity" class="form-control" placeholder="Città" autocomplete="off" autofocus required>
          <label for="searchCity" id="error" v-if="isSubmittedWithoutCity">Compila questo campo</label>
        </div>
        <button @click.prevent="onSubmit" type="submit" class="btn ml-auto text-white bg-secondary">Cerca</button> <!-- Intentionally "prevent" omitted -->
      </form>
    </div>
  </div>
</template>

<script>
  import * as geocoding from 'esri-leaflet-geocoder';

  export default {
    name: 'Home',
    data() {
      return {
        city: "",
        suggestions: [],
        isSubmittedWithoutCity: false
      }
    },
    methods: {
      onSubmit: function() {
        if (this.city != "") {
          this.$router.push("/search/" + this.city);
        } else {
          this.isSubmittedWithoutCity = true;
        }
      },
      getSuggestions: function() {
        if (this.city != "") {
          const vm = this;
          geocoding.suggest()
          .text(this.city)
          .run(function(error, response) {
            vm.suggestions = response.suggestions.map(elem => elem.text);
            //console.log(vm.suggestions);
          });
        }
      },
    },
  }
</script>

<style lang="scss">
form {
  .hidden {
    visibility: hidden;
  }
  #error {
    color: red;
  }
}
</style>
