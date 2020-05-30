<template>
  <q-field
    v-model="price"
    :label="label"
    :borderless="isBorderless"
    :disabled="disabled"
    :error="error?error:null"
    :dense="dense"
    class="currencyInput"
  >
    <template v-slot:control>
      <input
        :ref="uid"
        v-currency="currency"
        type="text"
        pattern="\d*"
        :placeholder="placeholder"
        :value="inputPrice"
        class="q-field__native text-left "
        :style="iStyle"
        @input="controlInput"
      >
    </template>
    <template
      v-if="price"
      v-slot:append
    >
      <q-icon
        name="cancel"
        class="cursor-pointer"
        @click.stop="clear"
      />
    </template>
    <template v-slot:before>
      <slot name="before" />
    </template>
    <template v-slot:after>
      <slot name="after" />
    </template>
    <template
      v-if="error"
      v-slot:error
    >
      <slot name="error" />
    </template>
  </q-field>
</template>

<script>
  import { CurrencyDirective, setValue } from 'vue-currency-input'
  import {uid} from 'quasar'
export default {
  name: 'CurrencyInput',
  directives: {
    currency: CurrencyDirective
  },
  data () {
    return {
      uid:null,
      price:null,
      inputPrice:null,
      currency: { currency: 'RUB', locale: 'ru-RU', precision: 0, distractionFree: false },
    }
  },
  props: {
    value:{
      required:false
    },
    currClass: {
      required: false
    },
    before:{
      required:false,
    },
    disabled: {
      required: false,
      default: false,
      type:Boolean
    },
    showCurrency:{
      required: false,
      default: true,
      type:Boolean
    },
    dense:{
      required:false,
      type:Boolean
    },
    error: {
      required: false,
      default: false,
      type:Boolean
    },
    label: {
      required: false
    },
    placeholder: {
      required: false
    },
    isOutlined: {
      required: false,
      default: false
    },
    isFlat: {
      required: false,
      default: false
    },
    isBorderless: {
      required: false,
      default: false,
      type:Boolean
    },
    stackLabel:{
      required:false,
      default:false,
      type:Boolean
    },
    inputClass: {
      required: false
    },
    inputStyle: {
      required: false
    },
    big: {
      required: false,
      type: Boolean,
      default: false
    }
  },
  created(){
    this.uid=uid()
    this.price=this.value
    this.inputPrice=this.value
  },
  computed: {
    iStyle () {
      // if(this.price===null){
      //   return 'font-size:14px; min-height:30px;'
      // }
      if (this.big && typeof this.inputStyle === 'undefined') {
        return 'font-size:18px;font-weight:700;min-height:30px;'
      }
      return this.inputStyle
    }
  },
  watch: {
    value: function (val) {
      this.price=val
      setValue(this.$refs[this.uid], val)

    },
  },

  methods:{
    controlInput(e){
      let value=e.target.value
      this.inputPrice=value
      if(value!==null&&value!==''){
        this.price=parseInt(value.replace(/\D/g,''))
        this.$emit('input', this.price)
      }else{
        this.clearPrice()
      }
    },
    clear(e){
      e.preventDefault()
      setValue(this.$refs[this.uid], null)
      this.clearPrice()
    },
    clearPrice(){
      this.price=null
      this.$emit('input', null)
    }
  }
}
</script>

<style>
.currencyInput .q-field__native{
  padding: 0!important;
}
</style>
