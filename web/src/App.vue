<template>
    <v-app id="main-app-wrapper">
      <Toolbar/>
      <router-view></router-view>
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
import VueMetamask from 'vue-metamask'
import {mapActions} from 'vuex'
export default {
  name: 'App',
  components: {
    Toolbar,
    VueMetamask
  },
  data: () => ({

  }),

  methods: {
    ...mapActions({
      boot: 'boot',
    }),
    updateEth(){
        this.save()
    },
  },
  mounted: function() {
    this.boot()
  }
}
</script>
