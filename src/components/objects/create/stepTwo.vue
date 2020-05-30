<template>
  <div class="q-gutter-sm">
    <!--    <p class="text-h5">-->
    <!--      О квартире-->
    <!--    </p>-->
    <FlatProp
      title="Количество комнат"
      required
    >
      <q-field
        :error="$v.rooms_total.$error"
        borderless
        no-error-icon
        @blur="$v.rooms_total.$touch()"
      >
        <q-btn-toggle
          v-model="rooms_total"
          clearable
          class="dense-toggle"
          toggle-color="primary"
          :options="roomQuantity"
          no-caps
          rounded
          @input="clearServerError('rooms_total')"
        />
        <template #error>
          <span v-if="!$v.rooms_total.required">Укажите количество комнат </span>
          <span v-if="!$v.rooms_total.server">{{ errors.get('rooms_total').join(' ') }}</span>
        </template>
      </q-field>
    </FlatProp>
    <FlatProp title="Статус">
      <q-btn-toggle
        v-model="property_type"
        clearable
        toggle-color="primary"
        :options="statuses"
        no-caps
        rounded
      />
      <template #after>
        <q-avatar
          color="primary"
          text-color="white"
          icon="fas fa-question"
          size="md"
        >
          <q-tooltip
            max-width="300px"
            content-class="tooltip-card"
          >
            <p><b>Жилой фонд</b>  – это квартиры, отнесенные к жилым помещениям с возможностью проживания лиц с постоянной регистрацией.</p>
            <p><b>Апартаменты</b> - это квартиры имеющие статус коммерческой недвижимости, отнесенные к нежилым помещениям с возможностью проживания лиц только с временной регистрацией.</p>
          </q-tooltip>
        </q-avatar>
      </template>
    </FlatProp>
    <FlatProp title="Санузел">
      <q-btn-toggle
        v-model="bathroom_unit"
        clearable
        toggle-color="primary"
        :options="sanuzels"
        no-caps
        rounded
        :dense="$q.screen.lt.md"
      />
    </FlatProp>
    <FlatProp title="Балкон\Лоджия">
      <q-btn-toggle
        v-model=" balcony"
        clearable
        toggle-color="primary"
        :options="balconyOptions"
        no-caps
        rounded
        :dense="$q.screen.lt.md"
      />
    </FlatProp>

    <FlatProp title="Состояние квартиры">
      <q-btn-toggle
        v-model="renovation"
        clearable
        toggle-color="primary"
        :options="renovationOptions"
        no-caps
        rounded
        :size="$q.screen.lt.md?'13px':'md'"
        :dense="$q.screen.lt.md"
      />
    </FlatProp>
    <FlatProp title="Окна">
      <q-btn-toggle
        v-model="windows"
        clearable
        toggle-color="primary"
        :options="windowsOptions"
        no-caps
        rounded
      />
    </FlatProp>
    <FlatProp
      title="Площадь, м<sup>2</sup>"
      required
    >
      <div class="row">
        <q-input
          v-model.number="square"
          flat
          label="Общая"
          class="col"
          :class="$q.screen.lt.md?'col-xs-11':''"
          bottom-slots
          type="number"
          :error="$v.square.$error"
          @blur="$v.square.$touch()"
          @input="clearServerError('square')"
        >
          <template #error>
            <span v-if="!$v.square.required">Укажите площадь </span>
            <span v-if="!$v.square.minValue">Общая площадь должна быть больше суммы площади кухни и жилой площади</span>
            <span v-if="!$v.square.server">{{ errors.get('square').join(' ') }}</span>
          </template>
          <template #prepend>
            <span class="text-negative">*</span>
          </template>
          <template #append>
            <span class="text-body1">
              м<sup>2</sup>
            </span>
            <q-separator
              v-if="$q.screen.gt.md"
              vertical
              class="q-ml-sm"
            />
          </template>
        </q-input>

        <q-input
          v-model.number="living_space"
          flat
          :class="$q.screen.lt.md?'col-xs-11':''"
          label="Жилая"
          bottom-slots
          class="col"
          type="number"
        >
          <template #prepend>
            <span class="q-pl-sm" />
          </template>
          <template #append>
            <span class="text-body1">
              м<sup>2</sup>
            </span>
            <q-separator
              v-if="$q.screen.gt.md"
              vertical
              class="q-ml-sm"
            />
          </template>
        </q-input>
        <q-input
          v-model.number="kitchen_space"
          flat
          :class="$q.screen.lt.md?'col-xs-11':''"
          class="col"
          label="Кухня"
          type="number"
          bottom-slots
        >
          <template #prepend>
            <span class="q-pl-sm" />
          </template>
          <template #append>
            <span class="text-body1">
              м<sup>2</sup>
            </span>
            <q-separator
              v-if="$q.screen.gt.md"
              vertical
              class="q-ml-sm"
            />
          </template>
        </q-input>
      </div>
    </FlatProp>

    <FlatProp
      title="Этаж"
      required
    >
      <div class="row">
        <q-input
          v-model.number="floor"
          outlined
          bottom-slots
          :error="$v.floor.$error"
          class="stepTwoFloor"
          dense
          type="number"
          :step="1"
          @blur="$v.floor.$touch()"
          @input="clearServerError('floor')"
        >
          <template #error>
            <span v-if="!$v.floor.required">Укажите этаж </span>
            <span v-if="!$v.floor.numeric">Этаж должен быть целым числом </span>
            <span v-if="!$v.floor.server">{{ errors.get('floor').join(' ') }}</span>
            <span v-if="!$v.floor.minValue">Этаж должен быть > 0</span>
            <span v-if="!$v.floor.maxValue">Этаж не может быть больше общего количества этажей</span>
          </template>
        </q-input>
        <q-input
          v-model.number="total_floors"
          outlined
          bottom-slots
          class="q-px-sm stepTwoTotalFloors"
          :error="$v.total_floors.$error"
          type="number"
          dense
          @blur="touchBothFloors"
          @input="clearServerError('total_floors')"
        >
          <template #error>
            <span v-if="!$v.total_floors.required">Укажите кол-во этажей </span>
            <span v-if="!$v.total_floors.numeric">Кол-во этажей должно быть целым числом </span>
            <span v-if="!$v.total_floors.server">{{ errors.get('total_floors').join(' ') }}</span>
          </template>
          <template #before>
            <span>
              из
            </span>
          </template>
        </q-input>
      </div>
    </FlatProp>

    <FlatProp title="Перепланировка">
      <q-radio
        v-model="layout_changed"
        class="non-selectable"
        :val="1"
        label="Да"
      />
      <q-radio
        v-model="layout_changed"
        class="non-selectable"
        :val="0"
        label="Нет"
      />
      <!--      <q-toggle-->
      <!--        v-model="layout_changed"-->
      <!--        class="non-selectable"-->
      <!--        checked-icon="check"-->
      <!--        color="primaty"-->
      <!--        unchecked-icon="clear"-->
      <!--      />-->
    </FlatProp>
    <FlatProp title="Лифт">
      <q-radio
        v-model="lift"
        class="non-selectable"
        :val="1"
        label="Есть"
      />
      <q-radio
        v-model="lift"
        class="non-selectable"
        :val="0"
        label="Нет"
      />
    </FlatProp>
    <FlatProp title="Грузовой лифт">
      <q-radio
        v-model="service_lift"
        class="non-selectable"
        :val="1"
        label="Есть"
      />
      <q-radio
        v-model="service_lift"
        class="non-selectable"
        :val="0"
        label="Нет"
      />
    </FlatProp>
    <FlatProp title="Закрытая территория">
      <q-radio
        v-model="guarded_territory"
        class="non-selectable"
        :val="1"
        label="Да"
      />
      <q-radio
        v-model="guarded_territory"
        class="non-selectable"
        :val="0"
        label="Нет"
      />
    </FlatProp>

    <FlatProp title="Тип плиты">
      <q-btn-toggle
        v-model="stove"
        :options="stoveOptions"
        clearable
        rounded
        toggle-color="primary"
        no-caps
        :size="$q.screen.lt.md?'13px':'md'"
        :dense="$q.screen.lt.md"
      />
    </FlatProp>
    <FlatProp title="Тип комнат">
      <q-btn-toggle
        v-model="layout"
        :options="layoutOptions"
        clearable
        rounded
        toggle-color="primary"
        no-caps
        :size="$q.screen.lt.md?'13px':'md'"
        :dense="$q.screen.lt.md"
      />
      <template #after>
        <q-avatar
          color="primary"
          text-color="white"
          icon="fas fa-question"
          size="md"
        >
          <q-tooltip
            max-width="300px"
            content-class="tooltip-card"
          >
            <p><b>Раздельные:</b> комнаты не имеют общих стен, каждая комната имеет собственный вход</p>
            <p><b>Смежно-раздельные:</b> каждая комната имеет собственный вход, комнаты имеют общую стену</p>
            <p><b>Проходные:</b> комнаты имеют общий вход и общую стену</p>
          </q-tooltip>
        </q-avatar>
      </template>
    </FlatProp>
    <!--    <FlatProp-->
    <!--      title="Дополнительно"-->
    <!--    >-->
    <!--      <div :class="$q.screen.lt.md?'flex column':''">-->
    <!--        <q-checkbox-->
    <!--          v-model="kitchen_furniture"-->
    <!--          class="non-selectable"-->
    <!--          :true-value="1"-->
    <!--          :toggle-indeterminate="false"-->
    <!--          :false-value="0"-->
    <!--          label="Кухонный гарнитур"-->
    <!--          color="primary"-->
    <!--        />-->
    <!--        <q-checkbox-->
    <!--          v-model="room_furniture"-->
    <!--          class="non-selectable"-->
    <!--          :true-value="1"-->
    <!--          :toggle-indeterminate="false"-->
    <!--          :false-value="0"-->
    <!--          label="Мебель в комнатах"-->
    <!--          color="primary"-->
    <!--        />-->
    <!--        <q-checkbox-->
    <!--          v-model="service_lift"-->
    <!--          class="non-selectable"-->
    <!--          :true-value="1"-->
    <!--          :toggle-indeterminate="false"-->
    <!--          :false-value="0"-->
    <!--          label="Грузовой лифт"-->
    <!--          color="primary"-->
    <!--        />-->
    <!--        <q-checkbox-->
    <!--          v-model="guarded_parking"-->
    <!--          class="non-selectable"-->
    <!--          :true-value="1"-->
    <!--          :toggle-indeterminate="false"-->
    <!--          :false-value="0"-->
    <!--          label="Охраняемая парковка"-->
    <!--          color="primary"-->
    <!--        />-->
    <!--      </div>-->
    <!--    </FlatProp>-->
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import FlatProp from "components/general/FlatProp"
import serverErrorVuex from "src/mixins/serverErrorVuex"
export default {
  mixins:[serverErrorVuex],
  components: {FlatProp},
  computed: {
    ...mapFields(
      'flats',
      [
        'flat',
        'flat.additionals',
        'flat.rooms_total',
        'flat.square',
        'flat.living_space',
        'flat.kitchen_space',
        'flat.property_type',
        'flat.bathroom_unit',
        'flat.floor',
        'flat.total_floors',
        'flat.balcony',
        'flat.renovation',
        'flat.windows',
        'flat.layout_changed',
        'flat.kitchen_furniture',
        'flat.room_furniture',
        'flat.service_lift',
        'flat.guarded_parking',
        'flat.guarded_territory',
        'flat.layout',
        'flat.lift',
        'flat.stove',
        'statuses',
        'layoutOptions',
        'balconyOptions',
        'stoveOptions',
        'renovationOptions',
        'sanuzels',
        'windowsOptions'
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
  methods:{
    touchBothFloors(){
      this.$v.total_floors.$touch()
      this.$v.floor.$touch()
    }
  },
  data () {
    return {

      roomQuantity: [
        {
          label: 'Студия',
          value: -1
        },
        {
          label: '1',
          value: 1
        },
        {
          label: '2',
          value: 2
        },
        {
          label: '3',
          value: 3
        },
        {
          label: '4+',
          value: 4
        }
      ],

    }
  },
  name: 'StepTwo'
}
</script>
<style scoped>
  .tooltip-card p{
    font-size: 12px;
    line-height: 1.5em;
    margin-bottom: 5px;
  }
  .tooltip-card p:last-child{
    margin-bottom: 0;
  }
  .stepTwoFloor{
    width: 180px;
  }
  .stepTwoTotalFloors{
    width: 227px
  }
  @media (max-width: 425px) {
    .stepTwoFloor{
      width: 100px;
    }
    .stepTwoTotalFloors{
      width: 150px
    }
  }
</style>
