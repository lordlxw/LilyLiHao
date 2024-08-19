<template>
  <div class="height100">
    <el-row class="height100">
      <el-col :span="18" class="height100 bg-black">
        <div class="height100 ">
          <com-work-order :height="orderH" :child="true" :searchParam="searchParam"
            :userSummary="userSummary"></com-work-order>
        </div>
      </el-col>
      <el-col :span="6" class="height100 bg-black">
        <div class="height100 custom-scrollbar ">
          <com-user-summary :searchParam="searchParam" :showDo="false" :tableSelection="1" @init="intiUsers"
            :height="orderH" @handleSelectionChange="userSummaryChange"></com-user-summary>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import ComWorkOrder from '../components/ComWorkOrder.vue';
import ComUserSummary from '../components/ComUserSummary.vue'
import { commMixin } from '@/utils/commMixin'
export default {
  mixins: [commMixin],
  components: {
    ComWorkOrder,
    ComUserSummary
  },
  created() {
    // if (this.userInfo.roleName && ['研究员'].indexOf(this.userInfo.roleName) !== -1) {
    //   this.initFrameH('enquiryH', 300)
    // } else {
    //   this.initFrameH('enquiryH', 120)
    // }
    this.initFrameH('orderH', 65)
    this.$winResize(() => {
      this.initFrameH('orderH', 65)
    })
  },
  data() {
    return {
      orderH: '0',
      searchParam: {
        date: ["", ""],
        userIds: []
      },
      userSummary: []
    }
  },
  methods: {
    userSummaryChange(rows) {
      // this.initChartB
      this.searchParam.userIds = rows.map(n => n.userId)
    },
    intiUsers(val) {
      this.userSummary = val;
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  mounted() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    this.searchParam.date = [start, end]
  }
}
</script>

<style></style>
