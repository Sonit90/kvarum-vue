import { LocalStorage } from 'quasar'
export default async ({ store }) => {
  let token =LocalStorage.getItem('token')
  if(token!==null&&token!==''){
    console.log('check token before app load')
    console.log(token)
    store.dispatch('auth/checkToken', token)
  }
}
