import Vue from 'vue'
import VueRouter from 'vue-router'
import {LocalStorage, Notify} from 'quasar'
import store from '../store' // your vuex store
import routes from './routes'


Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */
const Router = new VueRouter({
  base: process.env.VUE_ROUTER_BASE,
  mode: process.env.VUE_ROUTER_MODE,

  // Leave these as is and change from quasar.conf.js instead!
  // quasar.conf.js -> build -> vueRouterMode
  // quasar.conf.js -> build -> publicPath
  routes,
  scrollBehavior: () => ({ x: 0, y: 0 })
})

function rejectRoute(permission, next){
  let redirect= typeof permission.redirect!=='undefined'?permission.redirect:'/login'
  let message = typeof permission.message!=='undefined'?permission.message:'Чтобы просматривать это содержимое вы должны войти на сайт'
  Notify.create({message: message})
  return next(redirect)
}

function checkPermission(permission, ability, next){

  let name = permission.name
  let target = permission.target
  let who =typeof permission.who!=='undefined'?permission.who:null
  let condition
  if(who!==null){
    let profile = store.getters['auth/profile']
    if(profile===null){
      return rejectRoute(permission, next)
    }

    condition={modelName:target , [who.name]: parseInt(profile[who.param]) }
  }else{
    condition=target
  }
  console.log(ability)
  console.log(ability.rules)
  console.log(ability.can('create', 'flat'))
  if(!ability.can(name, condition)){
    return rejectRoute(permission, next)
  }
  store.commit('flats/EMPTY_TITLE')

  return next()
}

Router.beforeEach((to, from, next) => {
  console.log(to)
  if(typeof to.meta!=='undefined'&&typeof to.meta.permissions!=='undefined'){
    let permission = to.meta.permissions
    let ability = store.getters['auth/ability']
      if(typeof ability.rules==='undefined'|| ability.rules.length===0){
        console.log('no rules found')
        let token =LocalStorage.getItem('token')
        if(token!==null&&token!==''){
          store.dispatch('auth/checkToken', token).then(()=>{
            return checkPermission(permission, ability, next)
          })
        }
      }else{
        return checkPermission(permission, ability, next)
      }

  }
  store.commit('flats/EMPTY_TITLE')
  next()
})
export default Router
