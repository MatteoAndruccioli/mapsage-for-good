import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home';
import Login from '../views/Login';
import Register from '../views/Register';
import CustomerProfile from '../views/CustomerProfile';
import MasseurProfile from '../views/MasseurProfile';
import PageNotFound from '../views/PageNotFound';
import SearchVisualizer from '../views/SearchVisualizer.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home_view',
    component: Home
  },
  {
    path: '/login/:source?/:masseur_id?',
    name: 'Login_view',
    component: Login
  },
  {
    path: '/register',
    name: 'Register_view',
    component: Register
  },
  {
    path: '/customerProfile',
    name: 'CustomerProfile_view',
    component: CustomerProfile
  },
  {
    path: '/masseurProfile/:id',
    name: 'MasseurProfile_view',
    component: MasseurProfile
  },
  {
    path: '/search/:city',
    name: 'SearchVisualizer_view',
    component: SearchVisualizer
  },
  {
    path: '/404',
    name: 'PageNotFound_view',
    component: PageNotFound
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
