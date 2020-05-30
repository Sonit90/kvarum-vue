<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="row justify-center">
    <div
      v-if="loading"
      class="absolute-center"
    >
      <q-spinner
        color="primary"
        size="3em"
      />
    </div>
    <q-card
      v-else
      class="q-pa-md q-my-lg agency"
    >
      <div class="icon-container light-blue">
        <img
          v-if="agency.img"
          :src="imgUrl(agency.img)"
          :alt="agency.title"
        >
        <img
          v-else
          src="statics/logo_100.png"
        >
      </div>
      <h4 class="text-center">
        {{ agency.title }}
      </h4>

      <q-separator spaced />
      <div class="row q-pb-md">
        <q-item
          v-if="agency.address"
          class="col-6"
        >
          <q-item-section>
            <q-item-label>Адрес</q-item-label>
            <q-item-label caption>
              {{ agency.address }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-if="agency.website"
          class="col-6"
        >
          <q-item-section>
            <q-item-label>Сайт</q-item-label>
            <q-item-label caption>
              <a
                :href="agency.website"
                target="_blank"
              >{{ agency.website.replace(/(^\w+:|^)\/\//, '') }} </a>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-if="agency.phone"
          class="col-6"
        >
          <q-item-section>
            <q-item-label>Телефон</q-item-label>
            <q-item-label caption>
              <a
                class="text-grey-8"
                :href="'tel:'+agency.phone"
              >{{ agency.phone }} </a>
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-if="agency.email"
          class="col-6"
        >
          <q-item-section>
            <q-item-label>Email</q-item-label>
            <q-item-label caption>
              {{ agency.email }}
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item
          v-if="agency.director"
          class="col-6"
        >
          <q-item-section>
            <q-item-label>Руководитель</q-item-label>
            <q-item-label caption>
              {{ agency.director }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </div>
      <q-separator
        v-if="agency.description"
        spaced
      />
      <q-item v-if="agency.description">
        <q-item-section>
          <q-item-label>Описание</q-item-label>
          <q-item-label
            caption
            v-html="agency.description"
          />
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
export default {
  data () {
    return {
      loading: true,
      agency: null
    }
  },
  name: 'Agency',
  computed: {
    ...mapFields(
      'flats',
      [
        'title'
      ]
    )

  },
  mounted () {
    let id = this.id
    this.$store.dispatch('agencies/getAgency', id).then((response) => {
      console.log(response.data)
      this.agency = response.data
      this.title = this.agency.title
    })
      .catch((e) => {
        console.log(e)
        this.$q.notify('Не удалось получить агентства')
        console.log('Не удалось получить агентства')
      }).finally(()=>{
      this.loading = false
    })
  },
  methods: {
    imgUrl (url) {
      return process.env.URL + url
    }
  },
  props:
    { id: {
      required: true,
      type: [Number, String] } }
}
</script>
<style scoped>
    .icon-container {
        width: 300px;
        height: 200px;
        position: relative;
        margin: 0 auto;
        display: flex;
        align-items: center;
        padding-top: 40px;
        padding-bottom: 40px;
        justify-content: center;
    }
    .icon-container img{
        width: auto;
        max-width: 100%;
        height: auto;
    }
  .agency{
    min-width: 700px; max-width: 800px;
  }
    @media (max-width: 425px){
      .agency{
        min-width: 320px; max-width: 320px;
      }
    }

</style>
