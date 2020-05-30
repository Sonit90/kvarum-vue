<template>
  <h1
    class="text-bold FlatTitle"
    v-html="title"
    :style="{fontSize:size}"
  />
</template>

<script>
  import {format} from 'quasar'
  const { capitalize} = format
    export default {
        name: "FlatTitle",
      props: {
        flat: {
          required: true,
          type: Object
        },
        short:{
          required:false,
          type:Boolean,
          defaut:false
        },
        size:{
          required:false,
          default:'16px',
          type:String
        }
      },
      computed: {
        title() {
          let result=''

          if(!this.short){
            result=(this.flat.action==='Продать'?'Продаётся ':'Сдаётся ')+Math.abs(this.flat.rooms_total)+`-комнатная ${this.flat.category},  ${this.flat.square}  м<sup>2</sup>`

          }else{
            result=Math.abs(this.flat.rooms_total)+`-комнатная ${this.flat.category},  ${this.flat.square}  м<sup>2</sup>`
          }
          if(this.flat.floor!==null&&this.flat.total_floors!==null){
            result+=', '+this.flat.floor+'/'+ this.flat.total_floors+' этаж'
          }

          return  capitalize(result.toLowerCase())
        }
      },
    }
</script>

<style scoped>
  .FlatTitle{
    margin-top: 0;
    line-height: 1.5em;
  }
  @media (max-width: 420px) {
    .FlatTitle{
      line-height: 21px;
      margin:0;
    }
  }
</style>
