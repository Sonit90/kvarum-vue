<template>
  <q-layout
    view="lhh LpR lff"
    ref="mainLayout"
  >
    <q-header>
      <q-toolbar
        :class="$q.screen.gt.xs?'q-gutter-md':'q-pr-none'"
      >
        <q-btn
          dense
          flat
          round
          icon="menu"
          @click="drawer = !drawer"
        />
        <Breadcrumbs />
        <q-space />
        <q-btn-dropdown
          v-if="profile"
          stretch
          flat
          no-caps
          color="text-white"
        >
          <template v-slot:label>
            <div class="row q-gutter-sm items-center">
              <Avatar
                :profile="profile"
                :size="32"
              />
              <div class="text-center">
                {{ fio }}
              </div>
            </div>
          </template>
          <q-list class="non-selectable">
            <q-item
              v-close-popup
              clickable
              exact
              to="/profile"
            >
              <q-item-section>
                Мой профиль
              </q-item-section>
              <q-item-section avatar>
                <q-icon
                  color="primary"
                  name="person"
                />
              </q-item-section>
            </q-item>
            <q-item
              v-close-popup
              clickable
              @click="logOut"
            >
              <q-item-section>
                <q-item-label>Выйти</q-item-label>
              </q-item-section>
              <q-item-section avatar>
                <q-icon
                  color="primary"
                  name="exit_to_app"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <div v-else>
          <q-btn
            dense
            flat
            no-caps
            :to="'/register'"
          >
            Зарегистрироваться
          </q-btn>
          <q-btn
            dense
            flat
            no-caps
            :to="'/login'"
          >
            Войти
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawer"
      :mini="!drawer || miniState"
      :width="240"
      :breakpoint="420"
      show-if-above
      bordered
      content-class="bg-white"
    >
      <q-list
        padding
        class="q-pt-none non-selectable"
      >
        <q-item
          v-ripple
          clickable
          to="/"
        >
          <q-img
            class="q-ma-sm"
            contain
            transition="flip-left"
            :src="!miniState?'statics/logo.svg':'statics/logoHouse.svg'"
          />
          <!--          <q-img-->
          <!--            v-show="!miniState"-->
          <!--            basic-->
          <!--            class="q-ma-sm"-->
          <!--            contain-->
          <!--            :src="!miniState?'statics/logo.svg':'statics/logoHouse.svg'"-->
          <!--          />-->

          <!--          <q-avatar-->
          <!--            v-show="miniState"-->
          <!--            class="text-primary"-->
          <!--          >-->
          <!--            K-->
          <!--          </q-avatar>-->
        </q-item>
        <q-separator />
        <q-item
          v-ripple
          clickable
          to="/profile"
          exact
        >
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>

          <q-item-section>
            Мой профиль
          </q-item-section>
        </q-item>
        <q-item
          v-ripple
          clickable
          to="/"
          exact
        >
          <q-item-section avatar>
            <q-icon name="search" />
          </q-item-section>

          <q-item-section>
            Поиск объектов
          </q-item-section>
        </q-item>
        <q-item
          v-if="$can('create', 'flat')"
          v-ripple
          clickable
          to="/objects/add"
        >
          <q-item-section avatar>
            <q-icon name="add" />
          </q-item-section>

          <q-item-section>
            Добавить объект
          </q-item-section>
        </q-item>
        <q-item
          v-ripple
          clickable
          to="/agencies"
          exact
        >
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>

          <q-item-section>
            Агентства недвижимости
          </q-item-section>
        </q-item>
        <q-item
          v-ripple
          clickable
          to="/agents"
          exact
        >
          <q-item-section avatar>
            <q-icon name="person_pin_circle" />
          </q-item-section>

          <q-item-section>
            Поиск агента
          </q-item-section>
        </q-item>

        <q-expansion-item
          expand-separator
          icon="fas fa-calculator"
          label="Ипотечные калькуляторы"
          default-opened
          :content-inset-level="0.5"
        >
          <q-item
            v-ripple
            clickable
            to="/calcs/sberbank"
            exact
          >
            <q-item-section avatar>
              <q-icon
                name="fas fa-university"
                size="18px"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label>
                Сбербанк
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-expansion-item>



        <q-expansion-item
          v-if="$can('admin', 'site')"
          expand-separator
          icon="settings"
          label="Админка"
          default-opened
          :content-inset-level="0.5"
          class="layoutAdminMenu"
        >
          <q-item
            v-if="$can('edit', 'agencies')"
            v-ripple
            clickable
            to="/agencies/edit"
            exact
          >
            <q-item-section avatar>
              <q-icon
                name="business"
                size="18px"
              />
            </q-item-section>

            <q-item-section>
              <q-item-label>
                Управление агентствами
              </q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            v-if="$can('admin', 'site')"
            v-ripple
            clickable
            to="/users"
            exact
          >
            <q-item-section avatar>
              <q-icon
                name="person"
                size="18px"
              />
            </q-item-section>

            <q-item-section>
              Управление пользователями
            </q-item-section>
          </q-item>
          <q-item
            v-if="$can('reviewApplications', 'agency')"
            v-ripple
            clickable
            to="/agency-applications"
            exact
          >
            <q-item-section avatar>
              <q-icon
                name="remove_red_eye"
                size="18px"
              />
            </q-item-section>

            <q-item-section>
              Заявки в агентства
            </q-item-section>
          </q-item>
        </q-expansion-item>
      </q-list>

      <div
        v-show="drawer"
        class="absolute"
        style="top: 135px; right: -17px"
      >
        <q-btn
          v-show="$q.screen.gt.sm"
          dense
          round
          unelevated
          color="accent"
          icon="chevron_left"
          :style="'transform:rotate('+miniState*180+'deg)'"
          @click="miniState = !miniState"
        />
      </div>
    </q-drawer>

    <q-page-container>
      <q-page padding>
        <router-view :key="$route.path" />
        <q-page-scroller
          v-if="$q.screen.gt.md"
          position="bottom-right"
          :scroll-offset="150"
          :offset="[18, 18]"
        >
          <q-btn
            fab
            icon="keyboard_arrow_up"
            color="primary"
          />
        </q-page-scroller>
      </q-page>
    </q-page-container>
    <q-footer
      bordered
      class="bg-grey-1 text-black"
    >
      <div class="container q-px-md">
        <q-toolbar>
          <!--        <q-avatar>-->
          <!--          <img src="statics/logo.svg">-->
          <!--        </q-avatar>-->
          <q-toolbar-title>
            © {{ new Date().getFullYear() }} Kvarum
          </q-toolbar-title>
          <router-link to="/tos">
            Условия предоставления сервиса
          </router-link>
        </q-toolbar>
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import Breadcrumbs from 'components/Breadcrumbs'
import Avatar from 'components/general/Avatar'
import { mapFields } from 'vuex-map-fields'
export default {
  components: {
    Breadcrumbs,
    Avatar
  },
  data () {
    return {
      drawer: false,
      miniState: this.$q.localStorage.getItem('miniState'),
      isMounted: false
    }
  },
  computed: {
    ...mapFields(
      'auth',
      [
        'profile'
      ]
    ),
    fio () {
      return this.isMounted ? this.profile.name + ' ' + this.profile.surname : ''
    },
    menuHeight () {
      // console.log('calc(100% - 150px - ' + this.miniState * 100 + 'px )')
      return { marginTop: this.menuTop, height: 'calc(100% - 150px - ' + this.miniState * 100 + 'px )' }
    },
    menuTop () {
      return 150 - this.miniState * 100 + 'px'
    }
  },
  mounted () {
    this.isMounted = true
  },

  methods: {

    drawerClick (e) {
      // if in "mini" state and user
      // click on drawer, we switch it to "normal" mode
      if (this.miniState) {
        this.miniState = false

        // notice we have registered an event with capture flag;
        // we need to stop further propagation as this click is
        // intended for switching drawer to "normal" mode only
        e.stopPropagation()
      }
    },
    logOut () {
      this.$store.dispatch('auth/logout')
      if (this.$route.path !== '/')  this.$router.push('/')

    }
  },
  watch:{
    miniState(newValue){
        this.$q.localStorage.set('miniState', newValue)

    }
  }
}
</script>
<style>
  .q-drawer--mini .q-expansion-item__content {
    display: block;
    padding-left: 0!important;
  }
  .q-drawer--mini .layoutAdminMenu div.q-item{
    display: none;
  }
  .container{
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
