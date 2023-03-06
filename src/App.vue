<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  name: 'App',
  unmounted() {
    sessionStorage.clear()
  }
}
</script>
