import VueCurrencyInput from 'vue-currency-input'
export default async ({ Vue }) => {
  const pluginOptions = {
    currency: 'RUB',
    locale: 'ru-RU',
    decimalLength: 0,
    distractionFree: false
  }
  Vue.use(VueCurrencyInput, pluginOptions)
}
