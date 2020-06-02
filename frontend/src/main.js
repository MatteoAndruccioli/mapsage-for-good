import Vue from 'vue'
import App from './App.vue'
import router from './router'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "leaflet/dist/leaflet.css";
import "esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css";

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
