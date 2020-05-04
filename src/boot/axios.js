import axios from 'axios'
import {setAuthHeader} from 'src/services/axios'
import {LocalStorage} from "quasar";
export default async ({ Vue }) => {
  Vue.prototype.$axios = axios
  let token =LocalStorage.getItem('token')
  if(token!==null&&token!==''){
    setAuthHeader(token)
  }
}
