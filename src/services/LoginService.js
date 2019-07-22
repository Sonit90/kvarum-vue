import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://new-printax.ru/api/',
  method: 'post',
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000
})
export default {
  login (email, password) {
    return apiClient.post('/login/', { email, password })
  }
}
