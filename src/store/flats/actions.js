import EventService from 'src/services/EventService.js'
import {default as apiClient} from "src/services/axios";
import AdminService from "src/services/AdminService";
import ProfileService from "src/services/ProfileService";

export function fetchFirms ({ commit, state }) {
  return EventService.getFirms().then((response) => {
    // console.log(`Total events are ${response.headers['x-pagination-total-count']}`)
    // commit('SET_TICKETS', response.data)
    // commit('SET_COUNT', response.headers['x-pagination-total-count'])
    return response.data
  })
}

export function resetFlat ({ commit }) {
  commit('RESET_FLAT')
}
export function clearFilters({ commit }) {
  commit('CLEAR_FILTERS')
}

export function newFlat ({ commit }) {
  commit('RESET_FLAT')

  return EventService.newFlat().then((response) => {
    console.log(response)
    commit('SET_FLAT_ID', response.data)
    return response
  })
}
export function deleteImage ({ commit }, { uniqueId, order, obj_id }) {
  return EventService.deleteImage({ uniqueId, order, obj_id }).then((response) => {
    return response
  })
}

export function rotateImage ({ commit }, { uniqueId, obj_id, angle }) {
  return EventService.rotateImage({ uniqueId, obj_id, angle }).then((response) => {
    return response
  })
}

export function orderChange ({ commit }, {order, id }) {
  return EventService.orderChange({ order, id }).then((response) => {
    return response
  })
}


export function createFlat ({ commit }, flat) {
  return EventService.createFlat(flat).then((response) => {
    console.log(response)
    commit('SET_FLAT', response.data)

    return response

  })
}

export function updateFlat ({ commit }, flat) {
  return EventService.updateFlat(flat).then((response) => {
    console.log(response)
    commit('SET_FLAT', response.data)
    return response

  })
}

export function finalize ({ commit }, { id, order }) {
  return EventService.finalize({ id, order }).then((response) => {
    console.log(response)
    return response
    // if (response.data.result === 'success') {
    //   return 'success'
    // } else {
    //   return 'failure'
    // }
  })
}

export function getTableObjects ({ commit, state }, { page, fetchCount, filters, sortBy, expand }) {
  // console.log(sortBy) // sortBy - field name
  return EventService.getTableObjects(page, fetchCount, filters, sortBy, expand).then((response) => {
    console.log(response)
    console.log(`Total events are ${response.headers['x-pagination-total-count']}`)
    commit('SET_FLATS', response.data)
    commit('SET_COUNT', response.headers['x-pagination-total-count'])
    return response
  })
}

export function searchAgents ({ commit, state }, { page, fetchCount, filter, sortBy, descending }) {
  console.log(sortBy) // sortBy - field name
  console.log(descending) // descinding = true or false
  return ProfileService.searchAgents(page, fetchCount, filter, sortBy, descending).then((response) => {
    console.log(response)
    console.log(`Total users are ${response.headers['x-pagination-total-count']}`)
    // commit('SET_USERS', response.data)
    // commit('SET_COUNT', response.headers['x-pagination-total-count'])
    return response
  })
}



export function getFlat ({ commit, getters }, id) {
  //const flat = getters.getFlat(id)
  // if (flat) {
  //   commit('SET_FLAT', flat)
  //   return {data:flat}
  // }
  return EventService.getFlat(id).then((response) => {
    commit('SET_FLAT', response.data)
    return response
  })
}



export function addStatus ({ commit }, status) {
  console.log('добавляем статус ' + status)
  commit('ADD_STATUS', status)
}

export function removeStatus ({ commit }, status) {
  console.log('убираем статус ' + status)
  commit('REMOVE_STATUS', status)
}
