<template>
  <LoginCard title="Изменение пароля">
    <q-card-section v-if="haveId&&!success">
      <q-form
        class="q-gutter-md"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        @submit="onSubmit"
      >
        <q-input
          v-model="customCode"
          filled
          label="Код проверки"
          hint="Введите код проверки, отправленный Вам на email"
        >
          <template v-slot:prepend>
            <q-icon name="security" />
          </template>
        </q-input>
        <q-input
          v-model="password"
          filled
          :type="isPwd ? 'password' : 'text'"
          autocomplete="new-password"
          label="Новый пароль *"
          hint="Введите новый пароль"
        >
          <template v-slot:prepend>
            <q-icon name="vpn_key" />
          </template>
          <template v-slot:append>
            <q-icon
              :name="isPwd ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="isPwd = !isPwd"
            />
          </template>
        </q-input>

        <q-card-actions
          v-if="haveId"
          class="justify-between"
        >
          <q-btn
            :loading="processing"
            type="submit"
            :disable="processing"
            no-caps
            color="primary"
          >
            <div>Изменить пароль</div>
            <q-icon
              right
              size="1em"
              name="send"
            />
            <template v-slot:loading>
              <div class="text-no-wrap">
                Меняем пароль
              </div>
              <q-spinner-gears class="q-px-xs" />
            </template>
          </q-btn>
          <q-btn
            label="Войти"
            color="primary"
            flat
            class="float-right"
            to="/login"
          />
        </q-card-actions>
      </q-form>
    </q-card-section>
    <q-banner
      v-if="!haveId"
      rounded
      class="bg-negative text-white"
    >
      <template v-slot:avatar>
        <q-icon
          name="error"
          color="text-white"
        />
      </template>
      Эта страница служит для изменения пароля.
      Пройдите по ссылке, отправленной Вам на почту. Если вы хотите получить ссылку для изменения пароля на свой email - нажмите "Забыли пароль"
    </q-banner>
    <q-banner
      v-if="success"
      rounded
      class="bg-primary text-white"
    >
      <template v-slot:avatar>
        <q-icon
          name="check"
          color="text-white"
        />
      </template>
      Ваш пароль был успешно изменён.
    </q-banner>
    <template v-slot:after>
      <q-btn-group flat>
        <q-btn
          label="Зарегистрироваться"
          to="/register"
        />
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
import serverError from 'src/mixins/serverError'
export default {
  name: 'PasswordRecovery',
  components: { LoginCard },
  data () {
    return {
      password: '',
      processing: false,
      haveId: false,
      success: false,
      customCode: null,
      isPwd: true
    }
  },
  mixins: [serverError],
  mounted () {
    if (typeof this.id !== 'undefined') {
      this.haveId = true
    }
    this.customCode = this.code
  },
  methods: {
    onSubmit () {
      this.processing = true
      this.$q.loading.show({
        delay: 400, // ms
        message: 'Проверяем данные на сервере'
      })
      const { password, id, code } = this
      this.$store.dispatch('auth/resetPassword', { id, password, code }).then(response => {
        this.processing = false
        this.$q.loading.hide()
        this.$q.notify(response.data.message)
      })
        .catch((err) => {
          console.log(err)
          this.processing = false
          this.$q.loading.hide()
          this.$q.notify('Возникла ошибка при восстановлении пароля')
        })
    }

  },
  props:
    {
      code: [Number, String],
      id: {
        required: true
      }

    }
}
</script>

<style scoped lang="stylus">
    .text-caption
        margin-top: 5px
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
