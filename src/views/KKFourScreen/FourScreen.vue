<template>
  <div :style="{ height: parseInt(Math.floor(innerHeight)) + 'px', overflow: 'hidden' }">
    <el-row :gutter="0">
      <el-col :span="12" :style="{ height: fourScreenHeight + 'px', padding: '0 5px 5px 0', boxSizing: 'border-box' }">
        <div class="grid-content bg-purple">
          <com-enquiry :height="fourScreenHeight - 70"></com-enquiry>
        </div>
      </el-col>
      <el-col :span="12" :style="{ height: fourScreenHeight + 'px', padding: '0 0 5px 5px', boxSizing: 'border-box' }">
        <div class="grid-content bg-purple">
          <com-bonds :height="fourScreenHeight - 70"></com-bonds>
        </div>
      </el-col>
      <el-col :span="12" :style="{ height: fourScreenHeight + 'px', padding: '5px 5px 0 0', boxSizing: 'border-box' }">
        <div class="grid-content bg-purple">
          <com-no-bonds :height="fourScreenHeight - 70"></com-no-bonds>
        </div>
      </el-col>
      <el-col :span="12" :style="{ height: fourScreenHeight + 'px', padding: '5px 0 0 5px', boxSizing: 'border-box' }">
        <div class="grid-content bg-purple">
          <com-reward :height="fourScreenHeight / 2 - 35"></com-reward>
          <com-break :height="fourScreenHeight / 2 - 45" class="mt10"></com-break>
        </div>
      </el-col>
    </el-row>
    <main-socket></main-socket>
  </div>
</template>

<script>
import ComEnquiry from '../components/ComEnquiry.vue';
import ComNoBonds from '../components/ComNoBonds.vue';
import ComBonds from '../components/ComBonds.vue';
import ComReward from '../components/ComReward.vue';
import ComBreak from '../components/ComBreak.vue';
import { commMixin } from '@/utils/commMixin'
import MainSocket from '@/components/Socket.vue'
export default {
  mixins: [commMixin],
  components: {
    ComEnquiry,
    ComNoBonds,
    ComBonds,
    ComReward,
    ComBreak,
    MainSocket
  },
  data() {
    return {
      innerHeight: ''
    }
  },
  computed: {
    fourScreenHeight() {
      return parseInt(Math.floor(this.innerHeight / 2))
    },
  },
  mounted() {
    this.innerHeight = window.innerHeight;
    window.onresize = () => {
      this.innerHeight = window.innerHeight;
    }
    setTimeout(() => {
      this.innerHeight = window.innerHeight;
    }, 1000);
  }
}
</script>

<style lang="scss" scoped>
.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  height: 100%;
  background: #d3dce6;
  display: block;
  box-sizing: border-box;
  padding: 10px;
}

.bg-purple-light {
  background: #e5e9f2;
}

.row-bg {
  background-color: #f9fafc;
}
</style>
