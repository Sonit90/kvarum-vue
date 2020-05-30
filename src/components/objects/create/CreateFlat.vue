<template>
  <div
    :class="$q.screen.lt.md?'':'q-pa-md'"
  >
    <!--    <div>-->
    <!--      <h2>DELETE THIS IN PROD</h2>-->
    <!--      <q-btn-toggle-->
    <!--        v-model="step"-->
    <!--        :options="[-->
    <!--          {label: 'One', value: 1},-->
    <!--          {label: 'Two', value: 2},-->
    <!--          {label: 'Three', value: 3},-->
    <!--          {label: 'Four', value: 4}-->
    <!--        ]"-->
    <!--        toggle-color="primary"-->
    <!--        text-color="black"-->
    <!--        size="lg"-->
    <!--        class="q-mx-md"-->
    <!--        no-caps-->
    <!--      />-->
    <!--    </div>-->
    <q-stepper
      ref="stepper"
      v-model="step"
      class="CreateFlatStepper"
      color="primary"
      animated
      :contracted="$q.screen.lt.md"
      keep-alive
      :header-nav="isEditing||submitted||stepReached>3"
    >
      <q-step
        :name="1"
        title="Адрес"
        caption="+ инф. о доме"
        active-icon="location_on"
        error-icon="error_outline"
        :done="step>1||stepReached>3"
        :error="stepOne"
      >
        <stepOne ref="stepOne" />
      </q-step>

      <q-step
        :name="2"
        title="О квартире"
        icon="assignment"
        error-icon="error_outline"
        :done="step > 2||stepReached>3"
        :error="stepTwo"
        style="min-height: 200px;"
      >
        <stepTwo />
      </q-step>

      <q-step
        :name="3"
        title="Цена и описание"
        :done="step > 3||stepReached>3"
        icon="fas fa-ruble-sign"
        active-icon="fas fa-ruble-sign"
        error-icon="error_outline"
        :error="stepThree"
        style="min-height: 200px;"
      >
        <stepThree ref="stepThree" />
      </q-step>

      <q-step
        :name="4"
        title="Контакты"
        caption="и доп. инф."
        icon="add_comment"
        style="min-height: 200px;"
      >
        <stepFour />
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation class="q-gutter-x-md">
          <q-btn
            v-if="edit"
            color="primary"
            label="Сохранить"
            @click="editFlat()"
          />
          <q-btn
            v-if="step<4"
            ref="nextStep"
            color="primary"
            label="Далее"
            @click="nextClick()"
          />
          <q-btn
            v-if="step===4&&!edit"
            :disabled="$v.all.$anyError"
            color="primary"
            label="Создать"
            @click="createFlat()"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            label="Назад"
            class="q-ml-sm"
            @click="$refs.stepper.previous()"
          />
        </q-stepper-navigation>
      </template>

      <!--      <template v-slot:message>-->
      <!--        <q-banner-->
      <!--          v-if="step === 1"-->
      <!--          class="bg-purple-8 text-white q-px-lg"-->
      <!--        >-->
      <!--          Campaign settings are important...-->
      <!--        </q-banner>-->
      <!--        <q-banner-->
      <!--          v-else-if="step === 2"-->
      <!--          class="bg-orange-8 text-white q-px-lg"-->
      <!--        >-->
      <!--          The ad group helps you to...-->
      <!--        </q-banner>-->
      <!--        <q-banner-->
      <!--          v-else-if="step === 3"-->
      <!--          class="bg-green-8 text-white q-px-lg"-->
      <!--        >-->
      <!--          The Ad template is disabled - this won't be displayed-->
      <!--        </q-banner>-->
      <!--        <q-banner-->
      <!--          v-else-->
      <!--          class="bg-blue-8 text-white q-px-lg"-->
      <!--        >-->
      <!--          The final step is creating the ad...-->
      <!--        </q-banner>-->
      <!--      </template>-->
    </q-stepper>
    <div
      v-if="creating||uploadStarted"
      class="fixed-bottom-right z-max"
    >
      <q-card style="width: 360px">
        <q-card-section v-if="creating">
          Создаём объект <q-spinner-dots
            v-if="!created"
            color="primary"
            size="24px"
          />
          <q-icon
            v-if="created"
            name="check"
            color="positive"
            size="24px"
          />
        </q-card-section>
        <q-card-section v-if="uploadStarted">
          <div class="row no-wrap q-col-gutter-md">
            <div class="col">
              <span class="q-pr-sm">
                Загружаем фото
              </span>
              <q-spinner-dots
                v-if="!filesUploaded"
                color="primary"
                size="20px"
              />
              <q-icon
                v-if="uploadStarted&&filesUploaded===true"
                name="check"
                color="positive"
                size="24px"
              />
            </div>
            <div class="col">
              <q-linear-progress
                size="25px"
                :value="progressValue"
                color="primary"
                stripe
              >
                <div class="absolute-full flex flex-center">
                  <q-badge
                    color="white"
                    text-color="primary"
                  >
                    {{ photosLoaded }} из {{ photosTotal }}
                  </q-badge>
                </div>
              </q-linear-progress>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import stepOne from 'components/objects/create/stepOne'
import stepFour from 'components/objects/create/stepFour'
import stepTwo from 'components/objects/create/stepTwo'
import stepThree from 'components/objects/create/stepThree'
import { mapFields } from 'vuex-map-fields'
import { required, numeric,  minValue } from 'vuelidate/lib/validators'
import serverErrorVuex from "src/mixins/serverErrorVuex";
import { ReactiveProvideMixin } from 'vue-reactive-provide'
import { scroll } from 'quasar'
const { getScrollTarget, setScrollPosition } = scroll
export default {
  name: 'CreateFlat',
  mixins:[serverErrorVuex,
    ReactiveProvideMixin({
    name: 'validations',
      include:['$v', 'uploader']
  })],
  components: {
    stepOne, stepTwo, stepThree, stepFour
  },
  props:{
    edit:{
      default:false,
      required:false,
      type:Boolean
    }
  },
  computed: {
    ...mapFields(
      'flats',
      ['isEditing',
        'flat',
        'flat.address',
        'flat.sub_locality_name',
        'flat.floor',
        'flat.total_floors',
        'flat.square',
        'flat.living_space',
        'flat.kitchen_space',
        'flat.rooms_total',
        'flat.phone',
        'phoneValid',
        'flat.useProfile',
        'flat.name',
        'flat.price',
        'flat.deal_status',
        'flat.img_order',
        'flat.description',
        'photosLoaded',
        'photosTotal',
        'filesUploaded',
        'uploadStarted',
        'created'
      ]
    ),
    stepOne () {
      return this.$v.geo.$error
    },
    stepTwo () {
      return this.$v.info.$error
    },
    stepThree () {
      return this.$v.priceGroup.$error
    },
    progressValue(){
      return parseFloat((this.photosLoaded/this.photosTotal).toFixed(2))
    }
  },
  created () {
    this.isEditing=this.edit
    if (this.isEditing === false) {
      this.$store.dispatch('flats/newFlat')
    }else{
      this.filesUploaded=true
    }
  },
  data () {
    return {
      creating: false,
      step: 1,
      submitted:false,
      stepReached:1
    }
  },
  methods: {
    createFlat () {
      this.submitted=true
      this.creating = true
      let flat = this.flat
      this.$store.dispatch('flats/createFlat', flat).then((response) => {
        console.log(response)
        this.created=true
        //let status = response.status
            if (this.filesUploaded) {
              const id = this.flat.id
              this.$router.push({ name: 'object', params: { id: id } })
            // const { order } = this
            // const id = this.flat.id
            // this.$store.dispatch('flats/finalize', { id, order }).then((response) => {
            //   let status = response.status
            //   console.log(response)
            //   switch (status) {
            //     case 200:
            //       this.$router.push({ name: 'object', params: { id: response.data.id } })
            //       break
            //     case 422:
            //       console.log('error')
            //       break
            //   }
            // })
            }
            console.log('created a flat')

      }).catch((e)=>{
        this.creating = false
        console.log('got validations errors')
        this.collectErrors(e.response.data.errors)
        this.showErrorPage()
      })
    },
    editFlat () {
      this.submitted=true
      this.creating = true
      let flat = this.flat
      this.$store.dispatch('flats/updateFlat', flat).then((response) => {
        console.log(response)
        this.created=true
        if (this.filesUploaded) {
          const id = this.flat.id
          this.$router.push({ name: 'object', params: { id: id } })
        }else{
          this.$refs.stepThree.$refs.fileUploader.upload()
        }
      }).catch((e)=>{
        this.creating = false
        console.log('got validations errors')
        this.collectErrors(e.response.data.errors)
        this.showErrorPage()
      })
    },
    showErrorPage(){
      console.log('scroll to error step')
      this.$v.$touch()
      // console.log(this.$v.geo.$error)
      // console.log(this.$v.info.$error)
      // console.log(this.$v.priceGroup.$error)

      if (this.$v.geo.$error) {
        this.step=1
      }
      else if (this.$v.info.$error) {
        this.step=2
      }
      else if (this.$v.priceGroup.$error) {
        this.step=3
      }
      this.scrollToError()
    },

    nextClick () {
      switch (this.step) {
        case 1:
          this.$v.geo.$touch()
          if (!this.$v.geo.$error) {
            this.$refs.stepper.next()
            this.scrollTo('stepper')
          }else{
            this.scrollToError()
          }
          break;
        case 2:
          this.$v.info.$touch()
          console.log(this.$v.info)
          if (!this.$v.info.$error) {
            this.$refs.stepper.next()
            this.scrollTo('stepper')
          }
          else{
            this.scrollToError()
          }
          break;
        case 3:
          this.$v.priceGroup.$touch()
          if (!this.$v.priceGroup.$error) {
            this.$refs.stepper.next()
            this.scrollTo('stepper')
            //TODO check if files have not been uploaded, and number of files >0
            console.log(this.$refs.stepThree)
            this.$refs.stepThree.$refs.fileUploader.upload()
            this.stepReached=4
          }
          else{
            this.scrollToError()
          }
          break
      }
    },
    scrollTo (e) {
      setTimeout(() => {
        let el = this.$refs[e].$el
        console.log(el)
        const target = getScrollTarget(el)
        const offset = el.offsetTop-20
        const duration = 200
        setScrollPosition(target, offset, duration)
      }, 100)
    },
    scrollToError () {
      setTimeout(() => {
        let el = document.querySelector(".q-field--error");
        const target = window
        const stepper = this.$refs['stepper'].$el
        const extraOffset=stepper.offsetTop
        const offset = el.offsetTop+extraOffset
        const duration = 200
        setScrollPosition(target, offset, duration)
      }, 100)
    }
  },
  validations() {
    let baseAll=['address','deal_status','description','floor',
      'price', 'photosTotal','rooms_total', 'square',
      'sub_locality_name', 'total_floors']
    let extendedAll=['name', 'phone']
    let baseRules={
        address: {
          required,
          server: function (){
            return !this.hasServerError('address')
          }
        },
        deal_status: {
          required,
          server: function (){
            return !this.hasServerError('deal_status')
          }
        },
        description: {
          required,
          server: function (){
            return !this.hasServerError('description')
          }
        },
        floor: {
          required,
          numeric,
          maxValue:function(value){
            if(this.total_floors!==null){
              return parseInt(value)<= this.total_floors
            }
            return true
          },
          minValue:minValue(1),
          server: function (){
            return !this.hasServerError('floor')
          }
        },
        geo: ['address', 'sub_locality_name'],
        info: ['floor', 'total_floors', 'square', 'rooms_total'],
        price: {
          required,
          numeric,
          minValue:minValue(30000),
          server: function (){
            return !this.hasServerError('price')
          }
        },
        photosTotal:{
          required, minValue:minValue(1)
        },
        priceGroup: ['price', 'deal_status', 'description', 'photosTotal'],
        stepFourGroup:['name', 'phone'],
        rooms_total:{
          required,
          server: function (){
            return !this.hasServerError('rooms_total')
          }
        },
        square: {
          required,
          server: function (){
            return !this.hasServerError('square')
          },
          minValue: minValue(this.living_space+this.kitchen_space),
        },
        sub_locality_name: {
          required,
          server: function (){
            return !this.hasServerError('sub_locality_name')
          }
        },
        total_floors: {
          required,
          numeric,
          server: function (){
            return !this.hasServerError('total_floors')
          }
        }
      }
    let stepFourRules={
      name:{
        required,
        server: function (){
          return !this.hasServerError('name')
        }
        },
        phone:{
          required,
          phone:function(){
            return this.phoneValid
          },
          server: function (){
            return !this.hasServerError('phone')
          }
        }
      };
    if (this.useProfile===1) {
      let result = baseRules
      result.all=baseAll
      console.log(result)
      return result
    } else {
      let base=baseRules
      base.all=baseAll.concat(extendedAll)
      let result={...base,...stepFourRules}
      console.log(result)
      return result
    }

  }
}
</script>
<style>
  .q-stepper--horizontal .q-stepper__step-inner {
    padding: 14px 24px;
  }
  @media (max-width: 425px) {
    .q-stepper--horizontal .q-stepper__step-inner {
      padding: 8px 8px 8px 16px;
    }
  }
</style>
