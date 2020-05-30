<template>
  <q-avatar
    v-if="profile!==null&&typeof profile!=='undefined'"
    rounded
    color="primary"
    text-color="white"
    :size="size+'px'"
  >
    <q-img
      v-if="profile.avatar!==null&&profile.avatar!==''"
      :src="profile.avatar"
      basic
      style="width: 100%; height: 100%;"
    >
      <template v-slot:error>
        <span class="absolute-center text-white text-center transparent">{{ chars }}</span>
      </template>
    </q-img>
    <span
      v-else
      class="absolute-center text-white text-center transparent"
    > {{ chars }}</span>
  </q-avatar>
</template>
<script>
  export default {
    name: 'Avatar',
    props:{
      profile:{
        type:Object
      },
      size:{
        type: Number
      }
    },
    computed :{
      chars(){
      let result =''
        if(this.profile.name!==null&&typeof this.profile.name!=='undefined'){
          result+=this.profile.name.charAt(0)
        }
        if(this.profile.surname!==null &&typeof this.profile.surname!=='undefined'){
          result+=this.profile.surname.charAt(0)
        }
        if(result===''){
          return '#'+this.profile.user_id
        }
        return result

      }
    }
  }
</script>
