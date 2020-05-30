<template>
  <div class="row flex items-center q-my-md q-col-gutter-sm">
    <div class="col-md-3 col-xs-10 FlatPropTitle">
      <span
        v-if="required"
        class="text-negative text-h6 q-mr-sm"
      >*</span><span v-html="title" />
    </div>
    <div class="col-md-8 col-xs-12">
      <slot />
    </div>
    <div
      v-if="$slots.after"
      class="col-md-1 col-xs-1 FlatPropHint"
    >
      <slot
        name="after"
      />
    </div>
  </div>
</template>

<script>
    export default {
      name: "FlatProp",
      props:{
          title:{required:true},
        required:{required:false, default:false, type:Boolean},
      }
    }
</script>

<style scoped>
  @media (max-width: 425px) {
    .FlatPropHint{
order:-1;
    }
    .FlatPropTitle{
      order: -1;
    }

  }

</style>
