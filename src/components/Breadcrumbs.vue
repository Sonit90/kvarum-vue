<template>
    <div>
        <q-breadcrumbs active-color="white" class="text-orange-13" separator-color="white">
            <q-breadcrumbs-el icon="home" to="/" />
            <q-breadcrumbs-el v-for="(breadcrumb, index) in breadCrumbList" :key="index"  :label="breadcrumb.name" :icon="breadcrumb.icon" :to="breadcrumb.link" :class="{'active':!!breadcrumb.link}" />
<!--            <q-breadcrumbs-el label="Breadcrumbs" icon="navigation" to="/vue-components/breadcrumbs" />-->
<!--            <q-breadcrumbs-el label="Build" icon="build" />-->
        </q-breadcrumbs>
    </div>
</template>

<script>
export default {
  name: 'Breadcrumbs',
  data () {
    return {
      breadCrumbList: []
    }
  },
  mounted () {
    this.updateList()
  },
  watch: { '$route' () { this.updateList() }

  },
  methods: {
    // routeTo (pRouteTo) {
    //   if (this.breadCrumbList[pRouteTo].link) this.$router.push(this.breadCrumbList[pRouteTo].link)
    // },
    updateList () {
      console.log(this.$route.meta)
      this.breadCrumbList = this.$route.meta.breadcrumb
    }
  }
}
</script>

<style scoped>

</style>
