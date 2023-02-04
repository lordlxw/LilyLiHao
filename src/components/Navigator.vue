<template>
  <div class="navigator">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <!-- <el-breadcrumb-item :to="{ path: '/main' }">仪表盘</el-breadcrumb-item> -->
      <el-breadcrumb-item
        v-for="(item, index) in navigator"
        :key="item + index"
        >{{ item }}</el-breadcrumb-item
      >
    </el-breadcrumb>

    <back class="back"></back>
    <refresh class="refresh"></refresh>
    <div class="clearboth"></div>
  </div>
</template>

<script>
import Back from '@/components/Back.vue'
import Refresh from '@/components/Refresh.vue'
import { mapGetters } from 'vuex'
export default {
  components: {
    Refresh,
    Back
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters({
      navigator: 'getNavigator'
    })
  },
  methods: {
  }
}
</script>

<style  lang="scss" scoped>
.navigator {
  background-color: #f8f8f8;
  padding: 0 15px;
  .el-breadcrumb {
    height: 50px;
    line-height: 50px;
    float: left;
  }
  .back,
  .refresh {
    float: right;
    text-align: center;
    cursor: pointer;
    font-size: 12px;
    color: #999999;
    margin: 12px 0 0 10px;
  }
  // .back:hover,
  // .refresh:hover {
  //   background: #f4f1f1;
  // }
  .clearboth {
    clear: both;
  }
}
</style>
