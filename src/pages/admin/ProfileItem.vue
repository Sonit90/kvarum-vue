<template>
  <q-item
    v-if="typeof profile!=='undefined'&&profile!==null"
    v-ripple
    clickable
    class="ProfileItem"
    :to="`/profile/${profile.user_id}`"
  >
    <q-item-section side>
      <Avatar
        v-if="profile!==null"
        :profile="profile"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label>{{ profile.name }}</q-item-label>
      <q-item-label>{{ profile.surname }}</q-item-label>
    </q-item-section>
  </q-item>
</template>
<script>
    import Avatar from '../../components/general/Avatar'

    export default {
        name: 'ProfileItem',
        components: {Avatar},
        props: {
            profile:{
              type:Object
            }

        }
    }
</script>
<style>
  .ProfileItem{
    max-width: 200px;
  }
</style>
