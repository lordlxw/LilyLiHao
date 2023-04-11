<template>
  <div id="app">
    <router-view style="z-index: 2" />
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
  position: fixed;
  top: 30%;
  left: 30%;
  font-size: 300px;
  color: rgb(163, 28, 205);
  z-index: 0;
  content: "测试";
  opacity: 0.3;
  rotate: -45deg;
  z-index: 1;
}
</style>
