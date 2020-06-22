import '@babel/polyfill'
import 'mutationobserver-shim'
import Vue from 'vue'
import './plugins/bootstrap-vue'
import App from './App.vue'
import router from './router'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

Vue.config.productionTip = false

import VueCookies from 'vue-cookies'
Vue.use(VueCookies)
Vue.$cookies.config('30d')

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
