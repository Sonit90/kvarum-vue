<template>
  <div>
    <q-card
      class="q-pa-md"
      :class="{'AgentCard':$q.screen.gt.sm}"
    >
      <q-card-section
        v-if="title"
      >
        <h2 class="text-h5 text-weight-bold">
          {{ title }}
        </h2>
      </q-card-section>
      <q-card-section
        v-if="agency&&profile.type==='agencyAgent'"
      >
        <AgencyItem
          :agency="agency"
        />
      </q-card-section>
      <q-separator
        v-if="$q.screen.lt.sm"
        inset
      />
      <q-card-section>
        <AgentItem
          class="q-mb-md"
          :profile="profile"
          :flat="flat"
        />
        <call-button
          :flat="flat"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
  import AgencyItem from "components/agencies/AgencyItem";
  import AgentItem from "components/agent/AgentItem";
  import CallButton from "components/objects/flat/callButton";

  export default {
  components: {CallButton, AgentItem, AgencyItem},
  data(){
    return{
      showNumber:false
    }
  },
  name: 'AgentProfile',
  props: {
    title:{
      default:false,
      required:false
    },
    flat: {
      required: false,
      type: Object
    },
    profile: {
      required: true,
      type: Object
    },
    agency: {
      required: false,
      type: Object
    }
  }
}
</script>

<style scoped>
    .AgentCard{
    position: -webkit-sticky; /* for Safari */
    position: sticky;
    top: 20px;
    align-self: flex-start;
  }
</style>
