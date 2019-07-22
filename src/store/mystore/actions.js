import EventService from 'src/services/EventService.js'
import LoginService from 'src/services/LoginService.js'
import { LocalStorage } from 'quasar'

// export function createEvent ({ commit, dispatch }, event) {
//   return EventService.postEvent(event).then(() => {
//     commit('ADD_EVENT', event)
//     const notification = {
//       type: 'success',
//       message: 'Your event has been created!'
//     }
//     dispatch('notifications/add', notification, { root: true })
//   }
//   ).catch(error => {
//     const notification = {
//       type: 'error',
//       message: 'There was a problem, creating an event: ' + error.message
//     }
//     dispatch('notifications/add', notification, { root: true })
//     throw error
//   })
// }

export function checkToken ({ commit, dispatch, state }) {
  return new Promise(function (resolve, reject) {
    const token = LocalStorage.getItem('token', '')
    const profile = LocalStorage.getItem('profile', '')
    if (token !== '' && profile !== '') {
      commit('SET_TOKEN', token)
      commit('SET_AUTH_STATUS', 'authenticated')
      commit('SET_PROFILE', JSON.parse(profile))

      resolve()
    } else {
      reject()
    }
  }
  )
}

export function login ({ commit, dispatch, state }, { email, password }) {
  return LoginService.login(email, password).then(response => {
    console.log('response.data.token=' + response.data.token)
    if (response.data.token) {
      const token = response.data.token
      const profile = response.data.profile
      commit('SET_TOKEN', token)
      commit('SET_AUTH_STATUS', 'authenticated')
      commit('SET_PROFILE', profile)
      console.log('saving token to local storage ' + token)
      console.log('current auth status ' + state.auth)
      return response.data
    } else {
      console.log('removing token from local storage')
      LocalStorage.set('token', '')
      // commit('REMOVE_TOKEN', error)
      commit('SET_AUTH_STATUS', 'unauthenticated')
      return response.data
    }
  }).catch(() => {
    // console.log(`There was a problem: ${error.message}`)
    console.log('removing token from local storage')
    // commit('REMOVE_TOKEN', error)
    commit('SET_AUTH_STATUS', 'unauthenticated')
  })
}

export function fetchFirms ({ commit, state }) {
  return EventService.getFirms().then((response) => {
    // console.log(`Total events are ${response.headers['x-pagination-total-count']}`)
    // commit('SET_TICKETS', response.data)
    // commit('SET_COUNT', response.headers['x-pagination-total-count'])
    return response.data
  }).catch(
    (error) => {
      console.log('error in fetching firms')
      console.log(error)
      console.log(`There was a problem: ${error.message}`)
      // const notification = {
      //   type: 'error',
      //   message: 'There was a problem, fetching events: ' + error.message
      // }
      // dispatch('notifications/add', notification, { root: true })
    }
  )
}
export function createFirm ({ commit }, { title, parentId }) {
  return EventService.createFirm({ title, parentId }).then((response) => {
    console.log('after create firm event service')
    console.log(response.data)
    return response.data
    // if (response.data.result === 'success') {
    //   return 'success'
    // } else {
    //   return 'failure'
    // }
  })
}

export function fetchTickets ({ commit, state }, { page, assignedTo, statuses }) {
  return EventService.getTickets(state.perPage, page, assignedTo, statuses).then((response) => {
    // console.log(response);
    console.log(`Total events are ${response.headers['x-pagination-total-count']}`)
    commit('SET_TICKETS', response.data)
    commit('SET_COUNT', response.headers['x-pagination-total-count'])
  }).catch(
    (error) => {
      console.log('error in fetching tickets')
      console.log(error)
      console.log('current auth status ' + state.auth)
      console.log('token in local storage ' + state.token)
      console.log(`There was a problem: ${error.message}`)
      // const notification = {
      //   type: 'error',
      //   message: 'There was a problem, fetching events: ' + error.message
      // }
      // dispatch('notifications/add', notification, { root: true })
    }
  )
}

export function fetchTicket ({ commit, getters }, id) {
  const ticket = getters.getTicket(id)
  if (ticket) {
    commit('SET_TICKET', ticket)
    return ticket
  }
  return EventService.getTicket(id).then((response) => {
    commit('SET_TICKET', response.data)
    return response.data
  })
}

export function createTicket ({ commit }, { section, priority, finishDue, title, description }) {
  // console.log('closing ticket in action, id= '+id+' reason='+reason+' comment='+comment)

  // const ticket = getters.getTicket(id);
  // if (ticket) {
  //   commit('SET_TICKET', ticket);
  //   return ticket;
  // }
  return EventService.createTicket({ section, priority, finishDue, title, description }).then((response) => {
    console.log('after create ticket event service')
    console.log(response.data)
    if (response.data.result === 'success') {
      return 'success'
    } else {
      return 'failure'
    }
  })
}

export function closeTicket ({ commit }, { id, reason, comment }) {
  console.log('closing ticket in action, id= ' + id + ' reason=' + reason + ' comment=' + comment)

  // const ticket = getters.getTicket(id);
  // if (ticket) {
  //   commit('SET_TICKET', ticket);
  //   return ticket;
  // }
  return EventService.closeTicket({ id, reason, comment }).then((response) => {
    console.log('after close ticket event service')
    console.log('response= ' + response.data)
    if (response.data.result === 'success') {
      commit('SET_STATUS_TICKET', response.data.status)
      return 'success'
    } else {
      return 'failure'
    }
  })
}

export function takeTicket ({ commit }, id) {
  console.log('taking ticket in action, id= ' + id)
  return EventService.takeTicket(id).then((response) => {
    console.log('response= ' + response.data)
    console.log('response result= ' + response.data.result)
    console.log(response.data)
    if (response.data.result === 'success') {
      commit('TAKE_TICKET', response.data.assign)
      commit('SET_STATUS_TICKET', response.data.status)
      return 'success'
    } else {
      return 'failure'
    }
  })
}

export function startTicket ({ commit }, id) {
  console.log('начинаем работу над тикетом in action, id= ' + id)
  return EventService.startTicket(id).then((response) => {
    console.log('response= ' + response.data)
    console.log('response result= ' + response.data.result)
    console.log(response.data)
    if (response.data.result === 'success') {
      commit('SET_STATUS_TICKET', response.data.status)
      return 'success'
    } else {
      return 'failure'
    }
  })
}

export function openTicket ({ commit }, id) {
  console.log('открываем тикет in action, id= ' + id)
  return EventService.openTicket(id).then((response) => {
    // console.log('response= '+response.data)
    // console.log('response result= '+response.data.result)
    // console.log(response.data)
    if (response.data.result === 'success') {
      commit('SET_STATUS_TICKET', response.data.status)
      return 'success'
    } else {
      return 'failure'
    }
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
