<template>
  <div class="container">
    <q-card class="q-ma-lg q-pa-md">
      <q-table
        title="Заявки в агентства"
        :data="data"
        :columns="cols"
        row-key="id"
        :pagination.sync="pagination"
        :loading="loading"
        dense
        @request="onRequest"
      >
        <template v-slot:body-cell-type="props">
          <q-td
            key="type"
            :props="props"
          >
            <q-badge :color="props.row.type==='newAgency'?'positive':'secondary'">
              {{ convertType(props.row.type) }}
            </q-badge>
          </q-td>
        </template>


        <template v-slot:body-cell-agency="props">
          <q-td
            key="agency"
            :props="props"
          >
            <AgencyItem
              v-if="props.row.type!=='newAgency'"
              :agency="props.row.agency"
            />
          </q-td>
        </template>


        <template v-slot:body-cell-status="props">
          <q-td
            key="status"
            :props="props"
          >
            <q-badge :color="statusColor(props.row.status)">
              {{ statusValue(props.row.status) }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-createdBy="props">
          <q-td
            key="createdBy"
            :props="props"
          >
            <ProfileItem :profile="props.row.profile" />
          </q-td>
        </template>




        <template v-slot:body-cell-actions="props">
          <q-td
            key="actions"
            :props="props"
            class="q-gutter-xs"
          >
            <template v-if="parseInt(props.row.status)===0">
              <q-btn
                color="positive"
                icon="check"
                dense
                size="md"
                @click="accept(props.row)"
              >
                <q-tooltip>
                  Принять
                </q-tooltip>
              </q-btn>


              <q-btn
                color="negative"
                icon="close"
                dense
                size="md"
                @click="decline(props.row)"
              >
                <q-tooltip>
                  Отклонить
                </q-tooltip>
              </q-btn>
            </template>
          </q-td>
        </template>
      </q-table>
    </q-card>
  </div>
</template>

<script>
    import ProfileItem from "pages/admin/ProfileItem";
    import AgencyItem from "components/agencies/AgencyItem";
    export default {
        name: "AgencyApplications",
      components: {AgencyItem, ProfileItem},
      data() {
        return {
          loading:false,
          cols: [
            {
              name: 'id',
              label: 'Id',
              field: 'id'
            }, {
              name: 'type',
              label: 'Тип',
              field: 'type'

            },
            { name: 'agency',
              label: 'Агентство',
              field: 'agency'
            },
            { name: 'agencyName',
              label: 'Название агентства',
              field: 'agencyName'
            },
            { name: 'status',
              label: 'Статус',
              field: 'status'
            },
            { name: 'reason',
              label: 'Причина',
              field: 'reason'
            },
            { name: 'created',
              label: 'Время создания',
              field: 'created',
              format: val => this.$options.filters.toDateTime(val)
            },
            // { name: 'updated',
            //   label: 'Время изменения',
            //   field: 'updated',
            //   format: val => this.$options.filters.toDateTime(val)
            // },
            { name: 'createdBy',
              label: 'Кем создано',
              field: 'created',
              align: 'center'
            },
            // { name: 'updatedBy',
            //   label: 'Кем обновлено',
            //   field: 'created'
            // },
            { name: 'actions',
              label: 'Действия'
            }
          ],
          pagination: {
            sortBy: 'created',
            descending: false,
            page: 1,
            rowsPerPage: 10,
            rowsNumber: 10
          },
          data:[],
          test: [{
            "id": 4,
            "type": "newAgency",
            "agencyId": null,
            "agencyName": "Test",
            "status": "Создана",
            "reason": null,
            "created": 1577303322,
            "updated": 1577303322,
            "createdBy": 187,
            "updatedBy": 187,
            "profile": {
              "user_id": 187,
              "type": "agencyAgent",
              "name": "Дмитрий1",
              "surname": "Уральский2",
              "about": "",
              "agency_id": null,
              "phone_mobile": "",
              "phone_work": null,
              "public_email": "",
              "location": "",
              "website": null,
              "bio": null,
              "whatsapp": "",
              "vk": "",
              "instagram": "",
              "facebook": "",
              "twitter": "",
              "youtube": "",
              "timezone": "",
              "avatar": "",
              "read_feed": null
            },
            "agency": null
          }]
        }
      },
      mounted(){
        console.log('mounted')
        this.onRequest(null)
      },
      methods: {
          convertType(type){
            switch (type) {
              case 'newAgency':{
                return 'Создать новое агентство'
              }
              case 'editProfile':{
                return 'Редактирование профиля'
              }

            }
            return 'Регистрация'
          },
          replaceElement(id, data){
            let i = this.data.findIndex(x => x.id === id)
            console.log(i)
            this.data.splice(i, 1, data)
          },
        decline(row){
            console.log(row)
          this.$store.dispatch('agencies/declineRequest', row).then((response) => {
            console.log(response)
            this.replaceElement(row.id, response.data)
            //row=response.data
            //let id = response.data.id
            //this.$router.push(`/agencies/edit/${id}`)

          })
            .catch((e) => {
              console.log(e)
              this.$q.notify('Не удалось заявку')
            })
        },
        accept(row){
          //Принять и создать новое агентство

          this.$store.dispatch('agencies/acceptRequest', row).then((response) => {
            console.log(response)
            if(row.type==='newAgency'){
              let agencyId = response.data.agencyId
              this.$router.push(`/agencies/edit/${agencyId}`)
            }
            this.replaceElement(row.id, response.data)


          })
            .catch((e) => {
              console.log(e)
              this.$q.notify('Не удалось закрыть заявку')
            })

        },
        statusValue(status) {
          status=parseInt(status)
          switch(status) {
            case 0:
              return 'Создана'
              break

            case 1:
              return 'Принята'
              break
            case 2:
              return 'Отклонена'
              break
          }
          return 'Создана'
        },
        statusColor(status) {
            status=parseInt(status)
          switch(status) {
            case 0:
            return 'primary'
              break

            case 1:
              return 'positive'
              break
            case 2:
              return 'negative'
              break
          }
          return 'primary'
        },
        onRequest (props) {
          let pagination
          if (typeof props !== 'undefined' && props !== null) {
            pagination = props.pagination
          } else {
            pagination = this.pagination
          }
          let { page, rowsPerPage, rowsNumber, sortBy, descending } = pagination

          this.loading = true

          // update rowsCount with appropriate value

          console.log(this.pagination.rowsNumber)

          // get all rows if "All" (0) is selected
          //let fetchCount = rowsPerPage === 0 ? rowsNumber : rowsPerPage

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
          console.log(page)
          this.$store.dispatch('agencies/getRequests', {
            page, rowsPerPage, filter, sortBy, descending
          }).then((response) => {
            // this.pagination.rowsNumber = this.getRowsNumberCount(filter)
            console.log(response)
            //let returnedData = response.data
            //this.count=response.headers['x-pagination-total-count']
            this.data.splice(0, this.data.length, ...response.data)
            // don't forget to update local pagination object
            this.pagination.page = page
            this.pagination.rowsPerPage = rowsPerPage
            this.pagination.sortBy = sortBy
            this.pagination.descending = descending
            this.pagination.rowsNumber = response.headers['x-pagination-total-count']
            this.data=response.data
            this.loading = false
          }).catch((err)=>{
            console.log(err)

          })
        },
      },
    }
</script>

<style scoped>

</style>
