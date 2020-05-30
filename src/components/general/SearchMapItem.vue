<template>
  <div>
    <router-link
      class="full-width"
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
        />
        <q-badge
          v-if="flat.sortimages!==null"
          class="q-pa-sm imgCounter non-selectable"
        >
          {{ position+1 }} / {{ flat.sortimages.length }}
        </q-badge>
      </div>
    </router-link>
    <div
      class="q-px-sm q-pt-sm full-width relative-position"
    >
      <router-link
        target="_blank"
        :to="link(flat)"
      >
        <div class="absolute-full" />
      </router-link>
      <div class="row items-center">
        <p class="text-body1 text-bold q-mb-none">
          {{ flat.price | toCurrency }}
        </p>
        <q-space />
        <q-badge
          outline
          text-color="primary"
          style="max-height: 20px"
        >
          {{ flat.created | timeAgo }}
        </q-badge>
      </div>
      <div class="q-pt-xs">
        <FlatTitle
          :flat="flat"
          size="12px"
        />
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
      <div
        class="q-py-sm q-mt-auto self-end full-width"
        style="margin: auto 0 0"
      >
        <div
          v-if="$q.screen.gt.md"
          class="row q-pb-sm"
        >
          <span class="text-body2">
            {{ flat.address }}
          </span>
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
</template>

  <script>
    import AgentItem from "components/agent/AgentItem";
    import AgencyItem from "components/agencies/AgencyItem";
    import CallButton from "components/objects/flat/callButton";
    import FlatTitle from "components/objects/flat/FlatTitle";
    export default {
      name: "SearchMapItem",
      components:{
        FlatTitle,
        CallButton,
        AgentItem,AgencyItem
      },
      data() {
        return {
          position:0
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
      props: {
        flat: {
          type: Object,
          required:true
        },
      },
      watch:{
        flat(){
          this.position=0
        }
      }
    }
  </script>

  <style scoped>
    .gallery-element{
      position: relative;
      height: 178px;
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

    .pricePerM{
      letter-spacing: 0.01em;
    }
    @media (max-width: 425px){
      .gallery-element .control-btn{
        opacity: 1;
      }
    }


  </style>
