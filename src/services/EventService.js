import {default as apiClient} from 'src/services/axios'

const parameterizeArray = (key, arr) => {
  arr = arr.map(encodeURIComponent)
  return '&' + key + '[]=' + arr.join('&' + key + '[]=')
}

export default {
  createFirm ({ title, parentId }) {
    console.log('Создание фирмы в EventService')
    return apiClient.post('/firm/create/', { parentId, title })
  },
  createFlat (flat) {
    console.log(flat)
    console.log('Создание квартиры в EventService')
    return apiClient.post('/flats/create', flat)
  },
  updateFlat (flat) {
    console.log(flat)
    console.log('Редактирование квартиры в EventService')
    return apiClient.post('/flats/update', flat)
  },
  deleteFirm ({ id }) {
    console.log('Удаление фирмы в EventService')
    return apiClient.post('/firm/delete/', { id })
  },
  deleteImage ({ uniqueId, order, obj_id  }) {
    console.log('Удаление фото в EventService')
    return apiClient.post('/images/delete', { uniqueId, order, obj_id  })
  },
  rotateImage({ uniqueId, obj_id, angle }){
    console.log('Поворот фото в EventService')
    return apiClient.post('/images/rotate', { uniqueId, obj_id, angle })
  },
  orderChange({ order, id  }) {
    console.log('Изменился порядок фото в EventService')
    return apiClient.post('/flats/order-change', {order, id  })
  },
  finalize ({ id, order }) {
    console.log(order)
    console.log('Завершающий этап создания квартиры в EventService')
    return apiClient.post('/flats/finalize', { id, order })
  },
  getFirmProfiles ({ id }) {
    console.log('getting firm profiles in EventService')
    console.log(id)
    return apiClient.get(`/profile/?per-page=100&firm=${id}`)
  },
  getFirms () {
    console.log('getting firms in EventService')
    let request = '/firm/index'
    return apiClient.get(request)
  },
  getFlat (id) {
    console.log('getting flat in EventService')
    return apiClient.get(`/flats/view?id=${id}&expand=sortimages,profile,agency`)
  },
  getTableObjects (page, pageSize, filters, sortBy, expand) {
    // console.log('getting table objects in EventService')
    let sort = sortBy

    let params
    if (sort !== null) {
      params = { page, sort }
    } else {
      params = { page }
    }

    let request = '/flats/?' + Object.keys(params).map(key => key + '=' + params[key]).join('&')
    if (filters !== null) {
      // request += '&' + JSON.stringify(filters)
      let parsedFilters = this.parseFilters(filters)
      if (parsedFilters !== null) {
        request += '&' + parsedFilters
      }
    }
    // console.log(expand)
    if (expand !== '') {
      request += '&expand=' + expand.join()
    }
    request += '&status=created'

    if (pageSize !== '') {
      request += `&perPage=${pageSize}`
    }

    // console.log(request)

    return apiClient.get(request)
  },
  newFlat (flat) {
    return apiClient.post('/flats/new', flat)
  },
  openTicket (id) {
    return apiClient.post('/tickets/open/', { id })
  },
  parseFilters (filters) {
    let parsed = null
    parsed = Object.keys(filters).map(
      function (key, index) {
        if (filters[key] !== null && typeof filters[key] !== 'undefined') {
          if (Array.isArray(filters[key])) {
            if (filters[key].length > 0) {
              return key + '=' + filters[key]
            }
          } else {
            return key + '=' + filters[key]
          }
        }
      }).filter(item => item).join('&')
    // console.log((parsed))
    return parsed
  },
    updateFirm ({ node }) {
    console.log('Изменение фирмы в EventService')
    return apiClient.post('/firm/update/', { node })
  }
}
