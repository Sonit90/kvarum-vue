<template>
  <q-card class="q-pa-sm q-mb-md  col-sm-12 col-xs-12 grid-style-transition flatLine">
    <div class="row">
      <div class="col-md-5 col-sm-12 col-xs-12">
        <router-link
          target="_blank"
          :to="link(flat)"
        >
          <div
            class="gallery-element"
          >
            <q-img
              v-for="(image, idx) in flat.sortimages"
              v-show="idx===position"
              :key="image.path"
              basic
              :src="image.path"
              spinner-color="primary"
            />
            <q-btn
              color="grey-1"
              text-color="blue-grey-10"
              round
              dense
              icon="arrow_back"
              class="control-btn"
              style="top: 50%;transform: translateY(-50%);"
              @click.prevent="decreasePosition"
              v-if="flat.sortimages.length>1"
            />
            <q-btn
              color="grey-1"
              text-color="blue-grey-10"
              round
              dense
              icon="arrow_forward"
              class="right-arrow control-btn"
              style="top: 50%;transform: translateY(-50%);"
              @click.prevent="increasePosition"
              v-if="flat.sortimages.length>1"
            />
            <q-badge
              v-if="flat.sortimages!==null"
              class="q-pa-sm imgCounter non-selectable"
            >
              {{ position+1 }} / {{ flat.sortimages.length }}
            </q-badge>
          </div>
        </router-link>
      </div>
      <div
        v-if="flat.sortimages!==null&&flat.sortimages.length>1"
        class="col-md-1 col-sm-12 col-xs-12 vertical-photos"
      >
        <template v-for="(image, index) in verticalPhotos">
          <q-img
            v-if="noPhotos!==0||index!==4"
            :key="image.path"
            :src="image.path"
            class="verticalPhoto cursor-pointer"
            :ratio="1"
            @click="position=index+1"
          />

          <router-link
            v-if="noPhotos===0&&index===4"
            :key="image.id"
            target="_blank"
            :to="link(flat)"
            class="additionalPhotos relative-position"
          >
            <span
              class="absolute-center text-bold text-white"
              style="z-index: 2000"
            >
              {{ '+'+(flat.sortimages.length-5) }}
            </span>
            <q-img

              :src="image.path"
              class="verticalPhoto cursor-pointer"
              :ratio="1"
              @click="position=index+1"
            />
          </router-link>
        </template>

        <div
          v-for="n in noPhotos"
          :key="n"
          class="noPhoto  bg-blue-grey-1"
        >
          <q-icon
            color="blue-grey-3"
            size="30px"
            name="camera_alt"
            class="absolute-center"
          />
        </div>
      </div>
      <div
        class="col-sm-12 col-xs-12 q-px-md q-pt-md relative-position column"
        :class="{'col-md-6':flat.sortimages.length>1, 'col-md-7':flat.sortimages.length===1}"
      >
        <router-link
          target="_blank"
          :to="link(flat)"
        >
          <div class="absolute-full" />
        </router-link>
        <div class="row items-center">
          <p class="text-h5 text-bold q-mb-none">
            {{ flat.price | toCurrency }}
          </p>
          <q-space />
          <q-badge
            outline
            text-color="primary"
            style="max-height: 20px"
          >
            {{ flat.created | timeAgoMonth }}
          </q-badge>
          <q-btn
            v-if="$can('edit',{modelName:'flat', ...flat} )"
            class="q-ml-sm"
            round
            size="sm"
            color="accent"
            icon="create"
            :to="{name:'object-edit',params:{id:flat.id}}"
          />
        </div>
        <span
          v-if="pricePerM!==null"
          class="text-body1 text-weight-light  pricePerM"
        >
          {{ pricePerM| toCurrency }}/м<sup>2</sup>
        </span>
        <div class="q-pt-sm">
          <FlatTitle :flat="flat" />
          <!--          <span class="text-subtitle1 text-bold q-mr-md">-->
          <!--            <template v-if="flat.rooms_total>0">-->
          <!--              {{ Math.abs(flat.rooms_total) }} - комн. {{ flat.category.toLowerCase() }}-->
          <!--            </template>-->
          <!--            <template v-else>-->
          <!--              Студия-->
          <!--            </template>-->
          <!--          </span>-->
          <!--          <span class="text-subtitle1 text-bold q-mr-md"> {{ flat.square }} м<sup>2</sup></span>-->
          <!--          <span class="text-subtitle1 text-bold q-mr-md"> {{ flat.floor }}/{{ flat.total_floors }} этаж</span>-->
        </div>
        <div
          v-if="parseInt(flat.haggle)===1||parseInt(flat.mortgage)===1||flat.agent_comission_type!==0"
          class="q-py-sm q-gutter-md"
        >
          <q-badge
            v-if="parseInt(flat.haggle)===1"
            outline
            text-color="accent"
          >
            Торг
          </q-badge>
          <q-badge
            v-if="parseInt(flat.mortgage)===1"
            outline
            text-color="secondary"
          >
            Возможна ипотека
          </q-badge>
          <q-badge
            v-if="flat.agent_comission_type!==0"
            outline
            text-color="primary"
          >
            Встречное вознаграждение
          </q-badge>
        </div>
        {{ flat.address }}
        <div
          class="q-py-sm q-mt-auto self-end full-width"
          style="margin: auto 0 0"
        >
          <div
            v-if="$q.screen.gt.md"
            class="row q-pb-sm"
          >
            <AgentItem
              v-if="flat.profile&&flat"
              :profile="flat.profile"
              :flat="flat"
            />
            <AgencyItem
              v-if="flat.profile&&flat.profile.type==='agencyAgent'"
              :agency="flat.agency"
            />
          </div>
          <div class="row">
            <call-button :flat="flat" />
          </div>
        </div>
      </div>
    </div>
  </q-card>
</template>

<script>
  import AgentItem from "components/agent/AgentItem";
  import AgencyItem from "components/agencies/AgencyItem";
  import CallButton from "components/objects/flat/callButton";
  import FlatTitle from "components/objects/flat/FlatTitle";
    export default {
        name: "FlatLine",
      components:{
        FlatTitle,
        CallButton,
        AgentItem,AgencyItem
      },
      data() {
        return {
          position:0,
          verticalCount:5
        }
      },
      methods: {
        link (flat) {
          return { name: 'object', params: { id: flat.id } }
        },
        increasePosition () {
          if ((this.position + 1) >= this.flat.sortimages.length) {
            this.position = 0
          } else {
            this.position++
          }
        },
        decreasePosition () {
          if (this.position < 1) {
            this.position = this.flat.sortimages.length - 1
          } else {
            this.position--
          }
        }
      },
      computed: {
        pricePerM () {
          if (this.flat.price !== null && this.flat.square !== null) {
            return Math.floor(this.flat.price / this.flat.square)
          } else {
            return null
          }
        },
        verticalPhotos() {
          if(this.flat.sortimages!==null){
            return this.flat.sortimages.slice(1, this.verticalCount+1);
          }
          return 0
        },
        noPhotos(){
          if(this.flat.sortimages!==null&&this.flat.sortimages.length<this.verticalCount+1){
           return (this.verticalCount+1) -this.flat.sortimages.length
          }
          return 0
        }
      },
      props: {
        flat: {
          type: Object,
          required:true
        },
      },
    }
</script>

<style scoped>
  .additionalPhotos{
    max-height: 62px;
    width: 100%;
    margin-bottom: 0;
  }
  .additionalPhotos img{
    margin: 0;
  }
  .additionalPhotos:after{
    border-radius: 5px;
    position: absolute;
    content: "";
    background: rgba(0,0,0,.7);
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
  .flatLine{
    height: 360px;
  }
  .gallery-element{
    position: relative;
    height: 340px;
  }
  .gallery-element .q-img{
    height: 100%;
  }
  .gallery-element:hover .control-btn{
    opacity: 1;
  }
  .control-btn{
    left: 10px;
    position: absolute;
    opacity: 0;
    transition: all 0.1s;
    -webkit-transition: all 0.1s;
  }
  .imgCounter{
    position: absolute;
    background: rgba(97, 97, 97, 0.4);
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);

  }
  .control-btn.right-arrow{
    left: unset;
    right: 10px;
  }
  .vertical-photos{
    padding: 0 3px;
    display: flex;
    flex-direction: column;
  }
  .vertical-photos>div, .vertical-photos a{
    flex-basis: 20%;
    margin:3px;
  }
  .vertical-photos div:first-child{
    margin-top: 0;
  }
  .vertical-photos div:last-child,.vertical-photos a:last-child{
    margin-bottom: 0;
  }
  .verticalPhoto{
    max-height: 62px;
    border-radius: 5px;
  }
  .noPhoto{
    position: relative;
    border-radius: 5px;
    padding: 0 3px;
    width: 100%;
  }
  .pricePerM{
    letter-spacing: 0.01em;
  }
  @media (max-width: 425px){
    .gallery-element .control-btn{
      opacity: 1;
    }
    .flatLine{
      height: auto;
    }
    .vertical-photos {
      flex-direction: row;
      padding: 5px 0;
    }
    .vertical-photos div:first-child, .vertical-photos a:first-child {
      margin-left: 0;
      margin-top: 3px;
    }
  }


</style>
