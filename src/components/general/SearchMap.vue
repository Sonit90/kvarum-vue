<template>
  <div class="row searchMapContainer">
    <q-inner-loading
      :showing="!mapWasInit"
      v-if="!mapWasInit"
    >
      <q-spinner-gears
        size="50px"
        color="primary"
      />
    </q-inner-loading>

    <yandex-map
      :coords="coords"
      :controls="['fullscreenControl','geolocationControl','zoomControl']"
      zoom="12"
      ymap-class="searchMap"
      :options="{autoFitToViewport:'always'}"
      @map-was-initialized="mapInit"
      :cluster-options="clusterOptions"
      :cluster-callbacks="clusterCallbacks"
    >
      <template v-if="mapWasInit">
        <ymap-marker
          v-for="flat in mapFlats"
          :key="flat.id"
          :coords="flat.coords"
          :marker-id="flat.id"
          :options="iconOptions(flat)"
          cluster-name="1"
          @click="selectFlat($event,flat)"
        />
      </template>
    </yandex-map>
    <q-dialog
      content-class="flatMapDialog"
      v-if="showMap"
      v-model="rightMenu"
      seamless
      position="right"
      square
    >
      <SearchMapItems
        v-if="typeof currentFlat!=='undefined'&&currentFlat!==null"
        :flats="currentFlat"
      />
    </q-dialog>
  </div>
</template>

<script>
    import {mapFields} from "vuex-map-fields";
    import SearchMapItems from "components/general/SearchMapItems";
    export default {
        name: "SearchMap",
       components: {SearchMapItems},
      props: {
        flats: {
          type: Array,
          required:true
        },
        showMap:{
          type:Boolean
        }
      },
      data() {
        return {
          coords: [48.46, 135.11],
          rightMenu: false,
          mapWasInit:false,
          currentFlat:[],
          clusterOptions: {
            1: {
              clusterDisableClickZoom: true,
              clusterOpenBalloonOnClick: false,
              gridSize: 80
            },
          },
        }
      },
      computed: {
        mapFlats() {
          let arr = []
          this.flats.forEach((e) => {
            let flat = JSON.parse(JSON.stringify(e))
            let coords=this.getCoords(e)
            if(coords!==null){
              flat.coords=coords
              arr.push(flat)
            }
          })
          return arr
        },
        clusterCallbacks(){
          return {'1':{click: (e)=> {
                this.clusterClick(e)
              }}
        }
        }
      },
      watch:{
        flats(){

        }
      },
      methods: {
        clusterClick(e){
          console.log('cluster click')
          // console.log(e)
          // var objectId = e.get('objectId')
          // console.log(objectId)
          let clusterer = e.get('target')
          //let objManager=e.originalEvent.currentTarget._objectManager

          // let obj=objManager.objects.getById(objectId);
          //
          // console.log(obj)
          //console.log(this.yMap.GeoObjectCollection)

          if (typeof clusterer.getGeoObjects !== 'undefined') {


            let geoObjects = clusterer.getGeoObjects()

            let ids = geoObjects.map(function (el) {
              return el.properties._data.markerId
            });
            this.currentFlat = this.flats.filter(function (el) {
              return ~ids.indexOf(el.id)
            })

            this.rightMenu = true
          }
          }
       ,
          iconOptions(flat){
            if(this.currentFlat!==null&&typeof this.currentFlat[0]!=='undefined'&&this.currentFlat.length===1) {
              return flat.id !== this.currentFlat[0].id ? {preset: 'islands#blueIcon'} : {preset: 'islands#blueDotIcon'}
            }
            return {preset: 'islands#blueIcon'}
          },
        mapInit (map) {
          this.mapWasInit = true
          //console.log(map.getGeoObjects())
        },
        getCoords(flat){
            if(flat.latitude!==null&&
              typeof flat.latitude!=='undefined'&&
              flat.longtitude!==null&&
              typeof flat.longtitude!=='undefined'){
             return [flat.latitude, flat.longtitude]
            }
            else{
              // ymaps.geocode(flat.address, { kind: 'street' }).then(res => {
              //   let firstGeoObject = res.geoObjects.get(0)
              //   //TODO Write coords to database
              //   resolve (firstGeoObject.geometry.getCoordinates())
              // })
              return null

            }
        },
        selectFlat(event,flat){
          console.log('flat click')
         this.currentFlat=[flat]
          this.rightMenu=true
        }
      }
    }
</script>

<style scoped>

</style>
<style>
  .flatMapDialog .q-dialog__inner{
    width: 320px;
    top: 170px;
    bottom:50px;
    padding: 0;
  }
  .searchMapContainer{
    flex:1;
    display: flex;
    width: 100%;
    position: relative;
  }
  .searchMap{
    height: 100%;
    width: 100%;
    min-height:100px;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
  }
  /*.ymap-container>div>ymaps, .ymaps-2-1-75-map{*/
  /*  height: 100%!important;*/
  /*}*/
  @media (max-width: 450px) {
    .flatMapDialog .q-dialog__inner {
      top: 134px;
    }
  }
</style>
