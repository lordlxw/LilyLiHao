<template>
  <div id="app">
    <router-view />
    <div class="test" v-if="testWaterText"></div>
  </div>
</template>
<script>
import Vue from 'vue'
export default {
  name: 'App',
  data: {
    testWaterText: false
  },
  unmounted() {
    sessionStorage.clear()
  },
  mounted() {
    this.testWaterText = Vue.prototype.$apiUrl === 'https://apitest.quants.top'
  }
}
</script>
<style lang="scss" scoped>
.test::after {
  position: absolute;
  top: 38%;
  left: 40%;
  font-size: 100px;
  color: red;
  z-index: 0;
  content: "测试";
  opacity: 0.5;
  rotate: -45deg;
}
</style>
