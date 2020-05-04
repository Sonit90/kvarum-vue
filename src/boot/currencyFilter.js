
export default async ({ Vue }) => {
  Vue.filter('toCurrency', function (value) {
    if(value===null){
      return undefined
    }
    if (typeof parseInt(value) !== 'number') {
      return value
    }
    let formatter = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0
    })
    return formatter.format(parseInt(value))
  })
}
