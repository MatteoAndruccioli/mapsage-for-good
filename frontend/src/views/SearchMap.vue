<template>
  <div id="map-panel"></div>
</template>

<script>
  import L from 'leaflet'
  import * as esri from 'esri-leaflet'
  import * as geocoding from 'esri-leaflet-geocoder'
  import "leaflet/dist/leaflet.css";
  import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";
  import {buildGeoJsonLayer} from './utils/searchMapUtil'
  // Code required to display leaflet markers with Vue.js Webpack (comments included)
  // eslint-disable-next-line
  delete L.Icon.Default.prototype._getIconUrl
  // eslint-disable-next-line
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
  })

  export default {
    name: 'SearchMap',
    data() {
      return {
        city: this.$route.params.city
      }
    },
    methods: {
      init: function() {
        // Configuring map
        const map = L.map('map-panel').setView([43.991830, 12.607960], 8);
        var streetsTile = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        });
        var satelliteTile = esri.basemapLayer('Imagery');
          var baseMaps = {
          "Streets": streetsTile,
          "Satellite": satelliteTile
        }
        streetsTile.addTo(map);
        L.control.layers(baseMaps).addTo(map);
        L.control.scale().addTo(map);

        var geoJsonLayer = new L.LayerGroup();
        geoJsonLayer.addTo(map);

        // Locating map on the selected city
        var geocoder = geocoding.geocodeService();
        geocoder.geocode().text(this.city).run(function (error, response) {
          if (error) {
            console.log(error);
            return;
          }
          if(response.results[0] != null) {
            const lng = response.results[0].latlng.lng;
            const lat = response.results[0].latlng.lat;
            buildGeoJsonLayer(lng, lat, geoJsonLayer);
          }
          map.fitBounds(response.results[0].bounds);
        });

        // Building and configuration of search control
        var searchControl = new geocoding.geosearch({
          allowMultipleResults: false,
          useMapBounds: false
        }).addTo(map);
        searchControl.on('results', function(data){
          geoJsonLayer.clearLayers();
          // Only one "results" because of "allowMultipleResults=false" attribute
          const lng = data.results[0].latlng.lng;
          const lat = data.results[0].latlng.lat;
          buildGeoJsonLayer(lng, lat, geoJsonLayer);
        });
      }
    },
    mounted() {
      this.init();
    }
  }
</script>

<style lang="scss">

html, body, #map-panel {
  height: 100%;
  width: 100%;
}

</style>
