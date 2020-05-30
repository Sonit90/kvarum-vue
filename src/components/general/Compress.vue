<template>
  <div
    class="container"
    style="width: 100%;min-height: 200px; max-height: 1000px;"
  >
    <canvas ref="testCanvas" />

    <q-uploader
      label="Фотографии (не забудьте загрузить технический план квартиры!)"
      multiple
      style="width: 100%;min-height: 200px; max-height: 1000px;"
      class="q-my-md"
      field-name="image"
      hide-upload-btn
      accept="image/*"
      no-thumbnails
      @added="addFiles"
    >
      <template #list="scope">
        <q-btn
          v-if="scope.files.length ===0"
          flat
          class="absolute-center"
          icon="image"
          no-caps
          style="width: 100%;
    height: 100%;
    border: 2px dashed #0087F7; border-top: none;"
        >
          <q-uploader-add-trigger style="z-index: 1000;" />
          <div>Перенесите файлы сюда или нажмите для загрузки</div>
        </q-btn>
        <span
          v-if="time!==null"
          v-text="time"
        />
        <SlickList
          v-if="scope.files.length>0"
          v-model="scope.files"
          axis="xy"
          class="slickListContainer"
          :press-threshold="0"
          :distance="0"
          :transition-duration="0"
          :dragged-settling-duration="0"
          :lock-to-container-edges="true"
          helper-class="drag-helper"
        >
          <SlickItem
            v-for="(file, index) in scope.files"
            :key="file.uniqueId"
            :index="index"
            class="drag-image full-height items-center justify-center"
          >
            <canvas
              v-show="file.isLoaded"
              :key="file.uniqueId+'canvas'"
              :ref="file.uniqueId+'canvas'"
              class="canvasImage"
            />
            <q-spinner
              v-if="!file.isLoaded"
              color="primary"
              size="3em"
            />
          </SlickItem>
          <q-btn
            class="gt-xs add-btn width-auto"
            size="14px"
            no-caps
            outline
            text-color="primary"
            icon="image"
          >
            <q-uploader-add-trigger style="z-index: 1000;" />
            Добавить фото
          </q-btn>
        </SlickList>
      </template>
    </q-uploader>
  </div>
</template>

<script>
  import { uid } from 'quasar'
  import { SlickList, SlickItem } from 'vue-slicksort'
     export default {
      data() {
        return {
          time: null
        }
      },
      components: {SlickItem, SlickList },
        name: "Compress",
      methods: {
        addFiles(addedFiles) {
          let start = performance.now();
          let filesReady=[]
          addedFiles.forEach((e) => {
            e.uniqueId = uid();
            let p =this.convertCanvas(e).then(()=>filesReady.push(p))
            e.isLoaded=true
          })
          Promise.all(filesReady).then(() => {
            this.time = (performance.now() - start).toFixed(2);
          })



        },
        convertCanvas(file){
          return new Promise((resolve, reject) => {

          let img = new Image();
          img.onload =  ()=> {
            let canvas = this.$refs[file.uniqueId + 'canvas'][0]
            let ctx = canvas.getContext("2d");

            let aspectRatio = parseFloat((img.height / img.width).toFixed(4))
            if(aspectRatio>1){
              canvas.height = 853
              canvas.width = canvas.height / aspectRatio
            }else{
              canvas.width = 1280
              canvas.height = canvas.width * aspectRatio
            }
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve()
          }
          img.src = window.URL.createObjectURL(file);
          })
        }
          ,
      },
    }
</script>

<style scoped>
  .canvasImage{
    max-height: 100%;
  }
  .slickListContainer{
    display: grid;
    grid-gap: 5px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
</style>
