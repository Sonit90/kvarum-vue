<template>
  <LoginCard title="Подтверждение электронной почты">
    <q-card-section class="q-gutter-sm">
      <p
        v-if="!haveId"
        class="text-body2 text-justify text-negative"
      >
        Ваша ссыка неверна, или вы попали сюда по ошибке.
        Для подтверждения вашего адреса электронной почты, перейдите по ссылке, отправленной Вам на почту.
      </p>
      <q-input
        v-else
        v-model="customCode"
        filled
        label="Код из письма"
        hint="Перейдите по ссылке из письма на почте, или вставьте код в это поле"
      >
        <template v-slot:prepend>
          <q-icon name="security" />
        </template>
      </q-input>
    </q-card-section>
    <q-card-actions
      v-if="haveId"
      class="justify-between q-px-md"
    >
      <q-btn
        label="Отправить"
        color="primary"
        no-caps
        :disable="typeof customCode==='undefined'"
        icon-right="send"
        @click="confirm()"
      />
      <div>
        <span class="q-px-md">Уже зарегистрированы?</span>
        <q-btn
          label="Войти"
          color="primary"
          outline
          to="/login"
        />
      </div>
    </q-card-actions>
    <template v-slot:after>
      <q-btn-group flat>
        <q-btn
          label="Зарегистрироваться"
          to="/register"
        />
        <q-btn
          v-if="!haveId"
          label="Войти"
          to="/login"
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
export default {
  name: 'Confirm',
  components: { LoginCard },
  data () {
    return {
      customCode: null,
      haveId: false
    }
  },

  props:
    {
      id: {
        required: true
      },
      code: [Number, String]

    },
  mounted () {
    this.customCode = this.code
    if (typeof this.id !== 'undefined') {
      this.haveId = true
      this.confirm()
    }
  },
  methods: {
    confirm () {
      this.$q.loading.show({
        delay: 400, // ms
        message: 'Подтверждаем адрес электронной почты'
      })
      const id = this.id
      const code = this.customCode
      this.$store.dispatch('auth/confirm', { id, code }).then(response => {
        console.log('confirm successfully')
        console.log(response)
        this.$router.push('/')
        this.$q.notify(response.data.message)
      })
        .catch((err) => {
          console.log(err)
          console.log(err.response)
          this.$q.notify(err.response.data.message)
        }).finally(()=>{
        this.$q.loading.hide()
      })
    }
  }

}
</script>
