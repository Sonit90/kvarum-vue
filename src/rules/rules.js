import { AbilityBuilder, Ability } from '@casl/ability'
import ruleSet from './ruleSet'
export default function defineAbilitiesFor ({ profile, permissions }) {
if(permissions!==null&&typeof profile!=='undefined'&&profile!==null){



  const { rules, can } = AbilityBuilder.extract()
  if(rules===null){
    return new Ability()
  }


  for (let key in permissions) {
    // key - название разрешения
    // permissions.key - объект разрешения (нам нужно только имя)
    let name = permissions[key]['name']
    let rule = ruleSet.get(name)
    if (typeof rule !== 'undefined') {
      if (typeof rule.who !== 'undefined') {
        let condition={ [rule.who.name]: parseInt(profile[rule.who.param]) }
        can(rule.name, rule.target,condition )
      } else {
        can(rule.name, rule.target)
      }
    }
  }

  if (typeof profile.roles!=='undefined'&&profile.roles.includes('admin')) {
    can('edit', 'agencies')
    can('admin', 'site')
  }

  if (typeof profile.type!=='undefined'&&profile.type==='agencyAgent'||profile.type==='privateAgent') {
    can('be', 'agent')
  }
  can('be', 'logged')

  console.log(rules)
  return new Ability(rules)
}
else{
  return new Ability([])
}
}
