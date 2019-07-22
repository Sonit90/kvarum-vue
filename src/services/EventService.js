import axios from 'axios'

import { LocalStorage } from 'quasar'

const apiClient = axios.create({
  baseURL: 'http://new-printax.ru/api/',
  withCredentials: true,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + LocalStorage.getItem('token', '')
  },
  timeout: 10000
})

// apiClient.interceptors.request.use(
//   config => {
//     const token = LocalStorage.getItem('token', '')
//     // config.headers.Authorization
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   error => Promise.reject(error)
// )

const parameterizeArray = (key, arr) => {
  arr = arr.map(encodeURIComponent)
  return '&' + key + '[]=' + arr.join('&' + key + '[]=')
}

export default {
  getFirms () {
    console.log('getting firms in EventService')
    let request = '/firm/index'
    return apiClient.get(request)
  },
  createFirm ({ title, parentId }) {
    console.log('Создание фирмы в EventService')
    return apiClient.post('/firm/create/', { title, parentId })
  },

  getTickets (perPage, page, assignedTo, statuses) {
    console.log('getting tickets in EventService')
    var request = `/tickets/?per-page=${perPage}&_page=${page}&expand=profile,firm,assign&assigned_to=${assignedTo}`
    if (statuses !== '') {
      request += parameterizeArray('status', statuses)
    }
    console.log(request)
    return apiClient.get(request)
    // return apiClient.get('/tickets/3');
  },
  getTicket (id) {
    return apiClient.get(`/tickets/${id}`)
  },
  postTicket (ticket) {
    return apiClient.post('/tickets', ticket)
  },
  closeTicket ({ id, reason, comment }) {
    console.log('Закрытие тикета в EventService')
    return apiClient.post('/tickets/close/', { id, reason, comment })
  },
  createTicket ({ section, priority, finishDue, title, description }) {
    console.log('Создание тикета в EventService')
    return apiClient.post('/tickets/create/', { section, priority, finishDue, title, description })
  },
  takeTicket (id) {
    console.log('Берём тикет в работу в EventService, id=' + id)
    return apiClient.post('/tickets/take/', { id })
  },
  startTicket (id) {
    console.log('Начинаем работу над тикетом в EventService, id=' + id)
    return apiClient.post('/tickets/start/', { id })
  },
  openTicket (id) {
    return apiClient.post('/tickets/open/', { id })
  }
}
