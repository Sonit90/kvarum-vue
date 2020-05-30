import { getField } from 'vuex-map-fields'
export { getField }
export const getStepOne = state => state.stepOne
export const getOrderKeyByName = state => name => state.order.find(e => e.name === name)
export const getFlat= state => id =>{
  if(Object.entries(state.flats).length > 0)
  {
     return Object.values(state.flats).find(flat => flat.id === id)
  }
  return null
}
