<template>
  <div class="height100">
    <el-row class="height100">
      <el-col class="height100 bg-black order-body-left">
        <div class="height100 " >
          <com-work-order :height="orderH" :child="true" :searchParam="searchParam"
            :userSummary="userSummary"></com-work-order>
        </div>
      </el-col>
      <el-col class="height100 bg-black order-body-right">
        <div class="height100 custom-scrollbar ">
          <Order-Notify :searchParam="searchParam" :showDo="false" :tableSelection="1" @init="intiUsers"
            :height="orderH" @handleSelectionChange="userSummaryChange"></Order-Notify>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import ComWorkOrder from '../components/ComWorkOrder.vue';
import OrderNotify from '@/components/OrderNotify.vue'
import { commMixin } from '@/utils/commMixin'
export default {
  mixins: [commMixin],
  components: {
    ComWorkOrder,
    OrderNotify
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
  watch: {
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
    }),
    ...mapState({
      chatMessage: (state) => state.chatMessage,
    }),
  },
  mounted() {
    const end = new Date();
    const start = new Date();
    start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
    this.searchParam.date = [start, end]
  }
}
</script>

<style>
.order-body-left {
  width: calc(100% - 380px);
}

.order-body-right {
  width: 380px;
}

.custom-notify-class {
  margin-right: 380px; /* 根据需要调整这个值，使其向下偏移 */
}
</style>
