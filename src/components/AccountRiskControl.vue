<template>
  <div class="risk-control">
    <el-row>
      <el-col :span="4">
        <div class="grid-content">
          <span style="color: #0103ff">总允亏：{{ riskControlData["minProfitAlltime"] }}</span>
          万
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
          总盈亏：<span :style="calcToColor(riskControlData['profitAlltime'])">{{
            riskControlData["profitAlltime"]
          }}</span>
          万
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
          <span style="color: #0103ff">
            日允亏：{{ riskControlData["minProfitDaily"] }}
          </span>
          万
        </div>
      </el-col>

      <el-col :span="4">
        <div class="grid-content ">
          日实盈：<span :style="calcToColor(riskControlData['solidProfit'])">{{
            riskControlData["solidProfit"]
          }}</span>
          万
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content ">
          日浮盈：<span :style="calcToColor(riskControlData['floatProfit'])">{{
            riskControlData["floatProfit"]
          }}</span>
          万
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
          <span style="color: #0103ff">日允撤：{{ riskControlData["minBackDaily"] }}</span>
          万
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="4">
        <div class="grid-content">
          日回撤：<span :style="calcToColor(riskControlData['back'])">{{
            riskControlData["back"]
          }}</span>
          万
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
          <span style="color: #0103ff">加权限仓：{{ riskControlData["maxVolume"] }}</span>
          万
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
          加权买仓：<span style="color: #4b6c19">{{
            riskControlData["currentBid"]
          }}</span>
          万
        </div>
      </el-col>

      <el-col :span="4">
        <div class="grid-content ">
          加权卖仓：<span style="color: #974f1a">{{
            riskControlData["currentOffer"]
          }}</span>
          万
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content ">
          当前可买：<span style="color: #4b6c19">{{
            riskControlData["limitBid"]
          }}</span>
          万
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
          当前可卖：<span style="color: #974f1a">{{
            riskControlData["limitOffer"]
          }}</span>
          万
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex';
import api from "@/api/kk_trade";
export default {
  data() {
    return {
      riskControlData: {},
      timer: null,
      riskControlLabel: {
        'maxVolume': '加权限仓',
        'currentBid': '加权买仓',
        'currentOffer': '加权卖仓',
        'minProfitAlltime': '总允亏',
        'minProfitDaily': '日允亏',
        'minBackDaily': '日允撤',
        'profitAlltime': '当前总盈亏',
        'solidProfit': '当日实盈',
        'floatProfit': '当日浮盈',
        'back': '当日回撤',
        'limitBid': '当前最大可下买入',
        'limitOffer': '当前最大可下卖出',
      }
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'getUserInfo'
    }),
    ...mapState({
      enquiryInfo: (state) => state.enquiryInfo,
      riskInfo: (state) => state.riskInfo,
    })
  },
  watch: {
    riskInfo() {
      this.riskControlData = this.riskInfo
    }
  },
  methods: {
    initRiskControlData() {
      api.accountRiskControl({ userId: this.userInfo.userId }).then(res => {
        if (res && res.code === '00000' && res.value) {
          this.riskControlData = res.value
        }
      })
    },
    calcToColor(value) {
      if (value > 0) {
        return 'color:#00ff1f'
      } else if (value === 0) {
        return 'color:#333333'
      } else {
        return 'color:#ff0000'
      }
    }
  },
  mounted() {
    this.initRiskControlData()
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  line-height: 35px;
  height: 35px;

  .grid-content {
    padding: 0 10px;
    font-weight: bold;
    cursor: pointer;
  }

  &:last-child {
    margin-bottom: 0;
  }
}

.risk-control {
  background: #f8f8f8;
  box-sizing: border-box;

  ul {
    overflow: hidden;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    /*li {
      float: left;
      margin-right: 20px;
    }*/
  }
}

.el-col {
  border-radius: 4px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple {
  background: #d3dce6;
}

.bg-purple-light {
  background: #e5e9f2;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;

  span {
    color: #999999;
    font-size: 14px;
  }
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
