<template>
  <q-card class="q-ma-lg q-pa-md">
    <q-table
      title="Пользователи"
      :data="users"
      :columns="cols"
      row-key="id"
      :pagination.sync="pagination"
      :loading="loading"
      :filter="filter"
      :visible-columns="visibleColumns"
      dense
      @request="onRequest"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            key="id"
            :props="props"
          >
            <q-item :to="{name: 'user', params: {id:props.row.id}}">
              {{ props.row.id }}
            </q-item>
          </q-td>
          <q-td
            key="email"
            :props="props"
          >
            <q-item
              class="text-primary title"
            >
              {{ props.row.email }}
            </q-item>
          </q-td>
          <q-td
            key="name"
            :props="props"
          >
            <ProfileItem :profile="props.row.profile" />
          </q-td>
          <q-td
            key="phone"
            :props="props"
          >
            <q-item v-if="props.row.profile&&props.row.profile.phone_mobile!==null&&props.row.profile.phone_mobile!==''">
              <q-item-section side>
                <q-avatar
                  rounded
                  icon="phone"
                />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ props.row.profile.phone_mobile }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-td>
          <q-td
            key="agency"
            :props="props"
          >
            <AgencyItem :agency="props.row.agency" />
          </q-td>
          <q-td
            key="created_at"
            :props="props"
          >
            <span>{{ props.row.created_at |toDateTime }}</span>
          </q-td>
          <q-td
            key="last_login_at"
            :props="props"
          >
            <span>{{ props.row.last_login_at |toDateTime }}</span>
          </q-td>
          <q-td
            key="isDeleted"
            :props="props"
          >
            <q-badge
              v-if="props.row.isDeleted===null||parseInt(props.row.isDeleted)===0"
              color="positive"
            >
              <q-icon
                name="check_circle"
                color="white"
              />
              Не удалён
            </q-badge>
            <q-badge
              v-else
              color="negative"
            >
              <q-icon
                name="clear"
                color="white"
              />
              Удалён
            </q-badge>
          </q-td>

          <q-td
            key="confirmed"
            :props="props"
          >
            <q-badge
              v-if="props.row.confirmed_at!==null"
              color="positive"
            >
              <q-icon
                name="check_circle"
                color="white"
              />
              Активирован
            </q-badge>
            <q-badge
              v-else
              color="negative"
            >
              <q-icon
                name="clear"
                color="white"
              />
              Не активирован
            </q-badge>
          </q-td>
          <q-td
            key="blocked"
            :props="props"
          >
            <q-btn
              v-if="props.row.blocked_at===null"
              color="negative"
              label="Заблокировать"
              dense
              no-caps
            />
            <q-btn
              v-else
              color="positive"
              label="Разблокировать"
              dense
              no-caps
            />
          </q-td>

          <q-td
            key="actions"
            :props="props"
            class="q-gutter-xs"
          >
            <q-btn
              v-if="props.row.isDeleted!==1&&props.row.blocked_at===null&&props.row.confirmed_at!==null"
              color="secondary"
              icon="keyboard_return"
              dense
              size="md"
              @click="$q.dialog({
                title: 'Подтвердите действие',
                message: 'Вы хотите выполнить действие?',
                cancel: true,
              }).onOk(() => {
                loginAs(props.row)
              })"
            >
              <q-tooltip>
                Войти под пользователем
              </q-tooltip>
            </q-btn>

            <q-btn
              v-if="$can('edit','user')"
              color="primary"
              icon="edit"
              dense
              size="md"
              @click="editUser(props.row.id)"
            >
              <q-tooltip>
                Редактировать
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="$can('delete','user')&&(props.row.isDeleted===null||props.row.isDeleted!==1)"
              color="negative"
              icon="close"
              dense
              @click="deleteUser(props.row)"
            >
              <q-tooltip>
                Удалить
              </q-tooltip>
            </q-btn>
            <q-btn
              v-if="$can('restore','user')&&parseInt(props.row.isDeleted)===1"
              color="positive"
              icon="redo"
              dense
              @click="restoreUser(props.row)"
            >
              <q-tooltip>
                Восстановить
              </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:top-row>
        <q-tr>
          <q-td v-show="visibleColumns.includes('id')">
            <q-input
              v-model="filt.id"
              debounce="500"
              clearable
              clear-icon="close"
              dense
              @input="onRequest(null)"
            />
          </q-td>
          <q-td v-show="visibleColumns.includes('email')">
            <q-input
              v-model="filt.email"
              debounce="500"
              clearable
              clear-icon="close"
              dense
              @input="onRequest(null)"
            />
          </q-td>
          <q-td v-show="visibleColumns.includes('name')">
            <q-input
              v-model="filt.name"
              debounce="500"
              clearable
              clear-icon="close"
              dense
              @input="onRequest(null)"
            />
          </q-td>
          <q-td v-show="visibleColumns.includes('phone')">
            <q-input
              v-model="filt.phone"
              debounce="500"
              clearable
              clear-icon="close"
              dense
              @input="onRequest(null)"
            />
          </q-td>
          <q-td v-show="visibleColumns.includes('agency')">
            <q-input
              v-model="filt.agency"
              debounce="500"
              clearable
              clear-icon="close"
              dense
              @input="onRequest(null)"
            />
          </q-td>
        </q-tr>
      </template>
      <template v-slot:top-right>
        <q-btn
          v-if="$can('create','user')"
          label="Создать пользователя"
          icon="add"
          color="primary"
          dense
          outline
          no-caps
          size="md"
          class="q-ma-sm"
          @click.prevent="addUserDialog=true"
        />
        <q-select
          v-model="visibleColumns"
          multiple
          borderless
          dense
          options-dense
          :display-value="$q.lang.table.columns"
          emit-value
          map-options
          :options="cols"
          option-value="name"
          style="min-width: 150px"
        />
        <q-input
          v-model="filt.search"
          borderless
          dense
          debounce="300"
          placeholder="Поиск"
          clearable
          clear-icon="close"
          @input="onRequest(null)"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
    </q-table>
    <CreateUser v-model="addUserDialog" />
    <EditUser
      :id="id"
      v-model="editUserDialog"
    />
  </q-card>
</template>

<script>
  import CreateUser from '../../components/User/CreateUser'
  import EditUser from '../../components/User/EditUser'
  import {mapFields} from "vuex-map-fields";
  import ProfileItem from "pages/admin/ProfileItem";
  import AgencyItem from "components/agencies/AgencyItem";

  export default {
    name: 'UserManagement',
    components: {AgencyItem, ProfileItem, EditUser, CreateUser },
    data () {
      return {
        addUserDialog:false,
        editUserDialog:false,
        user:null,
        id:null,
        users:[],
        page: 1,
        visibleColumns: ['id', 'email', 'name', 'phone', 'agency','created_at', 'last_login_at', 'confirmed', 'blocked',  'actions'],
        loading: false,
        filt: { id: '', email:'' },
        sections: [
        ],
        pagination: {
          sortBy: 'name',
          descending: false,
          page: 1,
          rowsPerPage: 10,
          rowsNumber: 10
        },
        filter: '',
        cols: [
          {
            name: 'id',
            label: 'Id',
            field: 'id'
          }, {
            name: 'email',
            label: 'Email',
            field: 'email',
            required: true

          },
          { name: 'name',
            label: 'Имя, фамилия',
            field: 'name'
          },
          { name: 'phone',
            label: 'Телефон',
            field: 'phone'
          },
          { name: 'agency',
            label: 'Агентство',
            field: 'agency'
          },
          { name: 'created_at',
            label: 'Время регистрации',
            field: 'created_at'
          },
          { name: 'last_login_at',
            label: 'Время последнего входа',
            field: 'last_login_at'
          },
          { name: 'isDeleted',
            label: 'Удалён',
            field: 'isDeleted',
            required: false
          },
          { name: 'confirmed',
            label: 'Активация',
            field: 'confirmed_at',
            required: false
          },
          { name: 'blocked',
            label: 'Статус блокировки',
            field: 'blocked_at'
          },
          { name: 'actions',
            label: 'Действия'
          }
        ]
      }
    },
    watch: {
      visibleColumns (newValue) {
        this.$q.localStorage.set('UserVisibleColumns', JSON.stringify(newValue))
      }

    },
    mounted () {
      if (this.$q.localStorage.has('UserVisibleColumns')) {
        this.visibleColumns = JSON.parse(this.$q.localStorage.getItem('UserVisibleColumns'))
      }

      this.onRequest({
        pagination: this.pagination,
        filter: undefined
      })
    },
    methods: {
      onRequest (props) {
        let pagination
        if (typeof props !== 'undefined' && props !== null) {
          pagination = props.pagination
        } else {
          pagination = this.pagination
        }
        // console.log(pagination)
        let { page, rowsPerPage, rowsNumber, sortBy, descending } = pagination

        // let filter = props.filter

        this.loading = true

        // update rowsCount with appropriate value

        console.log(this.pagination.rowsNumber)

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
        console.log(sortBy)
        console.log(descending)
        this.$store.dispatch('admin/getUsers', {
          page, fetchCount, filter, sortBy, descending
        }).then((response) => {
          // this.pagination.rowsNumber = this.getRowsNumberCount(filter)
          console.log(response)
          this.users=response.data
          //let returnedData = response.data
          //this.count=response.headers['x-pagination-total-count']
          //this.data.splice(0, this.data.length, ...returnedData)
          // don't forget to update local pagination object
          this.pagination.page = page
          this.pagination.rowsPerPage = rowsPerPage
          this.pagination.sortBy = sortBy
          this.pagination.descending = descending
          this.pagination.rowsNumber = this.count

          this.loading = false
        }).catch((err)=>{
          console.log(err)

        })
      },
      editUser(id){
        console.log(id)
        this.id=id
        this.editUserDialog=true
      },
      loginAs(user){

            let token=user.auth_key
            this.$store.dispatch('auth/loginAs', token).then((response) => {
              console.log(response)
              this.$q.notify('Успешно зашли')
            }).catch((err)=>{
              this.$q.notify('Не удалось зайти под пользователем')
              console.log(err)
            })


      },
      deleteUser(user){
        this.$q.dialog({
          title: 'Подтвердите действие',
          message: 'Вы хотите удалить пользователя?',
          cancel: true,
        }).onOk(() => {
          this.$store.dispatch('admin/deleteUser', user.id).then((response) => {
            console.log(response)
            this.$q.notify('Пользователь был удалён')
          }).catch((err)=>{
            this.$q.notify(err.response.data.message)
            //this.$q.notify('Не удалось удалить пользователя')
            console.log(err)
          })
        })
      },
      restoreUser(user){
        this.$q.dialog({
          title: 'Подтвердите действие',
          message: 'Вы хотите восстановить пользователя?',
          cancel: true,
        }).onOk(() => {
          this.$store.dispatch('admin/restoreUser', user.id).then((response) => {
            console.log(response)
            this.$q.notify('Пользователь был восстановлен')
          }).catch((err)=>{
            this.$q.notify('Не удалось восстановить пользователя')
            console.log(err)
          })
        })
      },
      profileName (profile) {
        return profile.name + ' ' + profile.surname
      }
    },
    computed:{
        ...mapFields(
          'admin',
          [
            'count'
          ]
        )
    }
  }
</script>

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
