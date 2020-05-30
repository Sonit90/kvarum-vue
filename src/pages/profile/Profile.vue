<template>
  <div>
    <profile
      v-if="component_profile!==null"
      :profile="component_profile"
      :mine="mine"
    />
    <p
      v-if="loading"
      class="absolute-center text-center"
    >
      Загружаем профиль<br>
      <q-spinner

        color="primary"
        size="3em"
      />
    </p>
    <div
      v-if="!loading&&component_profile===null"
      class="absolute-center text-center q-gutter-md"
    >
      <p>
        {{ message }}
      </p>
      <q-btn
        color="primary"
        icon="arrow_back"
        style="width:200px;"
        align="around"
        @click="$router.go(-1)"
      >
        Назад
      </q-btn>
      <q-btn
        icon="home"
        color="secondary"
        style="width:200px;"
        align="around"
        @click="$router.push('/')"
      >
        На главную
      </q-btn>
    </div>
  </div>
</template>

<script>
import profile from 'components/user/Profile'
import {mapFields} from "vuex-map-fields";
export default {
  components: { profile
  },
  props: ['id'],
  data() {
    return {
      component_profile: null,
      mine:false,
      loading:true,
      message:'Профиль не найден'
    }
  },
  computed: {

      ...mapFields(
        'flats',
        [
          'title'
        ]),
    ...mapFields(
      'auth',
      [
        'profile'
      ])
  },
  mounted() {
    let id =this.id
    if(id===null||typeof id==='undefined'){
      this.mine=true
      this.component_profile=this.$store.getters['auth/profile']
      this.title='Мой профиль'
      this.loading=false
    }else{
      this.$store.dispatch('auth/getProfile', id).then((response) => {
        console.log(response)
        this.component_profile=response.data
      }).catch((e)=>{
        console.log(e)
        console.log(e.response)
        if(e.response.status===404){
          this.message='Профиль не найден'
        }else{
          this.message='Не удалось загрузить профиль'
        }
        this.$q.notify(this.message)
      }).finally(()=>{
        this.loading=false
      })
    }

  }
}
</script>

<style scoped>

</style>
