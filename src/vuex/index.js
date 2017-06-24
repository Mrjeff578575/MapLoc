import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'

//Modules
import login from './modules/login'
import common from './modules/common'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    actions,
    getters,
    modules: {
        login,
        common
    },
    trict: debug
    // plugins: debug ? [createLogger()] : []
})