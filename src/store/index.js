import Vue from 'vue'
import Vuex from 'vuex'

import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createdLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production';
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  strict:debug,
  plugins:debug?[createdLogger()]:[]
})
