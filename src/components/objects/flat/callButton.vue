<template>
  <div>
    <q-btn
      v-if="!showNumber"
      outline
      text-color="primary"
      class="full-width q-px-md q-py-xs"
      size="14px"
      label="Показать телефон"
      no-caps
      style="min-width: 250px"
      @click="showPhone"
    />
    <q-btn
      v-if="showNumber"
      outline
      text-color="primary"
      icon="phone"
      class="full-width q-px-md q-py-xs"
      size="14px"
      type="a"
      :label="realPhone"
      :href="realPhoneUrl"
      target="__blank"
      style="min-width: 250px"
    />
  </div>
</template>

<script>
    export default {
        name: "CallButton",
      data(){
        return{
          showNumber:false
        }
      },
      methods:{
        showPhone(){
          if(!this.showNumber){
            this.showNumber=true
          }

        }
      },
      computed: {
      useProfile(){
        if(this.flat.useProfile === 1 ||this.flat.useProfile===null){
          return true
        }else{
          return false
        }
      },
      realPhone(){
        return this.useProfile?this.flat.profile.phone_mobile:this.flat.phone
      },
      realPhoneUrl(){
        return 'tel:'+this.realPhone
      }
    },
      props: {
        flat: {
          required: true,
          type: Object
        }
      }
    }
</script>

<style scoped>

</style>
