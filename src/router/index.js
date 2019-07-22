import Vue from 'vue'
import VueRouter from 'vue-router'
import { Notify, LocalStorage } from 'quasar'

import routes from './routes'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ x: 0, y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  Router.beforeEach((to, from, next) => {
    // redirect to login page if not logged in and trying to access a restricted page
    const publicPages = ['/login']
    const authRequired = !publicPages.includes(to.path)
    const loggedIn = LocalStorage.getItem('auth') === 'authenticated'

    if (authRequired && !loggedIn) {
      Notify.create({
        message: 'Чтобы просматривать это содержимое вы должны войти на сайт'
      })
      console.log('going back to login page')
      return next('/login')
    }

    next()
  })
  return Router
}
