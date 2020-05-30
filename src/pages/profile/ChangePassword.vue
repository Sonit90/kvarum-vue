<template>
  <div class="flex flex-center q-my-lg">
    <q-card
      style="width: 700px; max-width: 80vw;"
      class="q-pa-md q-gutter-y-md"
    >
      <q-card-section class="q-py-none">
        <div class="text-h6">
          Сменить пароль
        </div>
      </q-card-section>
      <q-card-section>
        <q-input
          v-model="password"
          type="password"
          label="Старый пароль *"
          :error="$v.password.$error"
          autocomplete="current-password"
          @blur="$v.password.$touch()"
          @input="clearServerError('password')"
        >
          <template v-slot:error>
            <span v-if="!$v.password.required">Укажите ваш текущий пароль. </span>
            <span v-if="!$v.password.minLength">Пароль должен быть не короче {{ $v.password.$params.minLength.min }} символов</span>
            <span v-if="!$v.password.server">{{ errors.get('password').join(' ') }}</span>
          </template>
        </q-input>
        <q-input
          v-model="newPassword"
          type="password"
          label="Новый пароль *"
          :error="$v.newPassword.$error"
          autocomplete="new-password"
          @blur="$v.newPassword.$touch()"
          @input="clearServerError('newPassword')"
        >
          <template v-slot:error>
            <span v-if="!$v.newPassword.required">Укажите новый пароль. </span>
            <span v-if="!$v.newPassword.minLength">Пароль должен быть не короче {{ $v.newPassword.$params.minLength.min }} символов</span>
            <span v-if="!$v.newPassword.server">{{ errors.get('newPassword').join(' ') }}</span>
          </template>
        </q-input>
        <q-input
          v-model="newPasswordRepeat"
          type="password"
          label="Повторите пароль *"
          :error="$v.newPasswordRepeat.$error"
          autocomplete="password-repeat"
          @blur="$v.newPasswordRepeat.$touch()"
          @input="clearServerError('newPasswordRepeat')"
        >
          <template v-slot:error>
            <span v-if="!$v.newPasswordRepeat.required">Повторите пароль. </span>
            <span v-if="!$v.newPasswordRepeat.sameAsPassword">Повтор пароля должен совпадать с новым паролем</span>
            <span v-if="!$v.newPasswordRepeat.minLength">Повтор пароля должен быть не короче {{ $v.newPasswordRepeat.$params.minLength.min }} символов</span>
            <span v-if="!$v.newPasswordRepeat.server">{{ errors.get('newPasswordRepeat').join(' ') }}</span>
          </template>
        </q-input>
      </q-card-section>
      <q-card-actions>
        <q-btn
          outline
          label="Сохранить"
          :loading="processing"
          :disable="processing"
          icon-right="send"
          color="primary"
          @click="changePassword"
        />
        <q-btn
          outline
          label="Отмена"
          class="q-px-md"
          :disable="processing"
          :to="'/profile'"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
  import { minLength,required, sameAs	} from 'vuelidate/lib/validators'
  import serverError from 'src/mixins/serverError'
    export default {
        name: "ChangePassword",
      mixins: [serverError],
      data() {
        return {
          password:null,
          newPassword: null,
          newPasswordRepeat: null,
          processing:false
        }
      },
      methods: {
        changePassword() {
          this.$v.$touch()
          if (this.$v.$invalid) {
            return
          }
          this.processing = true
          let {password, newPassword, newPasswordRepeat}=this
          this.$store.dispatch('auth/changePassword', {password, newPassword, newPasswordRepeat}).then(response => {
            console.log(response)
            this.$q.notify('Пароль успешно изменён')
            this.$router.push('/profile')
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
        }
      },
      validations: {
          password: {
            minLength: minLength(6),
            required,
            server: function () {
              return !this.hasServerError('password')
            }
          },
        newPassword: {
          minLength: minLength(6),
          required,
          server: function () {
            return !this.hasServerError('newPassword')
          }
        },
        newPasswordRepeat: {
          minLength: minLength(6),
          sameAsPassword:sameAs('newPassword'),
          required,
          server: function () {
            return !this.hasServerError('newPasswordRepeat')
          }
        }
    }
  }
</script>

<style scoped>

</style>
