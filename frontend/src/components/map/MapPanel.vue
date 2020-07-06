<template>
  <div id="map">
    <div v-if="showLoading" class="loader"></div>
  </div>
</template>

<script>
  import L from 'leaflet'
  import * as esri from 'esri-leaflet'
  import * as geocoding from 'esri-leaflet-geocoder'
  import {buildGeoJsonLayer} from './geoJsonUtil'

  export default {
    props: ['initType', 'initialLocation', 'initialCity', 'enableEditLocationButton'],
    data() {
      return {
        map: null,
        geoJsonLayer: null,
        editButton: null,
        new_location: null,
        showLoading: true
      }
    },
    methods: {
      init() {
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

        new Promise((resolve, reject) => {
          // Map configuration
          switch(this.initType) {
            case 'SEARCH_MAP':
            this.initLocation(this.initialCity, this.initType)
              .then(() => resolve())
              .catch((reason) => reject(reason))
            this.initSearchControl(this.initType) // no need for promise because no async behaviour is present
            break;
            case 'REGISTER_PANEL_MAP':
              this.initGPSLocationButton(this.initType)
              this.initSearchControl(this.initType)
              resolve();
            break;
            case 'PROFILE_MAP':
              if (this.enableEditLocationButton) {
                this.initEditLocationButton() // no need for promise because no async behaviour is present
              }
              this.initLocation(this.initialLocation, this.initType)
                .then(() => resolve())
                .catch((reason) => reject(reason))
            break;
            default:
          }
        }).then(() => {
          this.showLoading = false
        }).catch(reason => {
          this.showLoading = false
          alert("An error occurs during map search. Error description: " + reason)
          console.log(reason)
        })
      },
      // Locates map on "initialLocation" location
      initLocation(location, initType) {
        const vm = this;
        return new Promise((resolve, reject) => {
          if (initType == 'PROFILE_MAP') {
            const latLng = L.latLng(location[1], location[0]);
            this.geoJsonLayer.addLayer(L.marker(latLng).bindPopup("I'm here!", { closeButton: false }));
            this.map.setView(latLng);
            resolve();
          } else if (initType == 'SEARCH_MAP') {
            var geocoder = geocoding.geocodeService();
            geocoder.geocode().text(this.initialCity).run(function (error, response) {
              if (error) {
                console.log(error);
                reject(error);
                return;
              }
              if(response.results[0] != null) {
                const lng = response.results[0].latlng.lng;
                const lat = response.results[0].latlng.lat;
                buildGeoJsonLayer(lng, lat, vm.geoJsonLayer)
                  .then(() => resolve())
                  .catch((reason) => reject(reason))
                vm.map.fitBounds(response.results[0].bounds);
              } else {
                reject("Geocoder does not found results")
              }
            });
          }
        })
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
              vm.showLoading = true;
              buildGeoJsonLayer(lng, lat, vm.geoJsonLayer)
                .then(() => vm.showLoading = false)
                .catch((reason) => {
                  vm.showLoading = false
                  alert("An error occurs during map search. Error description: " + reason)
                  console.log(reason)
                })
              break;
            case 'REGISTER_PANEL_MAP':
              vm.geoJsonLayer.addLayer(L.marker(data.results[0].latlng).bindPopup("I'm here!", { closeButton: false }));
              vm.$emit('locationEvent', [lng, lat])
              break;
            case 'PROFILE_MAP':
              vm.geoJsonLayer.addLayer(L.marker(data.results[0].latlng).bindPopup("I'm here!", { closeButton: false }));
              vm.new_location = [lng, lat]
              break;
            default:
          }
        });
      },
      // Builds and configures the "edit location" button
      initEditLocationButton() {
        const vm = this;
        L.easyButton({
          states: [{
                stateName: 'edit-location',
                icon: '<i class="far fa-edit fa-lg"></i>',
                title: 'Edit location',
                onClick: function(control) {
                  vm.initGPSLocationButton(vm.initType)
                  vm.initSearchControl(vm.initType)
                  control.state('confirm-location')
                }
              },{
                stateName: 'confirm-location',
                icon: '<i class="far fa-check-circle fa-lg" style="color:#00FF00;"></i>',
                title: 'Confirm location',
                onClick: function(control) {
                  control.state('edit-location');
                  if (vm.new_location != null)
                    vm.$emit('locationEvent', vm.new_location);
                  vm.$router.go();
                }
              }]
        }).addTo(this.map)
      },
      // Builds and configures the "GPS location" button
      initGPSLocationButton(initType) {
        const vm = this;
        L.easyButton({
          states: [{
                stateName: 'gps-location',
                icon: '<i class="fas fa-map-marker-alt fa-lg"></i>',
                title: 'GPS location',
                onClick: function() {
                  if(!("geolocation" in navigator)) {
                    alert('Error: geolocation is not available.');
                    return;
                  }
                  // get position
                  navigator.geolocation.getCurrentPosition(pos => {
                    const latlng = L.latLng(pos.coords.latitude, pos.coords.longitude)
                    vm.geoJsonLayer.clearLayers();
                    vm.geoJsonLayer.addLayer(L.marker(latlng).bindPopup("I'm here!", { closeButton: false }))
                    vm.map.flyTo(latlng)
                    if (initType == 'PROFILE_MAP') {
                      vm.new_location = [latlng.lng, latlng.lat]
                    } else if (initType == 'REGISTER_PANEL_MAP') {
                      vm.$emit('locationEvent', [latlng.lng, latlng.lat])
                    }
                  })
                }
              }]
        }).addTo(this.map)
      }
    },
    mounted() {
      if (this.initType == "SEARCH_MAP") {
        this.init()
      } else {
        // Timeout is required in case of use in MasseurRegisterPanel and MasseurProfilePanel bacause of Boostrap.
        setTimeout(this.init, 500)
      }
    }
  }
</script>

<style scoped>

#map {
  height: 100%;
  display: flex;
}

.loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #17a2b8;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  animation: spin 1s linear infinite;
  margin: auto;
  z-index: 9999;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

</style>
