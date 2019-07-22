<template>
    <div class="q-pa-md q-gutter-sm row">
<!--        <q-splitter-->
<!--                v-model="splitterModel"-->
<!--        >-->

<!--            <template v-slot:before>-->
        <div class="col">
<h1 class="text-h4">Фирмы</h1>
<!--            <h2>{{this.update}}</h2>-->
        <q-tree
                :nodes="props"
                :expanded.sync="expanded"
                :selected.sync="selected"
                default-expand-all
                node-key="id"
                ref="tree"
        >
            <template v-slot:default-header="prop" >
                <div class="q-gutter-x-md" @mouseover="showByIndex =prop.node.id" @mouseleave="showByIndex =null">
                    <div class="row items-center node-container" >
                        <img :src="imgUrl(prop.node.img)" class="custom-avatar q-mr-sm" v-if="prop.node.img">

                    <q-input @click.stop  autofocus dense
                             v-if="editable===prop.node.id" hide-bottom-space
                             @keyup.13="doneEditing(prop.node)" v-model="prop.node.title" class="text-weight-light text-black tree-label" />
                    <span v-on:dblclick="edit(prop.node)" v-else class="text-weight-light tree-label">{{prop.node.title}} </span>
                    <transition name="fade">
                    <q-btn-group rounded v-show="showByIndex === prop.node.id" class="text-black button-group">
                        <q-btn @click.stop="addNode(prop.node)" color="grey-3" icon="add" rounded size="xs" text-color="black"/>
                        <q-btn @click.stop="edit(prop.node)" v-show="editable!==prop.node.id"  color="grey-3" icon="edit" rounded size="xs" text-color="black"/>
                        <q-btn v-show="editable===prop.node.id" @click.stop="doneEditing(prop.node)" color="grey-3" icon="check" rounded size="xs" text-color="black"/>
                        <q-btn @click.stop="removeNode(prop.node,prop.node.id)" color="grey-3" icon="remove" rounded size="xs" text-color="black"/>
                    </q-btn-group>
                    </transition>
                </div>
                </div>
            </template>
      </q-tree>
<!--            </template>-->
<!--            <template v-slot:after>-->
        </div>
        <div class="col">
            <div class="sticky">
<!--                <q-page-sticky expand position="top-right" class="column">-->
                <q-card class="my-card q-pa-md" v-if="selected!==null" style="min-width:500px">
                    <q-card-section>
                    <div class="row justify-center">
                    <img alt="selectedFirm().title" :src="imgUrl(selectedFirm().img)" class="custom-avatar big  q-mr-sm justify-center" v-if="selectedFirm().img">
                    </div>
                    </q-card-section>
                    <q-card-section>
<!--                        <div class="text-h6"></div>-->
                        <q-input  debounce="500" filled v-model="selectedFirm().title" label="Название" class="text-h6"/>
<!--                        <q-popup-edit v-model="selectedFirm().title" buttons label-cancel="Отмена">-->
<!--                            <q-input v-model="selectedFirm().label" dense autofocus />-->
<!--                        </q-popup-edit>-->
                    </q-card-section>
                    <q-card-section >
<!--                        <p class="text-caption text-blue-grey-4">Телефон</p>-->
<!--                        <span class="text-subtitle2">{{selectedFirm().phone}}</span>-->
                        <q-input  debounce="500" filled v-model="selectedFirm().phone" label="Телефон" class="text-subtitle2"/>
                           </q-card-section>
                    <q-card-section>
<!--                        <p class="text-caption text-blue-grey-4">Адрес</p>-->

                        <q-input  debounce="500" filled v-model="selectedFirm().address" label="Адрес" class="text-subtitle2"/>
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
                        <q-editor v-model="selectedDescription" min-height="5rem"  style="max-width: 600px;"/>
                    </q-card-section>

                </q-card>
                    <div class=" q-gutter-lg">
                        <q-splitter
                                v-model="peopleSplitter"
                                v-if="this.selected!==null"
                        >

                            <template v-slot:before>
                                <div class="q-pa-md">
                                    <div class="text-subtitle2 q-mb-md">Сотрудники <b>{{selectedFirm().title}}</b></div>
                                </div>
                            </template>

                            <template v-slot:after>
                                <div class="q-pa-md">
                                    <div class="text-subtitle2 q-mb-md">Сотрудники без фирмы</div>

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
import { Notify } from 'quasar'

export default {
  name: 'Firms',
  data () {
    return {
      selected: null,
      expanded: null,
      editable: null,
      processing: false,
      update: false,
      showByIndex: null,
      // selectedFirm: null,
      splitterModel: 50,
      peopleSplitter: 50,
      id: 500000,
      props: [{ 'title': 'Фирмы' }]
    }
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

  methods: {
    imgUrl (url) {
      return 'https://printax27.ru/' + url
    },
    selectedFirm () {
      return this.$refs.tree.getNodeByKey(this.selected)
    },

    focusInput (event) {
      event.target.focus()
      // this.$refs.self.focus()
    },
    toggleSelected (expanded) {
      // console.log(expanded)
      // console.log('selected')
      // let index = expanded.indexOf(this.editable)
      // console.log(index)
      // if (index !== -1) { expanded.splice(index, 1) }
    },
    edit (node) {
      this.editable = node.id
      this.update = true
    },
    // changeEditable (label) {
    //   this.editable = label
    // },
    doneEditing (node) {
      if (!this.update) {
        this.createNode(node.title, node.parentId, node.id)
      }
      this.update = false
      this.editable = null
      this.showByIndex = null
      this.selected = node.id
      let rootId = node.parentId
      this.selectedDescription = rootId.toString()
    },
    createNode (title, parentId, id) {
      this.$store.dispatch('mystore/createFirm', { title, parentId }).then((response) => {
        console.log(response)

        Notify.create({
          message: 'Успешно добавили фирму'
        })
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
      console.log(node.children)
      this.changeFocus()

      if (node.children) {
        node.children.push({ title: '', id: this.id, parentId: node.id })
      } else {
        node.children = [{ title: '', id: this.id, parentId: node.id }]
        console.log(this.id)
      }
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
      this.changeFocus()

      // let index = this.props.indexOf(node)
      // console.log(this.props[index])
      this.props.forEach((element, i) => {
        this.props[i] = this.remove(this.props[i], id)
        if (this.props[i].length === 0) {
          this.props.splice(i, 1)
        }
        // this.remove(element, id)
      })
      // this.props[index] = this.remove(this.props[index], id)
      // if (this.props[index].length === 0) {
      //   this.props.splice(index, 1)
      // }
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
    }
  },
  mounted () {
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
  }
}
</script>
<style scoped>
    .sticky{
        position: sticky;
        top:0;
    }
    .custom-avatar{
        max-width: 50px;
        max-height: 50px;
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
