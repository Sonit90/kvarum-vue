import AgencyService from 'src/services/AgencyService.js'

export function getAgency ({ commit, state, getters }, id ) {
  let agency=getters.getAgency(id)
  if(agency!==null){
    return {data:agency}
  }


  return AgencyService.getAgency(id ).then((response) => {
    return response
  })
}
export function getRequests ({},{page,rowsPerPage}) {
  return AgencyService.getRequests({page,rowsPerPage}).then((response) => {
    return response
  })
}


export function acceptRequest ({},payload) {
  return AgencyService.acceptRequest(payload ).then((response) => {
    return response
  })
}

export function declineRequest ({}, payload) {

  return AgencyService.declineRequest(payload ).then((response) => {
    return response
  })
}



export function getAgencies ({ commit, state, getters }, page = -1) {
  if(getters.getAgencies(page)!==null){
    return {data:getters.getAgencies(page)}
  }

  return AgencyService.getAgencies(page).then((response) => {
      console.log(response)
    let data=response.data
    if(page===-1){
      let pageSize=10
      let pages=Math.ceil(response.data.length/pageSize)
      commit('SET_AGENCIES', {pages,pageSize,data})
      commit('SET_COUNT', response.data.length)
      commit('SET_PAGE_COUNT', pages)
    }else{
      commit('SET_AGENCIES_PAGE',{page,data}  )
      commit('SET_COUNT', response.headers['x-pagination-total-count'])
      commit('SET_PAGE_COUNT', response.headers['x-pagination-page-count'])
    }
      return response
    })
}

export function getTreeAgencies ({ commit, state }) {
  return AgencyService.getTreeAgencies().then((response) => {
    // console.log(`Total events are ${response.headers['x-pagination-total-count']}`)
    // commit('SET_TICKETS', response.data)
    // commit('SET_COUNT', response.headers['x-pagination-total-count'])
    return response
  })
}

export function addAgency ({ commit, state }, { title, parentId }) {
  return AgencyService.addAgency({ parentId, title }).then((response) => {
    return response
  })
}
export function deleteAgency ({ commit, state }, { id }) {
  return AgencyService.deleteAgency({ id }).then((response) => {
    return response
  })
}

export function updateAgency ({ commit, state }, { node }) {
  return AgencyService.updateAgency({ node }).then((response) => {
    return response
  })
}
