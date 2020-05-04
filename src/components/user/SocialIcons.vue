<template>
  <div
    class="social-block q-py-md"
    v-if="items.length>0"
  >
    <template
      v-for="(item, index) in items"
    >
      <q-btn
        :key="index"
        round
        type="a"
        :href="item.url"
        class="q-mx-sm"
        :class="item.name"
        :icon="item.icon"
        :size="size+'px'"
      />
    </template>
  </div>
</template>

<script>
export default {
  name: 'SocialIcons',
  computed: {

    items() {
      let socials = new Map([
        ['whatsapp', 'fab fa-whatsapp'], ['vk', 'fab fa-vk'], ['instagram', 'fab fa-instagram'], ['facebook', 'fab fa-facebook-f'], ['twitter', 'fab fa-twitter'], ['youtube', 'fab fa-youtube']
      ])
      let items = []
      for (let [key, value] of socials) {
        if (typeof this.profile[key] !== 'undefined' && this.profile[key] !== null&& this.profile[key]!=='') {
          if(key!=='whatsapp'){
            items.push({
              name:key,
              url: this.profile[key],
              icon: value
            })
          }else{
            items.push({
              name:key,
              url: 'https://wa.me/'+this.profile[key].replace(/\D/g,''),
              icon: value
            })
          }

        }
      }
      return items

    }
  },
  props:
    { profile:
              {
              required: true,
              type: Object
              },
      size:{
      required:false,
        type:[String,Number],
        default:12
      }
    }
}
</script>

<style scoped>
    .social-block a{
        margin-right: 5px;
    }
    .social-block>.fa:first-child {
        margin-left: 0;
    }

    .social-block a.facebook {
        background: #3B5998;
        color: white;
    }

    .social-block a.twitter {
        background: #55ACEE;
        color: white;
    }

    .social-block a.vk {
        background: #4a76a8;
        color: white;
    }
    .social-block a.whatsapp {
        background: #0cb757;
        color: white;
    }

    .social-block a.youtube {
        background: #b00202;
        color: white;
    }

    .social-block a.instagram {
        background: #d93175;
        color: white;
    }
</style>
