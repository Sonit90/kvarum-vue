import { LocalStorage } from 'quasar'
export function ADD_TICKET (state, ticket) {
  state.tickets.push(ticket)
}
export function SET_TICKETS (state, tickets) {
  state.tickets = tickets
}
export function SET_TICKET (state, ticket) {
  state.ticket = ticket
}
export function SET_COUNT (state, count) {
  state.count = count
}

export function SET_TOKEN (state, token) {
  state.token = token
  state.status = 'success'
  LocalStorage.set('token', token)
  LocalStorage.set('auth', 'authenticated')
}
export function REMOVE_TOKEN (state) {
  state.token = ''
  state.status = 'error'
  LocalStorage.set('token', '')
  LocalStorage.set('auth', '')
}
export function SET_AUTH_STATUS (state, auth) {
  state.auth = auth
  LocalStorage.set('auth', auth)
}

export function SET_STATUS_TICKET (state, status) {
  console.log('mutating status to ' + status)
  state.ticket.status = status
}

export function TAKE_TICKET (state, assign) {
  console.log('mutating assign to ' + assign)
  state.ticket.assign = assign
}
export function SET_PROFILE (state, profile) {
  state.profile = profile
  LocalStorage.set('profile', JSON.stringify(profile))
}

export function ADD_STATUS (state, status) {
  state.filters.push(status)
  // LocalStorage.setItem("profile",JSON.stringify(profile))
}

export function REMOVE_STATUS (state, status) {
  var index = state.filters.indexOf(status)
  if (index !== -1) state.filters.splice(index, 1)
  console.log(state.filters)
  // LocalStorage.setItem("profile",JSON.stringify(profile))
}
