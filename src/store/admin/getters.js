import { getField } from 'vuex-map-fields'
export { getField }
// export const getUser= state => id =>{
//   return state.users.find(i=>i.id===parseInt(id))
// }

export const getUser= state => id =>{
  if(Object.entries(state.users).length > 0)
  {
    let user=Object.values(state.users).find(el=>parseInt(el.id)===parseInt(id))
    return typeof user==='undefined'?null:user
  }
  return null

}
