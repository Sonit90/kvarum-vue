<template>
  <LoginCard title="Запросить новое подтверждающее письмо">
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
          hint="Введите адрес электронной почты"
          :error="$v.email.$error"
          autocomplete="new-email"
          @blur="$v.email.$touch()"
          @input="clearServerError('email')"
          @keypress.enter="resend"
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
          :disable="processing||$v.email.$error||email===''"
          no-caps
          color="primary"
          icon-right="send"
          label="Отправить"
          @click="resend"
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
        Ссылка для подтверждения Вашего адреса электронной почты была успешно отправлена Вам на почту!
      </q-banner>
    </q-card-section>
    <template v-slot:after>
      <q-btn-group flat>
        <q-btn
          to="/register"
          label="Нет аккаунта? Зарегистрируйтесь!"
        />
        <q-btn
          to="/forgot-password"
          label="Забыли пароль?"
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
  name: 'Resend',
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
    resend () {
      this.$v.$touch()

      if (this.$v.$invalid) {
        return
      }

      this.processing = true
      const { email } = this
      this.$store.dispatch('auth/resend', { email }).then(response => {
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
