import { updateField } from 'vuex-map-fields'
export { updateField }
export function SET_AGENCIES (state, {pages,pageSize,data}) {
  for (let i = 0; i < pages; i++) {
    state.agencies[i] = data.slice(i*pageSize, (i+1)*pageSize)
  }

}
export function SET_AGENCIES_PAGE (state, {page,data}) {
  state.agencies[page] = data
}

export function SET_COUNT (state, count) {
  state.count = parseInt(count)
}
export function SET_PAGE_COUNT (state, count) {
  state.pageCount = parseInt(count)
}
