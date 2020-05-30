<template>
  <LoginCard title="Восстановление пароля">
    <q-card-section>
      <div
        v-if="!success"
        class="q-gutter-md"
      >
        <q-input
          v-model="email"
          filled
          type="email"
          label="Адрес электронной почты*"
          hint="Укажите, на какой адрес электронной почты прислать ссылку для восстановления пароля"
          :error="$v.email.$error"
          autocomplete="new-email"
          @blur="$v.email.$touch()"
          @input="clearServerError('email')"
        >
          <template v-slot:prepend>
            <q-icon name="mail" />
          </template>
          <template v-slot:error>
            <span v-if="!$v.email.required">Укажите адрес электронной почты. </span>
            <span v-if="!$v.email.email">Укажите подходящий адрес электронной почты </span>
            <span v-if="!$v.email.server">{{ errors.get('email').join(' ') }}</span>
          </template>
        </q-input>

        <q-btn
          class="q-mt-lg"
          :loading="processing"
          type="submit"
          :disable="processing||email===''"
          no-caps
          color="primary"
          icon-right="send"
          label="Отправить"
          @click="forgot"
        >
          <template v-slot:loading>
            <div class="text-no-wrap">
              Работаем
            </div>
            <q-spinner-gears class="q-px-xs" />
          </template>
        </q-btn>
        <q-btn
          label="Войти"
          color="primary"
          flat
          class="float-right q-mt-lg"
          to="/login"
        />
      </div>
      <q-banner
        v-else
        rounded
        class="bg-primary text-white"
      >
        <template v-slot:avatar>
          <q-icon
            name="email"
            color="text-white"
          />
        </template>
        Ссылка для восстановления пароля была успешно отправлена Вам на почту!
      </q-banner>
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
import LoginCard from 'layouts/LoginCard'
import { required, email } from 'vuelidate/lib/validators'
import serverError from 'src/mixins/serverError'
export default {
  name: 'ForgotPassword',
  components: {
    LoginCard
  },
  data () {
    return {
      email: '',
      processing: false,
      success: false
    }
  },
  mixins: [serverError],
  methods: {
    forgot () {
      this.$v.$touch()

      if (this.$v.$invalid) {
        return
      }

      this.processing = true
      const { email } = this
      this.$store.dispatch('auth/forgotPassword', { email }).then(response => {
        this.processing = false
        console.log(response)
        this.$q.notify(response.data.message)
        this.success = true
      })
        .catch((err) => {
          this.processing = false
          this.$q.notify(err.response.data.message)
          this.collectErrors(err.response.data.errors)
          // this.$q.notify('Возникла ошибка при отправке письма')
        })
    }

  },
  validations: {
    email: {
      email,
      required,
      server: function () {
        return !this.hasServerError('email')
      }
    }
  }
}
</script>
