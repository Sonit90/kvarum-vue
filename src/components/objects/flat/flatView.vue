<template>
  <div
    class="container"
    :class="$q.screen.gt.md?'q-ma-md':''"
  >
    <FlatGeneralView :id="id" />
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import FlatGeneralView from 'components/objects/flat/FlatGeneralView'
export default {
  components: {
    FlatGeneralView
  },
  computed: {
    ...mapFields(
      'flats',
      [
        'flat',
        'flat.coords',
        'title'
      ]

    ) },
  props: {
    id: {
      required: true,
      type: [String, Number]
    }
  }
}
</script>
<style>
  .container{
    max-width: 1200px;
    margin-left: auto;
    margin-right: auto;
  }
</style>
