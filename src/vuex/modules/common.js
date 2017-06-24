import * as types from '../mutation-types'

const state  = {
    showModal: false,
    markerList: [],
    mapHelper: ''
}

const mutations  = {
    [types.INIT_MAP_HELPER](state, payload){
        state.mapHelper = payload.mapHelper
    },
	[types.CHANGEMODALSTATUS](state){
        state.showModal = !state.showModal
    },
    [types.INIT_MARKER_LIST](state, payload){
        state.markerList = payload.markerList
    },
    [types.ADD_MARKER_LIST](state, payload) {
        state.markerList.push(payload.marker)
    }
}

export default{
	state,
	mutations
}