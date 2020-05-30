<template>
  <div>
    <FlatProp
      title="Цена"
      required
    >
      <div class="row">
        <div class="col col-md-7 col-xs-11">
          <currency-input
            v-model="price"
            big
            filled
            :error="$v.price.$error"
            @blur="$v.price.$touch()"
            @input="clearServerError('price')"
          >
            <template #error>
              <span v-if="!$v.price.required">Укажите цену </span>
              <span v-if="!$v.price.numeric">Цена целым числом </span>
              <span v-if="!$v.price.minValue">Цена должна быть больше 30000 </span>
              <span v-if="!$v.price.server">{{ errors.get('price').join(' ') }}</span>
            </template>
          </currency-input>
        </div>
        <div class="col col-md-5 col-xs-12 flex ">
          <q-checkbox
            v-model="haggle"
            label="Торг"
            :true-value="1"
            :false-value="0"
            class="non-selectable"
          />
          <q-checkbox
            v-model="mortgage"
            label="Ипотека возможна"
            :true-value="1"
            :false-value="0"
            class="non-selectable"
          />
        </div>
      </div>
    </FlatProp>

    <FlatProp
      title="Тип сделки"
      required
    >
      <q-field
        :error="$v.deal_status.$error"
        borderless
        no-error-icon
        @blur="$v.deal_status.$touch()"
      >
        <q-btn-toggle
          v-model="deal_status"
          clearable
          toggle-color="primary"
          :options="deal_statuses"
          no-caps
          rounded
          :size="$q.screen.lt.md?'13px':'md'"
          :dense="$q.screen.lt.md"
          @input="clearServerError('deal_status')"
        />
        <template #error>
          <span v-if="!$v.deal_status.required">Укажите тип сделки </span>
          <span v-if="!$v.deal_status.server">{{ errors.get('deal_status').join(' ') }}</span>
        </template>
      </q-field>
      <template #after>
        <q-avatar
          color="primary"
          text-color="white"
          icon="fas fa-question"
          size="md"
        >
          <q-tooltip
            max-width="300px"
            content-class="tooltip-card"
          >
            <p><b>Свободная продажа</b> — самостоятельная сделка, не зависящая от других сделок</p>
            <p><b>Альтернатива</b> — одновременная сделка по продаже одного объекта недвижимости и приобретению другого</p>
            <p><b>Переуступка</b> — это приобретение имущественных прав по договору долевого участия. В этом случае у продавца нет права собственности на жильё, а сам объект, как правило, ещё не сдан</p>
          </q-tooltip>
        </q-avatar>
      </template>
    </FlatProp>

    <FlatProp title="Бонус агента">
      <q-btn-toggle
        v-model="agent_comission_type"
        :options="bonusOptions"
        clearable
        no-caps
        rounded
        class="q-mb-md"
        :size="$q.screen.lt.md?'13px':'md'"
        :dense="$q.screen.lt.md"
      />
      <currency-input
        v-if="agent_comission_type===1"
        v-model="agent_comission_fee"
        big
        label="Сумма бонуса"
        class="full-width"
        style="font-size:24px;"
      />
      <q-input
        v-if="agent_comission_type===2"
        v-model="agent_comission_fee"
        clearable
        label="Процент от цены"
        suffix="%"
        style="width: 200px"
        :hint="'Сумма бонуса: '+bonusSumm"
      />
    </FlatProp>
    <FlatProp
      title="Услуги агентства"
      class="q-pr-md"
    >
      <currency-input
        v-model="agent_fee"
        big
      />
    </FlatProp>
    <q-input
      v-model="description"
      class="q-pr-md"
      type="textarea"
      :error="$v.description.$error"
      label="Описание"
      autogrow
      @blur="$v.description.$touch()"
      @input="clearServerError('description')"
    >
      <template #error>
        <span v-if="!$v.description.required">Заполните описание </span>
        <span v-if="!$v.description.server">{{ errors.get('description').join(' ') }}</span>
      </template>
      <template #before>
        <span class="text-negative">*</span>
      </template>
    </q-input>
    <!--    {{ files }}-->
    <!--    <hr>-->
    <!--    {{ queuedFiles }}-->
    <!--    <hr>-->
    <!--    {{ uploadedFiles }}-->

    <q-field
      id="UploaderField"
      :error="$v.photosTotal.$error"
      borderless
      no-error-icon
      error-message="Добавьте файлы"
      style="width: 100%;min-height: 200px; max-height: 1000px;"
      @change="$v.photosTotal.$touch()"
    >
      <q-uploader
        ref="fileUploader"
        :url="uploadUrl"
        label="Фотографии (не забудьте загрузить технический план квартиры!)"
        multiple
        :headers="headers"
        style="width: 100%;min-height: 200px; max-height: 1000px;"
        class="q-my-md"
        field-name="image"
        accept="image/*"
        :factory="factoryFn"
        no-thumbnails
        @uploaded="uploaded"
        @uploading="uploadStart"
        @finish="uploadFinish"
        @removed="removeFile"
        @added="addFiles"
        @change="$v.photosTotal.$touch()"
      >
        <template #list="scope">
          <q-btn
            v-if="scope.files.length ===0"
            :color="$v.photosTotal.$error?'negative':'primary'"
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

          <SlickList
            v-if="scope.files.length>0"
            v-model="scope.files"
            axis="xy"
            class="slickListContainer"
            :press-threshold="0"
            :distance="$q.screen.gt.md?20:0"
            :transition-duration="0"
            :dragged-settling-duration="0"
            :lock-to-container-edges="true"
            helper-class="drag-helper"
            @sort-start="onSortStart($event)"
          >
            <SlickItem
              v-for="(file, index) in scope.files"
              :key="file.uniqueId"
              :index="index"
              class="drag-image"
            >
              <div class="flex full-height items-center justify-center overflow-hidden">
                <canvas
                  v-show="file.isLoaded"
                  :key="file.uniqueId+'canvas'"
                  :ref="file.uniqueId+'canvas'"
                  class="canvasImage"
                  :style="{transform:`rotate(${file.rotation}deg)`}"
                />
                <q-spinner
                  v-if="!file.isLoaded"
                  color="primary"
                  size="3em"
                />
              </div>

              <template v-if="file.isLoaded">
                <q-btn
                  class="rotate-btn rotate-right"
                  :size="$q.screen.lt.md?'12px':'md'"
                  flat
                  dense
                  round
                  text-color="white"
                  icon="rotate_right"
                  @click.stop="rotate(file, 90)"
                >
                  <q-tooltip>
                    Повернуть по часовой
                  </q-tooltip>
                </q-btn>

                <q-btn
                  class="rotate-btn rotate-left"
                  :size="$q.screen.lt.md?'12px':'md'"
                  flat
                  dense
                  round
                  text-color="white"
                  icon="rotate_left"
                  @click.stop="rotate(file, -90)"
                >
                  <q-tooltip>
                    Повернуть против часовой
                  </q-tooltip>
                </q-btn>


                <q-btn
                  class="remove-btn"
                  :size="$q.screen.lt.md?'12px':'md'"
                  flat
                  dense
                  round
                  text-color="white"
                  icon="delete"
                  @click="scope.removeFile(file)"
                >
                  <q-tooltip>
                    Удалить изображение
                  </q-tooltip>
                </q-btn>
              </template>
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
    </q-field>
  </div>
</template>

<script>
import { mapFields } from 'vuex-map-fields'
import CurrencyInput from 'components/general/CurrencyInput'
import { SlickList, SlickItem } from 'vue-slicksort'
import FlatProp from "components/general/FlatProp";
import serverErrorVuex from "src/mixins/serverErrorVuex"
import { uid } from 'quasar'
import rotateImageExif from 'src/mixins/rotateImageExif'
import canvasWebWorkerMixin from 'src/mixins/canvasWebWorkerMixin'
export default {
  name:'StepThree',
  components: {FlatProp, CurrencyInput, SlickItem, SlickList },
  mixins:[serverErrorVuex, rotateImageExif,canvasWebWorkerMixin],
  data () {
    return {
      photosAddedToUploader:false,
      isMounted: false
    }
  },
  computed: {
    files: {
      get: function () {
        if(this.isMounted){
          return this.$refs.fileUploader.files
        }
        return null
      },
      set: function (newValue) {
        this.$refs.fileUploader.files=newValue
      }
    },
    queuedFiles:
      {
        get: function () {
          if(this.isMounted){
            return this.$refs.fileUploader.queuedFiles
          }
          return null
        },
        set: function (newValue) {
          this.$refs.fileUploader.queuedFiles=newValue
        }
      },
    uploadedFiles: {
      get: function () {
        if(this.isMounted){
          return this.$refs.fileUploader.uploadedFiles
        }
        return null
      },
      set: function (newValue) {
        this.$refs.fileUploader.uploadedFiles=newValue
      }
    },
    bonusSumm () {
      if (this.price !== null && this.agent_comission_type === 2 && this.agent_comission_fee !== null && this.agent_comission_fee !== '') {
        return this.$options.filters.toCurrency(parseInt(Math.round(parseInt(this.price) * parseInt(this.agent_comission_fee) / 100)))
      }
      return 'Цена не указана'
    },

    headers () {
      return [
        { name: 'Authorization', value: 'Bearer ' + this.token }
      ]
    },
    ...mapFields(
      'flats',
      ['flat',
        'flat.price',
        'flat.deal_status',
        'flat.priceAdditionals',
        'flat.description',
        'flat.agentComission',
        'flat.agent_comission_fee',
        'flat.agent_comission_type',
        'flat.agent_fee',
        'flat.haggle',
        'flat.mortgage',
        'photosLoaded',
        'photosTotal',
        'filesUploaded',
        'uploadStarted',
        'created',
        'errors',
        'isEditing',
        'bonusOptions',
        'deal_statuses'
      ]
    ),
    ...mapFields(
      'auth',
      ['token']
    ),
    img_order: {
      get: function () {
        if (this.isMounted) {
          let files = this.$refs.fileUploader.files;
          let order = [];
          if (typeof files !== 'undefined' && files !== null) {
            files.forEach((e, index) => {
                order[index] = e.uniqueId

            })
          }
          return order
        }
        return []
      },
      set: function (newValue) {
        this.$store.commit('flats/UPDATE_ORDER', newValue)
      }
    },
    uploadedOrder() {
        if (this.uploadedFiles!==null) {
          //console.log(this.uploadedFiles)
          let order = [];

           this.uploadedFiles.forEach((e, index) => {
              order[index] = e.uniqueId
            });
          //console.log(order)
          //this.$store.commit('flats/UPDATE_ORDER', order)
          return order
        }
        return []
      },
    uploadUrl () {
      return process.env.URL + 'api/images/upload/'
    },
    $v(){
      return this.validations.$v
    },
    uploader(){
      return this.validations.uploader
    }
  },
  inject:{
    validations: {
      from: 'validations'
    }
  },

  mounted () {
    this.isMounted = true;
    if (this.isEditing) {
      this.loadFiles()
    }

  },
  methods: {
    imgToCanvas: function (image) {
      //paint and resize image on canvas
      return new Promise((resolve, reject) => {


        let img = new Image();

        img.setAttribute('crossorigin', 'anonymous');

        img.onload = () => {

          let canvas = this.$refs[image.uniqueId + 'canvas'][0];
          let ctx = canvas.getContext("2d");
          if(img.width>1280||img.height>853){ //if image is smaller, than boundaries => don't resize it
            let aspectRatio = parseFloat((img.height / img.width).toFixed(4));

            if (aspectRatio > 1) {
              canvas.height = 853;
              canvas.width = canvas.height / aspectRatio
            } else {
              canvas.width = 1280;
              canvas.height = canvas.width * aspectRatio
            }

          }else{
            canvas.width = img.width;
            canvas.height = img.height
          }



          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          resolve(imageData)

        };
        img.src = window.URL.createObjectURL(image);
      })
    },
    loadImgToCanvas(url,image){
        //paint image on canvas from url
        return new Promise((resolve, reject) => {


          let img = new Image();

          img.setAttribute('crossorigin', 'anonymous');

          img.onload = () => {

            let canvas = this.$refs[image.uniqueId + 'canvas'][0];
            let ctx = canvas.getContext("2d");

              canvas.width = img.width;
              canvas.height = img.height




            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

            const file = new File([imageData], image.uniqueId+'.jpg', {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            file.uniqueId=image.uniqueId;
            file.isLoaded=true;
            file.rotation=0;
            file.__progress=1
            file.__status='uploaded'
            file.__uploaded=file.size
            resolve(file)

          };
          img.src = url
        })
    },


    onSortStart(event){
      let oldCanvas = event.node.querySelector('canvas');
      let newCanvas = document.querySelector('.drag-helper canvas');

      var context = newCanvas.getContext('2d');
      context.drawImage(oldCanvas, 0, 0)
    },
    factoryFn (files) {
      console.log('factory function');
      console.log(files);
      let file=files[0];
      return {
        formFields :[
          {name:'uniqueId', value : file.uniqueId},
          {name:'rotation', value : file.rotation},
          {name: 'obj_id', value: this.flat.id },
          {name: 'img_order', value: JSON.stringify(this.img_order) },
      ]
    }
    },
    replaceFile(file){
      let index =this.files.findIndex(item => item.uniqueId === file.uniqueId);

      if(index!==-1){
        this.files.splice(index, 1, file)
      }
      let indexQueued =this.queuedFiles.findIndex(item => item.uniqueId === file.uniqueId);
      if(indexQueued!==-1){
        this.queuedFiles.splice(indexQueued, 1, file)
      }
      let indexUploaded =this.uploadedFiles.findIndex(item => item.uniqueId === file.uniqueId);
      if(indexUploaded!==-1){
        this.uploadedFiles.splice(indexUploaded, 1, file)
      }


      },
    rotate(file,angle){

      let uniqueId = file.uniqueId;
      let obj_id = this.flat.id;
      let _backup=file.rotation
      file.rotation+=angle
      this.replaceFile(file)
      this.$store.dispatch('flats/rotateImage', { uniqueId, obj_id, angle }).then((response) => {
        console.log(response);
        // if(typeof file.rotation!=='undefined'&&file.rotation!==null){
        //   file.rotation+=angle
        // }else{
        //   file.rotation=angle
        // }
        // this.replaceFile(file)

      }).catch((e) => {
        file.rotation=_backup
        this.replaceFile(file)


        console.log(e.response);
        this.$q.notify('Не удалось повернуть')
      })
    },
    addFiles(addedFiles) {

      let filesReady = [];
      this.filesUploaded = false;
       //console.log(this.queuedFiles)
       addedFiles.forEach((e) => {

             // Read in the image file as a data URL.

              e.uniqueId = uid();
              e.isLoaded=false;
              e.rotation=0;
           let p = new Promise((resolve, reject) => {
             this.getRotation(e).then((rotation)=>{
               console.log(rotation);
               if(rotation!==0)
               {e.rotation=rotation;}

                 this.imgToCanvas(e).then((imageData)=>{



                       this.convertToBlobWebWorker(imageData).then((result)=>{
                         const file = new File([result.data], e.uniqueId+'.jpg', {
                           type: 'image/jpeg',
                           lastModified: Date.now()
                         });
                         file.uniqueId=e.uniqueId;
                         file.isLoaded=true;
                         file.rotation=e.rotation;
                         file.__status='idle';
                         e=file;
                         this.replaceFile(e);
                         resolve(true)
                       })

                 })
             })
           });
         filesReady.push(p)
       });

       Promise.all(filesReady).then(() => {

         this.photosTotal = this.img_order.length;

         // this.$emit('added', files)
         // this.autoUpload === true && this.upload()
       })



    },
    loadFiles () {
      this.filesUploaded = true;
      this.photosTotal = this.flat.sortimages.length;
      this.photosLoaded=this.flat.sortimages.length;
      let i=0
      let loadingFiles=[]


      for (i = 0; i < this.flat.sortimages.length; i++) {
        let element = this.flat.sortimages[i]

        let newFile = new File([], element.uniqueId+'.jpg', {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        newFile.uniqueId=element.uniqueId


        this.files.push(newFile)
        this.uploadedFiles.push(newFile)

        let url = process.env.URL + element.path;
          let p = this.loadImgToCanvas(url, element).then((file)=>{

            this.replaceFile(file)
            loadingFiles.push(p)
          })


      }

      Promise.all(loadingFiles).then(() => {
        this.photosAddedToUploader=true;
      })
    },
    removeFile (files) {

      files.forEach((e) => {
        if (e.__status === 'uploaded') {
          let uniqueId = e.uniqueId;
          let order = this.uploadedOrder;
          let obj_id = this.flat.id;
          this.$store.dispatch('flats/deleteImage', { uniqueId, order, obj_id }).then((response) => {
            console.log(response);
            this.photosLoaded--
            //this.$q.notify(response.data.message)
          }).catch((e) => {
            console.log(e.response)
          }).finally(()=>{
            this.photosTotal=Object.keys(this.img_order).length
          })

        }
      });

    },
    uploadStart (info) {
      this.uploadStarted = true
    },
    uploaded (info) {
      this.photosLoaded++
    },
    uploadFinish () {
      this.uploadStarted=false;
      this.filesUploaded = true;
      if (this.created) {
        const id = this.flat.id;
        this.$router.push({ name: 'object', params: { id: id } })
      }
    }
  },
  watch: {
    img_order(newValue){
      this.$store.commit('flats/UPDATE_ORDER', newValue)
    },

    // uploadedOrder(newValue, oldValue) {
    //   //console.log(JSON.stringify(newValue),JSON.stringify(oldValue))
    //   if(this.photosAddedToUploader&&JSON.stringify(newValue)!==JSON.stringify(oldValue)){
    //
    //     this.img_order=newValue
    //   //let id = this.flat.id;
    //     //console.log('changing order on server');
    //   // this.$store.dispatch('flats/orderChange', { order, id }).then((response) => {
    //   //   console.log(response)
    //   // }).catch((e) => {
    //   //   console.log(e.response);
    //   //   this.$q.notify(e.response.data.message)
    //   // })
    //   }
    // }
  },
}
</script>
<style>
    .tooltip-card{
        color:#000;
        background: rgba(255,255,255,1);
        box-shadow: 0 1px 8px rgba(0,0,0,0.2), 0 3px 4px rgba(0,0,0,0.14), 0 3px 3px -2px rgba(0,0,0,0.12);
        padding:12px 10px;
    }
</style>
<style scoped>
  .canvasImage{
    max-height: 100%;
  }
  .slickListContainer{
    display: grid;
    grid-gap: 5px;
    grid-template-columns: 1fr 1fr 1fr 1fr;
  }
    .tooltip-card p{
        font-size: 12px;
      line-height: 1.5em;
    }
    .drag-image{
      border: 1px solid #e6e6e6;
      cursor:move;
      position: relative;
    }
    .add-btn,.drag-image{
      height: 100px;
      margin: 10px;
      user-select: none;
      -moz-user-select: none;
      -khtml-user-select: none;
      -webkit-user-select: none;
      -o-user-select: none;
    }
    .drag-image:before{
      content: '';
      opacity: 0;
      width: 100%;
      height: 100%;
      background: rgba(2,123,227,0.5);
      position: absolute;
      z-index: 1000;
    }

    .drag-image:hover:before, .drag-helper:before{
      opacity: 1;
      pointer-events: none;
    }
    .drag-image:hover,  .drag-helper, .drag-helper:hover{
      border: 1px solid var(--q-color-primary);
    }
    .drag-image:hover .remove-btn, .drag-image:hover .rotate-btn{
      opacity: 1;
    }
    .drag-image .remove-btn, .drag-image .rotate-btn{
      opacity: 0;
      transition: all 0.3s;
      position: absolute;
      right: 2px;
      bottom: 2px;
      z-index: 1001;
    }
  .drag-image .rotate-right{
    left:calc(50% - 16px);
  }
  .drag-image .rotate-left{
   right: auto;
    left: 2px;
  }
    .q-img__content > div{
        padding: 0;
    }
  @media (max-width: 425px) {
    .slickListContainer{
      grid-template-columns: 1fr 1fr
    }
    .drag-image{
      width: 110px;
      height: 110px;
      margin: 5px;
    }

    .drag-image .remove-btn, .drag-image .rotate-btn{
      opacity: 1;
      background: var(--q-color-primary);
    }
    .drag-image .remove-btn, .drag-image .rotate-btn{
      right: -35px;
      left: auto;
    }
    .drag-image .remove-btn{
      bottom: 0;
    }
    .drag-image .rotate-left{
      bottom: calc(50% - 12px);
    }
    .drag-image .rotate-right{
      top: 0;
      bottom:auto;
    }
  }
</style>
