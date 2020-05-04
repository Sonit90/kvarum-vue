import axios from 'axios'

const axiosApi = axios.create({
  baseURL: '/api',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  timeout: 20000,
  withCredentials: true
})


export const setAuthHeader = (token) => {
  axiosApi.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

export default axiosApi;
