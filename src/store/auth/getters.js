import { Ability } from '@casl/ability'
import defineAbilitiesFor from 'src/rules/rules'
export const isAuthenticated = state => !!state.token
export const rules = state => state.rules
export const tokenChecked = state => state.tokenChecked
export const ability = state => {
  let permissions = state.permissions
  let profile = state.profile
  let rules = defineAbilitiesFor({ profile, permissions }).rules
  //ability.update(rules)
  return new Ability(rules, { subjectName: (subject) => {
    if (typeof subject === 'object') {
      return subject.modelName
    }
    return !subject || typeof subject === 'string' ? subject : subject.type
  }
  })
}
export const profile = state => {
  return state.profile
}
import { getField } from 'vuex-map-fields'
export { getField }


export const getProfile= state => id =>{
  if(Object.entries(state.profiles).length > 0)
  {
    let merged = Object.values(state.profiles)
    let profile=merged.find(el=>el.id===parseInt(id))
    return typeof profile==='undefined'?null:profile
  }
  return null
}
