<template>
  <div
    class="flat-filter  shadow-1"
    :class="{'q-pa-md absolute':$q.screen.gt.md, 'q-px-md q-pt-md':$q.screen.lt.md}"
  >
    <div
      class="row"
      :class="{'q-col-gutter-md':$q.screen.gt.md}"
    >
      <div class="col-md-6 col-xs-12">
        <p class="text-body1 text-weight-bold">
          Квартира
        </p>
        <FilterField
          v-show="$q.screen.lt.md"
          label="Цена от"
          placeholder="₽"
        >
          <!--          <q-input-->
          <!--            v-model.lazy="priceMin"-->
          <!--            class="q-px-md"-->
          <!--            unmasked-value-->
          <!--            borderless-->
          <!--            stack-label-->
          <!--            clearable-->
          <!--            prefix="₽"-->
          <!--            dense-->
          <!--          />-->
          <currency-input
            v-model="priceMin"
            is-borderless
            stack-label
            big
            placeholder="₽"
            dense
            style="width: 200px;max-height: 40px;"
          />
        </FilterField>
        <FilterField
          v-show="$q.screen.lt.md"
          label="Цена до"
        >
          <!--          <q-input-->
          <!--            v-model.lazy="priceMax"-->
          <!--            class="q-px-md"-->
          <!--            unmasked-value-->
          <!--            borderless-->
          <!--            stack-label-->
          <!--            clearable-->
          <!--            prefix="₽"-->
          <!--            dense-->
          <!--          />-->
          <currency-input
            v-model="priceMax"
            is-borderless
            placeholder="₽"
            dense
            big
            style="width: 200px;max-height: 40px;"
          />
        </FilterField>

        <FilterField v-show="$q.screen.lt.md">
          <q-select
            v-model="sub_locality_name"
            dense
            use-chips
            emit-value
            :options="subLocalities"
            label="Район"
            class="full-width"
            multiple
            borderless
            clearable
            popup-content-style="max-height:50vh"
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
        </FilterField>

        <FilterField label="Площадь">
          <q-input
            v-model="squareMin"
            input-class="text-center"
            dense
            type="number"
            borderless
            hide-bottom-space
            placeholder="от"
            clearable
          />
          <q-input
            v-model="squareMax"
            type="number"
            input-class="text-center"
            dense
            borderless
            hide-bottom-space
            placeholder="до"
            clearable
          />
          <template v-slot:after>
            м<sup>2</sup>
          </template>
        </FilterField>
        <FilterField label="Площадь кухни от">
          <q-input
            v-model="kitchen_space"
            type="number"
            input-class="text-center"
            dense
            borderless
            hide-bottom-space
            class="flex-grow "
            clearable
            :class="{'q-px-md':$q.screen.gt.md}"
          />
          <template v-slot:after>
            м<sup>2</sup>
          </template>
        </FilterField>
        <FilterField label="Этаж">
          <q-input
            v-model="floorMin"
            pattern="\d*"
            type="number"
            input-class="text-center"
            dense
            borderless
            hide-bottom-space
            placeholder="с"
            clearable
          />
          <q-input
            v-model="floorMax"
            type="number"
            dense
            input-class="text-center"
            borderless
            hide-bottom-space
            placeholder="по"
            clearable
          />
        </FilterField>
        <div
          class="row filter no-wrap q-gutter-x-md"
        >
          <div class="col">
            <FilterField no-margin>
              <q-checkbox
                v-model="notFirstFloor"
                label="Не первый этаж"
                :indeterminate-value="false"
                :true-value="true"
                :false-value="null"
              />
            </FilterField>
          </div>
          <div class="col">
            <FilterField no-margin>
              <q-checkbox
                v-model="notLastFloor"
                label="Не последний этаж"
                :indeterminate-value="false"
                :true-value="true"
                :false-value="null"
              />
            </FilterField>
          </div>
        </div>
        <FilterField>
          <q-select
            v-model="layout"
            dense
            :options="layoutOptions"
            label="Тип комнат"
            class="full-width"
            borderless
            clearable
          />
        </FilterField>
        <FilterField>
          <q-select
            v-model="renovation"
            dense
            use-chips
            :options="renovationOptions"
            label="Состояние"
            class="full-width"
            multiple
            borderless
            clearable
          />
        </FilterField>
        <FilterField>
          <q-select
            v-model="balcony"
            dense
            :options="balconyOptions"
            label="Балкон"
            class="full-width"
            borderless
            clearable
          />
        </FilterField>
        <FilterField>
          <q-select
            v-model="bathroom_unit"
            dense
            :options="sanuzels"
            label="Санузел"
            class="full-width"
            borderless
            clearable
          />
        </FilterField>
      </div>
      <div class="col-md-6 col-xs-12">
        <p class="text-body1 text-weight-bold">
          Дом
        </p>
        <FilterField label="Год постройки">
          <q-input
            v-model="yearMin"
            type="number"
            input-class="text-center"
            dense
            borderless
            hide-bottom-space
            placeholder="с"
            clearable
          />
          <q-input
            v-model="yearMax"
            type="number"
            input-class="text-center"
            dense
            borderless
            hide-bottom-space
            placeholder="по"
            clearable
          />
        </FilterField>
        <FilterField>
          <q-select
            v-model="property_type"
            dense
            :options="statuses"
            label="Тип недвижимости"
            class="full-width"
            borderless
            clearable
          />
        </FilterField>

        <FilterField>
          <q-select
            v-model="building_type"
            use-chips
            dense
            :options="buildingTypes"
            label="Тип дома"
            class="full-width"
            multiple
            borderless
            clearable
          />
        </FilterField>
        <FilterField>
          <q-select
            v-model="parking_type"
            use-chips
            dense
            :options="parkingTypes"
            label="Парковка"
            class="full-width"
            multiple
            borderless
            clearable
          />
        </FilterField>
        <FilterField label="Этажей в доме от">
          <q-input
            v-model="minFloorNumber"
            type="number"
            input-class="text-center"
            dense
            borderless
            hide-bottom-space
            class="flex-grow"
            :class="{'q-px-md':$q.screen.gt.md}"
            clearable
          />
        </FilterField>
        <FilterField>
          <q-select
            v-model="stove"
            dense
            :options="stoveOptions"
            label="Тип плиты"
            class="full-width"
            borderless
            clearable
          />
        </FilterField>
      </div>
    </div>
    <q-separator spaced />
    <div
      class="row justify-end stickyRow"
    >
      <!--      <div class="col">-->
      <!--        <q-btn-->
      <!--          icon="location_on"-->
      <!--          class="full-width"-->
      <!--          text-color="primary"-->
      <!--          color="white"-->
      <!--          label="Показать на карте"-->
      <!--        />-->
      <!--      </div>-->
      <!--      <div class="col">-->
      <q-btn
        flat
        class="gt-md"
        color="blue-grey-5"
        label="Очистить"
        no-caps
        @click="$emit('clear')"
      />
      <q-btn
        class="q-ma-md"
        :class="{'full-width':$q.screen.lt.md}"
        color="primary"
        :loading="loading"
        no-caps
        :label="showLabel"
        @click="$emit('hide')"
      />
      <!--      </div>-->
    </div>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import FilterField from 'src/components/filters/FilterField'
import CurrencyInput from "components/general/CurrencyInput";
export default {
  name: 'FlatFilter',
  components: {
    CurrencyInput,
    FilterField
  },
  props:{
    'loading':{
      type:Boolean
    }
  },
  computed: {
    showLabel(){
      return `Показать ${this.count} ${this.$declOfNum(this.count,['объявление', 'объявления', 'объявлений'])}`
    },
    areasSelected(){
      if(typeof this.sub_locality_name !=='undefined'&&this.sub_locality_name !==null){
        return this.sub_locality_name.slice(0,1)
      }
      return []

    },
    ...mapFields(
      'flats',
      [
        'count',
        'filters.priceMin',
        'filters.priceMax',
        'filters.sub_locality_name',
        'filters.squareMin',
        'filters.squareMax',
        'filters.kitchen_space',
        'filters.renovation',
        'filters.balcony',
        'filters.bathroom_unit',
        'filters.floorMin',
        'filters.floorMax',
        'filters.notFirstFloor',
        'filters.notLastFloor',
        'filters.yearMin',
        'filters.yearMax',
        'filters.property_type',
        'filters.layout',
        'filters.building_type',
        'filters.parking_type',
        'filters.minFloorNumber',
        'filters.stove',
        'subLocalities',
        'balconyOptions',
        'sanuzels',
        'buildingTypes',
        'layoutOptions',
        'parkingTypes',
        'statuses',
        'renovationOptions',
        'stoveOptions'

      ]
    )

  }
}
</script>
<style scoped>
.flat-filter{
  background: #fff;
    width: 100%;
    min-width: 800px;
    max-width: 1200px;
  /*position: absolute;*/
}
    .flex-grow{
        flex-grow: 1;
    }
    .stickyRow{
      position: sticky;
      bottom: 0;
      background: #fff;
    }
@media (max-width: 800px) {
  .flat-filter{
   min-width: auto;
  }
}


</style>
