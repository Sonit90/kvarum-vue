<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div
    ref="top"
    class="row justify-center"
  >
    <div
      v-if="loading"
      class="absolute-center"
    >
      <q-spinner
        color="primary"
        size="3em"
      />
    </div>
    <div
      v-else

      class="AgenciesList"
      :class="$q.screen.gt.md?'q-pa-lg':'q-pa-sm'"
    >
      <q-list
        v-if="agencies!==null"
        bordered
        class="rounded-borders"
      >
        <q-item-label header>
          Агентства недвижимости
        </q-item-label>
        <div
          v-for="(item,index) in agencies"
          :key="item.id"
        >
          <q-item
            :to="{name:'agency',params:{id:item.id}}"
            class="q-pa-md agency-card"
            clickable
          >
            <q-item-section
              avatar
              class=" q-pa-sm"
              :class="$q.screen.gt.md?'col-2':'col-xs-12'"
            >
              <q-img
                contain
                no-default-spinner
                :src="item.img!==null?item.img:'statics/logo.svg'"
                class="firm-avatar"
              >
                <template v-slot:error>
                  <img
                    src="statics/logo.svg"
                    alt="Нет лого"
                  >
                </template>
              </q-img>
            </q-item-section>
            <q-item-section
              top
              :class="$q.screen.gt.md?'':'col-xs-12'"
            >
              <q-item-label
                lines="1"
                :class="$q.screen.lt.md?'q-py-md':''"
              >
                <span class="text-primary text-h6">{{ item.title }}</span>
              </q-item-label>
              <q-item-label
                caption
                lines="2"
                :class="$q.screen.lt.md?'q-py-md':''"
              >
                <span
                  v-if="item.address"
                  class="text-grey-8"
                > <q-icon name="location_on" />  {{ item.address }}</span>
              </q-item-label>
              <q-item-label
                v-if="item.director"
                caption
                lines="1"
                :class="$q.screen.lt.md?'q-py-md':''"
              >
                <span

                  class="text-grey-8"
                >Руководитель: {{ item.director }}</span>
              </q-item-label>
            </q-item-section>

            <q-item-section
              top
              :side="$q.screen.gt.md"
              :class="$q.screen.gt.md?' q-ml-md text-right justify-end':'agency-card-line col-xs-12'"
            >
              <div
                class="text-grey-8 "
                :class="$q.screen.gt.md?'q-gutter-xs':''"
              >
                <q-item-label
                  v-if="item.phone"
                  class="q-py-sm"
                  caption
                >
                  <q-icon
                    name="phone"
                    class="q-mr-sm"
                  /> <a
                    class="text-grey-8"
                    :href="'tel:'+item.phone"
                    @click.stop
                  >{{ item.phone }} </a>
                </q-item-label>
                <q-item-label v-if="item.email">
                  <q-icon name="email" />
                  {{ item.email }}
                </q-item-label>
                <q-item-label v-if="item.website">
                  <a
                    class="text-grey-8"
                    :href="item.website"
                    target="_blank"
                    @click.stop
                  >{{ item.website.replace(/(^\w+:|^)\/\//, '') }} </a>
                </q-item-label>
              </div>
            </q-item-section>
          </q-item>

          <q-separator v-if="index !== Object.keys(agencies).length - 1" />
        </div>
      </q-list>
      <q-pagination
        v-if="max>1"
        v-model="page"
        class="flex-center q-my-md"
        color="primary"
        :max="max"
        :boundary-links="true"
        @input="getAgencies"
      />
    </div>
  </div>
</template>

<script>
import {mapFields} from "vuex-map-fields";
import {scroll} from "quasar";
const { getScrollTarget, setScrollPosition } = scroll
export default {
  name: 'Agencies',
  data () {
    return {
      loading: true,
      page: 1,
      max: 5,
      perPage:10,
      agencies:[]
    }
  },
  methods: {
    scrollTo (e) {
      setTimeout(() => {
        let el = this.$refs[e]
        const target = window
        const offset = el.offsetTop
        const duration = 0
        setScrollPosition(target, offset, duration)
      }, 50)
    },
    getAgencies () {
      let page = this.page - 1
      this.$store.dispatch('agencies/getAgencies', page).then((response) => {
        console.log(response.data)
        this.agencies = response.data
        this.max = this.pageCount
        this.scrollTo('top')

      })
        .catch((e) => {
          console.log(e)
          this.$q.notify('Не удалось получить агентства')
          console.log('Не удалось получить агентства')
        }).finally(()=>{
        this.loading = false
      })
    }
  },
  computed:{
    ...mapFields(
      'agencies',
      ['count', 'pageCount']
    )
  },
  mounted () {
    this.getAgencies()
  }
}
</script>
<style scoped lang="stylus">
  .firm-avatar
    width: 100%
    min-width: 60px
    height: 45px
    padding: 0
  .AgenciesList
    max-width: 800px
  @media (max-width: 425px)
    .AgenciesList
      max-width: 360px
    .agency-card
      display flex
      flex-wrap wrap
    .agency-card-line
      margin-left: 0
</style>
