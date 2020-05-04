<template>
  <div class="root">
    <div class="scroll-container">
      <div
        class="column  items-center flex-center"
        :class="{'q-pa-sm':$q.screen.gt.md}"
      >
        <q-card
          class="login-card q-mb-md q-pa-sm"
          square
        >
          <q-card-section class="text-center q-pa-md">
            <q-item
              v-ripple
              clickable
              to="/"
              class="flex-center"
            >
              <img
                src="/statics/logo.svg"
                alt="Лого Kvarum.ru"
                class="logo"
              >
            </q-item>
            <p class="text-caption text-grey q-my-none">
              Площадка от риэлторов для риэлторов
            </p>
            <h1 class="q-my-sm loginCardH1">
              {{ title }}
            </h1>
          </q-card-section>
          <slot />
        </q-card>
        <slot name="after" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginCard',
  props:
      {
        title: {
          type: String,
          required: true
        }

      }
}
</script>
<style scoped lang="stylus">
  .root
    display flex
    justify-content center
    align-items center
    height 100vh
  .scroll-container
    margin auto
    max-height 100%
    width 100%
  .loginCardH1
    font-size 20px
    line-height 1.5em
  .logo
    width 60%
    max-width 150px
    max-height 80px
  .login-card
    max-width 600px
    min-width 360px
    width 50vw
</style>
