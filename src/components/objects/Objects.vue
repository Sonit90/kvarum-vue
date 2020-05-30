<template>
  <div
    ref="top"
    :class="{'q-pa-md':$q.screen.gt.md, 'absolute-full q-pa-sm full-height':showMap, 'container':!showMap}"
  >
    <q-table
      title="Объекты"
      :data="data"
      :columns="cols"
      row-key="id"
      :pagination.sync="pagination"
      :loading="loading"
      :filter="filter"
      hide-header
      grid
      :hide-bottom="showMap"
      binary-state-sort
      class="FlatsTable full-height"
      @request="onRequest"
    >
      <template v-slot:item="props">
        <FlatLine
          v-show="!showMap"
          :flat="props.row"
        />
      </template>
      <!--          <template v-slot:body="props">-->
      <!--            <FlatLine-->
      <!--              :key="props.row.id"-->
      <!--              :class="{'col-md-4':showMap}"-->
      <!--              :flat="props.row"-->
      <!--            />-->
      <!--          </template>-->

      <template v-slot:top>
        <FilterPage
          :show-map.sync="showMap"
          :loading="loading"
          @request="onRequest"
        />
        <SearchMap
          v-show="showMap"
          :show-map="showMap"
          :flats="data"
        />
      </template>

      <template
        v-slot:bottom="props"
      >
        <q-pagination
          v-if="props.pagesNumber>1"
          v-model="pagination.page"
          color="primary"
          :max-pages="5"
          ellipses
          :max="props.pagesNumber"
          boundary-numbers
          @input="onRequest"
          size="20px"
        />
      </template>
    </q-table>
  </div>
</template>

<script>
import FilterPage from 'src/pages/FilterPage'
import { mapFields } from 'vuex-map-fields'
import FlatLine from "components/objects/flat/view/flatLine";
import {scroll} from "quasar";
import SearchMap from "components/general/SearchMap";
const { setScrollPosition } = scroll
export default {
  components: {
    SearchMap,
    FlatLine,
    FilterPage
  },
  computed: {
    ...mapFields(
      'flats',
      [
        'flats',
        'count',
        'filters',
        'filters.category',
        'filters.subtype',
        'filters.priceMin',
        'filters.priceMax',
        'filters.area',
        'filters.sortBy'
      ]
    )
  },
  data () {
    return {
      showMap:false,
      cols: [
        {
          field: 'id',
          label: '#',
          name: 'id',
          required: true
        }, {
          field: 'title',
          label: 'Тема',
          name: 'title',
          required: true

        },
        { field: 'created',
          label: 'Дата создания',
          name: 'created'
        }
      ],
      data: [],
      filter: '',
      loading: true,
      page: 1,
      pagination: {
        descending: true,
        page: 1,
        rowsNumber: 10,
        rowsPerPage: 10,
        sortBy: 'name'
      }
    }
  },
  meta: {
    title: 'Поиск объектов недвижимости'
  },
  mounted () {
    this.onRequest()
  },
  watch: {
    filters: {
      deep: true,
      handler () {
        // console.log('Filters has changed')
        this.onRequest()
      }

    }
  },
  methods: {
    img (images) {
      if (typeof images !== 'undefined' && images !== null && images[0] !== null && typeof images[0] !== 'undefined') {
        return process.env.URL + images[0].path_med
      } else {
        return null
      }
    },
    link (row) {
      return { name: 'object', params: { id: row.id } }
    },
    scrollTo (e) {
        let el = this.$refs[e]
        const target = window
        const offset = el.offsetTop
        const duration = 0
        setScrollPosition(target, offset, duration)
    },
    getTableObjects(){
      let { page, rowsPerPage, rowsNumber } = this.pagination
      this.loading = true

      let sortBy = this.sortBy
      let fetchCount = rowsPerPage === 0 ? rowsNumber : rowsPerPage

      // calculate starting row of data
      // fetch data from "server"
      // console.log(sortBy)
      let expand = ['sortimages', 'profile', 'agency']
      let filters = this.filters
      this.$store.dispatch('flats/getTableObjects', {
        expand, fetchCount, filters, page, sortBy
      }).then((response) => {
        // this.pagination.rowsNumber = this.getRowsNumberCount(filter)
        // console.log(response)
        let returnedData = response.data
        this.data.splice(0, this.data.length, ...returnedData)
        // don't forget to update local pagination object
        this.pagination.page = page
        this.pagination.rowsPerPage = rowsPerPage
        this.pagination.sortBy = sortBy
        this.pagination.descending = true
        this.pagination.rowsNumber = this.count
        this.scrollTo('top')
        this.loading = false
      })
    },
    getMapsObjects(){
      this.loading = true
      let filters = this.filters
      let expand = ['sortimages', 'profile', 'agency']
      let fetchCount=0
      let page=1
      let sortBy = this.sortBy
      this.$store.dispatch('flats/getTableObjects', {
        expand, fetchCount, filters, page, sortBy
      }).then((response) => {
        let returnedData = response.data
        this.data.splice(0, this.data.length, ...returnedData)
        // don't forget to update local pagination object
        // this.pagination.page = page
        // this.pagination.rowsPerPage = rowsPerPage
        // this.pagination.sortBy = sortBy
        // this.pagination.descending = true
        // this.pagination.rowsNumber = this.count
        // this.scrollTo('top')
        this.loading = false
      })
    },
    onRequest () {
      this.showMap?this.getMapsObjects():this.getTableObjects()
    },
    pricePerM (row) {
      if (typeof row !== 'undefined' && row.price !== null && row.square !== null) {
        return Math.floor(row.price / row.square)
      } else {
        return null
      }
    },
    profileName (profile) {
      return profile.name + ' ' + profile.family
    }
  },
  name: 'Objects'
}
</script>

<style scoped lang="stylus">
    .titleImg
        max-width 220px
        max-height 220px

    .titleLink
        text-decoration none
        font-weight 700
        color $primary
        font-size 20px
        transition all 0.3s

    .container
        max-width 1200px
        min-width:1200px

    .titleLink:hover
        color $secondary

    @media (max-width: 1200px)
      .container
        max-width 100%
        min-width:100%


</style>
<style lang="stylus">
  .FlatsTable .q-table__top
      padding: 0
      height: 100%;
      display: flex
      flex-direction:column
      /*flex-wrap:inherit;*/

  .FlatsTable .q-table__middle thead,.FlatsTable .q-table
    display: block
    height: 100%
  @media (max-width: 425px)
    .FlatsTable .q-table__top
      padding: 0
</style>
