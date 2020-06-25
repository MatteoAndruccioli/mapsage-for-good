<template>
  <div class="container text-muted">
    <div class="row justify-content-center">
      <form class="text-center col-4">
        <div class="form-group">
          <label for="searchCity" class="hidden">City</label>
          <autocomplete @submit="handleAutocSelection" :search="getSuggestions" placeholder="Search for a municipality" aria-label="Search for a municipality"></autocomplete>
          <label for="searchCity" id="error" v-if="isSubmittedWithoutCity">Fill this field</label>
        </div>
        <button @click.prevent="onSubmit" type="submit" class="btn ml-auto btn-primary">Search</button> <!-- Intentionally "prevent" omitted -->
      </form>
    </div>
  </div>
</template>

<script>
  import * as geocoding from 'esri-leaflet-geocoder'
  import Autocomplete from '@trevoreyre/autocomplete-vue'
  import '@trevoreyre/autocomplete-vue/dist/style.css'

  export default {
    name: 'Home',
    components: {
      Autocomplete
    },
    data() {
      return {
        city: "",
        isSubmittedWithoutCity: false
      }
    },
    methods: {
      onSubmit: function() {
        console.log("prima del submit: " + this.city)
        if (this.city != "") {
          this.$router.push("/search/" + this.city);
        } else {
          this.isSubmittedWithoutCity = true;
        }
      },
      handleAutocSelection: function(result) {
        if (result != null) {
          console.log(result)
          this.city = result
        }
      },
      getSuggestions: function(input) {
        console.log(input)
        this.city = input
        return new Promise(resolve => {
          if (input.length < 1) { return resolve([]) }
          geocoding.suggest()
            .text(input)
            .run(function(error, response) {
              resolve(response.suggestions.map(elem => elem.text))
            });
        })
      }
    },
  }
</script>

<style lang="scss" scoped>
form {
  .hidden {
    visibility: hidden;
  }
  #error {
    color: red;
  }
}
</style>
