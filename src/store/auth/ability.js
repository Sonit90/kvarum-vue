import defineAbilitiesFor from 'src/rules/rules'
export default (store) => {
  let ability = store.getters['auth/ability']

  return store.subscribe((mutation) => {
    switch (mutation.type) {
      case 'auth/SET_PERMISSIONS':
        console.log('setting rules')
        let permissions = mutation.payload.permissions
        let profile = mutation.payload.profile
        let rules = defineAbilitiesFor({ profile, permissions }).rules
        ability.update(rules)
        store.rules=rules
        break
      case 'auth/REMOVE_TOKEN':
        console.log('remove token in ability')
        ability.update([])
        break
    }
  })
}
