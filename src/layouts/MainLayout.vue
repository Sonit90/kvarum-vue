<template>
    <q-layout view="lhh lpR fff">

        <q-header elevated class="bg-grey">
            <q-toolbar class="q-gutter-md">
                <q-btn dense flat round icon="menu" @click="drawer = !drawer" />
<!--                <q-toolbar-title>-->
<!--                    <q-avatar>-->
<!--                        <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">-->
<!--                    </q-avatar>-->
<!--                    Title-->
<!--                </q-toolbar-title>-->
<!--                <q-breadcrumbs active-color="white" class="text-orange-13" separator-color="white">-->
<!--                    <q-breadcrumbs-el icon="home" to="/" />-->
<!--                    <q-breadcrumbs-el label="Docs" icon="widgets" to="/start/pick-quasar-flavour" />-->
<!--                    <q-breadcrumbs-el label="Breadcrumbs" icon="navigation" to="/vue-components/breadcrumbs" />-->
<!--                    <q-breadcrumbs-el label="Build" icon="build" />-->
<!--                </q-breadcrumbs>-->
                <Breadcrumbs />
                <q-space />
                    <q-btn-dropdown stretch flat no-caps
                                    color="text-white">
                        <template v-slot:label>
                            <div class="row q-gutter-sm items-center">
                                <q-avatar>
                                    <img src="https://printax27.ru/uploads/users/avatars/32/avatar/mafjzs.jpg">
                                </q-avatar>
                                <div class="text-center">
                                    Дмитрий Уральский
                                </div>
                            </div>
                        </template>
                        <q-list>
                            <q-item clickable v-close-popup to="/user/admin" >
                                <q-item-section>
                                  Админка
                                </q-item-section>
                                <q-item-section avatar>
                                    <q-icon color="primary" name="bluetooth" />
                                </q-item-section>
                            </q-item>

                            <q-item clickable v-close-popup >
                                <q-item-section>
                                    <q-item-label>Videos</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item clickable v-close-popup >
                                <q-item-section>
                                    <q-item-label>Articles</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-btn-dropdown>
            </q-toolbar>
        </q-header>

        <q-drawer
                v-model="drawer"
                :mini="!drawer || miniState"
                :width="200"
                :breakpoint="400"
                show-if-above
                bordered
                content-class="bg-grey-3"
        >

            <q-scroll-area style="height:150px; marginTop:150px; display:block; border-right: 1px solid #ddd">
                <q-list padding>
                    <q-item clickable v-ripple to="/" exact>
                        <q-item-section avatar>
                            <q-icon name="star" />
                        </q-item-section>

                        <q-item-section>
                            Главная
                        </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple to="/tickets/create">
                        <q-item-section avatar>
                            <q-icon name="inbox" />
                        </q-item-section>

                        <q-item-section>
                            Создать тикет
                        </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple to="/firms">
                        <q-item-section avatar>
                            <q-icon name="business" />
                        </q-item-section>

                        <q-item-section>
                            Фирмы
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple>
                        <q-item-section avatar>
                            <q-icon name="send" />
                        </q-item-section>

                        <q-item-section>
                            Send
                        </q-item-section>
                    </q-item>

                    <q-item clickable v-ripple>
                        <q-item-section avatar>
                            <q-icon name="drafts" />
                        </q-item-section>

                        <q-item-section>
                            Drafts
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-scroll-area>
            <q-img class="absolute-top" src="https://cdn.quasar.dev/img/material.png"  style="height:150px">
                <div class="absolute-bottom bg-transparent">
                    <q-avatar size="56px" class="q-mb-sm">
                        <img src="https://printax27.ru/uploads/users/avatars/32/avatar/mafjzs.jpg">
                    </q-avatar>
                    <div class="text-no-wrap text-weight-bold" :class="miniState?'invisible\t':''">Razvan Stoenescu</div>
                    <div class="text-no-wrap" :class="miniState?'invisible\t':''">@rstoenescu</div>
                </div>
            </q-img>

            <!--
              in this case, we use a button (can be anything)
              so that user can switch back
              to mini-mode
            -->
            <div class="absolute" style="top: 135px; right: -17px"  v-show="drawer">
                <q-btn
                        dense
                        round
                        unelevated
                        color="accent"
                        icon="chevron_left"
                        @click="miniState = !miniState"
                        :style="'transform:rotate('+miniState*180+'deg)'"
                />
            </div>
        </q-drawer>

        <q-page-container>
            <router-view />
        </q-page-container>

<!--        <q-footer elevated class="bg-grey-8 text-white">-->
<!--            <q-toolbar>-->
<!--                <q-toolbar-title>-->
<!--                    <q-avatar>-->
<!--                        <img src="https://cdn.quasar.dev/logo/svg/quasar-logo.svg">-->
<!--                    </q-avatar>-->
<!--                    Title-->
<!--                </q-toolbar-title>-->
<!--            </q-toolbar>-->
<!--        </q-footer>-->

    </q-layout>
</template>

<script>
import Breadcrumbs from 'components/Breadcrumbs'
export default {
  components: {
    Breadcrumbs
  },
  data () {
    return {
      drawer: true,
      miniState: false
    }
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
    }
  },
  computed: {
    menuTop () {
      return 150 - this.miniState * 100 + 'px'
    },
    menuHeight () {
      console.log('calc(100% - 150px - ' + this.miniState * 100 + 'px )')
      return { marginTop: this.menuTop, height: 'calc(100% - 150px - ' + this.miniState * 100 + 'px )' }
    }
  }
}
</script>
<style scoped>
</style>
