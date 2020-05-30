<template>
  <q-table
    title="Поиск агентов"
    :data="users"
    :columns="cols"
    row-key="id"
    :pagination.sync="pagination"
    :loading="loading"
    :filter="filt"
    hide-header
    :visible-columns="visibleColumns"
    dense
    :grid="$q.screen.lt.md"
    :flat="$q.screen.lt.md"
    binary-state-sort
    @request="onRequest"
    :class="{'gridTable':$q.screen.lt.md}"
  >
    <template v-slot:item="props">
      <div
        class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
      >
        <q-card>
          <q-list dense>
            <q-item>
              <AgentItem
                class="q-pa-none"
                style="max-width: 300px"
                show-surname
                :profile="props.row.profile"
              />
            </q-item>
            <q-item
              v-if="props.row.profile.type==='agencyAgent'"
              v-show="visibleColumns.includes('agency')"
            >
              <AgencyItem
                :agency="props.row.agency"
              />
            </q-item>
            <q-item
              v-show="visibleColumns.includes('phone')"
              v-if="props.row.profile&&props.row.profile.phone_mobile!==null&&props.row.profile.phone_mobile!==''"
            >
              <q-item-section>
                Телефон:
              </q-item-section>
              <q-item-section side>
                <q-btn
                  v-if="props.row.profile&&props.row.profile.phone_mobile!==null&&props.row.profile.phone_mobile!==''"
                  flat
                  align="right"
                  text-color="primary"
                  icon="phone"
                  size="14px"
                  type="a"
                  :label="props.row.profile.phone_mobile"
                  :href="'tel:'+props.row.profile.phone_mobile"
                  target="__blank"
                  style="min-width: 200px"
                  class="gridCallButton"
                />
              </q-item-section>
            </q-item>


            <q-item
              v-show="visibleColumns.includes('public_email')"
              key="public_email"
              v-if="props.row.profile.public_email!==null&&props.row.profile.public_email!==''"
            >
              <q-item-section>
                Email:
              </q-item-section>
              <q-item-section side>
                {{ props.row.profile.public_email }}
              </q-item-section>
            </q-item>
            <q-item
              v-show="visibleColumns.includes('location')"
              key="location"
              v-if="props.row.profile.location!==null&&props.row.profile.location!==''"
            >
              <q-item-section>
                Город:
              </q-item-section>
              <q-item-section side>
                {{ props.row.profile.location }}
              </q-item-section>
            </q-item>
            <q-item
              v-show="visibleColumns.includes('socials')"
              key="socials"
              v-if="props.row.profile!==null&&hasSocials(props.row.profile)"
            >
              <q-item-section>
                Соц. сети:
              </q-item-section>
              <q-item-section side>
                <SocialIcons
                  :size="9"
                  :profile="props.row.profile"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card>
      </div>
    </template>


    <template v-slot:body="props">
      <q-tr :props="props">
        <q-td
          key="name"
          :props="props"
        >
          <AgentItem
            style="max-width: 300px"
            show-surname
            :profile="props.row.profile"
          />
        </q-td>
        <q-td
          key="phone"
          :props="props"
        >
          <q-btn
            v-if="props.row.profile&&props.row.profile.phone_mobile!==null&&props.row.profile.phone_mobile!==''"
            flat
            text-color="primary"
            icon="phone"
            size="14px"
            type="a"
            :label="props.row.profile.phone_mobile"
            :href="'tel:'+props.row.profile.phone_mobile"
            target="__blank"
            style="min-width: 200px"
          />
        </q-td>
        <q-td
          key="agency"
          :props="props"
        >
          <AgencyItem
            :agency="props.row.agency"
            v-if="props.row.profile.type==='agencyAgent'"
          />
        </q-td>
        <q-td
          key="public_email"
          :props="props"
        >
          {{ props.row.profile.public_email }}
        </q-td>
        <q-td
          key="location"
          :props="props"
        >
          {{ props.row.profile.location }}
        </q-td>
        <q-td
          key="socials"
          :props="props"
        >
          <SocialIcons
            :size="10"
            :profile="props.row.profile"
          />
        </q-td>
      </q-tr>
    </template>
    <template v-slot:top>
      <div class="row q-gutter-x-md full-width justify-between">
        <span class="text-bold text-h6">Поиск агента</span>
        <q-space />
        <q-btn
          v-if="$q.screen.lt.md"
          :icon-right="showFilters?'arrow_drop_up':'arrow_drop_down'"
          color="primary"
          no-caps
          :class="{'q-mx-sm':$q.screen.gt.md}"
          flat
          :label="'Фильтры'"
          @click="showFilters=!showFilters"
        />
        <q-dialog
          v-if="$q.screen.lt.md"
          v-model="showFilters"
          maximized
          transition-show="slide-up"
          transition-hide="slide-down"
        >
          <q-card>
            <div class="row q-pa-sm bg-white justify-between">
              <q-btn
                v-close-popup
                icon="close"
                flat
                round
                dense
              />
              <span class="text-h6 text-bold">
                Фильтры
              </span>
              <q-btn
                flat
                color="blue-grey-5"
                label="Очистить"
                dense
                no-caps
                @click="clearFilters"
              />
            </div>
            <q-card-section class="q-gutter-y-md">
              <q-select
                v-model="filt.userType"
                multiple
                borderless
                display-value="Тип профиля"
                dense
                options-dense
                emit-value
                map-options
                clearable
                :options="userTypes"
                style="min-width: 150px"
              />
              <q-input
                v-model="filt.name"
                debounce="500"
                label="Имя, фамилия"
                clearable
                clear-icon="close"
              />
              <q-input
                v-model="filt.phone"
                debounce="500"
                label="Телефон"
                clearable
                clear-icon="close"
              />
              <ChooseAgency
                v-model="filt.agency"
                :input-debounce="500"
              />
              <q-input
                v-model="filt.public_email"
                debounce="500"
                clearable
                label="Email"
                clear-icon="close"
              />
              <q-select
                v-model="filt.location"
                clearable
                hide-dropdown-icon
                hide-selected
                use-input
                hide-hint
                hint="Введите 3 символа для поиска"
                fill-input
                label="Город"
                input-debounce="200"
                :options="citiesOpts"
                @filter="filterCity"
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Город не найден
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-card-section>
            <q-card-actions>
              <q-btn
                class="q-ma-md full-width"
                color="primary"
                :loading="loading"
                no-caps
                :label="showLabel"
                @click="showFilters=false"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>


        <q-select
          v-if="$q.screen.gt.md"
          v-model="filt.userType"
          multiple
          borderless
          display-value="Тип профиля"
          dense
          options-dense
          emit-value
          map-options
          clearable
          :options="userTypes"
          style="min-width: 150px"
        />


        <q-select
          v-model="visibleColumns"
          multiple
          borderless
          dense
          options-dense
          display-value="Столбцы"
          emit-value
          map-options
          :options="cols"
          option-value="name"
          style="max-width: 40%;"
        />
        <q-input
          v-model="filt.search"
          borderless
          dense
          debounce="300"
          placeholder="Поиск"
          clearable
          clear-icon="close"
          style="max-width: 50%;"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </template>
    <template v-slot:top-row>
      <q-tr class="filter-table-row">
        <q-td>
          <q-input
            v-model="filt.name"
            debounce="500"
            placeholder="Имя, фамилия"
            clearable
            clear-icon="close"
            dense
          />
        </q-td>
        <q-td v-show="visibleColumns.includes('phone')">
          <q-input
            v-model="filt.phone"
            debounce="500"
            placeholder="Телефон"
            clearable
            clear-icon="close"
            dense
          />
        </q-td>
        <q-td v-show="visibleColumns.includes('agency')">
          <ChooseAgency
            dense
            placeholder="Агентство"
            :show-label="false"
            v-model="filt.agency"
            :input-debounce="500"
          />
        </q-td>
        <q-td v-show="visibleColumns.includes('public_email')">
          <q-input
            v-model="filt.public_email"
            placeholder="Email"
            debounce="500"
            clearable
            clear-icon="close"
            dense
          />
        </q-td>
        <q-td v-show="visibleColumns.includes('location')">
          <q-select
            v-model="filt.location"
            :dense="$q.screen.lt.md"
            clearable
            hide-dropdown-icon
            hide-selected
            use-input
            hide-hint
            placeholder="Город"
            hint="Введите 3 символа для поиска"
            fill-input
            input-debounce="200"
            :options="citiesOpts"
            @filter="filterCity"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey">
                  Город не найден
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </q-td>
        <q-td v-show="visibleColumns.includes('socials')">
          Соцсети
        </q-td>
      </q-tr>
      <q-tr
        no-hover
        class="no-border"
        v-if="loading"
      >
        <q-td
          colspan="6"
          no-hover
          class="q-pa-none"
        >
          <q-linear-progress
            indeterminate
            size="2px"
          />
        </q-td>
      </q-tr>
    </template>
  </q-table>
</template>

<script>
  import AgencyItem from "components/agencies/AgencyItem";
  import AgentItem from "components/agent/AgentItem";
  import {mapFields} from "vuex-map-fields";
  import SocialIcons from "components/user/SocialIcons";
  import ChooseAgency from "components/agencies/ChooseAgency";

  export default {
    name: 'Search',
    components: {ChooseAgency, SocialIcons, AgentItem, AgencyItem },
    data () {
      return {
        user:null,
        showFilters:false,
        citiesOpts:this.citiesOptions,
        count:null,
        users:[],
        page: 1,
        visibleColumns: ['phone', 'agency','public_email', 'location', 'socials'],
        loading: true,
        filt: {name:null, phone:null,location:null,  agency:null, public_email:null, userType:null },
        sections: [
        ],
        pagination: {
          sortBy: 'name',
          descending: false,
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 10
        },
        cols: [
          { name: 'name',
            label: 'Имя, фамилия',
            field: 'name',
            align:'left',
            required: true,
            style: 'width: 300px',
            sortable:true
          },
          { name: 'phone',
            label: 'Телефон',
            field: 'phone',
            align:'left',
            style: 'width: 200px',
          },
          { name: 'agency',
            label: 'Агентство',
            field: 'agency',
            align:'left',
            style: 'width: 300px',
            headerStyle:'width: 300px',
          },
          {
            name:'public_email',
            label: 'Email',
            field:'public_email',
            align:'left'
          },
          {
            name:'location',
            label: 'Город',
            field:'location',
            align:'left',
            style: 'width: 250px',
          },
          {
            name:'socials',
            label: 'Соц. сети',
            field:'socials',
            align:'left',
            style: 'width: 250px',
          },

        ]
      }
    },
    watch: {
      visibleColumns (newValue) {
        this.$q.localStorage.set('SearchAgentsColumns', JSON.stringify(newValue))
      },
      filt:{
        handler(val){
          this.onRequest(null)
        },
        deep: true

      }

    },
    mounted () {
      if (this.$q.localStorage.has('SearchAgentsColumns')) {
        this.visibleColumns = JSON.parse(this.$q.localStorage.getItem('SearchAgentsColumns'))
      }

      this.onRequest({
        pagination: this.pagination
      })
    },
    methods: {
      onRequest (props) {
        console.log(props)
        let pagination
        if(props===null){
          pagination = this.pagination
        }else{
          pagination=props.pagination
        }
        const { page, rowsPerPage, sortBy, descending } = pagination

        //let pagination = this.pagination

        // console.log(pagination)
        //let { page, rowsPerPage, rowsNumber, sortBy, descending } = pagination

        // let filter = props.filter

        this.loading = true

        // update rowsCount with appropriate value

        //onsole.log(this.pagination.rowsNumber)

        // get all rows if "All" (0) is selected
        let fetchCount = rowsPerPage === 0 ? rowsNumber : rowsPerPage

        // let filter = new Map([
        // ])
        // for (let prop in this.filt) {
        //   if (this.filt[prop] !== '') {
        //     filter.set(prop, this.filt[prop])
        //   }
        // }
        let filter = this.filt
        // calculate starting row of data
        // fetch data from "server"
        // console.log(sortBy)
        // console.log(descending)
        this.$store.dispatch('flats/searchAgents', {
          page, fetchCount, filter, sortBy, descending
        }).then((response) => {
          // this.pagination.rowsNumber = this.getRowsNumberCount(filter)
          this.users=response.data
          //let returnedData = response.data
          this.count=response.headers['x-pagination-total-count']
          //this.data.splice(0, this.data.length, ...returnedData)
          // don't forget to update local pagination object
          this.pagination.page = page
          this.pagination.rowsPerPage = rowsPerPage
          this.pagination.sortBy = sortBy
          this.pagination.descending = descending
          this.pagination.rowsNumber = this.count
        }).catch((err)=>{
          console.log(err)
        }).finally( ()=>this.loading = false)
      },
      filterCity(val, update, abort){
        if (val.length < 3) {
          abort()
          return
        }
        update(() => {
          const needle = val.toLowerCase()
          this.citiesOpts = this.citiesOptions.filter(v => v.toLowerCase().indexOf(needle) > -1)
        })
      },
      clearFilters(){
       this.filt= {name:null, phone:null,public_email:null,location:null,  agency:null, userType:null }
      },
      hasSocials(profile){
        let socials = ['whatsapp','vk','instagram','facebook', 'twitter','youtube']

        for (let index = 0; index < socials.length; index++) {
          if (profile[socials[index]] !== null&&profile[socials[index]] !== '' ){
            return true;
          }

        }
        return false;
      }
    },
    computed: {
      ...mapFields(
        'flats',
        ['cities']
      ),
      ...mapFields(
        'auth',[
          'userTypes'
        ]
      ),
      showLabel(){
        return `Показать ${this.count} ${this.$declOfNum(this.count,['человека', 'людей', 'людей'])}`
      },
      citiesOptions(){
        let cities= this.cities.map(function(el) {
          return el.city;
        });
        cities.sort()
        return Object.freeze(cities)
      }
    },
  }
</script>
<style>
  .gridCallButton .q-btn__wrapper{
    padding-right: 0;
  }
  .gridTable .q-table__top{
    padding: 0;
  }
</style>
<style scoped>

  .title, .category{
    max-width: 250px;
    -ms-text-overflow: ellipsis;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    display: block;
  }
  .category{
    width: 150px;
    font-size: 12px;
  }
</style>
