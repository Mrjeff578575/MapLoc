<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import mapNav from './components/nav'

export default {
  name: 'app',
  components: {
    'map-nav': mapNav
  }
}
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
html, body {
  height: 100%;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
  position: relative;
  overflow: hidden;
}
</style>
