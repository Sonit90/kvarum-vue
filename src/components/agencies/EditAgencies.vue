<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
  <div class="q-pa-lg q-gutter-sm row">
    <!--        <q-splitter-->
    <!--                v-model="splitterModel"-->
    <!--        >-->

    <!--            <template v-slot:before>-->

    <div class="col">
      <div class="row">
        <div class="col">
          <h1 class="text-h4">
            Агентства недвижимости
          </h1>
          <div
            class="cursor-pointer"
            style="width: 300px"
          >
            <q-btn
              color="primary"
              label="Добавить новое агентство"
            />
            <q-popup-edit
              v-model="newAgency"
              title="Введите название агентства"
              buttons
              label-set="Ок"
              @save="addRootNode()"
            >
              <q-input
                v-model="newAgency"
                dense
                autofocus
              >
                <template v-slot:append>
                  <q-icon name="edit" />
                </template>
              </q-input>
            </q-popup-edit>
          </div>
        </div>
      </div>
      <q-tree
        v-if="typeof props !=='undefined'"
        ref="tree"
        :nodes="props"
        :expanded.sync="expanded"
        :selected.sync="selected"
        default-expand-all
        node-key="id"
        selected-color="primary"
        @update:selected="onSelect"
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
                class="custom-avatar q-mr-md"
                alt="avatar"
              >

              <q-input
                v-if="editable===prop.node.id"
                v-model="prop.node.title"
                autofocus
                dense
                hide-bottom-space
                class="text-weight-light text-black tree-label"
                @click.stop
                @keypress.13.32.stop
                @keyup.13="doneEditing(prop.node)"
              />
              <span
                v-else
                class="text-weight-light text-subtitle1 tree-label"
                @dblclick="edit(prop.node)"
              >{{ prop.node.title }} </span>
              <transition name="fade">
                <q-btn-group
                  v-show="showByIndex === prop.node.id"
                  rounded
                  class="text-black button-group"
                >
                  <!--                                    <q-btn @click.stop="addNode(prop.node)" color="grey-3" icon="add" rounded size="xs" text-color="black" v-if="editable!==prop.node.id"/>-->
                  <q-btn
                    v-if="editable!==prop.node.id"
                    color="grey-3"
                    icon="edit"
                    rounded
                    size="xs"
                    text-color="black"
                    @click.stop="edit(prop.node)"
                  />
                  <q-btn
                    v-if="editable===prop.node.id&&prop.node.title!==''"
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
              <q-knob
                v-if="countFillesProps(prop.node)!==countProps(prop.node)"
                :value="countFillesProps(prop.node)"
                :max="countProps(prop.node)"
                show-value
                class="text-light-blue q-ma-md"
                size="50px"
                color="light-blue"
                readonly
              />
              <q-icon
                v-else
                size="md"
                class="q-ma-md"
                name="check"
                color="positive"
              />
            </div>
          </div>
        </template>
      </q-tree>
    </div>
    <div class="col">
      <div class="sticky">
        <!--                <q-page-sticky expand position="top-right" class="column">-->
        <q-card
          v-show="selected!==null"
          class="my-card q-pa-md"
          style="min-width:500px"
        >
          <q-card-section>
            <div class="upload-example">
              <img
                v-if="selectedFirm()!==null&&typeof selectedFirm() !=='undefined'&&typeof selectedFirm().img !== 'undefined' && selectedFirm().img !== null"
                :src="imgUrl(selectedFirm().img)"
                :alt="selectedFirm().title"
              >
              <Cropper
                v-if="cropperShow"
                ref="cropper"
                classname="upload-logo-cropper"
                :src="image"
                background-classname="cropperBg"
                :stencil-props="{
                  handlersClassnames: {
                    default: 'handler',
                    hover: 'handler--hover',
                  }
                }"
              />
              <div class="button-wrapper">
                <q-uploader
                  ref="uploader"
                  :url="uploadIconURL"
                  :headers="headers"
                  :form-fields="formFields"
                  field-name="icon"
                  hide-upload-btn
                  accept=".jpg, image/*"
                  class="q-mr-md"
                  @added="uploadImage"
                  @uploaded="uploaded"
                >
                  <template v-slot:header="scope">
                    <q-btn
                      v-if="scope.canAddFiles"
                      text-color="primary"
                      color="white"
                      type="a"
                      icon="insert_photo"
                    >
                      Выбрать лого
                      <q-uploader-add-trigger />
                      <q-tooltip>Выбрать лого</q-tooltip>
                    </q-btn>
                  </template>
                </q-uploader>
                <q-btn
                  color="white"
                  text-color="black"
                  label="Загрузить"
                  @click="uploadAvatar()"
                />
              </div>
            </div>
          </q-card-section>

          <q-card-section
            v-if="selectedFirm()!==null&&typeof selectedFirm() !=='undefined'"
            class="q-gutter-md"
          >
            <q-input
              v-model="selectedFirm().title"
              filled
              label="Название"
              class="text-h6"
            />
            <q-input
              v-model="selectedFirm().website"
              filled
              label="Сайт"
              class="text-h6"
            />
            <q-input
              v-model="selectedFirm().phone"
              filled
              label="Телефон"
              class="text-subtitle2"
            />
            <q-input
              v-model="selectedFirm().email"
              filled
              label="Email"
              class="text-subtitle2"
            />
            <q-input
              v-model="selectedFirm().director"
              filled
              label="Руководитель"
              class="text-subtitle2"
            />
            <q-input
              v-model="selectedFirm().address"
              filled
              label="Адрес"
              class="text-subtitle2"
            />
            <q-editor
              v-model="selectedDescription"
              min-height="5rem"
            />
          </q-card-section>
          <q-separator dark />
          <q-card-actions>
            <q-btn
              flat
              color="primary"
              icon-right="save"
              label="Сохранить"
              @click="updateNode"
            />
          </q-card-actions>
        </q-card>
      </div>
      <!--                </q-page-sticky>-->
    </div>
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
import { Cropper } from 'vue-advanced-cropper'
export default {
  name: 'EditAgencies',
  components: {
    Cropper
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
    },
    uploadIconURL () {
      return process.env.API + 'agencies/upload-icon/'
    }
  },
  data () {
    return {
      counts: new Map(),
      image: null,
      editable: null,
      newAgency: null,
      props: [],
      expanded: null,
      selected: null,
      processing: false,
      showByIndex: null,
      update: false,
      peopleSplitter: 50,
      splitterModel: 50,
      cropperShow: true,
      id: 5000000,
      coordinates: {
        height: 0,
        width: 0,
        left: 0,
        top: 0
      }
    }
  },
  mounted () {
    this.$store.dispatch('agencies/getTreeAgencies').then((response) => {
      console.log(response.data)
      this.props = response.data
     this.selected=typeof this.$route.params.id==='undefined'?null:parseInt(this.$route.params.id)

      //this.$q.notify('Успешно получили агентства')
    })
      .catch((e) => {
        console.warn(e)
        this.processing = false
        this.$q.notify('Не удалось получить агентства')
        console.log('Не удалось получить агентства')
      })
  },

  methods: {
    countProps(node){
      let copy=JSON.parse(JSON.stringify(node))
      delete copy.depth
      delete copy.id
      delete copy.lft
      delete copy.rgt
      delete copy.tree
      return  Object.values(copy).length
    },
    countFillesProps(node){
      let copy=JSON.parse(JSON.stringify(node))
      delete copy.depth
      delete copy.id
      delete copy.lft
      delete copy.rgt
      delete copy.tree
      let l =Object.values(copy).filter(x =>{
        if(x!==null&&x!==''){
          return true
        }
        return false
      }).length
     return l
    },
    maxSencil () {
      setTimeout(() => {
        this.$refs.cropper.setCoordinates((coordinates, imageSize) => ({
          width: imageSize.width,
          height: imageSize.height
        }))
      }, 600)
    },
    onSelect () {
      this.image = null
      this.$refs.uploader.reset()
      if (typeof this.selectedFirm().img !== 'undefined' && this.selectedFirm().img !== null) {
        // console.log(this.selectedFirm().img)
        // this.image = this.imgUrl(this.selectedFirm().img)
        // this.maxSencil()
        this.cropperShow = false
      } else {
        this.cropperShow = true
      }
    },
    headers () {
      return [
        { name: 'Authorization', value: 'Bearer ' + LocalStorage.getItem('token') }
      ]
    },
    formFields () {
      return [{ name: 'id', value: this.selected }]
    },
    dataURLtoFile (dataurl, filename) {
      let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },
    uploadImage (files) {
      // create a new FileReader to read this image and convert to base64 format
      console.log(files)
      this.cropperShow = true
      let reader = new FileReader()
      reader.onload = (e) => {
        this.image = e.target.result
        this.maxSencil()
      }
      reader.readAsDataURL(files[0])
    },
    uploaded (info) {
      let url = JSON.parse(info.xhr.response).url
      this.selectedFirm().img = url
      this.image = null
    },
    uploadAvatar () {
      const { coordinates, canvas } = this.$refs.cropper.getResult()
      this.coordinates = coordinates
      // You able to do different manipulations at a canvas
      // but there we just get a cropped image
      this.image = canvas.toDataURL()
      let name = this.$refs.uploader.files[0].name
      this.$refs.uploader.files[0] = this.dataURLtoFile(this.image, name)
      this.$refs.uploader.queuedFiles[0] = this.dataURLtoFile(this.image, name)
      this.$refs.uploader.upload()
    },
    updateNode () {
      let node = this.selectedFirm()
      console.log(node)
      this.$store.dispatch('agencies/updateAgency', { node }).then((response) => {
        this.$q.notify('Успешно обновили агентство')
        console.log(response)
      })
        .catch(() => {
          this.processing = false
          console.log('Удаляем ноду ' + node.id)
          this.removeNode(node.id)
          this.$q.notify('Не удалось обновить фирму')

          console.log('Не удалось обновить фирму')
        })
    },
    doneEditing (node) {
      this.update ? this.updateNode() : this.createNode(node.title, node.parentId, node.id)
      this.update = false
      this.editable = null
      this.showByIndex = null
      this.selected = node.id
    },
    edit (node) {
      this.editable = node.id
      this.update = true
    },
    imgUrl (url) {
      return process.env.URL + url
    },
    avaUrl (url, id) {
      return process.env.URL + `/uploads/users/avatars/${id}/avatar/` + url
    },
    selectedFirm () {
      if (typeof this.$refs.tree !== 'undefined' && typeof this.selected !== 'undefined') {
        return this.$refs.tree.getNodeByKey(this.selected)
      } else {
        return null
      }
    },
    updateId (oldId, newId) {
      let node = this.$refs.tree.getNodeByKey(oldId)
      if (typeof node !== 'undefined') {
        node.id = newId
        this.selected = newId
        this.showByIndex = newId
        this.expanded.push(newId)
        this.expanded = this.expanded.filter(e => e !== oldId)
        this.id++
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
      this.$store.dispatch('agencies/addAgency', { title, parentId }).then((response) => {
        console.log(response)
        let data = response.data
        this.removeTemp(id) // removing temp param from node
        let responseId = data.id
        if (typeof responseId !== 'undefined' && id !== responseId) {
          this.updateId(id, responseId)
        }
        this.$q.notify('Успешно добавили агентство')
      }).catch(() => {
        this.processing = false
        console.log('Удаляем ноду ' + id)
        this.removeNode(id)
        this.$q.notify('Не удалось добавить агентство')
        console.log('Не удалось добавить агентство')
      })
    },
    addNode (node) {
      console.log('addNode')
      this.update = false

      this.changeFocus()
      let newNode = { title: '', id: this.id, parentId: node.id, temp: true }

      node.children = (node.children ? node.children : [])
      node.children.push(newNode)
      this.editable = this.id
      this.selected = this.id
      this.expanded.push(node.id)
      this.showByIndex = this.id
      this.id++
    },
    addRootNode () {
      this.changeFocus()
      let title = this.newAgency
      this.$store.dispatch('agencies/addAgency', { title }).then((response) => {
        console.log(response)
        let newNode = response.data
        this.props.push(newNode)
        this.selected = response.data.id
      })
        .catch(() => {
          this.processing = false
          this.$q.notify('Не удалось добавить агентство')
          console.log('Не удалось добавить агентство')
        })
      this.newAgency = null
    },
    changeFocus (v) {
      v = typeof v !== 'undefined' ? v : null
      this.editable = v
      this.showByIndex = v
      this.selected = v
    },
    removeFromTree (id) {
      this.props.forEach((element, i) => {
        this.props[i] = this.remove(this.props[i], id)
        if (this.props[i].length === 0) {
          this.props.splice(i, 1)
        }
      })
      this.changeFocus()
    },
    removeNode (id) {
      if (confirm('Вы действительно хотите удалить агентство?')) {
        console.log('Удаляем ноду ' + id)
        let node = this.$refs.tree.getNodeByKey(id)
        if (typeof node.temp === 'undefined') {
          this.removeFromServer(id)
        } else {
          this.removeFromTree(id)
        }
      }
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
      console.log('Удаляем агентство ' + id + ' с сервера')
      this.$store.dispatch('agencies/deleteAgency', { id }).then((response) => {
        console.log(response)

        this.removeFromTree(id)
        this.$q.notify('Успешно удалили агентство')
      })
        .catch(() => {
          this.$q.notify('Не удалось удалить агентство')
          console.log('Не удалось удалить агентство')
        })
    }
  }
}
</script>
<style>
  .q-uploader__list{
    display: none;
  }
  .q-uploader{
    width: auto;
    display: inline-block;
    box-shadow: none;
    background: transparent;
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
  }
  .q-uploader__header{
    background: transparent;
    color: #000;
  }
  .q-uploader__header:before, .q-uploader__file:before{
    display: none;
  }
  .cropperBg{
    background:  rgba(119, 114, 114, 0.10);
  }
  .handler{
    background: black;
  }
</style>
<style scoped>
    .sticky{
        position: sticky;
        top:0;
    }
    .custom-avatar{
        max-width: 80px;
        max-height: 80px;
        /*border-radius: 50%;*/
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
  .q-tree__node--selected .tree-label{
    font-weight: 700;
  }
    .upload-logo-cropper {
      border: solid 1px #EEE;
      height: 200px;
      width: 200px;
      border-radius: 5px;
    }
</style>
