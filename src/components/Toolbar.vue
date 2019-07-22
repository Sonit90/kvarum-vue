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
            <li class="dropdown"><a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="true">Услуги <span class="caret"></span></a>
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
      menu: false,
      services: [
        'IT-Обслуживание', 'Заправка картриджей', 'IP Телефония', 'Обслуживание 1C', 'Установка видеонаблюдения', 'Проектирование и монтаж сетей', 'Ремонт техники'
      ]
    }
  }
}
</script>

<style scoped >
    .dropdown-menu {
        position: absolute;
        top: 100%;
        left: 0;
        z-index: 1000;
        display: none;
        float: left;
        min-width: 160px;
        padding: 5px 0;
        margin: 2px 0 0;
        font-size: 14px;
        text-align: left;
        list-style: none;
        background-color: #fff;
        -webkit-background-clip: padding-box;
        background-clip: padding-box;
        border: 1px solid #ccc;
        border: 1px solid rgba(0, 0, 0, .15);
        border-radius: 4px;
        -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
        box-shadow: 0 6px 12px rgba(0, 0, 0, .175);
    }
    .navbar-right .dropdown-menu {
        left: -60%;
        right: auto;
    }
    .navbar-nav>li>.dropdown-menu {
        margin-top: 0;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
    ul.nav li.dropdown:hover>ul.dropdown-menu {
        display: block;
    }
    .nav>li, .nav>li a {
        position: relative;
        display: block;
    }
    ul.nav li>a {
        color: #474747;
        padding: 20px 18px;
        font-size: 120%;
        font-weight: 700;
        cursor: pointer;
    }
    ul.dropdown-menu li>a {
        padding: 10px 18px;
        font-weight: 700;
        background: transparent;
        display: inline-block;
        clear: both;
        white-space: nowrap;
    }
    .navbar-nav>li>a{
        line-height: 30px;
    }
    a{    text-decoration: none;}
    .nav>li>a:focus, .nav>li>a:hover {
        text-decoration: none;
        background-color: #eee;
    }
    ul.nav li>a:after {
        position: absolute;
        top: 100%;
        left: 15px;
        width: calc(100% - 30px);
        height: 2px;
        background: #2196f3;
        content: '';
        opacity: 0;
        transform: translateY(10px);
        -webkit-transform: translateY(10px);
        -moz-transform: translateY(10px);
        transition: all .3s;
        margin-top: -15px;
    }
    ul.nav li>a:after {
        position: absolute;
        top: 100%;
        left: 15px;
        width: calc(100% - 30px);
        height: 2px;
        background: #2196f3;
        content: '';
        opacity: 0;
        transform: translateY(10px);
        -webkit-transform: translateY(10px);
        -moz-transform: translateY(10px);
        transition: all .3s;
        margin-top: -15px;
    }
    .navbar-right {
        float: right!important;
        display: flex;
        padding-right: 60px;
    }
    ul.dropdown-menu li>a:after {
        position: absolute;
        top: 100%;
        left: 17px;
        width: calc(100% - 30px);
        height: 2px;
        background: #2196f3;
        content: '';
        opacity: 0;
        transform: translateY(10px);
        -webkit-transform: translateY(10px);
        -moz-transform: translateY(10px);
        transition: all .3s;
        margin-top: -5px;
    }
    .dropdown-menu>li>a {
        display: block;
        padding: 3px 20px;
        clear: both;
        font-weight: 400;
        line-height: 1.42857143;
        color: #333;
        white-space: nowrap;
    }
    ul{
        margin: 0;
    }
    ul>li>a:hover:after, ul>li>a:focus:after, ul>li>a:active:after{
        opacity: 1;
        -webkit-transform: translateY(0px);
        transform: translateY(0px);
    }
    .caret {
        display: inline-block;
        width: 0;
        height: 0;
        margin-left: 2px;
        vertical-align: middle;
        border-top: 4px dashed;
        border-top: 4px solid\9;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
    }
</style>
