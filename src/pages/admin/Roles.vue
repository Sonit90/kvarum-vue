<template>
  <q-card class="q-ma-lg q-pa-md">
    <q-table
      title="Роли"
      :data="data"
      :columns="cols"
      row-key="name"
      :loading="loading"
      :visible-columns="visibleColumns"
      hide-bottom
      @request="onRequest"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            key="name"
            :props="props"
            auto-width
          >
            {{ props.row.name }}
          </q-td>

          <q-td
            key="description"
            :props="props"
            auto-width
          >
            {{ props.row.description }}
          </q-td>
          <q-td
            key="ruleName"
            :props="props"
            auto-width
          >
            {{ props.row.ruleName }}
          </q-td>

          <q-td
            key="actions"
            :props="props"
            auto-width
            class="q-gutter-xs"
          >
            <q-btn
              color="primary"
              icon="edit"
              dense
              size="md"
              :to="{name: 'editRole', params: {name:props.row.name}}"
            >
              <q-tooltip>
                Редактировать
              </q-tooltip>
            </q-btn>
            <q-btn
              color="negative"
              icon="close"
              dense
              @click="$q.dialog({
                title: 'Подтвердите действие',
                message: 'Вы хотите удалить правило?',
                cancel: true,
              }).onOk(() => {
                delete(props.row)
              })"
            >
              <q-tooltip>
                Удалить
              </q-tooltip>
            </q-btn>
          </q-td>
        </q-tr>
      </template>
      <template v-slot:top-right>
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
      </template>
    </q-table>
  </q-card>
</template>

<script>
  export default {
    name: 'Roles',
    data () {
      return {
        localStorageName:'RolesVisibleColumns',
        visibleColumns: ['name','description', 'ruleName', 'actions'],
        loading: false,
        cols: [
          { name: 'name',
            label: 'Название',
            field: 'name',
            required: true,
            align: 'left'
          },
          { name: 'description',
            label: 'Описание',
            field: 'name',
            required: true,
            align: 'left'
          },
          { name: 'ruleName',
            label: 'Правило',
            field: 'name',
            align: 'left'
          },
          { name: 'actions',
            label: 'Действия',
            required: true,
            align: 'left'
          }
        ],
        data: []
      }
    },
    watch: {
      visibleColumns (newValue) {
        this.$q.localStorage.set(this.localStorageName, JSON.stringify(newValue))
      }

    },
    mounted () {
      if (this.$q.localStorage.has(this.localStorageName)) {
        this.visibleColumns = JSON.parse(this.$q.localStorage.getItem(this.localStorageName))
      }
      this.onRequest()
    },
    methods: {
      onRequest () {
        this.loading = true
        this.$store.dispatch('admin/getRoles').then((response) => {
          console.log(response)
          if(typeof response.data!=='undefined'){
            this.data=Object.values(response.data)
          }else{
            this.data=Object.values(response)
          }

        this.loading = false
        })
      }
    }
  }
</script>
