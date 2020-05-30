import {default as apiClient} from 'src/services/axios'

export default {
  getProfile (id) {
    let request = `/profile/view?id=${id}&expand=agency,user`
    return apiClient.get(request, id)
  },
  editProfile (profile) {
    let request = '/profile/update'
    return apiClient.post(request, profile)
  },
  searchAgents (page, fetchCount, filter, sortBy, descending) {
    console.log('filter inside', filter)
    let filterString = ''

    Object.keys(filter).forEach(key => {
        if (filter[key] !== '' && filter[key] !== null&& filter[key] !== NaN) {
          if(Array.isArray(filter[key])){
            if(filter[key].length>0){
              filterString += `&${key}=` + filter[key]
            }
          }else{
            filterString += `&${key}=` + filter[key]
          }
        }
      }
    )
    let sort=null
    let params
    if(sortBy!==''&&sortBy!==null){
      sort = descending?'-'+sortBy:sortBy
      params = { page, sort }
    }else{
       params = { page}
    }



    console.log(filterString)

    let request = '/user/agentSearch?' + Object.keys(params).map(key => key + '=' + params[key]).join('&')

    if (filterString !== '') {
      request += filterString
    }

    if (fetchCount !== '') {
      request += `&per-page=${fetchCount}`
    }
    request += '&expand=agency,profile'

    console.log(request)

    return apiClient.get(request)
  }

}
