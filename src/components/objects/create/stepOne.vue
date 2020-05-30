<template>
  <div>
    <div
      class="row q-mb-md"
      :class="$q.screen.gt.md?'q-col-gutter-lg':''"
    >
      <q-input
        v-model="address"
        class="col-12 col-md-7 col-xs-12"
        :class="$q.screen.lt.md?'q-mb-sm':''"
        :loading="loadingAddress"
        outlined
        :debounce="1500"
        :error="$v.address.$error"
        label="Адрес"
        hint="Укажите адрес объекта (улица и номер здания)"
        clearable
        @input="addressChange"
        @blur="addressBlur"
      >
        <template #prepend>
          <span class="text-negative">*</span>
        </template>
        <template #error>
          <span v-if="!$v.address.required">Укажите адрес </span>
          <span v-if="!$v.address.server">{{ errors.get('address').join(' ') }}</span>
        </template>
      </q-input>
      <q-select
        v-model.trim="sub_locality_name"
        class="col-12  col-md-5 col-xs-12"
        outlined
        fill-input
        input-debounce="0"
        :options="subLocalities"
        emit-value
        :error="$v.sub_locality_name.$error"
        label="Район"
        @input="clearServerError('sub_locality_name')"
      >
        <template #error>
          <span v-if="!$v.sub_locality_name.required">Выберите район </span>
          <span v-if="!$v.sub_locality_name.server">{{ errors.get('sub_locality_name').join(' ') }}</span>
        </template>
        <template #option="scope">
          <q-item
            :dense="scope.opt.readonly===true"
            v-bind="scope.itemProps"
            v-on="scope.itemEvents"
          >
            <q-item-section>
              <q-item-label :class="scope.opt.readonly===true?'text-blue-grey-3':''">
                {{ scope.opt.label }}
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-separator v-if="scope.opt.readonly===true" />
        </template>
        <template #prepend>
          <span class="text-negative">*</span>
        </template>
      </q-select>
    </div>
    <div class="row q-my-sm">
      <yandex-map
        :coords="coords"
        zoom="16"
        ymap-class="map"
        @click="mapClick"
        @map-was-initialized="mapInit"
      >
        <ymap-marker
          v-if="mapWasInit&&!loadingAddress"
          :coords="coords"
          marker-id="address"
          :icon="markerIcon"
        />
      </yandex-map>
    </div>
    <p class="text-h6">
      Информация о доме
    </p>
    <FlatProp title="Год постройки">
      <div class="row">
        <q-input
          v-model.number="build_year"
          outlined
          style="width: 150px;"
          clearable
          class="non-selectable"
        />
        <q-checkbox
          v-model="not_built"
          label="Не сдан"
          class="non-selectable"
          :false-value="0"
          :true-value="1"
          :toggle-indeterminate="false"
        />
      </div>
    </FlatProp>
    <FlatProp title="Тип дома">
      <q-btn-toggle
        v-model="building_type"
        clearable
        toggle-color="primary"
        :options="buildingTypes"
        no-caps
        rounded
        :size="$q.screen.lt.md?'13px':'md'"
        :dense="$q.screen.lt.md"
      />
      <!--      <q-select-->
      <!--        v-model="building_type"-->
      <!--        filled-->
      <!--        :options="buildingTypes"-->
      <!--        label="Тип дома"-->
      <!--      />-->
    </FlatProp>
    <FlatProp title="Тип парковки">
      <q-btn-toggle
        v-model="parking_type"
        clearable
        toggle-color="primary"
        :options="parkingTypes"
        no-caps
        rounded
        :size="$q.screen.lt.md?'13px':'md'"
        :dense="$q.screen.lt.md"
      />
    </FlatProp>
    <!--    <div class="row  q-gutter-sm">-->
    <!--      <div class="col col-md-5 flex">-->
    <!--        <q-input-->
    <!--          v-model.number="buildYear"-->
    <!--          label="Год постройки"-->
    <!--          style="width: 150px;"-->
    <!--        />-->
    <!--        <q-checkbox-->
    <!--          v-model="not_built"-->
    <!--          label="Не сдан"-->
    <!--          :false-value="0"-->
    <!--          :true-value="1"-->
    <!--          :toggle-indeterminate="false"-->
    <!--        />-->
    <!--      </div>-->
    <!--      <div class="col">-->
    <!--        <q-select-->
    <!--          v-model="building_type"-->
    <!--          filled-->
    <!--          :options="buildingTypes"-->
    <!--          label="Тип дома"-->
    <!--        />-->
    <!--      </div>-->
    <!--      <div class="col">-->
    <!--        <q-select-->
    <!--          v-model="parking_type"-->
    <!--          filled-->
    <!--          :options="parkingTypes"-->
    <!--          label="Тип парковки"-->
    <!--        />-->
    <!--      </div>-->
    <!--    </div>-->

    <!--    <q-input filled v-model="appartment" label="Номер квартиры"  hint="Укажите номер квартиры." style="width: 450px; padding-bottom: 32px" />-->
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import FlatProp from "components/general/FlatProp"
import serverErrorVuex from "src/mixins/serverErrorVuex"
// let districts = []
// districts.push({
//   'areas': ['Белгородская', 'Брянская', 'Владимирская', 'Воронежская', 'Ивановская', 'Калужская', 'Костромская', 'Курская', 'Липецкая', 'Московская', 'Орловская', 'Рязанская', 'Смоленская', 'Тамбовская', 'Тверская', 'Тульская', 'Ярославская', 'Москва'],
//   'id': '1',
//   'name': 'Центральный федеральный округ'
// })
// districts.push({
//   'areas': ['Адыгея', 'Калмыкия', 'Краснодарский', 'Астраханская', 'Волгоградская', 'Ростовская'],
//   'id': '2',
//   'name': 'Южный федеральный округ'
// })
// districts.push({
//   'areas': ['Карелия', 'Коми', 'Архангельская', 'Вологодская', 'Калининградская', 'Ленинградская', 'Мурманская', 'Новгородская', 'Псковская', 'Санкт-Петербург', 'Ненецкий'],
//   'id': '3',
//   'name': 'Северо-Западный федеральный округ'
// })
// districts.push({
//   'areas': ['Саха /Якутия/', 'Камчатский', 'Приморский', 'Хабаровский', 'Амурская', 'Магаданская', 'Сахалинская', 'Еврейская', 'Чукотский'],
//   'id': '4',
//   'name': 'Дальневосточный федеральный округ'
// })
// districts.push({
//   'areas': ['Алтай', 'Бурятия', 'Тыва', 'Хакасия', 'Алтайский', 'Забайкальский', 'Красноярский', 'Иркутская', 'Кемеровская', 'Новосибирская', 'Омская', 'Томская'],
//   'id': '5',
//   'name': 'Сибирский федеральный округ'
// })
// districts.push({
//   'areas': ['Курганская', 'Свердловская', 'Тюменская', 'Челябинская', 'Ханты-Мансийский Автономный округ - Югра', 'Ямало-Ненецкий'],
//   'id': '6',
//   'name': 'Уральский федеральный округ'
// })
// districts.push({
//   'areas': ['Башкортостан', 'Марий Эл', 'Мордовия', 'Татарстан', 'Удмуртская', 'Чувашская', 'Кировская', 'Нижегородская', 'Оренбургская', 'Пензенская', 'Ульяновская', 'Самарская', 'Саратовская', 'Пермский'],
//   'id': '7',
//   'name': 'Приволжский федеральный округ'
// })
// districts.push({
//   'areas': ['Дагестан', 'Ингушетия', 'Кабардино-Балкарская', 'Карачаево-Черкесская', 'Северная Осетия - Алания', 'Чеченская', 'Ставропольский'],
//   'id': '8',
//   'name': 'Северо-Кавказский федеральный округ'
// })
//
// const ruRegions = districts.map(function (value, index) { return value['name'] })
// let ruAreas = districts.filter(function (value, index) { return value['id'] === '4' })
// ruAreas = ruAreas[0]['areas']
// let ruLocalities = ['Хабаровск']

export default {
  name: 'StepOne',
  mixins:[serverErrorVuex],
  components: {FlatProp},
  data () {
    return {
      loadingAddress:false,
      ymaps: null,
      coords: [48.46, 135.11],
      mapWasInit: false,
      markerIcon: {
        layout: 'islands#blueIcon',
        content: 'Введите адрес, или укажите место на карте'
      },
      additionalOptions: [{ label: 'Интернет', value: 'Интернет' }, { label: 'Холодильник', value: 'Холодильник' }, { label: 'Мебель на кухне', value: 'Мебель на кухне' }, { label: 'Кондиционер', value: 'Кондиционер' }, { label: 'Мебель в жилой', value: 'Мебель в жилой' }, { label: 'Лифт', value: 'Лифт' }, { label: 'Мусоропровод', value: 'Мусоропровод' }, { label: 'Консьерж', value: 'Консьерж' }, { label: 'Закрытая территория', value: 'Закрытая территория' }]

    }
  },
  computed: {
    ...mapFields(
      'flats',
      [
        'flat',
        'flat.address',
        'flat.sub_locality_name',
        'flat.build_year',
        'flat.not_built',
        'flat.building_type',
        'flat.parking_type',
        'flat.appartment',
        'flat.rooms_total',
        'flat.latitude',
        'flat.longtitude',
        'subLocalities',
        'buildingTypes',
        'parkingTypes'
      ]
    ),
    $v(){
      return this.validations.$v
    }
  },
  inject:{
    validations: {
      from: 'validations'
    }
  },
  methods: {
    setCoords(coords){
      this.latitude=coords[0]
      this.longtitude=coords[1]
    },
    addressBlur () {
      if(this.address!==null&&this.address!==''){
      this.addressGeocode('г.Хабаровск' + this.address, true)
        this.$v.address.$touch()
      }
      },
    addressChange () {
      this.clearServerError('address')
      this.addressGeocode(this.address)
    },
    addressGeocode (streetAddress, setAddress) {
      if (typeof setAddress==='undefined') setAddress=false
      /*eslint-disable */
      this.loadingAddress=true
      ymaps.geocode(streetAddress, { kind: 'street' }).then(res=> {
        // console.log(res)

        let firstGeoObject = res.geoObjects.get(0)
        console.log(firstGeoObject.getAddressLine())
        // console.log(firstGeoObject)
        let address =  firstGeoObject.getAddressLine()
        console.log(address)
        this.markerIcon.content = address
        this.coords = firstGeoObject.geometry.getCoordinates()
        this.setCoords(this.coords)
        this.loadingAddress=false
        if(setAddress){
          this.address = address
        }

      })
      /* eslint-enable */
    },
    geoCode (coords, street) {
      /*eslint-disable */
      ymaps.geocode(coords).then(res=> {
        // console.log(res)
        let firstGeoObject = res.geoObjects.get(0)
        // console.log( firstGeoObject.getLocalities())
        // console.log(firstGeoObject.getAdministrativeAreas())
        // console.log( firstGeoObject.getThoroughfare())
        // console.log( firstGeoObject.getPremise())
        // console.log( firstGeoObject.getPremiseNumber())
        // console.log(firstGeoObject.getAddressLine())
        // console.log(firstGeoObject)
        let address =  firstGeoObject.getAddressLine()
        // console.log(address)
        this.address =address
        this.markerIcon.content = address
        this.coords = firstGeoObject.geometry.getCoordinates()
        this.setCoords(this.coords)
        this.loadingAddress=false
      })
      /* eslint-enable */
    },
    mapClick (e) {
      // console.log(e)
      let evt = e._sourceEvent.originalEvent
      this.loadingAddress=true
      let coords = evt.coords
      console.log(coords)
      this.geoCode(coords)
      this.clearServerError('address')
      // TODO Cache map coords
    },
    mapInit (map) {
      // this.map = map
      console.log('map init')
      console.log(map)
      if (this.address !== null && typeof this.address !== 'undefined' && this.address !== '') {
        this.loadingAddress=true
        this.addressGeocode('г.Хабаровск' + this.address,true)
        //this.markerIcon.content = this.flat.address
      }

      this.mapWasInit = true
      // this.ymaps = map
    }
  },
}
</script>
<style>
    .required-input .q-field__before{
        align-items: flex-start;
        padding-right: 5px;
    }
    .map, .ymap-container{
      height: 350px;
    }
    @media (max-width: 425px) {
      .map, .ymap-container{
        height: 230px;
        min-height: 230px;
      }
    }
</style>
<style scoped>
  .map, .ymap-container{
    width: 100%;
    height: 350px;
    margin: 0 auto;
  }
  @media (max-width: 425px) {
    .map, .ymap-container{
      height: 230px;
      min-height: 230px;
    }
  }
</style>
