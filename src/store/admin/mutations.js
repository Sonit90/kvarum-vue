import { updateField } from 'vuex-map-fields'
export { updateField }


export function SET_USERS (state, users) {
  //state.users = users
 users.forEach((user)=>{
   state.users[user.id]=user
 })
}

export function SET_PERMISSIONS (state, permissions) {
  state.permissions = permissions
}
export function SET_COUNT (state, count) {
  state.count = count
}

export function EDIT_USER (state, user) {
  // if(typeof oldUser!=='undefined'){
  //   Object.assign(oldUser, newUser)
  // }
  let id = user.id
  state.users[id]=user

}

export function DELETE_USER (state, user) {
  user.isDeleted=1
}

export function RESTORE_USER (state, user) {
  user.isDeleted=0
}

export function SET_ROLES (state, roles) {
  state.roles=roles
}
