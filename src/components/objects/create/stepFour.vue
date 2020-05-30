<template>
  <div class="q-gutter-sm">
    <h5>Дополнительная информация</h5>
    <div class="q-gutter-sm">
      <q-option-group
        v-model="useProfile"
        :options="options"
        color="primary"
        inline
        class="non-selectable"
      />

      <div
        v-if="Boolean(useProfile)"
        class="q-gutter-sm"
      >
        <q-input
          v-model="Pname"
          outlined
          label="Обращение"
          disable
        />

        <q-input
          v-model="Pphone"
          outlined
          label="Телефон"
          disable
        />
      </div>
      <div
        v-else
        class="q-gutter-sm"
      >
        <q-input
          v-model="name"
          outlined
          label="Обращение"
          :error="$v.name.$error"
          clearable
          @input="clearServerError('name')"
          @blur="$v.name.$touch()"
        >
          <template #error>
            <span v-if="!$v.name.required">Укажите имя </span>
            <span v-if="!$v.name.server">{{ errors.get('name').join(' ') }}</span>
          </template>
        </q-input>



        <q-field
          :error="$v.phone.$error"
          borderless
          no-error-icon
        >
          <VuePhoneNumberInput
            v-model="phone"
            style="width: 100%;"
            :error="$v.phone.$error"
            no-flags
            no-country-selector
            :border-radius="0"
            default-country-code="RU"
            :translations="{phoneNumberLabel: 'Номер телефона',example: 'Пример: '}"
            required
            clearable
            @update="phoneUpdate"
            @input="clearServerError('phone')"
            @phone-number-blur="blurPhone"
          />
          <template #error>
            <span v-if="!$v.phone.required">Укажите телефон </span>
            <span v-if="!$v.phone.phone">Укажите телефон в формате +7 966 555 15 15</span>
            <span v-if="!$v.phone.server&&errors.get('phone')">{{ errors.get('phone').join(' ') }}</span>
          </template>
        </q-field>
      </div>
    </div>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import VuePhoneNumberInput from 'vue-phone-number-input';
import 'vue-phone-number-input/dist/vue-phone-number-input.css';
import serverErrorVuex from "src/mixins/serverErrorVuex";
export default {
  name: 'StepFour',
  components:{VuePhoneNumberInput},
  mixins:[serverErrorVuex],
  data () {
    return {
      Pname: null,
      Pphone: null,
      Pemail: null,
      formattedPhone:null,
      options: [
        {
          label: 'Использовать данные профиля',
          value: 1
        },
        {
          label: 'Указать другие контактные данные',
          value: 0
        }
      ]

    }
  },
  computed: {
    ...mapFields(
      'flats',
      [
        'flat.name',
        'flat.phone',
        'flat.useProfile',
        'phoneValid',
        'errors',
        'isEditing'
      ]
    ),
    ...mapFields(
      'auth',
      ['profile'
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
    phoneUpdate(value){
      this.phoneValid=value.isValid
      this.formattedPhone=value.formatInternational
    },
    blurPhone(){
      this.phone=this.formattedPhone
      this.$v.phone.$touch()
    }

  },

  mounted () {
    if(!this.isEditing){
      this.name = this.profile.name
      this.phone = this.profile.phone_mobile
    }

    this.Pname = this.profile.name
    this.Pphone = this.profile.phone_mobile
  }
}
</script>

<style scoped>

</style>
