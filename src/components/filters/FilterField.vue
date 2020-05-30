<template>
  <div
    class="row filter-field items-center   col-xs-12"
    :class="{'no-wrap q-px-sm':$q.screen.lt.md,'q-px-md':$q.screen.gt.md, 'q-my-md':!noMargin}"
  >
    <span
      v-if="label"
      class="non-selectable"
      v-text="label"
    />
    <slot />
    <span
      v-if="this.$slots['after']"
      class="q-pl-sm"
    >
      <slot name="after" />
    </span>
  </div>
</template>

<script>
export default {
  name: 'FilterField',
  props: {
    label: {
      default: null,
      required: false
    },
    noMargin:{
      type:Boolean,
      default:false
}
  }
}
</script>

<style scoped>
.filter-field{
    border: 2px solid rgba(0,0,0,.1);
    transition: border-color 0.36s cubic-bezier(0.4, 0, 0.2, 1);
    min-height: 45px;
    justify-content: space-between;
    /*box-shadow: 0 1px 5px rgba(0,0,0,0.2), 0 2px 2px rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12);*/
    /*max-height: 3em;*/
}
.filter-field:hover,.filter-field:focus{
    border-color: var(--q-color-primary);
    border-width: 2px;
}
</style>
