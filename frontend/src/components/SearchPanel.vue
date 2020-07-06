<template>
  <div class="container text-muted flex-column">
    <div class="row justify-content-center">
      <img src="../assets/images/logo_transparent.png" alt="Brand logo"/>
      <form class="text-center col-4">
        <div class="form-group">
          <label for="searchCity" class="hidden">City</label>
          <div id="searchField">
            <div id="autocomplete" class="autocomplete">
              <input id="autocomplete-input" class="autocomplete-input" :placeholder="autocompletePlaceholder" aria-label="Search for a country"/>
              <ul class="autocomplete-result-list"></ul>
            </div>
            <button @click.prevent="getGPSLocation" type="button" aria-label="Get GPS location" title="GPS location">
              <i class="fas fa-map-marked-alt"></i>
            </button>
          </div>
          <label for="searchCity" id="error" v-if="isSubmittedWithoutCity">Fill this field</label>
        </div>
        <button @click.prevent="onSubmit" type="submit" class="btn ml-auto submit-button"><span>Search</span></button>
      </form>
    </div>
  </div>
</template>

<script>
  import L from 'leaflet'
  import * as geocoding from 'esri-leaflet-geocoder'
  import Autocomplete from '@trevoreyre/autocomplete-js'
  import '@trevoreyre/autocomplete-js/dist/style.css'

  export default {
    name: 'Home',
    data() {
      return {
        city: "",
        isSubmittedWithoutCity: false,
        autocomplete: null,
        autocompletePlaceholder: 'Search for a municipality'
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
      handleAutocSelection: function(result) {
        if (result != null) {
          //console.log(result)
          this.city = result
        }
      },
      getSuggestions: function(input) {
        //console.log(input)
        this.city = input
        return new Promise(resolve => {
          if (input.length < 1) { return resolve([]) }
          geocoding.suggest()
            .text(input)
            .run(function(error, response) {
              resolve(response.suggestions.map(elem => elem.text))
            });
        })
      },
      getGPSLocation: function() {
        if(!("geolocation" in navigator)) {
          alert('Error: geolocation is not available.');
          return;
        }
        // get position
        var vm = this
        navigator.geolocation.getCurrentPosition(pos => {
          //console.log(pos)
          geocoding.reverseGeocode()
            .latlng(L.latLng(pos.coords.latitude, pos.coords.longitude))
            .run(function (error, result) {
            document.getElementById("autocomplete-input").value = result.address.LongLabel;
            vm.city = result.address.LongLabel
          });
        }, err => {
          console.log(err)
        })
      },
      setAutocompletePlaceholder: function() {
        if (window.innerWidth < 768) {
          this.autocompletePlaceholder = 'City'
        } else if (window.innerWidth < 1024) {
          this.autocompletePlaceholder = 'Municipality'
        } else {
          this.autocompletePlaceholder = 'Search for a municipality'
        }
      }
    },
    created() {
      window.addEventListener("resize", this.setAutocompletePlaceholder);
      this.setAutocompletePlaceholder();
    },
    mounted() {
      this.autocomplete = new Autocomplete('#autocomplete', {
        search: this.getSuggestions,
        onSubmit: this.handleAutocSelection
      })
    },
    destroyed() {
      window.removeEventListener("resize", this.setAutocompletePlaceholder);
    }
  }
</script>

<style lang="scss" scoped>
img {
  max-width:80%;
  height: auto;
  margin-bottom: 25px;
  opacity: 0.5;
}
form {
  .hidden {
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
    height: 1px;
    width: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
  }
  #error {
    color: red;
  }
  #searchField {
    display: flex;
    #autocomplete {
      background-color: #e9ecef;
      border-radius: 10px 0px 0px 10px;
      flex-grow: 5;
    }
    button {
      background-color: #e9ecef;
      width: 3em;
      border: none;
      border-radius: 0px 10px 10px 0px;
      outline: none;
      flex-grow: 1;
      &:hover {
        background-color: #CCCDD1;
        .fa-map-marked-alt {
          color: #767478;
        }
      }
      .fa-map-marked-alt {
        color: #929196;
      }
    }
  }
  .submit-button {
    padding: .5rem 1rem;
    line-height: 1.5;
    border-radius: .3rem;
    color: #fff;
    background-color: #17a2b8;
    transition: all 0.5s;
    span {
      cursor: pointer;
      display: inline-block;
      position: relative;
      transition: 0.5s;
      &:after {
        content: '\00bb';
        position: absolute;
        opacity: 0;
        top: 0;
        right: -20px;
        transition: 0.5s;
      }
    }
    &:hover {
      color: #fff;
      background-color: #138496;
      border-color: #117a8b;
      span {
        padding-right: 15px;
        &:after {
          opacity: 1;
          right: 0;
        }
      }
    }
  }
}

</style>
