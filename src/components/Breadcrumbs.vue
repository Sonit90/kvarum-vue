<template>
  <q-breadcrumbs
    v-show="$q.screen.gt.sm"
    active-color="white"
    separator-color="white"
    class="LayoutBreadcrumbs"
  >
    <q-breadcrumbs-el
      icon="home"
      to="/"
    />
    <q-breadcrumbs-el
      v-for="breadcrumb in breadCrumbs"
      :key="breadcrumb.name"
      :label="breadcrumb.name"
      :icon="breadcrumb.icon"
      :to="breadcrumb.link"
    />
  </q-breadcrumbs>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
export default {
  computed: {
    ...mapFields(
      'flats',
      [
        'title'
      ]
    ),
    breadCrumbs () {
      let breadCrumbList = this.$route.meta.breadcrumb
      if (typeof breadCrumbList === 'undefined') {
        breadCrumbList = []
        breadCrumbList.push({ name: 'Главная', link: '/' }, { name: this.title })
        return breadCrumbList
      }
      if ( typeof breadCrumbList[breadCrumbList.length - 1].link !== 'undefined') {
          //console.log('breadrumbs')
          //console.log(this.title)
          breadCrumbList.push({ name: this.title })
        }else{
          if(this.title !== null){
            breadCrumbList[breadCrumbList.length - 1].name=this.title
          }


        }

      return breadCrumbList
    }
  },
  name: 'Breadcrumbs'
}
</script>

<style lang="stylus">
  .q-breadcrumbs--last
    font-weight: bold
</style>
