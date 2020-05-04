export default {
  data () {
    return {
      errors: new Map()
    }
  },
  methods: {
    collectErrors (errors) {
      this.errors = new Map(Object.entries(errors))
      console.log(this.errors)
    },
    clearServerError (field, varName='form') {
      if (this.errors.has(field)) { // удаляем ошибку, только если есть серверные ошибки
        this.errors.delete(field)
        this.$v[varName][field].$touch()
      }
    },
    hasServerError (field) {
      return this.errors.has(field)
    }
  }
}
