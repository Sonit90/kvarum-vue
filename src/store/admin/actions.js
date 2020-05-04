import AdminService from "src/services/AdminService"
import LoginService from "src/services/LoginService";
import {authenticate} from "src/store/auth/actions";
import EventService from "src/services/EventService";

export function getUsers ({ commit, state }, { page, fetchCount, filter, sortBy, descending }) {
  console.log(sortBy) // sortBy - field name
  console.log(descending) // descinding = true or false
  return AdminService.getAdminUsers(page, fetchCount, filter, sortBy, descending).then((response) => {
    console.log(response)
    console.log(`Total users are ${response.headers['x-pagination-total-count']}`)
    commit('SET_USERS', response.data)
    commit('SET_COUNT', response.headers['x-pagination-total-count'])
    return response
  })
}


export function deleteUser ({ commit, dispatch, state, getters }, id) {
  return AdminService.deleteUser(id).then(response => {
    let user = getters.getUser(id)
    commit('DELETE_USER', user)
   return response
  })
}

export function restoreUser ({ commit, dispatch, state, getters }, id) {
  return AdminService.restoreUser(id).then(response => {
    let user = getters.getUser(id)
    commit('RESTORE_USER', user)
    return response
  })
}


export function getRoles ({ commit, state }) {
  if(state.roles!==null&&state.roles.length>0){
    return {data:state.roles}
  }
  return AdminService.getRoles().then((response) => {
    commit('SET_ROLES', response.data)
    return response
  })
}
export function getPermissions ({ commit, state }) {
  if(state.permissions!==null&&state.permissions.length>0){
    return {data:state.permissions}
  }
  return AdminService.getPermissions().then((response) => {
    commit('SET_PERMISSIONS', response.data)
    return response
  })
}


export function getRole ({ commit }, name) {
  return AdminService.getRole(name).then((response) => {
    return response
  })
}

export function createUser ({ commit, dispatch, state, getters }, { name, surname, email, password, agency, type, roles }) {
  return AdminService.createUser(name, surname, email, password, agency, type, roles).then(response => {
    //console.log('response.data.token=', response.data.auth_key)
    return response
  })
}
export function editUser ({ commit, dispatch, state, getters }, form) {
  return AdminService.editUser(form).then(response => {
    console.log(response)
    //let oldUser=getters.getUser(response.data.id)
    let user=response.data
    commit('EDIT_USER', user )
    return response
  })
}

