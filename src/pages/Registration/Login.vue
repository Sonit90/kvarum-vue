<template>
  <LoginCard title="Вход на сайт">
    <q-card-section class="q-pa-sm">
      <q-form
        class="q-gutter-md"
        @submit.prevent="onSubmit"
      >
        <q-input
          v-model="email"
          filled
          type="email"
          label="Адрес электронной почты*"
          hint="Введите адрес электронной почты"
        >
          <template v-slot:prepend>
            <q-icon name="mail" />
          </template>
        </q-input>

        <q-input
          v-model="password"
          filled
          type="password"
          label="Пароль *"
          hint="Введите пароль"
        >
          <template v-slot:prepend>
            <q-icon name="vpn_key" />
          </template>
        </q-input>
        <q-checkbox
          v-model="agree"
          class="non-selectable text-no-wrap"
          label="Я согласен с"
          dense
        >
          <q-btn
            label="условиями предоставления сервиса"
            no-caps
            color="primary"
            class="q-pa-none"
            flat
            dense
            :size="$q.screen.lt.md?'small':'medium'"
            @click.stop="showDialog"
          />
        </q-checkbox>


        <q-card-actions class="justify-between q-px-none">
          <q-btn
            :loading="processing"
            type="submit"
            :disable="!agree||processing"
            no-caps
            color="primary"
          >
            <div>Войти</div>
            <q-icon
              right
              size="1em"
              name="send"
            />
            <template v-slot:loading>
              <div class="text-no-wrap">
                Входим
              </div>
              <q-spinner-gears class="q-px-xs" />
            </template>
          </q-btn>
          <q-btn
            label="Забыли пароль?"
            color="primary"
            flat
            class="float-right"
            to="/forgot-password"
          />
        </q-card-actions>
      </q-form>
    </q-card-section>
    <template v-slot:after>
      <q-btn-group flat>
        <q-btn
          to="/register"
          label="Нет аккаунта? Зарегистрируйтесь!"
        />
        <q-btn
          to="/resend"
          label="Не пришло письмо?"
        />
      </q-btn-group>
    </template>
  </LoginCard>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import Terms from 'components/general/Terms'
import LoginCard from 'layouts/LoginCard'

export default {
  components: {
    LoginCard
  },
  computed: {
    ...mapFields(
      'auth',
      ['permissions'])
  },

  data () {
    return {
      agree: true,
      email: null,
      password: null,
      processing: false
    }
  },
  methods: {
    onSubmit () {
      this.processing = true
      const { email, password } = this
      this.$store.dispatch('auth/login', { email, password }).then(response => {
        console.log(response)
        this.processing = false
        this.$router.push('/')

        console.log(this.permissions)
        // this.$ability.update(this.permissions)
        console.log('pushing router')
        // let r = defineAbilitiesFor(response.data.profile)
        // console.log(r)
        // ability.update(r.rules)
        // console.log(this.$ability)
        // console.log(this.$ability.rules)
      })

        .catch((error) => {
          this.processing = false
          this.$q.notify(error.response.data.message)

          console.log('wrong login pass')
        })
    },
    showDialog () {
      this.$q.dialog({
        component: Terms
      }).onOk(() => {
        console.log('OK')
        this.agree = true
      })
    }

  }
}
</script>

<style scoped lang="stylus">
    h1
        font-size: 24px
        line-height: 1.5em
.logo
    padding: 20px
    width:60%
    max-width:300px
.login-card
    padding: 10px 20px
    width 600px
</style>
