import { updateField } from 'vuex-map-fields'
export { updateField }
import Vue from 'vue'
import { getDefaultState } from './state'
import {defaultFilters} from './state'
export function ADD_STATUS (state, status) {
  state.filters.push(status)
  // LocalStorage.setItem("profile",JSON.stringify(profile))
}

export function EMPTY_TITLE (state) {
  state.title = null
}

export function SET_TITLE (state, title) {
  state.title = title
}

export function REMOVE_STATUS (state, status) {
  var index = state.filters.indexOf(status)
  if (index !== -1) state.filters.splice(index, 1)
  console.log(state.filters)
  // LocalStorage.setItem("profile",JSON.stringify(profile))
}

export function SET_FLAT_ID (state, id) {
  state.flat.id = id
}

export function SET_FLAT_PROP_TYPE (state, propType) {
  state.flat.property_type = propType
}

export function SET_FLATS (state, flats) {
  state.flats = flats
}
export function SET_COUNT (state, count) {
  state.count = parseInt(count)
}
export function SET_FLAT (state, flat) {
  Vue.set(state, 'flat', flat)
  //state.flat = flat
  let id = flat.id
  state.flats[id]=state.flat
  state.title = flat.title
}
export function UPDATE_ERRORS (state, errors) {
  let errs = new Map()
  for (let key in errors) {
    errs.set(errors[key].field, errors[key].message)
  }
  console.log(errs)
  state.flat.errors = errs
}
export function UPDATE_STEP_ONE (state, val) {
  state.stepOne = val
}
export function UPDATE_ORDER (state, val) {
  state.flat.img_order = val
}
export function UPDATE_ORDER_BY_NAME (state, { name, id }) {
  console.log(name)
  console.log(id)
  let index = state.order.findIndex(obj => obj.name === name)
  state.order[index].id = id
}
export function RESET_FLAT (state) {
  console.log('reset flat')
  const freshState =  getDefaultState()
  console.log('new state is')
  console.log(freshState)
  Object.assign(state.flat, freshState.flat)
  state.created=freshState.created
  state.errors=freshState.errors
  state.files=freshState.files
  state.filesUploaded=freshState.filesUploaded
  state.isEditing=freshState.isEditing
  state.photosLoaded=freshState.photosLoaded
  state.photosTotal=freshState.photosTotal
  state.phoneValid=freshState.phoneValid
  state.title=freshState.title
  state.uploadStarted=freshState.uploadStarted
}
export function CLEAR_FILTERS(state) {
const filters=defaultFilters
  Object.assign(state.filters, filters)
}
