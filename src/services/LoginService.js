import {default as apiClient} from 'src/services/axios'

export default {
  login (email, password) {
    return apiClient.post('/user/login/', { email, password })
  },
  check(token){
    return apiClient.post('/user/check/', { token })
  },
  loginAs(token){
    return apiClient.post('/user/login-as/', { token })
  },
  register (name, surname, email, password, agency, noAgency, myAgency, type) {
    return apiClient.post('/user/register/', { name, surname, email, password, agency, noAgency, myAgency, type })
  },
  confirm (id, code) {
    return apiClient.post('/user/confirm/', { id, code })
  },
  forgotPassword (email) {
    return apiClient.post('/user/forgot-password/', { email })
  },
  resend (email) {
    return apiClient.post('/user/resend/', { email })
  },
  resetPassword (password, id, code) {
    return apiClient.post('/user/reset-password/', { password, id, code })
  },
  changePassword(password, newPassword, newPasswordRepeat) {
    return apiClient.post('/user/change-password/', { password, newPassword, newPasswordRepeat })
  }
}
