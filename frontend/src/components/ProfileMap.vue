<template>
  <div id="map"></div>
</template>

<script>
  import L from 'leaflet'
  import * as esri from 'esri-leaflet'
  import * as geocoding from 'esri-leaflet-geocoder'
  import "leaflet/dist/leaflet.css";
  import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";
  // Code required to display leaflet markers with Vue.js Webpack (comments included)
  // eslint-disable-next-line
  delete L.Icon.Default.prototype._getIconUrl
  // eslint-disable-next-line
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
  })

  import { eventBus } from './RegisterPanel'

  export default {
    data() {
      return {
        map: ''
      }
    },
    methods: {
      init: function() {
        var vm = this;
        // Configuring map
        this.map = L.map('map').setView([43.991830, 12.607960], 8);
        var streetsTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        var satelliteTile = esri.basemapLayer('Imagery');
        var baseMaps = {
          "Streets": streetsTile,
          "Satellite": satelliteTile
        }
        streetsTile.addTo(this.map);
        L.control.layers(baseMaps).addTo(this.map);
        L.control.scale().addTo(this.map);

        // Building and configuration of search control
        var searchControl = new geocoding.geosearch({
          allowMultipleResults: false,
          useMapBounds: false
        }).addTo(this.map);
        var results = new L.layerGroup().addTo(this.map);
        searchControl.on('results', function(data) {
          results.clearLayers();
          results.addLayer(L.marker(data.results[0].latlng));
          vm.$emit('locationEvent', [data.results[0].latlng.lng, data.results[0].latlng.lat])
        });
      },
      // Required for refreshing map when a user clicks the Masseur Tab in register panel
      refreshMap() {
        this.map.remove();
        setTimeout(this.init, 800)
      }
    },
    mounted() {
      this.init();
      var meth = this.refreshMap
      eventBus.$on('refreshMap', meth)
    }
  }
</script>

<style scoped>

#map {
  height: 300px;
}

</style>
