<template>
  <div class="height100">
    <el-row class="height100">
      <el-col :span="18" class="height100">
        <div class="height100">
          <sum-main :child="true" :searchParam="searchParam"></sum-main>
        </div>
      </el-col>
      <el-col :span="6" class="height100">
        <div class="height100 custom-scrollbar ">
          <com-user-summary :searchParam="searchParam" :showDo="false" :tableSelection="1"
            @handleSelectionChange="userSummaryChange"></com-user-summary>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SumMain from '../KKSimulation/Main.vue';
import ComUserSummary from '../components/ComUserSummary.vue'
import { commMixin } from '@/utils/commMixin'
export default {
  mixins: [commMixin],
  components: {
    SumMain,
    ComUserSummary
  },
  created() {
    if (this.userInfo.roleName && ['研究员'].indexOf(this.userInfo.roleName) !== -1) {
      this.initFrameH('enquiryH', 300)
    } else {
      this.initFrameH('enquiryH', 120)
    }
  },
  data() {
    return {
      enquiryH: '0',
      searchParam: {
        date: [new Date(), new Date()],
        userIds: []
      },
    }
  },
  methods: {
    userSummaryChange(rows) {
      // this.initChartB
      this.searchParam.userIds = rows.map(n => n.userId)
    },
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
}
</script>

<style></style>
