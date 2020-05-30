<template>
  <q-item class="flatProp q-py-none">
    <q-item-section>
      <q-item-label class="text-h6 text-bold">
        {{ title }} <span v-if="square">м<sup>2</sup></span> <span
          v-if="addition"
          class="text-grey-5"
        >{{ addition }}</span>
      </q-item-label>
      <q-item-label caption>
        {{ caption }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  props: {
    addition: {
      Number,
      required: false,
      type: String
    },
    square: {
      default:false,
      required: false,
      type: Boolean
    },
    caption: {
      required: true,
      type: [String, Number]
    },
    title: {
      required: true,
      type: [String, Number]
    }
  }
}
</script>

<style scoped>
.flatProp{
  max-width: 200px;
  flex: 1 0 auto;
}
</style>
