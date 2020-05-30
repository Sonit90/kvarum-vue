<template>
  <FlatGeneral
    :id="id"
    style="max-width: 1200px;
    margin: 0 auto;"
    :show-profile="parseInt(showProfile)===1?true:false"
  />
</template>

<script>import FlatGeneral from 'components/objects/flat/FlatGeneralView'

export default {
  components: {
    FlatGeneral
  },
  props: {
    id: {
      required: true,
      type: [String, Number]
    },
    showProfile: {
      type:[String,Number],
      required: false,
      default:1
    }
  }
}
</script>
