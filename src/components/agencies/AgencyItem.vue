<template>
  <div>
    <q-item
      v-if="agency"
      v-ripple
      style="height: 100%"
      :to="`/agency/${agency.id}`"
    >
      <q-item-section avatar>
        <img
          v-if="agency.img!==null"
          :src="agency.img"
          style="max-height: 30px; max-width: 30px"
        >
      </q-item-section>
      <q-item-section>
        <q-item-label>{{ agency.title }}</q-item-label>
        <q-item-label
          caption
          lines="1"
        >
          Агентство недвижимости
        </q-item-label>
      </q-item-section>
    </q-item>
    <q-item
      v-else
    >
      <q-item-section>
        <q-item-label>Нет агентства</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>
<script>
    export default {
        name: 'AgencyItem',
        props: {
            agency: {type:Object}
        }
    }
</script>
