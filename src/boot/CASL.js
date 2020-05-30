import { abilitiesPlugin } from '@casl/vue'
//import { Ability } from '@casl/ability'
import store from '../store'
export default async ({ Vue }) => {
  // let rules = AuthStore.getters.rules
  // console.log(rules)
  // const ability = new Ability([], { subjectName: (subject) => {
  //   if (typeof subject === 'object') {
  //     return subject.modelName
  //   }
  //   return !subject || typeof subject === 'string' ? subject : subject.type
  // } })
  // console.log(store.getters)
  // console.log(store.getters['auth/ability'])
  //Vue.use(abilitiesPlugin, ability)
  Vue.use(abilitiesPlugin, store.getters['auth/ability'])
}
