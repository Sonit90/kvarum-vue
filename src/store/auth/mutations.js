import { updateField } from 'vuex-map-fields'
export { updateField }
import { LocalStorage } from 'quasar'
import defineAbilitiesFor from 'src/rules/rules'
export function SET_TOKEN (state, token) {
  state.token = token
  LocalStorage.set('token', token)
  console.log('token is set and checked')
}
export function REMOVE_TOKEN (state) {
  state.token = ''
  state.profile = ''
  LocalStorage.set('token', '')
  LocalStorage.set('profile', '')
}
export function SET_PROFILE (state, profile) {
  state.profile = profile
}
export function SET_ROLES (state, roles) {
  state.roles = roles
}
export function SET_PERMISSIONS (state,  { profile, permissions }) {
  state.permissions = permissions
}
//
// export function SET_RULES (state, {profile, permissions}) {
//   let rules = defineAbilitiesFor({profile, permissions}).rules
//   console.log(rules)
//   state.rules = rules
// }
export function REMOVE_PERMISSIONS (state) {
  state.permissions = null
}
export function REMOVE_ROLES (state) {
  state.roles = null
}
export function REMOVE_RULES (state) {
  state.rules = []
}
export function ADD_PROFILE (state, profile) {
  state.profiles[profile.user_id] = profile
}
