import {mapFields} from "vuex-map-fields";
export default {
  computed: {
    ...mapFields(
      'flats',
      [
        'errors'
      ]
    )
  },
  methods: {
    collectErrors (errors) {
      this.errors = new Map(Object.entries(errors))
      let keys = Object.keys(errors)
      keys.forEach((key)=> {
        this.$v[key].$touch()
      })
    },
    clearServerError (field) {
      if (this.errors.has(field)) { // удаляем ошибку, только если есть серверные ошибки
        this.errors.delete(field)
        this.$v[field].$touch()
      }
    },
    hasServerError (field) {
      return this.errors.has(field)
    }
  }
}
