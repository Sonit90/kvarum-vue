<template>
  <q-toolbar class="navbar">
    <q-toolbar-title>
      <a href="/">
        <img src="/assets/logo.svg">
      </a>
    </q-toolbar-title>
    <!--        <q-btn to="about" stretch flat label="О нас" />-->
    <!--        <q-btn stretch flat label="Вакансии"/>-->
    <!--        <q-btn-dropdown stretch flat label="Услуги"  >-->
    <!--            <q-list>-->
    <!--                <q-item  v-for="(service, index) in services" :key="index" clickable v-close-popup :tabindex="index">-->
    <!--                    <q-item-label>{{service}}</q-item-label>-->
    <!--                </q-item>-->
    <!--            </q-list>-->
    <!--        </q-btn-dropdown>-->
    <!--        <q-btn stretch flat label="Контакты"/>-->
    <!--        <q-btn stretch flat label="Вход для клиентов"/>-->
    <ul class="nav navbar-nav navbar-right">
      <li><a href="/about">О нас</a></li>
      <li><a href="/jobs/">Вакансии</a></li>
      <li class="dropdown">
        <a
          href="javascript:;"
          class="dropdown-toggle"
          data-toggle="dropdown"
          role="button"
          aria-haspopup="true"
          aria-expanded="true"
        >Услуги <span class="caret" /></a>
        <ul class="dropdown-menu">
          <li><a href="/it">IT - обслуживание</a></li><li><a href="/refill">Заправка картриджей</a></li><li><a href="/ip-phone">IP телефония</a></li><li><a href="/1c">Обслуживание 1С</a></li><li><a href="/video">Установка видеонаблюдения</a></li><li><a href="/lan">Проектирование и монтаж сетей</a></li><li><a href="/repair">Ремонт техники</a></li>
        </ul>
      </li>
      <li><a href="/contacts">Контакты</a></li>
      <li><a href="/contacts">Вход для клиентов</a></li>
    </ul>
  </q-toolbar>
</template>

<script>
export default {
  name: 'Toolbar',
  data () {
    return {
      menu: false
    }
  }
}
</script>

<style scoped >
</style>
