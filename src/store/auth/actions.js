import LoginService from 'src/services/LoginService.js'
import ProfileService from "src/services/ProfileService"
import router from 'src/router'
import {setAuthHeader} from 'src/services/axios'


export function authenticate (response, commit) {
  if (response.data.auth_key) {
    let data = response.data
    console.log('authenticate action')
    const token = data.auth_key
    const profile = data.profile
    const permissions = data.permissions
    setAuthHeader(token)
    commit('SET_TOKEN', token)
    commit('SET_PROFILE', profile)
    commit('SET_PERMISSIONS', { permissions, profile })
    return response
  }

    console.log('removing token from local storage')
    commit('REMOVE_TOKEN')
    return response
}

export function loginAs ({ commit, dispatch, state }, token) {
  return LoginService.loginAs(token).then(response => {
    console.log('response check token', response)
    authenticate(response, commit)
  })
}




export function checkToken ({ commit, dispatch, state }, token) {
    console.log('token has not been checked yet')
    //setAuthHeader(token)
    return LoginService.check(token).then(response => {
      console.log('response check token', response)
      authenticate(response, commit)
    })
}


export function register ({ commit, dispatch, state, getters }, { name, surname, email, password, agency, noAgency, myAgency, type }) {
  return LoginService.register(name, surname, email, password, agency, noAgency, myAgency, type).then(response => {
    console.log('response.data.token=', response.data.auth_key)
    return response
  })
}

export function login ({ commit, dispatch, state, getters }, { email, password }) {
  return LoginService.login(email, password).then(response => {
    authenticate(response, commit)
  })
}

export function confirm ({ commit, dispatch, state, getters }, { id, code }) {
  return LoginService.confirm(id, code).then(response => {
    if (response.data.auth_key) {
      let data = response.data
      const token = data.auth_key
      const profile = data.profile
      const roles = data.profile.roles
      const permissions = data.permissions
      setAuthHeader(token)
      commit('SET_TOKEN', token)
      commit('SET_PROFILE', profile)
      commit('SET_ROLES', roles)
      //commit('SET_RULES', {profile, permissions})
      commit('SET_PERMISSIONS', { profile, permissions })
      console.log('saving token to local storage ' + token)
    } else {
      console.log('removing token from local storage')
      commit('REMOVE_TOKEN')
    }
    return response
  })
}

export function logout ({ commit, dispatch, state }) {
  commit('REMOVE_TOKEN')
  commit('REMOVE_PERMISSIONS')
  commit('REMOVE_ROLES')
  commit('REMOVE_RULES')
}

export function forgotPassword ({ commit, dispatch, state }, { email }) {
  return LoginService.forgotPassword(email).then(response => {
    return response
  })
}

export function changePassword ({ commit, dispatch, state }, { password, newPassword, newPasswordRepeat }) {
  return LoginService.changePassword(password, newPassword, newPasswordRepeat).then(response => {
    return response
  })
}



export function resend ({ commit, dispatch, state }, { email }) {
  return LoginService.resend(email).then(response => {
    return response
  })
}

export function resetPassword ({ commit, dispatch, state }, { password, id, code }) {
  return LoginService.resetPassword(password, id, code).then(response => {
    console.log('response after reset password')
    console.log(response)
    console.log('response status is 200, continue to login')
    let email = response.data.email
    login({ commit, dispatch, state }, { email, password }).then(
      resp => {
        router.push('/')
        return resp
      })
    return response
  }).catch((error) => {
    console.log(error.response)
    // console.log(`There was a problem: ${error.message}`)
    console.log('removing token from local storage')
    // commit('REMOVE_TOKEN', error)
    return error.response
  })
}



export function getProfile ({ commit, state, getters },  id ) {
  if(getters.getProfile(id)!==null){
    return {data:getters.getProfile(id)}
  }
  return ProfileService.getProfile(id).then((response) => {
    commit('ADD_PROFILE', response.data)
    return response
  })
}

export function editProfile ({ commit, state, getters },  profile ) {

  return ProfileService.editProfile(profile).then((response) => {
    commit('ADD_PROFILE', response.data)
    commit('SET_PROFILE', response.data)
    return response
  })
}
