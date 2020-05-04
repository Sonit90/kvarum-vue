import YmapPlugin from 'vue-yandex-maps'

export default async ({ Vue }) => {
  const settings = {
    apiKey: 'b6c98afa-fdb8-4409-9de1-cbf9e70850c3',
    lang: 'ru_RU',
    coordorder: 'latlong',
    version: '2.1'
  }
  Vue.use(YmapPlugin, settings)
}
