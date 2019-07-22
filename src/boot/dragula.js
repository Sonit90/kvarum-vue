import { Vue2Dragula } from 'vue2-dragula'
import 'dragula/dist/dragula.css'
// import something here

// "async" is optional
export default async ({ Vue }) => {
  Vue.prototype.$dragula = Vue2Dragula
  Vue.use(Vue2Dragula, {
    logging: {
      service: true // to only log methods in service (DragulaService)
    }
  })
}
