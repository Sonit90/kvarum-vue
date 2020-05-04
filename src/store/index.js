import Vue from 'vue'
import Vuex from 'vuex'
import auth from './auth'
import admin from './admin'
import createPersistedState from 'vuex-persistedstate'
import abilityPlugin from './auth/ability'
Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation
 */
const Store = new Vuex.Store({
  modules: {
    agencies, auth, flats, admin
  },
  plugins: [createPersistedState({
    paths: ['auth']
  }), abilityPlugin],

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEV
})

export default Store
