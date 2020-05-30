<template>
  <div
    class="row"
    :class="{'q-col-gutter-md':$q.screen.gt.sm, 'q-pa-md justify-center':!showProfile&&$q.screen.gt.md}"
  >
    <section
      v-if="showProfile"
      class="col-xs-12 row "
      :class="{'q-gutter-sm q-mb-md':$q.screen.gt.md}"
    >
      <q-btn
        v-go-back=" '/' "
        :flat="$q.screen.lt.md"
        :style="$q.screen.lt.md?'flex:1':''"
        icon="arrow_back"
        no-wrap
        no-caps
        align="around"
      >
        Назад
      </q-btn>
      <q-btn
        :style="$q.screen.lt.md?'flex:1':''"
        :flat="$q.screen.lt.md"
        icon="favorite_border"
        no-wrap
        no-caps
        align="around"
      >
        В избранное
      </q-btn>
      <q-btn
        :style="$q.screen.lt.md?'flex-basis: 20%;':''"
        :flat="$q.screen.lt.md"
        icon="share"
        no-wrap
        no-caps
        align="around"
      >
        <q-menu>
          <q-list style="min-width: 100px">
            <q-item
              v-if="$q.screen.lt.md"
              v-close-popup
              clickable
              tag="a"
              target="_blank"
              :href="waLink"
            >
              <q-item-section avatar>
                <q-icon
                  color="green-6"
                  name="fab fa-whatsapp"
                />
              </q-item-section>
              <q-item-section>Whatsapp</q-item-section>
            </q-item>

            <q-item
              v-close-popup
              clickable
              tag="a"
              target="_blank"
              :href="vkLink"
            >
              <q-item-section avatar>
                <q-icon
                  color="primary"
                  name="fab fa-vk"
                />
              </q-item-section>
              <q-item-section>Вконтакте</q-item-section>
            </q-item>
            <q-item
              v-close-popup
              clickable
              tag="a"
              target="_blank"
              :href="fbLink"
            >
              <q-item-section avatar>
                <q-icon
                  color="primary"
                  name="fab fa-facebook-f"
                />
              </q-item-section>
              <q-item-section>Facebook</q-item-section>
            </q-item>
            <q-item
              v-close-popup
              clickable
              @click="copyToClip"
            >
              <q-item-section avatar>
                <q-icon
                  color="primary"
                  name="content_copy"
                />
              </q-item-section>
              <q-item-section>Скопировать ссылку</q-item-section>
            </q-item>
          </q-list>
        </q-menu>

        <q-tooltip v-if="$q.screen.gt.sm">
          Поделиться
        </q-tooltip>
      </q-btn>
      <q-btn
        v-if="$can('edit',{modelName:'flat', ...flat} )"
        class="q-ml-sm"
        color="accent"
        icon="create"
        :to="{name:'object-edit',params:{id:flat.id}}"
      />
    </section>
    <section
      class="col-md-8  col-xs-12 q-gutter-y-md"
      :style="!showProfile?'max-width:1000px':''"
    >
      <q-card
        class="flex flex-direction-column FlatTopCard"
        :square="$q.screen.lt.md"
      >
        <q-card-section
          class="flex justify-between"
          :class="$q.screen.gt.xs?'q-pa-lg':'q-pa-md flex column'"
        >
          <div>
            <FlatTitle
              :flat="flat"
            />
            <q-badge
              v-show="$q.screen.gt.sm"
              outline
              text-color="primary"
              style="max-height: 20px"
            >
              {{ flat.created|timeAgo }}
            </q-badge>
          </div>
          <div :class="$q.screen.gt.sm?'text-right':'text-left'">
            <p class="text-h6 text-bold q-mb-none FlatPrice">
              {{ flat.price | toCurrency }}
            </p>
            <p
              v-if="pricePerM!==null"
              class="text-caption q-mb-xs"
            >
              {{ pricePerM| toCurrency }} за м <sup>2</sup>
            </p>
            <p
              v-if="flat.agent_fee"
              class="text-body1 q-mb-xs text-grey-8"
            >
              Услуги агентства: {{ flat.agent_fee | toCurrency }}
            </p>
            <template v-if="$can('be', 'agent')">
              <q-badge
                v-if="flat.agent_comission_type===1"
                class="q-pa-sm q-mb-sm"
                outline
                color="primary"
              >
                Встречное вознаграждение: {{ flat.agent_comission_fee| toCurrency }}
              </q-badge>

              <q-badge
                v-if=" flat.agent_comission_type===2"
                outline
                class="q-pa-sm q-mb-sm"
                color="primary"
              >
                Встречное вознаграждение: {{ agentComissionFee| toCurrency }}
                <q-tooltip>
                  {{ flat.agent_comission_fee }} процента
                </q-tooltip>
              </q-badge>
            </template>
            <!--            <p-->
            <!--             -->
            <!--              class="text-caption"-->
            <!--            >-->
            <!--              Бонус агента: {{ agentComissionFee| toCurrency }}-->
            <!--            </p>-->
          </div>
          <div v-show="$q.screen.lt.sm">
            <q-badge
              outline
              text-color="primary"
              style="max-height: 20px"
            >
              {{ flat.created|timeAgo }}
            </q-badge>
          </div>
        </q-card-section>
        <q-card-section :class="$q.screen.gt.xs?'q-px-lg':'q-px-md'">
          {{ flat.address }}
        </q-card-section>
        <q-card-section
          v-if="images!==null"
          class="q-pa-none ImageGalleryFlat"
        >
          <ImageGallery
            :images="images"
          />
        </q-card-section>
        <q-card-section :class="$q.screen.gt.xs?'q-pa-lg':'q-pa-md'">
          <q-list
            class="flex FlatPropertyList"
          >
            <FlatProperty
              v-if="flat.square"
              :title="flat.square"
              square
              caption="Площадь"
            />
            <FlatProperty
              v-if="flat.living_space"
              :title="flat.living_space"
              square
              caption="Жилая"
            />
            <FlatProperty
              v-if="flat.kitchen_space"
              :title="flat.kitchen_space"
              square
              caption="Кухня"
            />
            <FlatProperty
              v-if="flat.floor&&flat.total_floors"
              :title="flat.floor"
              :addition="'из '+flat.total_floors"
              caption="Этаж"
            />
            <FlatProperty
              v-if="flat.build_year&&parseInt(flat.not_built)!==1"
              :title="flat.build_year+ ' г.'"
              caption="Год постройки"
            />
            <FlatProperty
              v-if="flat.not_built"
              title="Не сдан"
              caption="Дом не сдан"
            />
          </q-list>
        </q-card-section>
        <q-card-section
          v-if="parseInt(flat.haggle)===1||parseInt(flat.mortgage)===1||flat.deal_status!==''"
          :class="$q.screen.gt.xs?'q-pa-lg':'q-pa-md'"
        >
          <q-list class="FlatDetailedList">
            <FlatDetailedProperty
              v-if="parseInt(flat.haggle)===1"
              title="Торг"
            >
              Возможен
            </FlatDetailedProperty>
            <FlatDetailedProperty
              v-if="parseInt(flat.mortgage)===1"
              title="Ипотека"
            >
              Возможна
            </FlatDetailedProperty>


            <!--            <q-badge-->
            <!--              v-if="parseInt(flat.haggle)===1"-->
            <!--              outline-->
            <!--              text-color="accent"-->
            <!--            >-->
            <!--              Торг-->
            <!--            </q-badge>-->
            <!--            <q-badge-->
            <!--              v-if="parseInt(flat.mortgage)===1"-->
            <!--              outline-->
            <!--              text-color="secondary"-->
            <!--            >-->
            <!--              Возможна ипотека-->
            <!--            </q-badge>-->
            <FlatDetailedProperty
              title="Тип сделки"
              :val="flat.deal_status"
            />
          </q-list>
        </q-card-section>

        <!--        <q-card-section :class="$q.screen.gt.xs?'q-pa-lg':'q-pa-md'">-->
        <!--          <h2 class="text-h5 text-weight-bold">-->
        <!--            Особенности-->
        <!--          </h2>-->
        <!--          <q-list class="FlatDetailedList">-->
        <!--            <FlatDetailedProperty-->
        <!--              v-if="flat.parking_type"-->
        <!--              title="Тип парковки"-->
        <!--              :val="flat.parking_type"-->
        <!--            />-->
        <!--            <FlatDetailedProperty-->
        <!--              v-if="flat.guarded_parking"-->
        <!--              title="Охраняемая парковка"-->
        <!--              bool-->
        <!--              :val="flat.guarded_parking"-->
        <!--            />-->
        <!--          </q-list>-->
        <!--        </q-card-section>-->
      </q-card>
      <q-card
        :square="$q.screen.lt.md"
        :class="$q.screen.gt.xs?'q-pa-lg':'q-pa-md'"
      >
        <h2
          v-if="parseInt(flat.rooms_total)<0"
          class="text-h5 text-weight-bold"
        >
          Студия
        </h2>
        <h2
          v-else
          class="text-h5 text-weight-bold"
        >
          {{ flat.category }}
        </h2>

        <q-list class="FlatDetailedList">
          <FlatDetailedProperty
            title="Комнат"
            :val="Math.abs(parseInt(flat.rooms_total))"
          />

          <FlatDetailedProperty
            v-if="flat.square"
            title="Площадь"
          >
            {{ flat.square }} м<sup>2</sup>
          </FlatDetailedProperty>
          <FlatDetailedProperty
            v-if="flat.living_space"
            title="Жилая"
          >
            {{ flat.living_space }} м<sup>2</sup>
          </FlatDetailedProperty>
          <FlatDetailedProperty
            v-if="flat.kitchen_space"
            title="Кухня"
          >
            {{ flat.kitchen_space }} м<sup>2</sup>
          </FlatDetailedProperty>
          <FlatDetailedProperty
            v-if="flat.floor&&flat.total_floors"
            title="Этаж/этажность"
            :val="flat.floor+'/'+flat.total_floors"
          />
          <FlatDetailedProperty
            v-if="flat.layout"
            title="Тип комнат"
            :val="flat.layout"
          />
          <FlatDetailedProperty
            v-if="flat.layout_changed"
            title="Перепланировка"
            yes-value="Да"
            bool
            :val="flat.layout_changed"
          />
          <FlatDetailedProperty
            v-if="flat.windows"
            title="Окна"
            :val="flat.windows"
          />
          <FlatDetailedProperty
            v-if="flat.balcony"
            title="Балкон\Лоджия"
            :val="flat.balcony"
          />
          <FlatDetailedProperty
            v-if="flat.renovation"
            title="Состояние квартиры"
            :val="flat.renovation"
          />
          <FlatDetailedProperty
            v-if="flat.rooms_type"
            title="Тип комнат"
            :val="flat.rooms_type"
          />

          <FlatDetailedProperty
            v-if="flat.stove"
            title="Тип плиты"
            :val="flat.stove"
          />
          <FlatDetailedProperty
            v-if="flat.bathroom_unit"
            title="Тип санузла"
            :val="flat.bathroom_unit"
          />
          <FlatDetailedProperty
            v-if="flat.room_furniture"
            title="Мебель в комнатах"
            bool
            :val="flat.room_furniture"
          />
          <FlatDetailedProperty
            v-if="flat.kitchen_furniture"
            title="Кухонный гарнитур"
            bool
            :val="flat.kitchen_furniture"
          />
        </q-list>
      </q-card>
      <q-card
        v-if="aboutHouse"
        :square="$q.screen.lt.md"
        :class="$q.screen.gt.xs?'q-pa-lg':'q-pa-md'"
      >
        <h2 class="text-h5 text-weight-bold">
          О доме
        </h2>
        <q-list class="FlatDetailedList">
          <FlatDetailedProperty
            v-if="flat.property_type"
            title="Тип недвижимости"
            :val="flat.property_type"
          />
          <FlatDetailedProperty
            v-if="flat.build_year&&parseInt(flat.not_built)!==1"
            title="Год постройки"
            :val="parseInt(flat.build_year) + ' г.'"
          />
          <FlatDetailedProperty
            v-if="flat.not_built"
            title="Дом не сдан"
            val="Не сдан"
          />
          <FlatDetailedProperty
            v-if="flat.building_type"
            title="Материал стен"
            :val="flat.building_type"
          />
          <FlatDetailedProperty
            v-if="flat.lift"
            title="Лифт"
            bool
            :val="flat.lift"
          />
          <FlatDetailedProperty
            v-if="flat.service_lift"
            title="Грузовой лифт"
            bool
            :val="flat.service_lift"
          />
          <FlatDetailedProperty
            v-if="flat.parking_type"
            title="Тип парковки"
            :val="flat.parking_type"
          />

          <FlatDetailedProperty
            v-if="flat.guarded_territory"
            title="Закрытая территория"
            bool
            :val="flat.guarded_territory"
          />
        </q-list>
      </q-card>
      <!--      <q-card-->
      <!--        :square="$q.screen.lt.md"-->
      <!--        :class="$q.screen.gt.xs?'q-pa-lg':'q-pa-md'"-->
      <!--      >-->
      <!--        <h2 class="text-h6 text-weight-bold">-->
      <!--          Сделка-->
      <!--        </h2>-->
      <!--        <q-list class="FlatDetailedList">-->
      <!--          <FlatDetailedProperty-->
      <!--            title="Тип сделки"-->
      <!--            :val="flat.deal_status"-->
      <!--          />-->
      <!--          <FlatDetailedProperty-->
      <!--            v-if="flat.haggle"-->
      <!--            bool-->
      <!--            title="Торг"-->
      <!--            :val="flat.haggle"-->
      <!--          />-->
      <!--        </q-list>-->
      <!--      </q-card>-->
      <q-card
        :square="$q.screen.lt.md"
      >
        <q-card-section :class="$q.screen.gt.xs?'q-pa-lg':'q-pa-md'">
          <h2 class="text-h6 text-weight-bold">
            Описание
          </h2>
          {{ flat.description }}
        </q-card-section>
        <q-card-section :class="$q.screen.gt.xs?'q-pa-lg':'q-pa-md'">
          <h2 class="text-h6 text-weight-bold">
            Местоположение
          </h2>
          <p>
            {{ flat.address }}
          </p>
          <yandex-map
            v-show="mapCoords!==null"
            :coords="mapCoords"
            zoom="16"
            ymap-class="map"
            @map-was-initialized="mapInit"
          >
            <ymap-marker
              v-if="mapCoords!==null"
              :coords="mapCoords"
              marker-id="address"
              :icon="markerIcon"
              :options="{preset: 'islands#blueHomeCircleIcon'}"
            />
          </yandex-map>
        </q-card-section>
      </q-card>

      <q-card
        v-if="showProfile!==false"
        :square="$q.screen.lt.md"
        :class="$q.screen.gt.xs?'q-pa-lg':'q-pa-md'"
      >
        <h2 class="text-h6 text-weight-bold">
          Продавец
        </h2>
        <div class="row flex-start">
          <div
            v-if="flat.profile&&flat.profile.type==='agencyAgent'"
            class="col-md-6 col-xs-12"
          >
            <AgencyItem :agency="flat.agency" />
          </div>
          <div
            v-if="flat.profile&&flat"
            class="col-md-6 col-xs-12"
          >
            <AgentItem
              :profile="flat.profile"
              :flat="flat"
            />
          </div>
        </div>
      </q-card>
    </section>
    <AgentProfile
      v-show="$q.screen.gt.sm"
      v-if="showProfile!==false&&typeof flat.profile!=='undefined'"
      :flat="flat"
      :profile="flat.profile"
      :agency="flat.agency"
    />
  </div>
</template>

<script>
  import {mapFields} from 'vuex-map-fields'
  import AgentProfile from 'src/components/agent/agentProfile'
  import ImageGallery from 'src/components/general/ImageGallery'
  import FlatProperty from "components/objects/flat/flatProperty";
  import FlatDetailedProperty from "components/objects/flat/FlatDetailedProperty";
  import FlatTitle from "components/objects/flat/FlatTitle";
  import AgentItem from "components/agent/AgentItem";
  import AgencyItem from "components/agencies/AgencyItem";
  import { copyToClipboard } from 'quasar'
  export default {
  components: {
    AgencyItem,
    AgentItem,
    FlatTitle,
    FlatDetailedProperty,
    FlatProperty,
    AgentProfile,
    ImageGallery
  },
  computed: {
    coords() {
      if(this.flat.latitude!==null&&
        typeof this.flat.latitude!=='undefined'&&
        this.flat.longtitude!==null&&
        typeof this.flat.longtitude!=='undefined'){
        return [this.flat.latitude, this.flat.longtitude]
      }
      return null
    },
    aboutHouse(){
let about=['property_type','build_year','not_built','building_type', 'lift', 'parking_type', 'service_lift', 'guarded_territory']
return about.some((el)=>typeof this.flat[el]!=='undefined'&&this.flat[el]!==null&&this.flat[el]!==0&&this.flat[el]!=='')
    },
    agentComissionFee(){
      if(this.flat.agent_comission_type===2){
        return Math.floor(this.flat.price*this.flat.agent_comission_fee/100)
      }

      return null
    },
    waLink(){
      return 'whatsapp://send?text='+window.location.href
    },
    fbLink(){
      return 'https://www.facebook.com/sharer.php?u='+window.location.href
    },
    vkLink(){
      return `https://vk.com/share.php?url=${window.location.href}&title=${encodeURIComponent(this.title)}`
    },

    ...mapFields(
      'flats',
      [
        'flat',
        'title'
      ]

    ),
    images () {
      //console.log(this.flat.sortimages)
      let items = []
      const normalize = require('normalize-path')
      if (typeof this.flat.sortimages !== 'undefined') {
        this.flat.sortimages.forEach(function (el) {
          let p = process.env.URL + normalize(el.path)
          //let med = process.env.URL + normalize(el.path_med)
          let thumb = process.env.URL + normalize(el.path_thumb)
          items.push({ src: p, thumbnail: thumb })
        })
      } else {
        return null
      }
      //console.log(items)
      return items
    },
    pricePerM () {
      if (this.flat.price !== null && this.flat.square !== null) {
        return Math.floor(this.flat.price / this.flat.square)
      } else {
        return null
      }
    },
    properties () {
      let types = this.objProps.map(x => x['varName'])
      let filtered = Object.keys(this.flat).filter(key => types.includes(key)).reduce((obj, key) => {
        if (this.flat[key] !== null) {
          let prop = this.objProps.find(x => x.varName === key)
          obj.push({
            'addition': prop['addition'], 'icon': prop['icon'], 'title': prop['title'], 'value': this.flat[key]
          })
        }
        return obj
      }, [])
      return filtered
    },
    // roomsTotalText () {
    //   switch (this.flat.rooms_total) {
    //     case 1:return 'комната'
    //     case 2: case 3: case 4: return 'комнаты'
    //     case 5: case 6: case 7: return 'комнат'
    //   }
    //   return 'комната'
    // }
  },
  props: {
    id: {
      type: [String, Number],
      required: true
    },
    showProfile: {
      type: Boolean,
      default:true,
      required: false
    }
  },
  data () {
    return {
      slide: 1,
      isMounted: false,
      ymaps: null,
      mapCoords: [48.46, 135.11],
      objProps: [
        {
          title: 'Тип недвижимости',
          icon: 'domain',
          varName: 'type'
        },
        {
          title: 'Материал стен',
          icon: 'view_stream',
          varName: 'building_type'
        }

      ],
      markerIcon: {
        content: 'Начните вводить адрес, или укажите место на карте'
      }
    }
  },
  created () {
    console.log(this.id)
    this.$store.dispatch('flats/getFlat', this.id).then((response) => {
      console.log(response)
      this.markerIcon.content = this.flat.address
      this.title = this.flat.address
    })
      .catch((e) => {
        console.log(e)
        this.$q.notify('Не удалось получить объект')
      })
  },
  methods: {
    copyToClip(){
      copyToClipboard(window.location.href)
        .then(() => {
          this.$q.notify('Ссылка скопирована в буфер обмена')
        })
        .catch((e) => {
         console.log(e)
        })
    },
    mapInit (map) {
      console.log('map init')
      console.log(map)

      /*eslint-disable */
        if (typeof this.coords === 'undefined' || this.coords===null) {
          console.log('geocoding address')
          ymaps.geocode(this.flat.address, { kind: 'street' }).then(res => {
            console.log(res)
            let firstGeoObject = res.geoObjects.get(0)
            console.log(firstGeoObject.getAddressLine())
            //this.coords = firstGeoObject.geometry.getCoordinates()
            this.mapCoords = firstGeoObject.geometry.getCoordinates()
          })
        }
        else{
          this.mapCoords=this.coords
        }
        /* eslint-enable */
    }
  },
  mounted () {
    this.isMounted = true
  }
}
</script>

<style>
  .map, .ymap-container{
    height: 500px;
    min-height: 500px;
  }
  @media (max-width: 425px) {
    .map, .ymap-container{
      height: 230px;
      min-height: 230px;
    }
  }
</style>
<style scoped>
  .FlatPrice{
    line-height: 1.5em;
  }
  .FlatTopCard>div{
    width: 100%;
  }
  .FlatPropertyList div:not(:last-child){
    border-right:1px solid rgba(0,0,0,0.12);
  }
  .FlatPropertyList>div:nth-child(2n-1){
    padding-left: 5px;
  }
  .FlatDetailedList{
    -moz-column-count: 2;
    column-count: 2;
  }
  .FlatDetailedList div{
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    page-break-inside: avoid;
    -moz-column-break-inside: avoid;
    break-inside: avoid;
  }

    .container{
        max-width: 1200px;
        margin-left: auto;
        margin-right: auto;
    }
    .custom-prop{
        flex-basis: 50%;
    }
    .prop{
        flex-basis: 33%;
    }
    .prop>span{
        font-size: 16px;
        color: #939393;
    }
    .prop>span>span{
        color:black;
        font-weight: bolder;
    }
    .description{
        font-size: 16px;
        line-height: 24px;
    }

    @media (max-width: 425px) {
      .map, .ymap-container{
        height: 230px;
        min-height: 230px;
      }

      .FlatPrice{
        line-height: 30px;
      }
      .ImageGalleryFlat{
        display: flex;
        order:-1;
      }
        .price{
            margin-top: 0px;
            margin-bottom: 10px;
        }
      .FlatDetailedList{
        -moz-column-count: 1;
        column-count: 1;
      }
      .FlatPropertyList div:not(:last-child){
        border-right:none;
      }
      .FlatPropertyList div{
        margin:8px 0px;
        flex-basis: 50%;
      }


    }
</style>
