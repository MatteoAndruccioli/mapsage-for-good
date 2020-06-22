<template>
  <div id="map"></div>
</template>

<script>
  import L from 'leaflet'
  import * as esri from 'esri-leaflet'
  import * as geocoding from 'esri-leaflet-geocoder'
  import 'leaflet/dist/leaflet.css'
  import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css'
  import 'leaflet-easybutton'
  // Code required to display leaflet markers with Vue.js Webpack (comments included)
  // eslint-disable-next-line
  delete L.Icon.Default.prototype._getIconUrl
  // eslint-disable-next-line
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
  })

  import {buildGeoJsonLayer} from './geoJsonUtil'

  export default {
    props: ['initType', 'initialLocation', 'initialCity', 'enableEditLocationButton'],
    data() {
      return {
        map: null,
        geoJsonLayer: null,
        editButton: null,
        new_location: null
      }
    },
    methods: {
      init: function() {
        // Map initialization
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

        this.geoJsonLayer = new L.layerGroup().addTo(this.map)

        // Map configuration
        switch(this.initType) {
          case 'SEARCH_MAP':
            this.initLocation(this.initialCity, this.initType)
            this.initSearchControl(this.initType)
          break;
          case 'REGISTER_PANEL_MAP':
            this.initSearchControl(this.initType)
          break;
          case 'PROFILE_MAP':
            if (this.enableEditLocationButton) {
              this.initEditLocationButton()
            }
            this.initLocation(this.initialLocation, this.initType)
          break;
          default:
        }
      },
      // Locates map on "initialLocation" location
      initLocation(location, initType) {
        const vm = this;
        if (initType == 'PROFILE_MAP') {
          const latLng = L.latLng(location[1], location[0]);
          this.geoJsonLayer.addLayer(L.marker(latLng));
          this.map.flyTo(latLng);
        } else if (initType == 'SEARCH_MAP') {
          var geocoder = geocoding.geocodeService();
          geocoder.geocode().text(this.initialCity).run(function (error, response) {
            if (error) {
              console.log(error);
              return;
            }
            if(response.results[0] != null) {
              const lng = response.results[0].latlng.lng;
              const lat = response.results[0].latlng.lat;
              buildGeoJsonLayer(lng, lat, vm.geoJsonLayer);
            }
            vm.map.fitBounds(response.results[0].bounds);
          });
        }
      },
      // Builds and configures search control
      initSearchControl(initType) {
        var searchControl = new geocoding.geosearch({
          allowMultipleResults: false,
          useMapBounds: false,
          expanded: initType == 'SEARCH_MAP' ? false : true
        }).addTo(this.map);
        const vm = this;

        searchControl.on('results', function(data) {
          vm.geoJsonLayer.clearLayers();
          const lng = data.results[0].latlng.lng;
          const lat = data.results[0].latlng.lat;
          switch (initType) {
            case 'SEARCH_MAP':
              buildGeoJsonLayer(lng, lat, vm.geoJsonLayer);
              break;
            case 'REGISTER_PANEL_MAP':
              vm.geoJsonLayer.addLayer(L.marker(data.results[0].latlng));
              vm.$emit('locationEvent', [lng, lat])
              break;
            case 'PROFILE_MAP':
              vm.geoJsonLayer.addLayer(L.marker(data.results[0].latlng));
              vm.new_location = [lng, lat]
              break;
            default:
          }
        });
      },
      // Builds and configures the "edit location" button
      initEditLocationButton() {
        const vm = this;
        L.easyButton({states: [{
                stateName: 'edit-location',
                icon: '<i class="far fa-edit fa-lg" style="color:#0000FF;"><!-- icon --></i>',
                title: 'edit location',
                onClick: function(control) {
                  vm.initSearchControl(vm.initType)
                  control.state('confirm-location')
                }
              },{
                stateName: 'confirm-location',
                icon: '<i class="far fa-check-circle fa-lg" style="color:#00FF00;"><!-- icon --></i>',
                title: 'confirm location',
                onClick: function(control) {
                  control.state('edit-location');
                  if (vm.new_location != null)
                    vm.$emit('locationEvent', vm.new_location);
                  vm.$router.go();
                }
              }
            ]
        }).addTo(this.map)
      }
    },
    mounted() {
      // Timeout is required in case of use in MasseurRegisterPanel and MasseurProfilePanel.
      // It is irrelevant in case of use in SearchVisualizer
      setTimeout(this.init, 200)
    }
  }
</script>

<style scoped>

#map {
  height: 100%;
}

</style>
