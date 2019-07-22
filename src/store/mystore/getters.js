// export function catLength (state) {
//   return state.categories.length
// }
// export function getEventById (state, id) { return state.events.find(event => event.id === id) }

// export const getEventById = state => id => { return state.events.find(event => event.id === id) }
export const getTicket = state => id => state.tickets.find(ticket => ticket.id === id)
export const isAuthenticated = state => !!state.token
export const authStatus = state => state.status
