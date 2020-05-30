<template>
  <q-dialog
    v-model="show"
  >
    <q-card
      style="width: 700px; max-width: 80vw;"
      class="q-pa-md"
    >
      <q-card-section class="row items-center">
        <div class="text-h6">
          Создание пользователя
        </div>
        <q-space />
        <q-btn
          v-close-popup
          icon="close"
          flat
          round
          dense
        />
      </q-card-section>

      <q-card-section class="q-gutter-lg">
        <q-input
          v-model="form.name"
          label="Имя *"
          hint="Ваше имя"
          :error="$v.form.name.$error"
          @blur="$v.form.name.$touch()"
          @input="clearServerError('name')"
        >
          <template v-slot:error>
            <span v-if="!$v.form.name.required">Укажите ваше имя. </span>
            <span v-if="!$v.form.name.minLength">Имя должно быть не короче {{ $v.form.name.$params.minLength.min }} символов</span>
            <span v-if="!$v.form.name.server">{{ errors.get('name').join(' ') }}</span>
          </template>
        </q-input>
        <q-input
          v-model="form.surname"
          label="Фамилия *"
          hint="Ваша фамилия"
          :error="$v.form.surname.$error"
          @blur="$v.form.surname.$touch()"
          @input="clearServerError('surname')"
        >
          <template v-slot:error>
            <span v-if="!$v.form.surname.required">Укажите вашу фамилию. </span>
            <span v-if="!$v.form.surname.server">{{ errors.get('surname').join(' ') }}</span>
          </template>
        </q-input>
        <q-input
          v-model="form.email"
          type="email"
          label="Email *"
          hint="Ваш адрес электронной почты"
          :error="$v.form.email.$error"
          autocomplete="new-email"
          @blur="$v.form.email.$touch()"
          @input="clearServerError('email')"
        >
          <template v-slot:error>
            <span v-if="!$v.form.email.required">Укажите адрес электронной почты. </span>
            <span v-if="!$v.form.email.email">Укажите подходящий адрес электронной почты </span>
            <span v-if="!$v.form.email.server">{{ errors.get('email').join(' ') }}</span>
          </template>
        </q-input>
        <q-input
          v-model="form.password"
          type="password"
          label="Пароль"
          hint="Введите пароль"
          :error="$v.form.password.$error"
          autocomplete="new-password"
          @blur="$v.form.password.$touch()"
          @input="clearServerError('password')"
        >
          <template v-slot:prepend>
            <q-icon name="vpn_key" />
          </template>
          <template v-slot:error>
            <span v-if="!$v.form.password.required">Укажите пароль. </span>
            <span v-if="!$v.form.password.minLength">Пароль должен быть не короче {{ $v.form.password.$params.minLength.min }} символов</span>
            <span v-if="!$v.form.password.server">{{ errors.get('password').join(' ') }}</span>
          </template>
        </q-input>

        <q-select
          v-model="form.roles"
          multiple
          :options="rolesOptions"
          label="Роли пользователя"
          use-chips
          emit-value
          map-options
          :error="$v.form.roles.$error"
          @blur="$v.form.roles.$touch()"
        >
          <template v-slot:error>
            <span v-if="!$v.form.roles.required">Выберите хотя бы одну роль. </span>
          </template>
        </q-select>

        <q-btn-toggle
          v-model="form.type"
          no-caps
          push
          spread
          class="custom-spread"
          toggle-color="primary"
          :options="userTypes"
        />
        <ChooseAgency
          v-model="form.agency"
          :disabled="form.type!=='agencyAgent'"
          :error="$v.form.agency.$error"
          @blur="$v.form.agency.$touch()"
        />
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          outline
          :loading="processing"
          :disable="processing"
          label="Создать"
          icon-right="add"
          color="primary"
          @click="createUser"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
  import { required, minLength, email, requiredIf } from 'vuelidate/lib/validators'
  import serverError from 'src/mixins/serverError'
  import { mapFields } from 'vuex-map-fields'
  import ChooseAgency from "components/agencies/ChooseAgency"
  export default {
    name: 'CreateUser',
    components: {ChooseAgency},
    mixins:[serverError],
    props: ['value'],
    data () {
      return {
        processing:false,
        rolesOptions:[],
        form:{email:null, password:null, name:null, surname:null, agency:null, type:'agencyAgent', roles:['user']},
      }
    },

    computed:{
      ...mapFields(
        'admin',
        [
          'roles'
        ]
      ),
      ...mapFields(
        'auth',
        [
          'userTypes'
        ]
      ),
      show: {
        get: function() {
          return this.value
        },
        set: function(value) {
          this.$emit('input', value)
          console.log(value)
        }
      }
    },
    methods:{
      createUser(){
        this.$v.form.$touch()
        if (this.$v.form.$invalid) {
          return
        }
        this.processing = true
        Object.keys(this.form).forEach((key) => (this.form[key] == null) && delete this.form[key]) //Удаляем null значения
        const { name, surname, email, password, agency, type, roles } = this.form
        this.$store.dispatch('admin/createUser', { name, email, surname, agency, password, type, roles }).then(response => {
          this.$q.notify('Пользователь успешно создан')
          this.form={email:null, password:null, name:null, surname:null, agency:null, type:'agencyAgent', roles:['user']}
          //Object.assign(this.$data, this.$options.data.apply(this))
          this.$v.$reset()
          //this.show=false
        })
          .catch((err) => {
            console.log(err)
            console.log(err.response)
            this.$q.notify(err.response.data.message)
            this.collectErrors(err.response.data.errors)
          })
          .finally(()=>{
            this.processing = false
          })
      },
      loadRoles(){
        this.$store.dispatch('admin/getRoles').then((response) => {
          console.log(response)
          this.rolesOptions=Object.keys(response.data)
        })
      }
    },
    watch : {
      value(newVal){
        this.show=newVal
        if(this.show===false){
          //Object.assign(this.$data, this.$options.data.apply(this))
          this.form={email:null, password:null, name:null, surname:null, agency:null, type:'agencyAgent', roles:['user']}
          this.$v.$reset()
        }
      }
    },
    mounted () {
      this.loadRoles()
    },
    validations: {
      form: {
        agency: {
          requiredIf: requiredIf(function() {
            return this.form.type === 'agencyAgent' && !this.form.noAgency
          })
        },
        email: {
          email,
          required,
          server: function () {
            return !this.hasServerError('email')
          }
        },
        roles:{
          required
        },
        name: {
          minLength: minLength(2),
          required,
          server: function () {
            return !this.hasServerError('name')
          }
        },
        password: {
          minLength: minLength(6),
          server: function () {
            return !this.hasServerError('password')
          }
        },
        surname: {
          required,
          server: function () {
            return !this.hasServerError('surname')
          }
        }
      }

    }
  }
</script>
<style lang="stylus">
  .custom-spread button:first-child
    flex: 18000 1 0%
</style>
