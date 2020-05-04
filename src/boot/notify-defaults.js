import { Notify } from 'quasar'

Notify.setDefaults({
  position: 'top-right',
  timeout: 3500,
  textColor: 'white',
  actions: [{ icon: 'close', color: 'white' }]
})
