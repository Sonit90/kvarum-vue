<template>
  <div class="q-pa-md q-gutter-sm row">
    <!--        <q-splitter-->
    <!--                v-model="splitterModel"-->
    <!--        >-->

    <!--            <template v-slot:before>-->
    <div class="col">
      <div class="row">
        <div class="col">
          <h1 class="text-h4">
            Фирмы
          </h1>
        </div>
        <div class="col">
          <p
            v-if="upToDate"
            class="text-subtitle2 text-blue-grey-13"
          >
            Все изменения сохранены
          </p>
          <div v-else>
            <p class="text-subtitle2 text-blue-grey-13">
              Сохранение
              <q-spinner-dots
                color="primary"
                size="2em"
              />
            </p>
          </div>
        </div>
      </div>
      <q-tree
        ref="tree"
        :nodes="props"
        :expanded.sync="expanded"
        :selected.sync="selected"
        default-expand-all
        node-key="id"
        @update:selected="loadProfiles"
      >
        <template v-slot:default-header="prop">
          <div
            class="q-gutter-x-md"
            @mouseover="showByIndex =prop.node.id"
            @mouseleave="showByIndex =null"
          >
            <div class="row items-center node-container">
              <img
                v-if="prop.node.img"
                :src="imgUrl(prop.node.img)"
                class="custom-avatar q-mr-sm"
              >

              <q-input
                v-if="editable===prop.node.id"
                v-model="prop.node.title"
                autofocus
                dense
                hide-bottom-space
                class="text-weight-light text-black tree-label"
                @click.stop
                @keyup.13="doneEditing(prop.node)"
              />
              <span
                v-else
                class="text-weight-light tree-label"
                @dblclick="edit(prop.node)"
              >{{ prop.node.title }} </span>
              <transition name="fade">
                <q-btn-group
                  v-show="showByIndex === prop.node.id"
                  rounded
                  class="text-black button-group"
                >
                  <q-btn
                    color="grey-3"
                    icon="add"
                    rounded
                    size="xs"
                    text-color="black"
                    @click.stop="addNode(prop.node)"
                  />
                  <q-btn
                    v-show="editable!==prop.node.id"
                    color="grey-3"
                    icon="edit"
                    rounded
                    size="xs"
                    text-color="black"
                    @click.stop="edit(prop.node)"
                  />
                  <q-btn
                    v-show="editable===prop.node.id"
                    color="grey-3"
                    icon="check"
                    rounded
                    size="xs"
                    text-color="black"
                    @click.stop="doneEditing(prop.node)"
                  />
                  <q-btn
                    color="grey-3"
                    icon="remove"
                    rounded
                    size="xs"
                    text-color="black"
                    @click.stop="removeNode(prop.node.id)"
                  />
                </q-btn-group>
              </transition>
            </div>
          </div>
        </template>
      </q-tree>
    </div>
    <div class="col">
      <div class="sticky">
        <!--                <q-page-sticky expand position="top-right" class="column">-->
        <q-card
          v-if="selected!==null"
          class="my-card q-pa-md"
          style="min-width:500px"
        >
          <q-card-section>
            <div class="row justify-center">
              <img
                v-if="selectedFirm().img"
                alt="selectedFirm().title"
                :src="imgUrl(selectedFirm().img)"
                class="custom-avatar big  q-mr-sm justify-center"
              >
            </div>
          </q-card-section>
          <q-card-section>
            <!--                        <div class="text-h6"></div>-->
            <q-input
              v-model="selectedFirm().title"
              debounce="300"
              filled
              label="Название"
              class="text-h6"
              @input="inputUpdateDebounce(selectedFirm())"
            />
            <!--                        <q-popup-edit v-model="selectedFirm().title" buttons label-cancel="Отмена">-->
            <!--                            <q-input v-model="selectedFirm().label" dense autofocus />-->
            <!--                        </q-popup-edit>-->
          </q-card-section>
          <q-card-section>
            <!--                        <p class="text-caption text-blue-grey-4">Телефон</p>-->
            <!--                        <span class="text-subtitle2">{{selectedFirm().phone}}</span>-->
            <q-input
              v-model="selectedFirm().phone"
              debounce="300"
              filled
              label="Телефон"
              class="text-subtitle2"
              @input="inputUpdateDebounce(selectedFirm())"
            />
          </q-card-section>
          <q-card-section>
            <!--                        <p class="text-caption text-blue-grey-4">Адрес</p>-->

            <q-input
              v-model="selectedFirm().address"
              debounce="300"
              filled
              label="Адрес"
              class="text-subtitle2"
              @input="inputUpdateDebounce(selectedFirm())"
            />
          </q-card-section>

          <q-card-section>
            <!--                        <p class="text-caption text-blue-grey-4">Описание</p>-->
            <!--                        <div class="q-pa-md" style="max-height: 300px">-->
            <!--                            <q-input debounce="500"-->
            <!--                                    v-model="selectedFirm().description"-->
            <!--                                     label="Описание"-->
            <!--                                    filled-->
            <!--                                    type="textarea"-->
            <!--                                    autogrow-->
            <!--                            />-->
            <q-editor
              v-model="selectedDescription"
              min-height="5rem"
              style="max-width: 600px;"
              @input="inputUpdateDebounce(selectedFirm())"
            />
          </q-card-section>
        </q-card>
        <div class=" q-gutter-lg">
          <q-splitter
            v-if="this.selected!==null"
            v-model="peopleSplitter"
          >
            <template v-slot:before>
              <div
                v-if="!processing&&typeof users[selected] !=='undefined'"
                class="q-pt-md"
              >
                <UserList :users="users[selected]" />
              </div>
            </template>

            <template v-slot:after>
              <div class="q-pa-md">
                <div class="text-subtitle2 q-mb-md">
                  Сотрудники без фирмы
                </div>
              </div>
            </template>
          </q-splitter>
        </div>
      </div>
      <!--                </q-page-sticky>-->
    </div>

    <!--            </template>-->
    <!--        </q-splitter>-->
  </div>
</template>

<script>
import { Notify, debounce } from 'quasar'
import UserList from './UserList'

export default {
  name: 'Firms',
  components: {
    'UserList': UserList
  },
  computed: {
    selectedDescription: { get: function () {
      if (this.selectedFirm().description) {
        return this.selectedFirm().description
      } else {
        return ''
      }
    },
    set: function (value) {
      this.selectedFirm().description = value
    }
    }
  },
  data () {
    return {
      expanded: null,
      selected: null,
      editable: null,
      processing: false,
      showByIndex: null,
      update: false,
      splitterModel: 50,
      // selectedFirm: null,
      upToDate: true,
      id: 500000,
      peopleSplitter: 50,
      props: [{ 'title': 'Фирмы' }],
      users: null
    }
  },
  mounted () {
    this.inputUpdate = debounce(this.inputUpdate, 3000)
    this.$store.dispatch('mystore/fetchFirms').then((response) => {
      console.log(response)
      this.props = response.tree
      this.id = response.id
      Notify.create({
        message: 'Успешно получили фирмы'
      })
    })
      .catch(() => {
        this.processing = false
        Notify.create({
          message: 'Не удалось получить фирмы'
        })
        console.log('Не удалось получить фирмы')
      })
  },

  methods: {
    loadProfiles (target) {
      this.processing = true
      console.log(target)
      this.$store.dispatch('mystore/getFirmProfiles', target).then((response) => {
        console.log(response)
        this.users = { [target]: response }
        this.processing = false
      })
        .catch(() => {
          this.processing = false
          Notify.create({
            message: 'Не удалось получить сотрудников фирмы'
          })
        })
    },
    inputUpdate (node) {
      this.updateNode(node)
    },
    inputUpdateDebounce (node) {
      this.upToDate = false
      this.inputUpdate(node)
    },
    imgUrl (url) {
      return 'https://printax27.ru/' + url
    },
    avaUrl (url, id) {
      return `https://printax27.ru/uploads/users/avatars/${id}/avatar/` + url
    },
    selectedFirm () {
      return this.$refs.tree.getNodeByKey(this.selected)
    },
    edit (node) {
      this.editable = node.id
      this.update = true
    },
    doneEditing (node) {
      if (this.update) {
        this.updateNode(node)
      } else {
        this.createNode(node.title, node.parentId, node.id)
      }
      this.update = false
      this.editable = null
      this.showByIndex = null
      this.selected = node.id
      // let rootId = node.parentId
      // check if rootId exists
      // this.selectedDescription = rootId.toString()
    },
    updateNode (node) {
      this.$store.dispatch('mystore/updateFirm', { node }).then((response) => {
        console.log(response)
        this.removeTemp(node.id)
        this.upToDate = true
        if (response.result === 'success') {
          // Notify.create({
          //   message: 'Успешно обновили данные фирмы'
          // })
        } else {
          Notify.create({
            message: 'Не удалось обновить фирму'
          })
        }
      })
        .catch(() => {
          this.processing = false
          console.log('Удаляем ноду ' + node.id)
          this.removeNode(node.id)
          Notify.create({
            message: 'Не удалось обновить фирму'
          })
          console.log('Не удалось обновить фирму')
        })
    },
    updateId (oldId, newId) {
      let node = this.$refs.tree.getNodeByKey(oldId)
      if (typeof node !== 'undefined') {
        node.id = newId
        this.id = newId + 1
        console.log('changing id after request')
      }
    },
    removeTemp (id) {
      let node = this.$refs.tree.getNodeByKey(id)
      if (typeof node.temp !== 'undefined') {
        delete node.temp
        console.log('removing temp prop')
      }
    },
    createNode (title, parentId, id) {
      this.$store.dispatch('mystore/createFirm', { title, parentId }).then((response) => {
        console.log(response)
        if (response.result === 'success') {
          // removing temp param from node
          this.removeTemp(id)
          let responseId = response.node.id
          if (typeof responseId !== 'undefined') {
            if (id !== responseId) {
              this.updateId(id, responseId)
            }
          }

          Notify.create({
            message: 'Успешно добавили фирму'
          })
        } else {
          Notify.create({
            message: 'Не удалось добавить фирму'
          })
        }
      })
        .catch(() => {
          this.processing = false
          console.log('Удаляем ноду ' + id)
          this.removeNode(id)
          Notify.create({
            message: 'Не удалось добавить фирму'
          })
          console.log('Не удалось добавить фирму')
        })
    },
    addNode (node) {
      this.update = false
      this.changeFocus()
      let newNode = { title: '', id: this.id, parentId: node.id, temp: true }
      // node.children.push(newNode)
      node.children = (node.children ? node.children : [])
      node.children.push(newNode)
      this.expanded.push(node.id)
      this.editable = this.id
      this.showByIndex = this.id
      this.id++
    },
    changeFocus (v) {
      v = typeof v !== 'undefined' ? v : null
      this.editable = v
      this.showByIndex = v
      this.selected = v
    },
    removeNode (id) {
      console.log('Удаляем ноду ' + id)

      let node = this.$refs.tree.getNodeByKey(id)
      if (typeof node.temp === 'undefined') {
        this.removeFromServer(id)
      }
      this.changeFocus()
      this.props.forEach((element, i) => {
        this.props[i] = this.remove(this.props[i], id)
        if (this.props[i].length === 0) {
          this.props.splice(i, 1)
        }
      })
    },
    remove (parent, id) {
      if (parent.children) {
        parent.children = parent.children
          .filter(function (child) {
            return child.id !== id
          })
          .map((child) => {
            return this.remove(child, id)
          })
      }
      if (parent.id === id) {
        return []
      }
      return parent
    },
    removeFromServer (id) {
      console.log('Удаляем фирму ' + id + ' с сервера')
      this.$store.dispatch('mystore/deleteFirm', { id }).then((response) => {
        console.log(response)
        // let responseId = response.node.id
        // if (typeof responseId !== 'undefined') {
        //   if (id !== responseId) {
        //     this.updateId(id, responseId)
        //   }
        // }

        Notify.create({
          message: 'Успешно удалили фирму'
        })
      })
        .catch(() => {
          // this.processing = false
          // console.log('Удаляем ноду ' + id)
          // this.removeNode(id)
          Notify.create({
            message: 'Не удалось удалить фирму'
          })
          console.log('Не удалось удалить фирму')
        })
    }
  }
}
</script>
<style scoped>
    .sticky{
        position: sticky;
        top:0;
    }
    .custom-avatar{
        max-width: 30px;
        max-height: 30px;
        border-radius: 50%;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2), 0 1px 1px rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12);
        vertical-align: middle;
    }
    .custom-avatar.big{
        max-width: 300px;
        max-height: 150px;
        border-radius: 0;
    }
.node-container{
    position: relative;
    padding-right: 15px;
}
    .button-group{
        position: absolute;
        left: 0;
        margin-left: 100%;
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .25s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active до версии 2.1.8 */ {
        opacity: 0;
    }
    .tree-label{
        line-height: 36px;
        height: 36px!important;
        display: inline-block;
    }
</style>
