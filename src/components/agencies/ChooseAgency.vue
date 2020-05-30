<template>
  <q-select
    v-if="agencies!==null"
    v-model="agency"
    :label="showLabel?'Агентство':undefined"
    :options="agencies"
    option-value="id"
    :dense="dense"
    emit-value
    map-options
    :input-debounce="inputDebounce"
    use-input
    error-message="Выберите агентство из списка"
    :placeholder="placeholder"
    :disable="disabled"
    class="non-selectable ChooseAgencySelect"
    input-class="no-wrap"
    :error="error"
    @filter="filterAgencies"
  >
    <template v-slot:after>
      <slot name="after" />
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey">
          Нет результатов
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:selected-item="no-option">
      <q-item>
        <q-item-section class="text-grey">
          Не найдены агентства по вашему запросу
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:selected-item="scope">
      <q-chip
        v-if="scope.opt.id"
        class="non-selectable agencyChip"
        square
        color="blue-grey-1"
        text-color="primary"
        v-bind="scope.itemProps"
        removable
        v-on="scope.itemEvents"
        @remove="removeAgency"
      >
        <q-img
          contain
          no-default-spinner
          :src="scope.opt.img!==null?scope.opt.img:'statics/logo.svg'"
          class="q-mr-md firm-avatar"
        >
          <template v-slot:error>
            <img
              src="statics/logo.svg"
              alt="Нет лого"
            >
          </template>
        </q-img>
        <span class="chooseAgencyTitle">
          {{ scope.opt.title }}
        </span>
      </q-chip>
    </template>
    <template v-slot:option="scope">
      <q-item
        class="non-selectable"
        v-bind="scope.itemProps"
        v-on="scope.itemEvents"
      >
        <q-item-section avatar>
          <q-img
            contain
            no-default-spinner
            :src="scope.opt.img!==null?scope.opt.img:'statics/logo.svg'"
            class="firm-avatar"
          >
            <template v-slot:error>
              <img
                src="statics/logo.svg"
                alt="Нет лого"
              >
            </template>
          </q-img>
        </q-item-section>
        <q-item-section>
          <q-item-label>{{ scope.opt.title }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script>
    export default {
      props:{
        value:{required: true},
        disabled:{required:false},
        error:{required:false},
        showLabel:{
          type:Boolean,
          default:true
        },
        inputDebounce:{
          type: Number,
          default: 100
        },
        dense:{
          type:Boolean,
          default:false
        },
        placeholder:{
          type:String,
          required:false
        }
      },
      data () {
        return {
          storedAgencies:null,
          agencies:null
        }
      },
      name: "ChooseAgency",
      methods:{
        removeAgency(){
          this.agency=null
          this.$emit('input', null)
        },
        filterAgencies (val, update) {
          if (val === '') {
            update(() => {
              this.agencies = this.storedAgencies
            })
            return
          }

          update(() => {
            const needle = val.toLowerCase()
            this.agencies = this.storedAgencies.filter(v => v.title.toLowerCase().indexOf(needle) > -1)
          })
        },

      },
      mounted() {
        this.$store.dispatch('agencies/getAgencies').then((response) => {
          console.log(response.data)
          this.agencies = response.data
          this.storedAgencies = response.data
        })
          .catch((e) => {
            console.log(e)
            this.$q.notify('Не удалось получить агентства')
            console.log('Не удалось получить агентства')
          })
      },
      computed:{
        agency: {
          get: function() {
            return parseInt(this.value)
          },
          set: function(value) {
            this.$emit('input', parseInt(value))
          }
        }

      }
    }
</script>
<style>
  .ChooseAgencySelect .q-field__native{
    flex-wrap: nowrap;
  }

</style>
<style scoped lang="stylus">

  .agencyChip
    width 220px
  .firm-avatar
    width: 100%
    max-width: 50px
    height: 25px
    padding: 0
    min-width: 40px
  .chooseAgencyTitle
    max-width: 150px
    min-width: 130px;
    text-overflow: ellipsis
    overflow: hidden
  @media (max-width: 425px)
    .firm-avatar
      max-width: 30px
    .agencyChip
      padding: 0.3em 0.5em
</style>
