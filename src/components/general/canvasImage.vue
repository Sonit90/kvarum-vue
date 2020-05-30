<template>
  <div class="flex full-height items-center justify-center">
    <canvas
      v-show="isLoaded"
      :ref="image.uniqueId+'canvas'"
      class="canvasImage"
    />
    <q-spinner
      v-show="!isLoaded"
      color="primary"
      size="3em"
    />
  </div>
</template>

<script>
  //import Pica from 'pica';
    export default {
        name: "CanvasImage",
      data() {
        return {
          isLoaded: false,
          timeTaken:null
        }
      },
      props: {
        image: {
          required: true,
          type: File
        },
        maxWidth:{
          required:true,
          type:Number
        },
        maxHeight:{
          required:true,
          type:Number
        }
      },
      methods: {
        oldCanvas() {
          console.log(this.image)
           let t0 = performance.now();
          let canvas = this.$refs[this.image.uniqueId+'canvas']
          let ctx = canvas.getContext("2d");
          let img = new Image();


          img.setAttribute('crossorigin', 'anonymous');

          img.onload = () =>{
            let aspectRatio=parseFloat((img.height / img.width).toFixed(4))
            canvas.width=1280
            canvas.height = canvas.width * aspectRatio
            ctx.drawImage(img, 0, 0, canvas.width , canvas.height);
            this.isLoaded=true
             this.timeTaken=(performance.now() - t0).toFixed(2)
          }
          img.src = this.image.__img.src
        },
        picaCanvas(){
          //const pica = Pica();
          const pica = require('pica')({ features: [ 'js', 'wasm', 'ww', 'cib'  ] });
          let t0 = performance.now();
          let canvas = this.$refs[this.image.uniqueId+'canvas']
          //const resizedCanvas = document.createElement("canvas");
          //let aspectRatio=parseFloat((img.height / img.width).toFixed(4))
          canvas.width=177
          //canvas.height = canvas.width * aspectRatio

          // canvas.height = 100;
          // canvas.width = 100;


          pica.resize(this.$refs.imgSrc, canvas, {
            quality:0,
            unsharpAmount: 0,
            unsharpRadius: 0.6,
            unsharpThreshold: 2
          })
            .then(result => {
              let t1=performance.now();
              this.timeTaken=(t1 - t0)
              this.isLoaded=true
               //this.$refs.imgResult.src = result.toDataURL();

            });
        }
      },
      mounted(){
        this.oldCanvas()
       // this.picaCanvas()

      }
    }
</script>

<style scoped>
  .canvasImage{
    width: 100%;
  }
.img-dragged{
  height: auto;
  display: block;
  position: absolute;
  max-width: 100%;
  top: 0;
  bottom: 0;
}
</style>
