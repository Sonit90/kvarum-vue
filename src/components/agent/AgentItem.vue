<template>
  <q-item
    v-ripple
    class="q-py-sm"
    clickable
    :to="profileUrl"
  >
    <q-item-section avatar>
      <Avatar
        v-if="profile!==null"
        :profile="profile"
      />
    </q-item-section>
    <q-item-section>
      <q-item-label
        lines="1"
        :class="{'text-h6':$q.screen.gt.md, 'text-body-1':$q.screen.lt.md}"
      >
        {{ useProfile?profile.name:flat.name }}
        <span v-if="showSurname">
          {{ profile.surname }}
        </span>
      </q-item-label>
      <q-item-label
        caption
      >
        {{ profileType }}
        <template v-if="profile.location!==''&&profile.location!==null&&showCity">
          <q-icon
            name="location_on"
            color="grey"
          /> {{ profile.location }}
        </template>
      </q-item-label>
      <q-item-label
        v-if="profile.user"
        caption
      >
        На сайте уже {{ profile.user.created_at |timeAgoRaw }}
      </q-item-label>
    </q-item-section>
  </q-item>
</template>
<script>
    import Avatar from "components/general/Avatar";
    export default {
        name: 'AgentItem',
      components: {Avatar},
      computed: {
        profileType(){
          switch (this.profile.type) {
            case 'agencyAgent':
              return 'Агент'
            case 'privateAgent':
              return 'Частный агент'
            case 'owner':
              return 'Частное лицо'
          }
          return 'Агент'
        },
        fio () {
          return this.profile.name + ' ' + this.profile.surname
        },
        useProfile(){
          if(typeof this.flat==='undefined'){
        return true
        }
          if(this.flat.useProfile === 1 ||this.flat.useProfile===null){
            return true
          }else{
            return false
          }
        },
        profileUrl () {
          return '/profile/' + this.profile.user_id
        }
        },
        props: {
            profile: {required:true},
          flat:{
              required:false,
            type:Object
          },
          showSurname:{
              type:Boolean,
            default:false
          },
          showCity:{
              type:Boolean,
            default:false
          }
        }
    }
</script>
