<template>
  <q-item class="q-pl-none">
    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>

    <q-item-section
      side
    >
      <q-item-label>
        <span
          v-if="!bool"
          class="text-bold text-black"
        >
          <slot />
          <template v-if="val">
            {{ val }}
          </template>
        </span>
        <q-icon
          v-else
          size="22px"
          name="check"
          color="green"
        />
      </q-item-label>
    </q-item-section>
  </q-item>
</template>
<script>
    export default {
        name: 'FlatDetailedProperty',
      computed: {
          // yes(){
          //   if(typeof this.yesValue!=='undefined'){
          //     return this.yesValue
          //   }
          //   return 'Есть'
          // },
        // is() {
        //   return (typeof this.val!=='undefined'&&this.val!==null&&parseInt(this.val)===1)?this.yes:'Нет'
        // }
      },
      props: {
        title: {
          required: true,
          type: [String, Number]
        },
        val: {
          required: false,
          type: [String, Number]
        },
        bool: {
          required: false,
          type: Boolean,
          default:false
        }
      }
    }
</script>
