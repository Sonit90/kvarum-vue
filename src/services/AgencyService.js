import {default as apiClient} from 'src/services/axios'

import { LocalStorage } from 'quasar'

//axios.defaults.headers.common['Authorization'] = 'Bearer ' + LocalStorage.getItem('token', '')
// let apiClient
//
// apiClient = axios.create({
//   baseURL: '/api',
//   headers: {
//     Accept: 'application/json',
//     'Content-Type': 'application/json'
//   },
//   timeout: 10000,
//   withCredentials: true
// })

export default {
  addAgency ({ title, parentId }) {
    console.log('creating agency in AgencyService')
    let request = '/agencies/create'
    return apiClient.post(request, { parentId, title })
  },
  deleteAgency ({ id }) {
    console.log('deleting agency in AgencyService')
    let request = '/agencies/delete'
    return apiClient.post(request, { id })
  },
  getAgencies (page = -1) {
    console.log('getting agencies in AgencyService')
    let request = '/agencies/index?page=' + page
    return apiClient.get(request)
  },
  getAgency ( id ) {
    console.log('getting agencies in AgencyService')
    let request = '/agencies/view/?id=' + id

    return apiClient.get(request)
  },
  getTreeAgencies () {
    console.log('getting tree agencies in AgencyService')
    let request = '/agencies/tree'
    return apiClient.get(request)
  },
  updateAgency ({ node }) {
    console.log('updating agency in AgencyService')
    let request = '/agencies/update'
    return apiClient.post(request, { node })
  },
  acceptRequest(payload){
    let request = '/agency-requests/accept'
    return apiClient.post(request, payload)
  },
  declineRequest(payload){
    let request = '/agency-requests/decline'
    return apiClient.post(request, payload)
  },
  getRequests ( {page,rowsPerPage} ) {
    page = (typeof page === 'undefined') ? 0 : page

    rowsPerPage = (typeof rowsPerPage === 'undefined') ? 10 : rowsPerPage
    console.log('getting requests in AgencyService')
    let request = '/agency-requests/?expand=profile,agency&page=' + page+'&per-page='+rowsPerPage

    return apiClient.get(request)
  },
}
