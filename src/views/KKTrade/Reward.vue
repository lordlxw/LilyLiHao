<!-- 交割回报 -->
<template>
  <div class="content mt20">
    <!-- <div class="filter-condition"></div> -->
    <div class="list">
      <div class="do mb10">
        <el-tag type="success" class="mr20"
          >交割（买）：<b>{{ rewardBuyVolume }}</b></el-tag
        >
        <el-tag type="danger" class="mr20"
          >交割（卖）：<b>{{ rewardSaleVolume }}</b></el-tag
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
        highlight-current-row
        :cell-style="cellStyleUpdate"
        :row-class-name="tableRowFinishClassName"
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
        <el-table-column fixed="right" align="center" label="操作" width="80px">
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
              <el-table border :data="breakTableData">
                <template v-for="itemHead in breakTableHead">
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
                <el-table-column
                  v-if="doListOption && doListOption.length > 0"
                  label="选择"
                  width="300px"
                >
                  <template slot-scope="scope">
                    <el-checkbox-group
                      v-model="scope.row.mySelected"
                      @input="handleDoCheck"
                    >
                      <el-checkbox
                        v-for="item in doListOption"
                        :label="item.value"
                        :key="item.value"
                        >{{ item.label }}</el-checkbox
                      >
                    </el-checkbox-group>
                  </template>
                </el-table-column>
                <el-table-column label="违约方" width="150px">
                  <template slot-scope="scope">
                    <el-select
                      v-model="scope.row.weiyuePerson"
                      v-if="
                        scope.row.mySelected && scope.row.mySelected.length > 0
                      "
                      placeholder="请选择"
                    >
                      <el-option
                        v-for="(value, key) in config.breakTypeOptions"
                        :key="key"
                        :label="value"
                        :value="key"
                      ></el-option>
                    </el-select>
                  </template>
                </el-table-column>
                <el-table-column label="违约量" width="150px">
                  <template slot-scope="scope">
                    <el-input
                      size="mini"
                      v-model="scope.row.weiyueAmount"
                      v-if="
                        scope.row.mySelected && scope.row.mySelected.length > 0
                      "
                      width="90"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="做市商" width="150px">
                  <template slot-scope="scope">
                    <el-input
                      size="mini"
                      v-model="scope.row.marketMakerName"
                      v-if="
                        scope.row.mySelected && scope.row.mySelected.length > 0
                      "
                      width="90"
                    ></el-input>
                  </template>
                </el-table-column>
              </el-table>
              <div style="text-align: right" class="mt20">
                <el-button
                  type="primary"
                  @click="
                    handlePopoverClose(
                      scope,
                      `popover-deliveryback-${scope.$index}`
                    )
                  "
                  >取消</el-button
                >
                <el-button
                  type="primary"
                  @click="handleDeliveryBackClick(scope)"
                  >确认</el-button
                >
              </div>
              <el-button
                type="text"
                slot="reference"
                class="ml10"
                @click="handleLoadCurrentRow(scope)"
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
import apiAdmin from '@/api/kk_power_admin'
import { pageMixin } from '@/utils/pageMixin'
import { commMixin } from '@/utils/commMixin'
import config from '@/utils/config'
import * as util from '@/utils/util'
import { debounce } from '@/utils/debounce'
import moment from 'moment'
let tableFinishClassName = ''
let currentFinishCode = ''
export default {
  mixins: [pageMixin, commMixin],
  data() {
    return {
      config,
      loading: false,
      // 表头
      tableHead: [],
      tableData: [],
      // 改违约表头
      breakTableHead: [
        { label: '券码', prop: 'tscode', formatter: this.funcFormat, width: '120', align: 'left', show: true },
        { label: '方向', prop: 'direction', formatter: this.funcFormat, width: '60', align: 'left', show: true },
        { label: '交割价', prop: 'price', formatter: this.funcFormat, width: '120', align: 'right', show: true },
        { label: '交割量', prop: 'volume', width: '100', align: 'right', show: true }
      ],
      breakTableData: [],
      doListOption: config.doBreakList,
      errorMsg: '',
      rewardH: '0',
      rewardBuyVolume: '',
      rewardSaleVolume: '',
      rewardFloatProfit: ''
    }
  },
  created() {
    this.initFrameH('rewardH', 200)
  },
  methods: {
    // 已平仓行样式
    tableRowFinishClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        tableFinishClassName = 'odd-row'
        currentFinishCode = row.finishCode
      } else {
        if (currentFinishCode !== row.finishCode) {
          currentFinishCode = row.finishCode
          if (tableFinishClassName === 'even-row') {
            tableFinishClassName = 'odd-row'
          } else {
            tableFinishClassName = 'even-row'
          }
        }
      }
      return tableFinishClassName
    },
    handleDoCheck(val) {
      this.errorMsg = ''
      if (val.length > 1) {
        val.shift()
      }
    },
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
    handleLoadCurrentRow(scope) {
      scope.row.mySelected = []
      scope.row.weiyuePerson = ''
      scope.row.weiyueAmount = scope.row.volume
      scope.row.marketMakerName = ''
      this.breakTableData = [JSON.parse(JSON.stringify(scope.row))]
    },
    // 获取用户模版id下设置的column
    dispatchUserColumn() {
      apiAdmin.getUserColumn({
        templateId: 94,
        userId: null,
      }).then(response => {
        if (response && response.code === '00000') {
          const headContent = JSON.parse(response.value.headContent)
          for (let i = 0; i < headContent.length; i++) {
            if (config.rewardHead[headContent[i]]) {
              config.rewardHead[headContent[i]].formatter = this.funcFormat
              this.tableHead.push(config.rewardHead[headContent[i]])
            }
          }
          this.loadInitData()
        }
      })
    },
    // 改违约
    handleDeliveryBackClick: debounce(function (scope) {
      // const finishCodeList = [...new Set(this.breakTableData.map(item => item.finishCode))]
      const wyList = []
      const len = this.breakTableData.length
      let flag = false
      for (let i = 0; i < len; i++) {
        if (this.breakTableData[i].mySelected.length > 0) {
          wyList.push({
            marketMakerName: this.breakTableData[i].marketMakerName,
            realTradeId: this.breakTableData[i].realTradeId,
            weiyueAmount: this.breakTableData[i].weiyueAmount ? parseInt(this.breakTableData[i].weiyueAmount) : '',
            weiyuePerson: this.breakTableData[i].weiyuePerson,
            weiyueType: this.breakTableData[i].mySelected[0]
          })
          if (!this.breakTableData[i].weiyuePerson) {
            this.errorMsg = '违约方必须选全'
            flag = true
            break;
          }
          if (parseInt(this.breakTableData[i].weiyueAmount) > this.breakTableData[i].volume) {
            this.errorMsg = '违约量不能超过持仓量'
            flag = true
            break;
          }
          if (isNaN(this.breakTableData[i].weiyueAmount) || Number(this.breakTableData[i].weiyueAmount) <= 0) {
            this.errorMsg = '违约量必须大于0'
            flag = true
            break;
          }
        } else {
          this.errorMsg = '请勾选违约类型'
          flag = true
          break;
        }
      }
      if (!flag) {
        api.deliverBreak({
          marketMakerName: wyList[0].marketMakerName,
          realTradeId: wyList[0].realTradeId,
          weiyueAmount: wyList[0].weiyueAmount,
          weiyuePerson: wyList[0].weiyuePerson,
          weiyueType: wyList[0].weiyueType
        }).then(response => {
          if (response && response.code === '00000') {
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            this.handlePopoverClose(scope, `popover-deliveryback-${scope.$index}`)
            this.loadInitData()
          }
        })
      } else {
        this.$message({
          message: `${this.errorMsg}`,
          type: 'error'
        })
      }
    }),
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
          let rewardBuyVolume = 0
          let rewardSaleVolume = 0
          let rewardFloatProfit = 0
          response.value.forEach(element => {
            if (!isNaN(element.profit)) {
              rewardFloatProfit += element.profit
            }
            if (!isNaN(element.profit) && element.direction === 'bond_0') {
              rewardBuyVolume += Number(element.volume)
            }
            if (!isNaN(element.profit) && element.direction === 'bond_1') {
              rewardSaleVolume += Number(element.volume)
            }
          })
          this.tableData = response.value;
          this.rewardFloatProfit = util.moneyFormat(rewardFloatProfit, 2)
          this.rewardBuyVolume = rewardBuyVolume
          this.rewardSaleVolume = rewardSaleVolume
        } else {
          this.tableData = [];
          this.$message({
            message: `${response.message}`,
            type: 'warning'
          })
        }
        this.loading = false;
      });
    },
    // 更新记录表
    cellStyleUpdate(row, column, rowIndex, columnIndex) {
      if (row.column.label === '交割量' && parseInt(row.row.volume) < row.row.chengjiaoAmount) {
        return 'color:orange'
      }
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
    this.dispatchUserColumn()
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
