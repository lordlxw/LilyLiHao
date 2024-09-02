<template>
  <div>
    <div class="steps custom-scrollbar" v-swipe-copy>
      <el-steps :active="tradeSteps.length" align-center>
        <el-step v-for="item in tradeSteps" :key="item.id" :title="item.operation"
          :description="item.createTime | dateFormat('YYYY-MM-DD HH:mm:ss')"></el-step>
        <!-- <el-step title="步骤2" description="这是一段很长很长很长的描述性文字"></el-step>
        <el-step title="步骤3" description="这是一段很长很长很长的描述性文字"></el-step>
        <el-step title="步骤4" description="这是一段很长很长很长的描述性文字"></el-step> -->
      </el-steps>
    </div>
    <div class="mt30">
      <el-descriptions title="订单信息" direction="vertical" size="medium" :column="5" border>
        <template slot="extra" v-if="setAuth('system:order:edit')">
          <el-button type="primary" size="small" @click="handleInquiryDealConfirmClick">同意成交</el-button>
        </template>
        <el-descriptions-item label="研究员">{{ currentRow.createuser }}</el-descriptions-item>
        <el-descriptions-item label="询价单">{{ currentRow.sourceNum }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="3">{{ currentRow.createTime }}</el-descriptions-item>

        <el-descriptions-item label="状态">{{ funcFormat(currentRow.status.toString(),
          "inquiryStatus") }}</el-descriptions-item>
        <el-descriptions-item label="方向">
          <el-tag size="small">{{ currentRow.direction == 'bond_0' ? '买入' : '卖出' }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="中介" :span="3">{{ currentRow.target }}</el-descriptions-item>

        <el-descriptions-item label="询价">{{ currentRow.price }}</el-descriptions-item>
        <el-descriptions-item label="询量">{{ currentRow.volume }}</el-descriptions-item>
        <el-descriptions-item label="交割速度" :span="3">{{ currentRow.deliverySpeed }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script>
import api from '@/api/kk_trade'
import config from "@/utils/config";
import moment from "moment";
import { pageMixin } from "@/utils/pageMixin";
import { debounce } from '@/utils/debounce'
export default {
  props: {
    currentRow: {}
  },
  mixins: [pageMixin],
  components: {},
  data() {
    return {
      tradeSteps: []
    }
  },
  watch: {
    currentRow() {
      console.log(this.currentRow)
      this.initRowSteps()
    }
  },
  methods: {
    initRowSteps() {
      const { tradeNum } = this.currentRow;
      if (tradeNum) {
        api.getOperationTrack({
          fromNum: tradeNum
        }).then(({ code, value }) => {
          if (code === '00000' && value) {
            value.sort(function (a, b) {
              return moment(a.createTime).diff(moment(b.createTime))
            })
            this.tradeSteps = value
          }
        })
      }
    },
    funcFormat(val, key) {
      return config.funcKeyValue(val.toString(), key);
    },
    handleInquiryDealConfirmClick: debounce(function () {
      const { userTradeId } = this.currentRow;
      api.inquiryDealConfirm({ userTradeId: userTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "已成交",
            type: 'success'
          })
          // self.loadInitData()
        } else {
          this.$message({
            message: response.message,
            type: 'info'
          })
        }
      })
    }),
  },
  created() {
    this.initRowSteps()
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/style.scss";

.steps {
  padding-bottom: 10px;

  >>>.el-step__head.is-finish {
    color: #000000;
    border-color: #000000;
  }

  >>>.el-step__title.is-finish,
  >>>.el-step__description.is-finish {
    color: #000000;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: normal;
    font-size: 12px;
  }
}
</style>
