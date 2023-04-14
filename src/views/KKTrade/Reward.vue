<!-- 交割回报 -->
<template>
  <div class="content mt20">
    <!-- <div class="filter-condition"></div> -->
    <div class="list">
      <div class="do mb10">
        <el-tag type="success" class="mr20"
          >交割总量：<b>{{ rewardTotalVolume }}</b></el-tag
        >
        <el-tag
          :type="
            rewardFloatProfit.toString().indexOf('-') !== -1
              ? 'danger'
              : 'success'
          "
          class="mr20"
          v-if="setAuth('reward:datatotal')"
          >交割盈亏：<b>{{ rewardFloatProfit }}</b></el-tag
        >
      </div>
      <el-table
        v-loading="loading"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        :height="rewardH"
        border
        header-row-style="height:30px;line-height:30px;"
        header-cell-style="background:#f8f8f8;"
        :key="Math.random()"
      >
        <template v-for="itemHead in tableHead">
          <el-table-column
            v-if="itemHead.show"
            :key="itemHead.label"
            :align="itemHead.align"
            :prop="itemHead.prop"
            :formatter="
              itemHead.formatter
                ? itemHead.formatter
                : (row, column, cellValue, index) => {
                    return cellValue;
                  }
            "
            :label="itemHead.label"
            :width="itemHead.width ? itemHead.width : ''"
          >
          </el-table-column>
        </template>
        <el-table-column></el-table-column>
        <el-table-column fixed="right" align="center" label="操作" width="80">
          <template slot-scope="scope">
            <el-popover
              v-if="setAuth('reward:back') && funcIsBreak(scope)"
              placement="bottom-end"
              :ref="`popover-deliveryback-${scope.$index}`"
            >
              <p>
                确认要<span class="color-red"> 改违约 </span> "{{
                  scope.row.tscode
                }}"？
              </p>
              <div style="text-align: right">
                <el-button
                  type="text"
                  @click="
                    handlePopoverClose(
                      scope,
                      `popover-deliveryback-${scope.$index}`
                    )
                  "
                  >取消</el-button
                >
                <el-button type="text" @click="handleDeliveryBackClick(scope)"
                  >确认</el-button
                >
              </div>
              <el-button type="text" slot="reference" class="ml10"
                >改违约</el-button
              >
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import api from "@/api/kk_reward"
import { pageMixin } from '@/utils/pageMixin'
import { commMixin } from '@/utils/commMixin'
import config from '@/utils/config'
import * as util from '@/utils/util'
import moment from 'moment'
export default {
  mixins: [pageMixin, commMixin],
  data() {
    return {
      config,
      loading: false,
      // 表头
      tableHead: [
        { label: '券码', prop: 'tscode', formatter: this.funcFormat, width: '120', align: 'left', show: true },
        { label: '方向', prop: 'direction', formatter: this.funcFormat, width: '60', align: 'left', show: true },
        { label: '交割价', prop: 'price', formatter: this.funcFormat, width: '120', align: 'right', show: true },
        { label: '交割量', prop: 'volume', width: '100', align: 'right', show: true },
        { label: '交割盈亏', prop: 'profit', width: '100', align: 'right', show: true },
        { label: '对手方', prop: 'counterParty', width: '100', align: 'left', show: true },
        { label: '联系人', prop: 'contactPerson', width: '100', align: 'left', show: true },
        { label: '联系方式', prop: 'contactType', width: '110', align: 'left', show: true },
        { label: '创建人id', prop: 'createBy', width: 'auto', align: 'left', show: false },
        { label: '交割时间', prop: 'createTime', width: '150', align: 'left', show: true },
        { label: '交割速度', prop: 'deliverySpeed', width: '90', align: 'left', show: false },
        { label: '交割日期', prop: 'deliveryTime', formatter: this.funcFormat, width: '100', align: 'left', show: true },
        { label: '单据号', prop: 'tradeNum', width: '150', align: 'left', show: false },
        { label: '交易员', prop: 'tradeuser', width: '120', align: 'left', show: true },
        { label: '备注', prop: 'remark', width: '500', align: 'left', show: true }
      ],
      tableData: [],
      rewardH: '0',
      rewardTotalVolume: '',
      rewardFloatProfit: ''
    }
  },
  created() {
    this.initFrameH('rewardH', 200)
  },
  methods: {
    // 搜索事件
    handleSearch() {
      this.loadInitData()
    },
    // 清除事件
    handleClearCondition() {
      Promise.all([

      ]).then(() => {
        this.handleSearch()
      })
    },
    // 导出
    handleExport() {
    },
    // 改违约
    handleDeliveryBackClick(scope) {
      api.deliverBreak({ realTradeId: scope.row.realTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.handlePopoverClose(scope, `popover-deliveryback-${scope.$index}`)
          this.loadInitData()
        }
      })
    },
    // 初始化数据
    loadInitData() {
      this.loading = true;
      api.get({
        deliveryDateEnd: null,
        deliveryDateStart: null,
        realTradeId: null,
        tradeNum: null,
        tscode: null,
        userName: null,
        userTradeId: null
      }).then((response) => {
        if (response && response.code === '00000' && response.value) {
          let rewardTotalVolume = 0
          let rewardFloatProfit = 0
          response.value.forEach(element => {
            if (!isNaN(element.profit)) {
              rewardFloatProfit += element.profit
            }
            if (!isNaN(element.profit)) {
              rewardTotalVolume += Number(element.volume)
            }
          })
          this.tableData = response.value;
          this.rewardFloatProfit = util.moneyFormat(rewardFloatProfit, 2)
          this.rewardTotalVolume = rewardTotalVolume
        } else {
          this.tableData = [];
        }
        this.loading = false;
      });
    },
    // 数据格式化
    funcFormat(row, column) {
      switch (column.property) {
        case "status":
          return config.funcKeyValue(row.status.toString(), "inquiryStatus");
        case "direction":
          return config.funcKeyValue(row.direction, "directionMeta")
        case "deliveryTime":
          return moment(row.deliveryTime).format('YYYY-MM-DD') // + `（T+${row.deliverySpeed}）`
        case "realDeliveryTime":
          return row.realDeliveryTime ? moment(row.realDeliveryTime).format('YYYY-MM-DD') : "--"
        case "price":
          return util.moneyFormat(row.price, 4)
        case "realPrice":
          return row.realPrice ? util.moneyFormat(row.realPrice, 4) : "--"
        case "realVolume":
          return row.realVolume ? row.realVolume : "--"
        case "tscode":
          return row.tscode.replace(/.IB/, '')
      }
      return row[column.property]
    },
    // 是否不能改违约
    funcIsBreak(scope) {
      return !moment(
        moment(scope.row.deliveryTime).format('YYYY-MM-DD')
      ).isBefore(moment(new Date()).format('YYYY-MM-DD'))
    }
  },
  mounted() {
    this.loadInitData()
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/style.scss";
.content {
  .navigator {
    position: relative;
    background-color: #f8f8f8;
    padding: 0 15px;
    .el-breadcrumb {
      height: 50px;
      line-height: 50px;
    }
    .el-button {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
  .filter-condition {
    margin: 20px 15px 10px;
    background-color: #f8f8f8;
    padding: 10px 15px;
    .item {
      display: inline-block;
      padding: 5px 0;
    }
    label {
      font-size: 12px;
      color: #999999;
    }
    .btn-box {
      float: right;
    }
    .clearboth {
      clear: both;
    }
  }
  .list {
    padding: 0 15px;
    .do {
      .el-button {
        margin-top: 10px;
      }
    }
  }
  .copy-tooltip {
    visibility: hidden;
  }
  .copy:hover {
    .copy-tooltip {
      visibility: visible;
    }
  }
  .pagination {
    float: right;
  }
  .my-el-row .el-col {
    padding: 5px 0;
  }
  .my-el-row .el-col:nth-child(odd) {
    text-align: right;
    font-size: 14px;
    color: #999999;
  }
  .my-el-row .el-col:nth-child(even) {
    font-size: 14px;
    word-break: break-all;
  }
}
</style>
