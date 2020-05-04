<template>
  <div
    :key="$route.fullPath"
    :class="{'q-pa-md':$q.screen.gt.md, 'q-pa-none':$q.screen.lt.md}"
  >
    <div class="row">
      <div
        :class="{'col-md-8 offset-md-2':$q.screen.gt.md, 'col-xs-12':$q.screen.lt.md}"
      >
        <q-card
          flat
          bordered
          class="bg-grey-1"
          :class="{'q-pa-md':$q.screen.gt.md, 'q-pa-none':$q.screen.lt.md}"
        >
          <q-card-section :class="{'q-pa-none':$q.screen.lt.md}">
            <div class="row justify-center">
              <div class="col-md-6 col-sm-12 col-xs-12">
                <AgentItem
                  :profile="profile"
                />
                <AgencyItem
                  v-if="profile.agency&&profile.type==='agencyAgent'"
                  :agency="profile.agency"
                />
                <SocialIcons :profile="profile" />
                <!--                <q-rating-->
                <!--                  v-model="ratingModel"-->
                <!--                  size="1.5em"-->
                <!--                  color="primary"-->
                <!--                  icon="star_border"-->
                <!--                  icon-selected="star"-->
                <!--                  readonly-->
                <!--                />-->
              </div>
              <div class="col-md-6 col-sm-12 col-xs-12">
                <q-list
                  v-if="profile.phone_mobile||profile.public_email"
                  class="q-mt-md"
                >
                  <q-item
                    v-if="profile.user&&profile.user.last_login_at&&!mine"
                  >
                    <q-item-section>
                      <q-item-label>Последний вход</q-item-label>
                      <q-item-label caption>
                        {{ profile.user.last_login_at|timeAgo }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>


                  <q-item
                    v-if="profile.phone_mobile"
                  >
                    <q-item-section>
                      <q-item-label>Телефон</q-item-label>
                      <q-item-label caption>
                        <a
                          class="text-grey-8"
                          :href="'tel:'+profile.phone_mobile"
                        >{{ profile.phone_mobile }} </a>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="profile.public_email"
                  >
                    <q-item-section>
                      <q-item-label>Email</q-item-label>
                      <q-item-label caption>
                        {{ profile.public_email }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    v-if="profile.about"
                  >
                    <q-item-section>
                      <q-item-label>О себе</q-item-label>
                      <q-item-label caption>
                        {{ profile.about }}
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div
                v-if="$can('editOwn',{modelName:'profile', user_id:parseInt(profile.user_id)})"
                class="absolute-top-right"
              >
                <q-btn
                  color="grey-7"
                  round
                  flat
                  icon="more_vert"
                >
                  <q-menu
                    fit
                    anchor="bottom left"
                    self="top left"
                  >
                    <q-item
                      clickable
                      to="/profile/edit"
                    >
                      <q-item-section>Редактировать</q-item-section>
                    </q-item>
                    <q-item
                      clickable
                      to="/profile/change-password"
                    >
                      <q-item-section>Сменить пароль</q-item-section>
                    </q-item>
                  </q-menu>
                </q-btn>
              </div>
            </div>
          </q-card-section>
          <template>
            <q-card-section
              v-if="mine"
              :class="{'q-pa-sm':$q.screen.lt.md}"
            >
              <q-tabs
                v-model="tab"
                dense
                class="text-grey"
                active-color="primary"
                indicator-color="primary"
                align="justify"
                narrow-indicator
              >
                <q-tab
                  name="myObjects"
                  label="Мои объекты"
                />
                <q-tab
                  disable
                  name="feed"
                  label="Лента"
                />
                <q-tab
                  disable
                  name="favourites"
                  label="Избранное"
                />
              </q-tabs>

              <q-separator />

              <q-tab-panels
                v-model="tab"
                animated
                style="background: inherit"
                keep-alive
              >
                <q-tab-panel
                  name="myObjects"
                  :class="{'q-px-none':$q.screen.lt.md}"
                >
                  <q-spinner
                    v-if="objLoading"
                    color="primary"
                    size="3em"
                  />
                  <profileObjects
                    v-else
                    :objects="objects"
                    mine
                  />
                </q-tab-panel>
                <q-tab-panel name="feed">
                  <div class="text-h6">
                    Лента
                  </div>
                  Тут будет лента
                </q-tab-panel>

                <q-tab-panel name="favourites">
                  <div class="text-h6">
                    Movies
                  </div>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </q-tab-panel>
              </q-tab-panels>
            </q-card-section>
            <q-card-section v-else>
              <q-spinner
                v-if="objLoading"
                color="primary"
                size="3em"
              />
              <profileObjects
                v-else
                :objects="objects"
              />
            </q-card-section>
          </template>
          <q-card-section v-if="!objLoading&&objects.length>0">
            У этого агента пока нет объектов
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import profileObjects from 'src/components/objects/profileObjects'
import AgencyItem from "components/agencies/AgencyItem";
import AgentItem from "components/agent/AgentItem";
import {mapFields} from "vuex-map-fields";
import SocialIcons from "components/user/SocialIcons";
export default {
  name: 'Profile',
  components: {
    SocialIcons,
    AgentItem,
    AgencyItem,
    profileObjects
  },
  data () {
    return {
      // ratingModel: 3,
      objLoading: true,
      tab: 'myObjects',
      objects: []
    }
  },
  methods: {
    getObjects() {
      let fetchCount = 0
      let page = 0
      let filters = { 'seller_id': this.profile.user_id }
      let sortBy = '-id'
      let expand = ['sortimages']
      console.log(expand)
      this.$store.dispatch('flats/getTableObjects', {
        expand, fetchCount, filters, page, sortBy
      }).then((response) => {
        console.log(response)
        this.objects = response.data

        this.objLoading = false
      })
    }
  },
  props:
    { profile: {
      type: Object,
      required: true },
      mine:{
      type:Boolean,
        required:true,
        default:false
      }

      },
  computed: {
    ...mapFields(
      'flats',
      [
        'title'

      ]
    )
  },
  mounted () {
    this.getObjects()
    this.title= this.profile.name
  }
}
</script>

<style scoped>
  .agency-img{
    max-width: 100px;
    margin-top: 10px;
    vertical-align: bottom;
  }

</style>
