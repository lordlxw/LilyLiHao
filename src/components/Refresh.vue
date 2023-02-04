<template>
  <!-- <i class="el-icon-refresh" @click="reload"></i> -->
  <el-button size="mini" icon="el-icon-refresh" @click="reload">刷新</el-button>
</template>

<script>
export default {
  inject: ['reload']
}
</script>

<style>
</style>
