import * as types from './mutation-types'

export const changeModalStatus = ({commit}) => {
	commit(types.CHANGEMODALSTATUS)
}

export const initMarkerList = ({commit}, payload) => {
	commit(types.INIT_MARKER_LIST, payload)
}

export const initMapHelper = ({commit}, payload) => {
	commit(types.INIT_MAP_HELPER, payload)
}