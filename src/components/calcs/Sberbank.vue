<template>
  <div id="calculator" />
</template>

<script>
    export default {
        name: "Sberbank",
      mounted() {
        this.addScript('https://cdn.domclick.ru/widget/mortgage/inject.js')
        setTimeout(() => this.addScript('/statics/js/sberbank.js'), 1000);
      },
      methods: {
        addScript(src) {
          let script=document.createElement('script')
          script.setAttribute('src', src)
          document.head.appendChild(script)
        }
      },
    }
</script>

<style scoped>

</style>
<style>
  #domclick__result{
    transition: margin 150ms;
  }
</style>
