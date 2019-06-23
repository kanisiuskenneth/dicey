<template>
    <v-app id="main-app-wrapper">
      <Toolbar/>
      <router-view></router-view>
      <vue-metamask @onComplete="onComplete"></vue-metamask>
    </v-app>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<script>
import Toolbar from './components/Toolbar'
import Home from './components/Home.vue'
import VueRouter from 'vue-router'
import Vue from 'vue'

Vue.use(VueRouter)

const routes = [
  {path: "/", component: Home},
  // {path: "*", component: NotFound}
];
const router = new VueRouter({
  routes: routes,
  mode: 'history',
});

export default {
  name: 'App',
  router,
  components: {
    Toolbar,
    VueMetamask
  }
  methods: {
    onComplete(data){
      console.log('data:', data);
    }
  }
}
</script>
