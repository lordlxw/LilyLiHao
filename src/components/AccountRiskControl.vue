<template>
  <div class="risk-control">
    <el-row :gutter="20">
      <!-- <el-col :span="6" v-for="item in Object.keys(riskControlLabel)" :key="item">
        <div class="grid-content"><span>{{ riskControlLabel[item] }}：</span>{{ riskControlData[item] }} <span>万</span>
        </div>
      </el-col> -->
      <el-col :span="4">
        <div class="grid-content">
          <span style="color: #0103ff"
            >总允亏：{{ riskControlData["minProfitAlltime"] }}</span
          >
          万
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
          总盈亏：
          <span
            style="color: #00ff1f"
            v-if="riskControlData['profitAlltime'] > 0"
            >{{ riskControlData["profitAlltime"] }}</span
          >
          <span v-if="riskControlData['profitAlltime'] === 0">{{
            riskControlData["profitAlltime"]
          }}</span>
          <span
            style="color: #ff0000"
            v-if="riskControlData['profitAlltime'] < 0"
            >{{ riskControlData["profitAlltime"] }}</span
          >
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
        <div class="grid-content">
          日实盈：{{ riskControlData["solidProfit"] }} 万
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
          日浮盈：<span style="color: #ff0000">{{
            riskControlData["floatProfit"]
          }}</span>
          万
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
          日允撤：<span style="color: #0103ff">{{
            riskControlData["minBackDaily"]
          }}</span>
          万
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
          日回撤：<span style="color: #ff0000">{{
            riskControlData["back"]
          }}</span>
          万
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
          加权限仓：<span style="color: #0103ff">{{
            riskControlData["maxVolume"]
          }}</span>
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
        <div class="grid-content">
          加权卖仓：<span style="color: #974f1a">{{
            riskControlData["currentOffer"]
          }}</span>
          万
        </div>
      </el-col>
      <el-col :span="4">
        <div class="grid-content">
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
      enquiryInfo: (state) => state.enquiryInfo
    })
  },
  watch: {
    enquiryInfo() {
      this.initRiskControlData()
    }
  },
  methods: {
    initRiskControlData() {
      api.accountRiskControl({ userId: this.userInfo.userId }).then(res => {
        if (res && res.code === '00000' && res.value) {
          this.riskControlData = res.value
        }
      })
    }
  },
  mounted() {
    this.initRiskControlData()
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.risk-control {
  background: #f8f8f8;
  padding: 10px 15px 0 15px;
  box-sizing: border-box;
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
  }
}

.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
