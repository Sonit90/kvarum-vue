<template>
  <LoginCard title="Регистрация">
    <q-card-section
      :class="{'q-pa-sm':$q.screen.lt.md}"
      v-if="!registered"
    >
      <q-form
        class="q-gutter-sm"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
        @submit="onSubmit"
      >
        <q-input
          v-model="form.name"
          filled
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
          filled
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
          filled
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
          filled
          type="password"
          label="Пароль *"
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
        <q-input
          v-model="form.password_repeat"
          filled
          type="password"
          label="Повторите пароль *"
          hint="Повторите пароль"
          :error="$v.form.password_repeat.$error"
          @blur="$v.form.password_repeat.$touch()"
        >
          <template v-slot:prepend>
            <q-icon name="vpn_key" />
          </template>
          <template v-slot:error>
            <span v-if="!$v.form.password_repeat.required">Повторите пароль </span>
            <span v-if="!$v.form.password_repeat.minLength">Пароль должен быть, по крайней мере {{ $v.form.password_repeat.$params.minLength.min }} символов<br></span>
            <span v-if="!$v.form.password_repeat.sameAsPassword">Повтор пароля должен совпадать с паролем<br></span>
          </template>
        </q-input>
        <q-btn-toggle
          v-if="$q.screen.gt.md"
          v-model="form.type"
          no-caps
          push
          spread
          class="custom-spread"
          toggle-color="primary"
          :options="userTypes"
        />

        <q-select
          v-else
          v-model="form.type"
          filled
          :options="userTypes"
          map-options
          emit-value
        />

        <q-checkbox
          v-show="form.type==='agencyAgent'"
          v-model="form.noAgency"
          class="non-selectable"
        >
          Моего агентства нет в списке
        </q-checkbox>
        <q-input
          v-if="form.noAgency&&form.type==='agencyAgent'"
          v-model="form.myAgency"
          filled
          label="Название вашего агентства *"
          :error="$v.form.myAgency.$error"
          error-message="Укажите название вашего агентства"
          @blur="$v.form.myAgency.$touch()"
        />


        <ChooseAgency
          v-show="!form.noAgency&&form.type==='agencyAgent'"
          v-model="form.agency"
          filled
          label="Агентство *"
          :error="$v.form.agency.$error"
          @blur="$v.form.agency.$touch()"
        />
        <!-- eslint-disable -->
        <q-checkbox
          v-model="accept"
          class="non-selectable text-no-wrap"
          dense
          label="Я согласен с"
        ><q-btn
            label="условиями предоставления сервиса"
            no-caps
            color="primary"
            flat
            dense
            :size="$q.screen.lt.md?'small':'medium'"
            @click.stop="showDialog"
          />
        </q-checkbox>
        <!-- eslint-enable -->
        <q-card-actions class="justify-between q-px-none">
          <q-btn
            :loading="processing"
            type="submit"
            :disable="processing||!accept"
            no-caps
            :class="{'full-width q-mb-md':$q.screen.lt.md}"
            color="primary"
            label="Зарегистрироваться"
            icon-right="dvr"
          />
          <q-space />
          <span class="q-px-md">Уже зарегистрированы?</span><q-btn
            label="Войти"
            color="primary"
            outline
            class="q-px-md"
            :class="{'aligh-end':$q.screen.lt.md}"
            to="/login"
          />
        </q-card-actions>
      </q-form>
    </q-card-section>
    <q-card-section v-if="registered">
      <q-banner

        rounded
        class="bg-primary text-white"
      >
        <template v-slot:avatar>
          <q-icon
            name="check"
            color="text-white"
          />
        </template>
        Вы успешно зарегистрировались!
        Теперь Вам необходимо подтвердить свой профиль.
        Для этого пройдите по ссылке, отправленной Вам на почту.
      </q-banner>
    </q-card-section>
    <template v-slot:after>
      <q-btn-group flat>
        <q-btn
          label="Не пришло письмо?"
          to="/resend"
        />
        <q-btn
          label="Забыли пароль?"
          to="/forgot-password"
        />
      </q-btn-group>
    </template>
  </LoginCard>
</template>

<script>
import LoginCard from 'layouts/LoginCard'
import Terms from 'components/general/Terms'
import { required, minLength, email, sameAs, requiredIf } from 'vuelidate/lib/validators'
import ChooseAgency from "components/agencies/ChooseAgency"
import serverError from 'src/mixins/serverError'
import {mapFields} from "vuex-map-fields";
export default {
  name: 'Register',
  components: {
    LoginCard,
    ChooseAgency
  },
  data () {
    return {
      agency: null,
      accept: true,
      registered:false,
      form: {
        name: null,
        surname: null,
        email: null,
        password: null,
        password_repeat: null,
        noAgency: false,
        myAgency: null,
        type: 'agencyAgent'
      },
      processing: false,
      terms: false

    }
  },
  mixins: [serverError],
  meta: {
    title: 'Регистрация'
  },
  computed:{
    ...mapFields(
      'auth',
      [
        'userTypes'
      ]
    )},
  methods: {
    showDialog () {
      this.$q.dialog({
        component: Terms
      }).onOk(() => {
        console.log('OK')
        this.accept = true
      })
    },
    onSubmit () {
      this.$v.form.$touch()

      if (this.$v.form.$invalid) {
        return
      }

      this.processing = true
      this.$q.loading.show({
        delay: 400, // ms
        message: 'Регистрируемся'
      })
      const { name, surname, email, password, agency, noAgency, myAgency, type } = this.form
      this.$store.dispatch('auth/register', { name, email, surname, agency, password, myAgency, noAgency, type }).then(response => {
        this.$q.notify(response.data.message)
        this.registered=true
        // let id = response.data.profile.user_id
        //this.$router.push('/confirm?id=' + id)
      })
        .catch((err) => {
          console.log(err)
          console.log(err.response)
          this.$q.notify(err.response.data.message)
          this.collectErrors(err.response.data.errors)
        })
        .finally(()=>{
        this.processing = false
        this.$q.loading.hide()
      })
    }

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
        server: function (){
          return !this.hasServerError('email')
        }
      },
      myAgency: {
        requiredIf: requiredIf(function() {
          return this.form.noAgency && this.form.type === 'agencyAgent'
        })
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
        required,
        server: function () {
          return !this.hasServerError('password')
        }
      },
      password_repeat: {
        minLength: minLength(6),
        required,
        sameAsPassword: sameAs('password')
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
<style scoped lang="stylus">

  .text-caption
    margin-top: 5px
  h1
    font-size: 24px
    line-height: 1.5em
  .logo
    padding: 15px
    width:60%
    max-width:300px
    min-width:360px
  .firm-avatar
    width: 100%
    max-width: 30px
</style>
