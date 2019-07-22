<template>
    <div class="column q-pa-md items-center">
        <q-card class="login-card"   style="max-width: 600px; min-width:360px;">
            <q-card-section class="text-center">
            <img src="https://printax27.ru/images/logo.svg" alt="Лого Printax27.ru" class="logo">
            </q-card-section>
            <q-card-section>
        <q-form
                @submit="onSubmit"
                class="q-gutter-md"
        >
            <q-input
                    filled
                    v-model="email"
                    type="email"
                    label="Адрес электронной почты*"
                    hint="Введите адрес электронной почты"
            >
                <template v-slot:prepend>
                    <q-icon name="mail" />
                </template>
            </q-input>

            <q-input
                    filled
                    type="password"
                    v-model="password"
                    label="Пароль *"
                    hint="Введите пароль"
            >
                <template v-slot:prepend>
                    <q-icon name="vpn_key" />
                </template>
            </q-input>

            <q-checkbox v-model="agree" class="non-selectable"  >
                    Я согласен с  <q-btn label="условиями предоставления сервиса" type="a" to="/tos" no-caps color="primary" class="q-pa-xs"  flat />

            </q-checkbox>

            <q-card-section class="bottom-line">
                <q-btn :loading="processing" type="submit" :disable="!agree||processing" no-caps color="primary">
                    <div>Войти</div>
                    <q-icon right size="1em" name="send" />
                    <template v-slot:loading>
                        <div class="text-no-wrap">Входим</div>
                        <q-spinner-gears class="q-px-xs"/>

                    </template>
                </q-btn>
                <q-btn label="Забыли пароль?" color="primary" flat class="float-right" />
            </q-card-section>
        </q-form>
            </q-card-section>
        </q-card>
        <q-btn to="/user/resend" flat class="q-pa-md" type="a" label="Не пришло письмо?" />
    </div>
</template>

<script>

import { Notify } from 'quasar'
export default {
  data () {
    return {
      email: '',
      password: '',
      agree: true,
      processing: false
    }
  },

  methods: {
    onSubmit () {
      this.processing = true
      const { email, password } = this
      this.$store.dispatch('mystore/login', { email, password }).then(response => {
        if (response.success) {
          this.processing = false
          Notify.create({
            message: 'Успешный вход'
          })
          this.$router.push('/')
          console.log('pushing router')
        } else {
          this.processing = false
          Notify.create({
            message: 'Неправильный логин или пароль'
          })
          console.log('wrong login pass')
        }
      })
        .catch(() => {
          this.processing = false
          Notify.create({
            message: 'Неправильный логин или пароль'
          })
          console.log('wrong login pass')
        })
    }

  }
  // mounted () {
  //   console.log('Created hook')
  //   this.$store.dispatch('mystore/checkToken').then(() => {
  //     console.log('WE got token')
  //     setTimeout(() => {
  //       this.$router.push('/')
  //     }, 1500)
  //     console.log('navigated to ListView')
  //   }).catch(() => {
  //     console.log('mounted catch block')
  //   })
  // }
}
</script>

<style scoped lang="stylus">
.logo
    padding: 20px
    width:60%
    max-width:300px
.login-card
    padding: 10px 20px
    width 600px
.bottom-line
   padding 15px 0
</style>
