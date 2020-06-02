<template>
  <div id="map-panel"></div>
</template>

<script>
  import L from 'leaflet';
  import * as esri from 'esri-leaflet';
  import * as geocoding from 'esri-leaflet-geocoder';
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
        const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        var streetsTile = L.tileLayer(tileUrl, {attribution});
        var satelliteTile = esri.basemapLayer('Imagery');

        const map = L.map('map-panel', {
          layers: [streetsTile]
        }).setView([43.991830, 12.607960], 8);

        var baseMaps = {
          "Streets": streetsTile,
          "Satellite": satelliteTile
        }
        L.control.layers(baseMaps).addTo(map);

        L.control.scale().addTo(map);

        // Build and configuration of search control
        var searchControl = new geocoding.geosearch({
          allowMultipleResults: true,
          useMapBounds: false
        }).addTo(map);
        var results = new L.layerGroup().addTo(map);
        searchControl.on('results', function(data){
          results.clearLayers();
          for (var i = data.results.length - 1; i >= 0; i--) {
            results.addLayer(L.marker(data.results[i].latlng));
          }
        });

        // Locating map on the selected city
        var geocoder = geocoding.geocodeService();
        geocoder.geocode().text(this.city).run(function (error, response) {
          if (error) {
            console.log(error);
            return;
          }
          if(response.results[0] != null) {
            map.fitBounds(response.results[0].bounds);
          }
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
