<template>
  <div class="ImageGalleryContainer">
    <div class="relative-position">
      <div
        ref="gallery"
        v-touch-pan.horizontal.mouse.prevent="panImage"
        class="gallery-element"
        :style="galleryStyle"
        :class="{animating: isAnimating}"
      >
        <span :style="imgStyle" />
        <q-img
          v-for="image in images"
          :key="image.path"
          basic
          :src="image.src"
          spinner-color="primary"
          class="curImg"
          contain
        />
      </div>
      <q-btn
        color="grey-1"
        text-color="blue-grey-10"
        :size="controlBtnSize"
        round
        dense
        icon="arrow_back"
        class="control-btn"
        style="top: 50%;transform: translateY(-50%);"
        @click="decreaseIndex"
      />
      <q-btn
        color="grey-1"
        text-color="blue-grey-10"
        :size="controlBtnSize"
        round
        dense
        icon="arrow_forward"
        class="right-arrow control-btn"
        style="top: 50%;transform: translateY(-50%);"
        @click="increaseIndex"
      />
      <q-btn
        v-if="!fullscreen"
        color="grey-1"
        text-color="blue-grey-10"
        :size="controlBtnSize"
        round
        dense
        icon="fullscreen"
        class="absolute-top-right control-btn"
        @click="enterFullScreen"
      />
      <q-badge
        class="q-pa-sm imgCounter"
      >
        {{ index+1 }} / {{ images.length }}
      </q-badge>
    </div>


    <ul
      ref="thumbs"
      class="thumbs"
    >
      <li
        v-for="(image, idx) in images"
        :key="image.thumbnail"
        class="thumb-element"
        :class="[idx===index? 'active-thumb' : '']"
        @click="scrollCont()"
        @mousemove="scrollThumbs(idx, 'thumbs', $event)"
      >
        <img
          :src="image.thumbnail"
          alt=""
          class="thumbnail"
          @mousemove="index=idx"
        >
      </li>
    </ul>

    <div
      v-show="fullscreen"

      class="fullscreen"
      @click.self="exitFullScreen"
      @wheel="zoomScroll"
    >
      <q-btn
        color="grey-1"
        text-color="blue-grey-10"
        :size="controlBtnSize"
        round
        dense
        icon="arrow_back"
        class="control-btn"
        style="top: 50%;transform: translateY(-50%);"
        @click="decreaseIndex"
      />
      <q-btn
        color="grey-1"
        text-color="blue-grey-10"
        :size="controlBtnSize"
        round
        dense
        icon="arrow_forward"
        class="right-arrow control-btn"
        style="top: 50%;transform: translateY(-50%);"
        @click="increaseIndex"
      />
      <q-btn
        color="grey-1"
        text-color="blue-grey-10"
        :size="controlBtnSize"
        round
        dense
        icon="zoom_in"
        class="control-btn zoom-in-btn"
        @click="zoomIn"
      />
      <q-btn
        color="grey-1"
        text-color="blue-grey-10"
        :size="controlBtnSize"
        round
        dense
        icon="zoom_out"
        class="control-btn zoom-out-btn"
        @click="zoomOut"
      />
      <q-btn
        color="grey-1"
        text-color="blue-grey-10"
        :size="controlBtnSize"
        round
        dense
        icon="close"
        class="absolute-top-right control-btn"
        @click="exitFullScreen"
      />
      <q-badge
        class="q-pa-sm imgCounter non-selectable z-max"
      >
        {{ index+1 }} / {{ images.length }}
      </q-badge>

      <ul
        ref="fullThumbs"
        class="thumbs thumbs-fullscreen"
        :style="fullscreenThumbStyle"
      >
        <li
          v-for="(image, idx) in images"
          :key="image.thumbnail"
          class="thumb-element"
          :class="[idx===index? 'active-thumb-fullscreen' : '']"
          @mouseenter="index=idx"
          @click="scrollFullscreen"
        >
          <img
            :src="image.thumbnail"
            alt=""
            class="thumbnail"
            @mouseenter="index=idx"
          >
        </li>
      </ul>
      <div
        v-touch-pan.horizontal.mouse.prevent="panImage"
        class="fullscreenGallery"
        :class="{animating: isAnimating}"
        :style="galleryStyle"
      >
        <!--      <div-->
        <!--        class="gallery-element gallery-fullscreen"-->
        <!--        @click.self="fullscreen=false"-->
        <!--      >-->
        <!--        <img-->
        <!--          v-for="image in images"-->
        <!--          :key="image.src"-->
        <!--          :src="image.src"-->
        <!--          alt=""-->
        <!--          class="curImg"-->
        <!--          :style="'transform: scale('+zoom+')'"-->
        <!--          @click="increaseIndex"-->
        <!--        >-->
        <q-img
          v-for="(image, idx) in images"
          :key="image.src"
          :src="image.src"
          alt=""
          basic
          contain
          class="curImg"
          :img-style="index===idx?{'transform':'scale3d('+zoom+','+zoom+','+zoom+')'}:{}"
          @click="increaseIndex"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { scroll } from 'quasar'
const { setHorizontalScrollPosition } = scroll
export default {
  data () {
    return {
      index: 0,
      fullscreen: false,
      left: 0,
      zoom:1,
      zoomStep:0.2,
      threshold: this.$q.screen.gt.md?200:100,
      moveImage:0,
      isAnimating:false
    }
  },
  name: 'ImageGallery',
  computed: {

    controlBtnSize(){
      return this.$q.screen.gt.md?'1.5em':'1.2em'
    },
    currentImg () {
      return this.images[this.index].src
    },
    fullscreenThumbStyle () {
      return { transform: 'translate3d(calc(-30px + ' + this.left + '%),0,0)' }
    },
    imgStyle () {
      return { backgroundImage: `url("${this.currentImg}")`,
        backgroundSize: 'cover',
        display: 'block',
        filter: 'blur(13px)',
        height: '100%',
        opacity: '.4',
        width: '100%',
        position:'absolute'
      }
    },
    galleryStyle(){
      return{
        width:`calc(${this.images.length}*100%)`,
        transform: `translate3d(calc(-${this.index/this.images.length}*100% + ${this.moveImage}px),0,0)`
      }
    },
    thumbStyle () {
      return {
        backgroundColor: '#027be3',
        borderRadius: '3px',
        opacity: 0.75,
        right: '2px',
        width: '3px'
      }
    }
  },
  destroyed () {
    window.removeEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.decreaseIndex()
      }
      if (e.key === 'ArrowRight') {
        this.increaseIndex()
      }
      if (e.key === 'Escape') {
        this.fullscreen = false
      }
    })
  },
  methods: {
    // swipeImage({ evt, ...info }){
    //   console.log(info)
    //   let x = info.distance.x
    //   console.log(x)
    //   if(x>=this.threshold){
    //     if(info.direction==='right'){
    //       this.increaseIndex()
    //     }else{
    //       this.decreaseIndex()
    //     }
    //
    //
    //   }
    //
    // },
    panImage({ evt, ...info }){
      let x = info.distance.x
      if(info.direction==='left'&&this.index!==this.images.length-1){
        this.moveImage=-x
      }
      if(info.direction==='right'&&this.index!==0){
        this.moveImage=x
      }


      if(info.isFinal){
        this.isAnimating=true
        this.moveImage=0
        if(x>=this.threshold){
          if(info.direction==='left'&&this.index!==this.images.length-1){
            this.increaseIndex()
          }
          if(info.direction==='right'&&this.index!==0){
            this.decreaseIndex()
          }

        }

      }




    },
    enterFullScreen(){
      this.fullscreen=true
      //this.$router.push({ hash: '#fullscreen' })
      //location.hash='#fullscreen'
    },
    exitFullScreen(){
      this.fullscreen=false
      //this.$router.push({ hash: '' })
      //location.hash=''
    },
    handlePanZoom({ evt, ...info }){
      console.log('handlePanZoom')
      console.log(info)
    },
    zoomScroll(event){
      console.log('zoomScroll')
      const deltaY = event.deltaY
      deltaY<0?this.zoomIn():this.zoomOut()
    },
    zoomIn(){
      if(this.zoom<=2.2){
        this.zoom=this.zoom+this.zoomStep
      }
    },
    zoomOut(){
      if(this.zoom>=0.7){
        this.zoom=this.zoom-this.zoomStep
      }
    },
    scrollCont (animate) {
      if(animate){
        this.isAnimating=true
        setTimeout(() => {this.isAnimating=false }, 200)
      }
      this.zoom=1
      let width = this.$refs.thumbs.offsetWidth
      let scrollAmount= (width / this.images.length) * this.index
      setHorizontalScrollPosition(this.$refs.thumbs, scrollAmount)
      this.scrollFullscreen()
    },
    increaseIndex () {
      let animate=false
      if ((this.index + 1) >= this.images.length) {
        this.index = 0
      } else {
        animate=true
        this.index++
      }
      this.scrollCont(animate)
    },
    decreaseIndex () {
      let animate=false
      if (this.index < 1) {
        this.index = this.images.length - 1
      } else {
        animate=true
        this.index--
      }
      this.scrollCont(animate)
    },
    scrollThumbs (idx, ref, event) {

      if (idx !== null) {
        this.index = idx
      }
      let width = this.$refs[ref].offsetWidth
      let distanceFromLeftBorder = event.clientX - this.$refs[ref].offsetWidth
      let leftNoScroll = -100
      let leftOffset = distanceFromLeftBorder - leftNoScroll
      let scrollAmount = width * (1 / parseFloat(width / leftOffset))
      setHorizontalScrollPosition(this.$refs[ref], scrollAmount)
    },

    scrollFullscreen () {
      let val = parseInt(this.index / this.images.length * -100)
      this.left = val
    }
  },
  mounted () {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        this.decreaseIndex()
      }
      if (e.key === 'ArrowRight') {
        this.increaseIndex()
      }
      if (e.key === 'Escape') {
        this.fullscreen = false
      }
    })
  },
  watch: {
    fullscreen(newValue) {
      document.body.style.overflow = newValue ? 'hidden' : ''
    },
  },
  props: {
    images: {
      required: true,
      type: [Array]
    }
  }
}
</script>

<style scoped>
  .fullscreenGallery{
    height: 100%;
    display: flex;
    padding: 0;
    overflow: hidden;
    align-items: center;
  }
  .animating{
    transition: all 0.2s;
  }
  .ImageGalleryContainer{
    width: 100%;
    overflow:hidden;
  }
    .fullscreen{
        z-index: 10000;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,.9);
    }
    .active-thumb:before{
        content: '';
        position: absolute;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        border: 2px solid #000;
        border-radius: 4px;
        z-index: 100;
    }
    .active-thumb-fullscreen:before{
        content: '';
        position: absolute;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        border: 2px solid #fff;
        border-radius: 4px;
        z-index: 100;
    }

    .thumbs{
        padding: 0 20px;
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        max-width: 100%;
      transition: transform 0.3s;
    }
    .thumbs-fullscreen{
        max-width: initial;
        margin: 0;
        overflow: visible;
        position: fixed;
        bottom:20px;
        left: 50%;
        padding: 0;
        transform: translate3d(0, 0, 0);
      z-index: 1000000;
    }
    .thumbs-fullscreen .thumb-element{
        margin-bottom: 0;
    }
    .thumb-element{
        position: relative;
        display: inline-block;
        width: 60px;
        height: 60px;
        cursor: pointer;
        vertical-align: top;
        overflow: hidden;
        margin-bottom: 10px;
        border: 3px solid transparent;
        -moz-user-select: none;
        -webkit-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    .thumbnail{
        /*position: absolute;*/
        /*top: -9999px;*/
        /*bottom: -9999px;*/
        /*left: -9999px;*/
        /*right: -9999px;*/
        /*margin: auto;*/
        /*max-height: 100%;*/
      height: 100%;
      width: auto;
      display: block;
      transform: translateX(-50%);
      margin-left: 50%;
    }
    .gallery-element:not(.gallery-fullscreen):hover .control-btn{
        opacity: 1;
    }
    .gallery-fullscreen{
      display: flex;
    }
    .fullscreen .control-btn:hover{
        opacity: 1;
    }
    .control-btn{
      left: 10px;
        position: absolute;
        opacity: 0.56;
        transition: all 0.2s;
        -webkit-transition: all 0.2s;
    }
    .control-btn.right-arrow{
      left: unset;
        right: 10px;
    }
    /*.control-btn.absolute-left{*/
    /*    left: 10px;*/
    /*}*/
    .control-btn.absolute-top-right{
      left: unset;
      right: 10px;
        top:10px;
    }

    .zoom-in-btn{
      left: unset;
      right: 70px;
      top:10px;
    }
    .zoom-out-btn{
      left: unset;
      right: 130px;
      top:10px;
    }
    .fullscreen .control-btn.right-arrow{
        right: 10px;
    }
    /*.fullscreen .control-btn.absolute-left{*/
    /*    left: 20px;*/
    /*}*/
    .fullscreen .control-btn.absolute-top-right{
        right: 10px;
        top: 10px;
    }

    .gallery-element{
        height: 592px;
      display: flex;
        position: relative;
        padding: 0;
        overflow: hidden;
    }
    /*.fullscreen .gallery-element{*/
    /*    height: 75vh;*/
    /*    top: 20px;*/
    /*}*/
.curImg{
  position: relative;
  max-height: 100%;
  max-width: 100%;
  overflow: visible!important;
  transform-origin: 0 0;
}
.fullscreen .control-btn{
  z-index: 500000;
}

  .imgCounter{
    background: rgba(97, 97, 97, 0.4);
    position: absolute;
    bottom: 20px;
    left: 20px;
  }


  .fullscreen .imgCounter{
    bottom: 90px;
    left: 50%;
    transform: translate3d(-50%,0,0);
  }



    @media (max-width: 425px) {
      .imgCounter{
        bottom:10px;
        left: 10px;
      }

        .gallery-element{
            height: 270px;
        }
      .thumbs{
        padding: 0 10px;
        margin: 7px 0px;
      }
      .thumb-element{
        margin-bottom: 0;
      }
      .thumbs-fullscreen{
        padding: 0;
        margin: 0;
      }

        /*.thumbs {*/
        /*    display: flex;*/
        /*    flex-wrap: wrap;*/
        /*    width: 100%;*/
        /*}*/

    }

</style>
