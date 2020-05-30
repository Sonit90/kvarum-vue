<template>
  <div
    class="column items-center"
  >
    <div
      id="addObjectContainer"
      class="q-pa-md container-form"
    >
      <div class="q-gutter-sm">
        <div class="q-px-sm">
          <h4 :class="$q.screen.lt.md?'text-h5':''">
            Новое объявление
          </h4>
          <div>
            <q-btn-toggle
              v-model="action"
              :options="sellOptions"
              class="choose_action"
              toggle-color="primary"
              text-color="black"
              :size="$q.screen.name"
              no-caps
              @input="scrollTo('types')"
            >
              <template
                v-for="(option, index) in sellOptions"
                v-slot:[option.slot]
              >
                <span :key="index">{{ option.value }}</span>
              </template>
            </q-btn-toggle>
          </div>
          <div
            v-show="action"
            ref="types"
          >
            <h5 :class="$q.screen.lt.md?'text-h5':''">
              Выберите тип недвижимости:
            </h5>

            <q-btn-toggle
              v-model="category"
              :options="flatOptions"
              class="choose_type"
              toggle-color="primary"
              text-color="black"
              size="lg"
              no-caps
              @input="scrollTo('forms')"
            >
              <template
                v-for="(option, index) in flatOptions"
                v-slot:[option.slot]
              >
                <span :key="index">{{ option.value }}</span>
              </template>
            </q-btn-toggle>
          </div>

          <!--                    <q-radio v-model="type" val="Продажа" label="Продажа" />-->
          <!--                    <q-radio v-model="type" val="Аренда" label="Аренда" />-->
        </div>
      </div>
      <div ref="forms">
        <CreateFlat v-show="category==='Квартира'" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import CreateFlat from 'components/objects/create/CreateFlat'
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
export default {
  name: 'AddObject',
  components: {
    CreateFlat
  },
  computed: {
    ...mapFields(
      'flats',
      ['flat',
        'flat.action',
        'flat.type',
        'flat.category'
      ]
    )
  },
  data () {
    return {
      flatOptions: [
        { icon: 'far fa-building', slot: 'flat', value: 'Квартира' },
        { disable: true, icon: 'fas fa-bed', slot: 'room', value: 'Комната' },
        { disable: true, icon: 'fas fa-home', slot: 'house', value: 'Дом' },
        { disable: true, icon: 'fas fa-warehouse', slot: 'garage', value: 'Гараж' },
        { disable: true, icon: 'fas fa-city', slot: 'commerce', value: 'Коммерческая' },
        { disable: true, icon: 'far fa-map', slot: 'earth', value: 'Участок' }

      ],
      sellOptions: [
        { icon: 'fas fa-key', slot: 'sell', value: 'Продать' },
        { disable: true, icon: 'far fa-calendar', slot: 'rent_long', value: 'Сдать длительно' },
        { disable: true, icon: 'far fa-clock', slot: 'rent_short', value: 'Сдать посуточно' }
      ]
    }
  },
  methods: {
    scrollTo (e) {
      setTimeout(() => {
        let el = this.$refs[e]
        const target = getScrollTarget(el)
        const offset = el.offsetTop
        const duration = 200
        setScrollPosition(target, offset, duration)
      }, 100)
    }
  }
}
</script>
<style>
    .choose_action .q-btn{
        padding: 30px;
        -webkit-border-radius: 6px;
        -moz-border-radius: 6px;
        border-radius: 6px;
    }
    .choose_action .q-btn,.choose_type .q-btn {
      height: 240px;
    }


    .choose_action .q-btn:not(:nth-child(3n)), .choose_type .q-btn:not(:nth-child(3n)){
    margin-right: 20px;}
    .choose_action > .q-btn-item:not(:last-child), .choose_action> .q-btn-item + .q-btn-item,.choose_type > .q-btn-item:not(:last-child), .choose_type> .q-btn-item + .q-btn-item {
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
    }

    .choose_action button:after, .choose_type button:after {
        content: "";
        display: block;
        padding-bottom: 100%;
    }
    .choose_action button, .choose_type button{
        position: relative;
        width: 33%;
    }
    .choose_action .q-btn__content, .choose_type .q-btn__content{
    position: absolute;
    width: 100%;
    height: 100%;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        flex-direction: column;
    }

    .choose_action, .choose_type{
        display: flex!important;
        -webkit-box-shadow: none;
        -moz-box-shadow: none ;
        box-shadow: none;
    }
    .choose_type button{
        margin-bottom: 15px;
    }

    .choose_type button:nth-child(3n){
        width: 33%;
    }
    .choose_type button:not(:nth-child(3n)){
        width:  calc(33.333% - 20px);
    }

 .choose_type .q-btn, .choose_action .q-btn{
        padding: 30px;
        -webkit-border-radius: 6px;
        -moz-border-radius: 6px;
        border-radius: 6px;
     box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);
    }
    .choose_type button:hover, .choose_action button:hover{
        color: #fff!important;
        background: #027be3;
    }

    @media (max-width: 425px) {

      .choose_action .q-btn,.choose_type .q-btn {
        height: 100px;
      }
    }
</style>

<style scoped>
  .container-form{
    max-width: 700px; margin-bottom: 100px;
        min-width: 800px;
    }
    .choose_action span,  .choose_type span{
        margin-top: 15px;
        font-size: 1.2rem;
    }
    .choose_type{
        flex-wrap:wrap!important;
    }
    @media (max-width: 425px) {
      .container-form{
        max-width: 360px;
        min-width: 320px;
      }
      .choose_action span,  .choose_type span{
        margin-top: 10px;
        font-size: 12px;
        line-height: 1.2em;
      }
    }



</style>
