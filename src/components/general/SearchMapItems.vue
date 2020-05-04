<template>
  <q-card class="q-pa-sm q-mb-md  grid-style-transition full-height">
    <q-card-section class="row q-py-none q-px-sm">
      <span
        class="text-grey"
        v-text="flatCount"
      />
      <q-space />
      <q-btn
        icon="close"
        flat
        size="10px"
        round
        dense
        v-close-popup
      />
    </q-card-section>
    <q-card-section
      class="row q-pa-xs"
      v-for="(flat, index) in flats"
      :key="flat.id"
    >
      <SearchMapItem :flat="flat" />
      <q-separator
        color="grey-5"
        v-if="(index+1)!==flats.length"
        class="q-my-sm"
      />
    </q-card-section>
  </q-card>
</template>

<script>
    import SearchMapItem from "components/general/SearchMapItem";
    export default {
        name: "SearchMapItems",
      components: {SearchMapItem},
      computed: {
        flatCount() {
          return this.flats.length+' '+this.$declOfNum(this.flats.length,['объект', 'объекта', 'объектов'])
        }
      },
      props: {
        flats: {
          type: Array,
          required:true
        },
      },
    }
</script>

<style scoped>

</style>
