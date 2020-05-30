import { getField } from 'vuex-map-fields'
export { getField }
export const getAgencies= state => page =>{
  if(page!==-1&&typeof state.agencies[page] !=='undefined'&&state.agencies[page].length>0) {
    //console.log(state.agencies[page])
    return state.agencies[page]
  }
  return null
}

export const getAgency= state => id =>{
  if(Object.entries(state.agencies).length > 0)
  {
    let merged = [].concat(...Object.values(state.agencies))
    let agency=merged.find(el=>parseInt(el.id)===parseInt(id))
    console.log(agency)
    return typeof agency==='undefined'?null:agency
  }
  return null

}
