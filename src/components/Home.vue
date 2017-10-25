<template>
  <div class="page_wp">
    <div class="pagebox page_1"></div>
    <div class="pagebox page_2"></div>
    <div class="pagebox page_3"></div>
    <div class="pagebox page_4"></div>
    <div class="pagebox page_5"></div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.page_wp {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
}
.pagebox{
    width: 100%;
    height: 100%;
}
.page_1 {
  background: #c1c1c1;
}
.page_2 {
  background: #d1e662;
}
</style>
