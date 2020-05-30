<template>
  <div class="column items-center">
    <div
      v-if="gotFlat"
      ref="forms"
      class="container-form"
    >
      <Flat

        v-show="category==='Квартира'"
        edit
      />
    </div>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import Flat from 'components/objects/create/CreateFlat'
export default {
  name: 'AddObject',
  components: {
    Flat
  },
  data() {
    return {
      gotFlat: false
    }
  },
  computed: {
    ...mapFields(
      'flats',
      ['flat',
        'action',
        'flat.type',
        'flat.category'
      ]
    )
  },
  created () {
    this.$store.dispatch('flats/getFlat', this.id).then((response) => {
      if(!this.$can('edit', {modelName:'flat', seller_id:parseInt(this.flat.seller_id)})){
        this.$q.notify('Вам не разрешено редактировать данный объект')
        this.$router.push('/')
      }else{
        this.gotFlat=true
      }

    })
      .catch((e) => {
        console.log(e)
        this.$q.notify('Не удалось получить объект')
      })
  },

  props: {
    id: {
      required: true,
      type: [String, Number]
    }
  }
}
</script>

<style scoped>
    .container-form{
        width: 900px;
    }
    @media (max-width: 900px) {
      .container-form{
        width: 100%;
      }
    }
</style>
