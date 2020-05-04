<template>
  <div
    class="row  filters"
  >
    <div
      class="full-width row shadow-1 justify-between gt-md"
    >
      <portal to="subtypeFilter">
        <q-btn-dropdown
          flat
          :label="buyLabel"
          menu-anchor="bottom left"
          menu-self="top left"
          borderless
          no-caps
          class="primary"
          size="md"
          content-class="subtypeFilterDropdown q-py-md q-px-none"
          style="height: 40px"
        >
          <q-list
            dense
            class="filter-menu non-selectable"
          >
            <q-item
              v-for="(cat, index) in categories"
              :key="index"
              class="q-pa-none"
            >
              <q-item-section>
                <q-radio
                  v-model="category"
                  :val="cat.value"
                  :label="cat.title"
                  class="dense-radio q-pa-sm"
                  color="primary"
                />
                <q-option-group
                  v-if="category===cat.value&&typeof cat.types!=='undefined'"
                  v-model="rooms_total"
                  class="q-pl-md non-selectable twoCols"
                  :options="cat.types"
                  type="checkbox"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </portal>
      <portal-target name="subtypeFilter" />
      <q-separator
        vertical
      />
      <currency-input
        v-model="priceMin"
        is-borderless
        stack-label
        placeholder="₽ Цена от"
        dense
        style="width: 200px;max-height: 40px;"
      />
      <q-separator
        vertical
      />
      <currency-input
        v-model="priceMax"
        is-borderless
        placeholder="₽ Цена до"
        dense
        style="width: 200px;max-height: 40px;"
      >
        <template #after>
          <q-separator
            vertical
          />
        </template>
      </currency-input>
      <div style="width: 300px;max-height: 40px;">
        <q-select
          v-model.trim="sub_locality_name"
          borderless
          multiple
          clearable
          emit-value
          input-debounce="0"
          :options="subLocalities"
          label="Район"
          class="q-pl-md q-pr-none non-selectable"
          dense
        >
          <template
            v-if="areasSelected.length>0"
            #selected
          >
            <template
              v-for="item in areasSelected"
            >
              {{ item }}
            </template>
            <template v-if="sub_locality_name!==null&&sub_locality_name.length>1">
              + ещё {{ sub_locality_name.length-areasSelected.length }}
            </template>
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
        </q-select>
      </div>
    </div>
    <div
      class="row q-my-xs full-width"
      :class="{'q-gutter-y-xs':$q.screen.gt.md}"
    >
      <q-select
        v-model="sortBy"
        class="sortDropdown"
        outlined
        :dense="$q.screen.lt.md"
        fill-input
        input-debounce="0"
        :options="sortOptions"
        label="Сортировать:"
        emit-value
        map-options
      />
      <q-space />

      <!--      <q-btn-->
      <!--        v-show="moreFilters"-->
      <!--        class="lt-md"-->
      <!--        color="blue-grey-8"-->
      <!--        outline-->
      <!--        no-caps-->
      <!--        icon="clear"-->
      <!--        label="Очистить"-->
      <!--        @click="clearFilters"-->
      <!--      />-->

      <span
        class="gt-md self-center"
        v-text="findLabel"
      />
      <q-btn
        ref="moreFilters"
        :icon-right="moreFilters?'arrow_drop_up':'arrow_drop_down'"
        color="primary"
        no-caps
        :class="{'q-mx-sm':$q.screen.gt.md}"
        :flat="!moreFilters"
        :outline="moreFilters"
        :label="$q.screen.gt.md?'Ещё фильтры':'Фильтры'"
        @click="moreFilters=!moreFilters"
      />
      <q-btn
        v-show="!showMap"
        icon="location_on"
        align="right"
        class="btn-fixed-width gt-md q-mx-sm"
        text-color="primary"
        color="white"
        label="На карте"
        @click="showMapClick"
      />
      <q-btn
        v-show="showMap"
        icon="list"
        align="right"
        class="btn-fixed-width gt-md q-mx-sm"
        text-color="primary"
        color="white"
        label="Списком"
        @click="showListClick"
      />
      <q-btn
        class="btn-fixed-width gt-md"
        color="primary"
        no-caps
        :loading="loading"
        :label="showLabel"
        @click="$emit('request')"
      />
    </div>
    <div class="row lt-md full-width items-center">
      <span v-text="findLabel" />
      <q-space />
      <q-btn
        v-show="!showMap"
        icon-right="location_on"
        align="right"
        class="btn-fixed-width"
        text-color="primary"
        color="white"
        flat
        no-caps
        label="На карте"
        @click="showMapClick"
        size="md"
      />
      <q-btn
        v-show="showMap"
        icon-right="list"
        align="right"
        class="btn-fixed-width"
        text-color="primary"
        color="white"
        flat
        no-caps
        label="Списком"
        @click="showListClick"
        size="md"
      />
    </div>
    <div
      v-show="moreFilters"
      class="row  more-filters"
    >
      <q-dialog
        v-if="$q.screen.lt.md"
        v-model="moreFilters"
        maximized
        transition-show="slide-up"
        transition-hide="slide-down"
      >
        <div>
          <div class="row q-pa-sm bg-white justify-between">
            <q-btn
              v-close-popup
              icon="close"
              flat
              round
              dense
            />
            <span class="text-h6 text-bold">
              Фильтры
            </span>
            <q-btn
              flat
              color="blue-grey-5"
              label="Очистить"
              dense
              no-caps
              @click="clearFilters"
            />
          </div>
          <div class="row bg-white">
            <portal-target name="subtypeFilter" />
          </div>
          <FlatFilter
            v-if="category==='Квартира'"
            :loading="loading"
            @clear="clearFilters"
            @hide="moreFilters=false"
          />
        </div>
      </q-dialog>
      <FlatFilter
        v-if="category==='Квартира'&&$q.screen.gt.md"
        :loading="loading"
        @clear="clearFilters"
        @hide="moreFilters=false"
      />
    </div>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import FlatFilter from 'src/components/filters/FlatFilter'
import { mixin as clickaway } from 'vue-clickaway'
import CurrencyInput from "components/general/CurrencyInput";

export default {
  name: 'FilterPage',
  components: {
    CurrencyInput, FlatFilter
  },
  props:{
    'loading':{
    type:Boolean
},
    'showMap':{
      type:Boolean
    }
},
mounted(){
  this.clearFilters()
},
  computed: {
    findLabel(){
      return `Найдено ${this.count} ${this.$declOfNum(this.count,['объявление', 'объявления', 'объявлений'])}`
    },
    showLabel(){
      return `Показать ${this.count} ${this.$declOfNum(this.count,['объявление', 'объявления', 'объявлений'])}`
    },
    areasSelected(){
      if(typeof this.sub_locality_name !=='undefined'&&this.sub_locality_name !==null){
        return this.sub_locality_name.slice(0,1)
      }
      return []

    },
    buyLabel () {
      let val
      if (this.category !== null) {
        val = this.categories.find(element => {
          return element.value === this.category
        })
      }
      if (val !== null&&typeof val!=='undefined') {
        return (this.category !== null) ? 'Купить ' + val.title.toLocaleLowerCase() : 'Купить'
      }
      return 'Купить'

    },
    ...mapFields(
      'flats',
      [
        'count',
        'filters',
        'filters.category',
        'filters.rooms_total',
        'filters.priceMin',
        'filters.priceMax',
        'filters.sub_locality_name',
        'filters.sortBy',
        'subLocalities'
      ]
    )
  },
  mixins: [ clickaway ],
  data () {
    return {
      moreFilters: false,
      sortOptions: [{ label: 'По умолчанию', value: null }, { label: 'Цена по возрастанию', value: 'price' }, { label: 'Цена по убыванию', value: '-price' }],

      categories: [
        { title: 'Квартиру', value: 'Квартира', types: [{label:'Студия', value:-1}, {label:'1-комнатная', value:1}, {label:'2-комнатная', value:2} ,{label:'3-комнатная', value:3} ,{label:'4-комнатная и более', value:4} ] },
        // { title: 'Комнату', value: 'Комната', types: ['В общежитии', 'В квартире'] },
        // { title: 'Дом', value: 'Дом', types: ['Коттедж', 'Дом', 'Таунхаус'] },
        // { title: 'Участок', value: 'Участок', types: ['ИЖС', 'Коммерч. назначение', 'Сельхоз. назначение'] },
        // { title: 'Дачу', value: 'Дача' },
        // { title: 'Гараж', value: 'Гараж' },
        // { title: 'Коммерческую недвижимость',
        //   value: 'Коммерческая недвижимость',
        //   types: ['Промышленное назначение',
        //     'Гостиница',
        //     'Офисное помещение',
        //     'Производственное помещение',
        //     'Складское помещение',
        //     'Помещение общественного питания',
        //     'Помещение свободного назначения',
        //     'Торговое помещение',
        //     'Готовый бизнес'
        //   ] },
        // { title: 'Новостройки', types: ['Студия', '1-комнатная', '2-комнатная', '3-комнатная', '4-комнатная и более'] }

      ],
      options: []
    }
  },
  methods: {
    showListClick(){
        this.$emit('update:showMap',false)
    },
    showMapClick(){
      this.$emit('update:showMap',true)
    },
    clearFilters(){
      this.$store.dispatch('flats/clearFilters')
    },
    hideFilters (event) {
      console.log(event.target)
      console.log(event.target === this.$refs.moreFilters)
      console.log(this.$refs.moreFilters)
      this.moreFilters = false
    },
    suboptions (types) {
      // let result = []
      // types.forEach(e => {
      //   result.push({ label: e.label, value: e.val })
      // })
      return types
      //return result
    }
  }
}
</script>
<style>
    .filter-menu{
        max-width: 360px;
        min-width: 320px;
    }
    .flex-50 .q-checkbox__label{
        font-size: 12px;
    }
    .flex-50 .q-checkbox__inner {
        width: 32px;
        min-width: 32px;
        height: 32px;
        padding: 3px;}
    /*.q-item-filter{*/
    /*    padding: 2px 10px!important;*/
    /*}*/
    .flex-50>div{
        flex-basis: calc(50% - 16px);
    }
    .flex-50{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        padding-top: 3px;
    }
    .medium-dense label{
        padding: 2px 10px;
    }
    .dense-radio .q-radio__inner {
        width: 20px;
        min-width: 20px;
        height: 20px;
    }
    .dense-radio .q-radio__bg {
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
    }
    /*.q-list--dense > .q-item, .q-item--dense {*/
    /*    padding: 0;*/
    /*}*/
    .filter-menu .q-radio{
      background: rgba(2, 123, 227, 0.2);
    }
</style>
<style scoped>
  .filters{
    z-index: 2500;
  }
  .sortDropdown{
    width: 250px;
  }
  .subtypeFilterDropdown{
    z-index: 9999999;
  }
  .twoCols{
    column-count: 2;
  }
    .more-filters{
        background-color: #fff;
        z-index: 1;
        width: 100%;
    }
  @media (max-width: 450px) {
    .sortDropdown{
      width: 200px;
    }
  }
</style>
