<template>
    <q-layout view="hHh lpR fff">

        <q-header class="bg-white " reveal>
            <Toolbar></Toolbar>
        </q-header>

        <q-page-container>
            <router-view/>
        </q-page-container>

        <q-footer class="bg-grey-8 text-white" elevated>
            <q-toolbar>
                <q-toolbar-title>
                    <img src="/assets/logo.svg">
                    Title
                </q-toolbar-title>
            </q-toolbar>
        </q-footer>

    </q-layout>
</template>

<script>
import Toolbar from 'components/Toolbar'
export default {
  data () {
    return {
    }
  },
  components: {
    Toolbar
  }
}
</script>
