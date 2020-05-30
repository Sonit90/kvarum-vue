<template>
  <div>
    <img
      v-if="avatar !== null"
      :src="avatar"
      class="q-pa-md"
      alt="Фото профиля"
    >
    <Cropper
      v-if="cropperShow"
      ref="cropper"
      class="q-pa-md"
      classname="upload-logo-cropper"
      :src="image"
      background-classname="cropperBg"
      :stencil-props="{
        aspectRatio:aspectRatio,
        handlersClassnames: {
          default: 'handler',
          hover: 'handler--hover',
        }
      }"
    />
    <div
      class="button-wrapper"
      :class="{'q-gutter-x-md':image===null}"
    >
      <q-uploader
        ref="uploader"
        :url="uploadURL"
        :headers="headers"
        :form-fields="formFields"
        :field-name="fieldName"
        hide-upload-btn
        accept=".jpg, image/*"
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
            {{ buttonCaption }}
            <q-uploader-add-trigger />
            <q-tooltip>{{ buttonCaption }}</q-tooltip>
          </q-btn>
        </template>
      </q-uploader>
      <q-btn
        v-show="image!==null"
        color="white"
        text-color="black"
        label="Загрузить"
        @click="uploadAvatar()"
      />
    </div>
  </div>
</template>
<script>
  import { Cropper } from 'vue-advanced-cropper'
  import { LocalStorage } from 'quasar'
    export default {
        name: 'ImageUploader',
      components: {
        Cropper
      },
      data() {
        return {
          image: null,
          cropperShow:false
        }
      },
      computed: {
        headers () {
          return [
            { name: 'Authorization', value: 'Bearer ' + LocalStorage.getItem('token') }
          ]
        }
      },
        props: {
          fieldName:{
            type:String,
            required:true
          },
          aspectRatio:{
            type:[String,Number],
            required:false,
            default:1
          },
          buttonCaption:{
            type:String,
            required:false,
            default:'Выбрать лого'
          },
          uploadURL:{
            type:String,
            required:true
          },
          formFields:{
            type:Array,
            required:true
          },
          avatar:{type:String, required:false}
        },
      methods: {
        dataURLtoFile (dataurl, filename) {
          let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n)
          while (n--) {
            u8arr[n] = bstr.charCodeAt(n)
          }
          return new File([u8arr], filename, { type: mime })
        },
        maxSencil () {
          setTimeout(() => {
            this.$refs.cropper.setCoordinates((coordinates, imageSize) => ({
              width: imageSize.width,
              height: imageSize.height
            }))
          }, 600)
        },
        uploadImage (files) {
          // create a new FileReader to read this image and convert to base64 format
          console.log(files)
          this.cropperShow = true
          let reader = new FileReader()
          reader.onload = (e) => {
            this.image = e.target.result
           // this.maxSencil()
          }
          reader.readAsDataURL(files[0])
        },
        uploaded (info) {
          let url = JSON.parse(info.xhr.response).url
          this.$emit('avatarUploaded', url)
          this.cropperShow=false
          this.image = null
        },
        uploadAvatar () {
          const { canvas } = this.$refs.cropper.getResult()
          this.image = canvas.toDataURL()
          let name = this.$refs.uploader.files[0].name
          this.$refs.uploader.files[0] = this.dataURLtoFile(this.image, name)
          this.$refs.uploader.queuedFiles[0] = this.dataURLtoFile(this.image, name)
          this.$refs.uploader.upload()
          //TODO ДОбавить try catch блоки на загрузку
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
  .cropperBg{
    background:  rgba(119, 114, 114, 0.10);
  }
</style>
<style scoped>
  .upload-logo-cropper {
    border: solid 1px #EEE;
    height: 400px;
    width: 600px;
    border-radius: 5px;
  }
</style>
