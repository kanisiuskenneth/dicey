import Vue from 'vue'
import Vuex from 'vuex'
import eth from './modules/eth'

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    eth,
  }
})
