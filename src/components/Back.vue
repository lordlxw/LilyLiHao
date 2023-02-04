<template>
  <!-- <el-button type="default" icon="el-icon-arrow-left" @click="back"
    >返回</el-button
  > -->
  <el-button size="mini"  icon="el-icon-arrow-left" @click="back">返回</el-button>
  <!-- <i class="el-icon-arrow-left" @click="back" /> -->
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    back() {
      this.$router.go(-1)
    }
  }
}
</script>

<style>
</style>
