<template>
  <div id="map-panel"></div>
</template>

<script>
  import axios from 'axios'
  import L from 'leaflet'
  import * as esri from 'esri-leaflet'
  import * as geocoding from 'esri-leaflet-geocoder'
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
        //const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
        //const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        //var streetsTile = L.tileLayer(tileUrl, {attribution});
        var streetsTile = esri.basemapLayer('Streets');
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

        var geoJsonLayer = new L.LayerGroup();
        geoJsonLayer.addTo(map);

        // Locating map on the selected city
        const vm = this;
        var geocoder = geocoding.geocodeService();
        geocoder.geocode().text(this.city).run(function (error, response) {
          if (error) {
            console.log(error);
            return;
          }
          if(response.results[0] != null) {
            const lng = response.results[0].latlng.lng;
            const lat = response.results[0].latlng.lat;
            vm.buildGeoJsonLayer(lng, lat, geoJsonLayer);
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
          vm.buildGeoJsonLayer(lng, lat, geoJsonLayer);
        });
      },
      buildGeoJsonLayer: function(lng, lat, geoJsonLayer) {
        axios.post('http://localhost:3000/masseurs', {
          type: "Point",
          coordinates: [lng, lat]
        }).then(res => {
          if(!res.data.error && res.data.cityBoundaries) {
            var coordinates = new Array;
            coordinates.push(res.data.cityBoundaries)
            if(res.data.masseursLocations) {
              res.data.masseursLocations.forEach(location => coordinates.push(location));
            } else {
              console.log("NO MASSEUR IN THE SPECIFIED CITY")
            }
            console.log(coordinates)
            const geoJson = L.geoJSON({
              type: "FeatureCollection",
              features: coordinates
            });
            geoJsonLayer.addLayer(geoJson)
          } else {
            console.log("CAN'T SEARCH IN A CITY OUTSIDE OF ITALY")
          }
        })
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
