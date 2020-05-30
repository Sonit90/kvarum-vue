<template>
  <div>
    <q-btn-toggle
      v-model="myType"
      toggle-color="primary"
      no-caps
      :options="typeOptions"
      :dense="$q.screen.lt.md"
      :size="$q.screen.gt.md?'16px':'12px'"
      @input="toggleType"
    />

    <q-table
      :data="data"
      :columns="cols"
      row-key="id"
      :pagination.sync="pagination"
      class="q-mt-md"
      :grid="$q.screen.lt.md"
    >
      <template v-slot:item="props">
        <div
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
          :style="props.selected ? 'transform: scale(0.95);' : ''"
        >
          <q-card :class="props.selected ? 'bg-grey-2' : ''">
            <q-separator />
            <q-list dense>
              <q-card-section class="q-pb-none">
                <p class="text-body1 text-bold">
                  Фото
                </p>
                <q-item
                  :to="`/objects/${props.row.id}`"
                  class="titleImg q-pa-none q-ma-none"
                  dense
                >
                  <q-img
                    v-if="img(props.row.sortimages)!==null"
                    :src="img(props.row.sortimages)"
                    contain
                    placeholder-src="statics/logo.svg"
                  />
                  <q-img
                    v-else
                    src="statics/logo.svg"
                    contain
                  />
                </q-item>
                <p class="text-body1 q-my-sm text-bold">
                  Описание
                </p>
                <q-item class="q-pa-none">
                  <q-item-section>
                    <q-item-label v-if="props.row.category">
                      {{ props.row.category }}
                    </q-item-label>
                    <q-item-label v-if="props.row.rooms_total">
                      <a
                        class="text-primary text-h6 text-weight-bold"
                        :href="`/objects/${props.row.id}`"
                      > <FlatTitle
                        :flat="props.row"
                        short
                      /></a>
                    </q-item-label>
                    <q-item-label v-else>
                      <a
                        class="text-primary text-h6 text-weight-bold"
                        :href="`/objects/${props.row.id}`"
                      > Нет названия</a>
                    </q-item-label>
                    <q-item-label
                      v-if="props.row.address"
                      caption
                    >
                      <q-icon name="location_on" />{{ props.row.address }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
                <p class="text-body1 q-my-sm text-bold">
                  Цена
                </p>
                <span class="text-h6">
                  {{ props.row.price | toCurrency }}
                </span>
              </q-card-section>
              <q-card-actions>
                <q-btn-group
                  v-if="$can('edit',{modelName:'flat', ...props.row} )"
                  spread
                  class="full-width"
                >
                  <q-btn
                    no-wrap
                    no-caps
                    color="accent"
                    icon="create"
                    :to="{name:'object-edit',params:{id:props.row.id}}"
                  />
                  <q-btn
                    v-if="props.row.status!=='created'"
                    no-wrap
                    no-caps
                    label="Опубликовать"
                    icon="publish"
                  />
                  <q-btn
                    no-wrap
                    no-caps
                    label="В архив"
                    icon="archive"
                  />
                  <q-btn
                    no-wrap
                    no-caps
                    label="Лендинг"
                    icon="web"
                  >
                    <q-menu>
                      <q-list style="min-width: 100px">
                        <q-item
                          v-close-popup
                          clickable
                          :to="{name:'landing',params:{id:props.row.id}}"
                        >
                          <q-item-section avatar>
                            <q-icon
                              color="primary"
                              name="person"
                            />
                          </q-item-section>
                          <q-item-section>С профилем</q-item-section>
                        </q-item>
                        <q-item
                          v-close-popup
                          clickable
                          :to="{name:'landing',params:{id:props.row.id, showProfile:0}}"
                        >
                          <q-item-section avatar>
                            <q-icon
                              color="primary"
                              name="visibility_off"
                            />
                          </q-item-section>
                          <q-item-section>Без профиля</q-item-section>
                        </q-item>
                        <q-separator />
                        <q-item
                          v-close-popup
                          clickable
                          @click="copyLink(1, props.row.id)"
                        >
                          <q-item-section avatar>
                            <q-icon
                              color="primary"
                              name="content_copy"
                            />
                          </q-item-section>
                          <q-item-section>Скопировать ссылку с профилем</q-item-section>
                        </q-item>
                        <q-item
                          v-close-popup
                          clickable
                          @click="copyLink(0, props.row.id)"
                        >
                          <q-item-section avatar>
                            <q-icon
                              color="primary"
                              name="content_copy"
                            />
                          </q-item-section>
                          <q-item-section>Скопировать ссылку без профиля</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                  </q-btn>
                </q-btn-group>
              </q-card-actions>




              <!--              <q-item-->
              <!--                v-for="col in props.cols.filter(col => col.name !== 'desc')"-->
              <!--                :key="col.name"-->
              <!--              >-->
              <!--                <q-item-section>-->
              <!--                  <q-item-label>{{ col.label }}</q-item-label>-->
              <!--                </q-item-section>-->
              <!--                <q-item-section side>-->
              <!--                  <q-item-label caption>-->
              <!--                    {{ col.value }}-->
              <!--                  </q-item-label>-->
              <!--                </q-item-section>-->
              <!--              </q-item>-->
            </q-list>
          </q-card>
        </div>
      </template>



      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            key="sortimages"
            :props="props"
            style="width: 200px"
          >
            <q-item
              :to="`/objects/${props.row.id}`"
              class="titleImg q-pa-none q-ma-none"
              dense
            >
              <q-img
                v-if="img(props.row.sortimages)!==null"
                :src="img(props.row.sortimages)"
                contain
                placeholder-src="statics/logo.svg"
              />
              <q-img
                v-else
                src="statics/logo.svg"
                contain
              />
            </q-item>
          </q-td>
          <q-td
            key="title"
            :props="props"
            auto-width
          >
            <q-item>
              <q-item-section>
                <q-item-label v-if="props.row.category">
                  {{ props.row.category }}
                </q-item-label>
                <q-item-label v-if="props.row.rooms_total">
                  <a
                    class="text-primary text-h6 text-weight-bold"
                    :href="`/objects/${props.row.id}`"
                  > <FlatTitle
                    :flat="props.row"
                    short
                  /></a>
                </q-item-label>
                <q-item-label v-else>
                  <a
                    class="text-primary text-h6 text-weight-bold"
                    :href="`/objects/${props.row.id}`"
                  > Нет названия</a>
                </q-item-label>
                <q-item-label
                  v-if="props.row.address"
                  caption
                >
                  <q-icon name="location_on" />{{ props.row.address }}
                </q-item-label>
              </q-item-section>
            </q-item>
            <q-item v-if="$can('edit',{modelName:'flat', ...props.row} )">
              <q-btn-group rounded>
                <q-btn
                  rounded
                  color="accent"
                  icon="create"
                  :to="{name:'object-edit',params:{id:props.row.id}}"
                />
                <q-btn
                  v-if="props.row.status!=='created'"
                  rounded
                  label="Опубликовать"
                  icon="publish"
                />
                <q-btn
                  rounded
                  label="В архив"
                  icon="archive"
                />
                <q-btn
                  rounded
                  label="Лендинг"
                  icon="web"
                >
                  <q-menu>
                    <q-list style="min-width: 100px">
                      <q-item
                        v-close-popup
                        clickable
                        :to="{name:'landing',params:{id:props.row.id}}"
                      >
                        <q-item-section avatar>
                          <q-icon
                            color="primary"
                            name="person"
                          />
                        </q-item-section>
                        <q-item-section>С профилем</q-item-section>
                      </q-item>
                      <q-item
                        v-close-popup
                        clickable
                        :to="{name:'landing',params:{id:props.row.id, showProfile:0}}"
                      >
                        <q-item-section avatar>
                          <q-icon
                            color="primary"
                            name="visibility_off"
                          />
                        </q-item-section>
                        <q-item-section>Без профиля</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item
                        v-close-popup
                        clickable
                        @click="copyLink(1, props.row.id)"
                      >
                        <q-item-section avatar>
                          <q-icon
                            color="primary"
                            name="content_copy"
                          />
                        </q-item-section>
                        <q-item-section>Скопировать ссылку с профилем</q-item-section>
                      </q-item>
                      <q-item
                        v-close-popup
                        clickable
                        @click="copyLink(0, props.row.id)"
                      >
                        <q-item-section avatar>
                          <q-icon
                            color="primary"
                            name="content_copy"
                          />
                        </q-item-section>
                        <q-item-section>Скопировать ссылку без профиля</q-item-section>
                      </q-item>
                    </q-list>
                  </q-menu>
                </q-btn>
              </q-btn-group>
            </q-item>
          </q-td>
          <q-td
            key="price"
            :props="props"
            auto-width
          >
            <span class="text-h6">
              {{ props.row.price | toCurrency }}
            </span>
          </q-td>

          <q-td
            key="created"
            :props="props"
            auto-width
          >
            <span>{{ props.row.created|toDate }}</span>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import FlatTitle from "components/objects/flat/FlatTitle";
import { copyToClipboard } from 'quasar'
export default {
  components: {FlatTitle},
  data () {
    return {
      myType: 'created',
      data: [],
      page: 1,
      loading: true,
      pagination: {
        sortBy: 'id',
        descending: true,
        page: 1,
        rowsPerPage: 10
      },
      cols: [
        {
          name: 'sortimages',
          required: true,
          label: 'Фото',
          field: 'sortimages',
          align: 'left'
        }, {
          name: 'title',
          label: 'Описание',
          field: 'title',
          align: 'left'
        },
        {
          name: 'price',
          label: 'Цена',
          field: 'price',
          align: 'center',
          sortable: true
        },
        { name: 'created',
          label: 'Дата создания',
          field: 'created',
          align: 'center',
          sortable: true
        }
      ]
    }
  },
  name: 'ProfileObjects',
  computed: {
    typeOptions(){
      if(!this.mine){
        return  [
          {label: `Опубликовано (${this.publishedCount})`, value: 'created'},
          {label: `В архиве (${this.archievedCount})`, value: 'archieved'}
        ]

      }

      return  [
        {label: `Опубликовано (${this.publishedCount})`, value: 'created'},
        {label: `На модерации (${this.moderationCount})`, value: 'on moderation'},
        {label: `В архиве (${this.archievedCount})`, value: 'archieved'}
      ]
    },

    ...mapFields(
      'flats',
      [
        'flats'

      ]
    ),
    ...mapFields(
      'auth',
      [
        'profile'

      ]
    ),
    archievedCount () {
      return this.objects.filter(x => x.status === 'archieved').length
    },
    moderationCount () {
      return this.objects.filter(x => x.status === 'moderation').length
    },
    publishedCount () {
      return this.objects.filter(x => x.status === 'created').length
    }

  },
  mounted () {
    this.data = this.objects.filter(x => x.status === 'created')
    // this.data = this.objects
    // this.onRequest({
    //   pagination: this.pagination,
    //   filter: undefined
    // })
  },
  methods: {
    copyLink(showProfile, id){
      let link=`${window.location.origin}/landing/${id}`
      if(showProfile===0) link+='/0'
      copyToClipboard(link)
        .then(() => {
          this.$q.notify('Ссылка скопирована в буфер обмена')
        })
        .catch((e) => {
          console.log(e)
        })
    },
    pricePerM (row) {
      if (typeof row !== 'undefined' && row.price !== null && row.square !== null) {
        return Math.floor(row.price / row.square)
      } else {
        return null
      }
    },
    toggleType (value) {
      if (value !== 'all') {
        this.data = this.objects.filter(x => x.status === value)
      } else {
        this.data = this.objects
      }
      console.log(this.data.length)
    },
    img (images) {
      if (typeof images !== 'undefined' && images !== null&&typeof images[0] !=='undefined' && images[0] !== null) {
        return process.env.URL + images[0].path
      } else {
        return null
      }
    },
    link (row) {
      return '/objects/' + row.id
    },
  },
  props:
    { objects:
        {
          required: true,
          type: Array
        },
      mine:{
      type:Boolean,
        default:false
      }
    }
}
</script>

<style scoped lang="stylus">
    .titleImg
        max-width 220px
        max-height 220px
        margin: 0 auto;
    .titleLink
        text-decoration none
        font-weight 700
        color $primary
        font-size 20px
        transition all 0.3s

    .container
        max-width 1200px

    .titleLink:hover
        color $secondary
</style>
