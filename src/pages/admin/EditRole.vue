<template>
  <div
    class="row justify-center full-width q-pa-md q-gutter-lg"
  >
    <q-card
      class="flex-center q-pa-md"
      style="min-width: 600px; max-width: 900px"
    >
      <q-card-section>
        <q-input
          v-model="role.name"
          label="Имя"
        />
        <q-input
          v-model="role.description"
          label="Описание"
        />
        <!--        <q-select-->
        <!--          label="Правило"-->
        <!--          v-model="role.ruleName"-->
        <!--          v-if="ruleOptions!==null"-->
        <!--          :options="ruleOptions"-->
        <!--        />-->
        <q-select
          v-model="role.children"
          multiple
          :options="childrenOptions"
          label="Права"
          use-chips
          emit-value
          map-options
        />
        <q-card-actions class="q-pl-none">
          <q-btn
            color="positive"
            label="Сохранить"
            @click="updateRole"
          />
        </q-card-actions>
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
  export default {
    name: 'EditRole',
    data () {
      return {
       role:{},
        ruleOptions:null,
        childrenOptions:[]
      }
       },
    props:{
      name:{
        type:String,
        requred:true
      }
    },
    mounted () {
      this.$q.loading.show()
      let name = this.name
      this.$store.dispatch('mystore/getRole', {name}).then((response) => {
        this.role=response.data.role
        this.role.children=[]
        this.ruleOptions=Object.keys(response.data.rules)
        let children = response.data.children
        Object.values(children).forEach(e => {
          let child={}
          child.label=`${e.name} (${e.description})`
          child.value=e.name
          this.childrenOptions.push(child)
          this.role.children.push(e.name)
        });

        this.$q.loading.hide()
      })
    },
    methods:{
      updateRole(){
        //TODO UPDATE ROLE
      }
    }
  }
</script>

<style scoped>

</style>
