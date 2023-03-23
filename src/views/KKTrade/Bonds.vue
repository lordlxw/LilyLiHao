<!-- 持仓单 -->
<template>
  <div class="content">
    <!-- <div class="filter-condition"></div> -->
    <div class="list">
      <el-tabs
        ref="eltabs"
        type="card"
        @tab-click="handleTabsClick"
        class="mt20"
      >
        <!-- 未平仓 -->
        <el-tab-pane :label="tablist[0]" v-if="setAuth('nobonds:view')">
          <div class="do">
            <el-button size="mini" @click="handleDefaultExpandAll">{{
              defaultExpandAll ? "全收" : "全展"
            }}</el-button>
          </div>
          <div class="table mt10">
            <el-table
              v-loading="loading"
              :data="tableData"
              tooltip-effect="dark"
              style="width: 100%"
              height="600"
              border
              row-key="rowId"
              :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
              :row-class-name="tableRowClassName"
              :cell-style="cellStyle"
              :key="Math.random()"
              :default-expand-all="defaultExpandAll"
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
              <el-table-column
                fixed="right"
                align="center"
                label="操作"
                width="80"
              >
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-if="
                      setAuth('bonds:cover') && scope.row.realTradeId === null
                    "
                    @click="handleBondsCover(scope.row)"
                    >平仓</el-button
                  >
                  <el-button
                    @click="handleNoBondsEditClick(scope.row)"
                    type="text"
                    size="small"
                    v-if="
                      setAuth('nobonds:update') &&
                      scope.row.realTradeId !== null &&
                      scope.row.status === 11
                    "
                    >修改</el-button
                  >

                  <el-popover
                    v-if="
                      setAuth('nobonds:updateconfirm') &&
                      scope.row.realTradeId !== null &&
                      scope.row.status === 17
                    "
                    placement="bottom-end"
                    :ref="`popover-agreeupdatenobonds-${scope.$index}`"
                  >
                    <p>
                      确认要<span class="color-red">同意修改</span>“<span
                        class="color-main"
                        >{{ scope.row.tradeNum }}</span
                      >”{{ scope.row.tscode }}？
                    </p>
                    <div style="text-align: right">
                      <el-button
                        type="text"
                        @click="handleAgreeNoBondsUpdateClick(scope)"
                        >同意</el-button
                      >
                      <el-button
                        type="text"
                        @click="handleRejectNoBondsUpdateClick(scope)"
                        >拒绝</el-button
                      >
                    </div>
                    <el-button type="text" slot="reference" class="ml10"
                      >修改审核</el-button
                    >
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
        <!-- 已平仓 -->
        <el-tab-pane :label="tablist[1]" v-if="setAuth('bonds:view')">
          <div class="table mt10">
            <el-table
              v-loading="loading"
              :data="tableDataFinish"
              tooltip-effect="dark"
              style="width: 100%"
              class="table-height"
              border
              row-key="rowId"
              :row-class-name="tableRowFinishClassName"
              :cell-style="finishCellStyle"
              :key="Math.random()"
              :span-method="objectSpanMethod"
            >
              <template v-for="itemHead in tableHeadFinish">
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
              <!-- <el-table-column></el-table-column> -->
              <el-table-column align="center" label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    @click="handleBondsEditClick(scope.row)"
                    type="text"
                    size="small"
                    v-if="setAuth('bonds:update') && scope.row.status === 12"
                    class="ml10"
                    >修改</el-button
                  >
                  <el-popover
                    v-if="
                      setAuth('bonds:updateconfirm') &&
                      scope.row.realTradeId !== null &&
                      scope.row.status === 16
                    "
                    placement="bottom-end"
                    :ref="`popover-agreeupdatebonds-${scope.$index}`"
                  >
                    <p>
                      确认要<span class="color-red">同意修改</span>“<span
                        class="color-main"
                        >{{ scope.row.tradeNum }}</span
                      >”{{ scope.row.tscode }}？
                    </p>
                    <div style="text-align: right">
                      <el-button
                        type="text"
                        @click="handleAgreeBondsUpdateClick(scope)"
                        >同意</el-button
                      >
                      <el-button
                        type="text"
                        @click="handleRejectBondsUpdateClick(scope)"
                        >拒绝</el-button
                      >
                    </div>
                    <el-button type="text" slot="reference" class="ml10"
                      >修改审核</el-button
                    >
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="是否违约"
                width="80"
                v-if="setAuth('bonds:delivery')"
              >
                <template slot-scope="scope">
                  <el-checkbox
                    v-if="funcIsBreak(scope)"
                    v-model="scope.row.breakStatus"
                    >违约</el-checkbox
                  >
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                label="交割操作"
                width="100"
                v-if="setAuth('bonds:delivery')"
              >
                <template slot-scope="scope">
                  <el-popover
                    placement="bottom-end"
                    :ref="`popover-delivery-${scope.$index}`"
                  >
                    <p>
                      确认要<span class="color-red"> 交割 </span> "{{
                        scope.row.tscode
                      }}"？
                    </p>
                    <div style="text-align: right">
                      <el-button
                        type="text"
                        @click="
                          handlePopoverClose(
                            scope,
                            `popover-delivery-${scope.$index}`
                          )
                        "
                        >取消</el-button
                      >
                      <el-button type="text" @click="handleDeliveryClick(scope)"
                        >确认</el-button
                      >
                    </div>
                    <el-button type="text" slot="reference" class="ml10"
                      >交割</el-button
                    >
                  </el-popover>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>

    <el-dialog
      title="平仓"
      width="500px;"
      :visible.sync="dialogBondsCoverFormVisible"
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <bonds-cover
        :row="currentRow"
        @change="handleBondsCoverDialogVisible"
      ></bonds-cover>
    </el-dialog>
    <el-dialog
      title="未平仓修改申请"
      width="500px;"
      :visible.sync="dialogNoBondsFormVisible"
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <no-bonds-edit
        :row="nobondsRow"
        @change="handleNoBondsDialogVisible"
      ></no-bonds-edit>
    </el-dialog>
    <el-dialog
      title="已平仓修改申请"
      width="500px;"
      :visible.sync="dialogBondsFormVisible"
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <bonds-edit
        :row="bondsRow"
        @change="handleBondsDialogVisible"
      ></bonds-edit>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/kk_bonds"
import apiAdmin from '@/api/kk_power_admin'
import apiBondPool from '@/api/kk_bond_pool'
import { pageMixin } from '@/utils/pageMixin'
import { animationMixin } from '@/utils/animationMixin'
import BondsCover from '@/components/BondsCover.vue'
import NoBondsEdit from '@/components/NoBondsEdit.vue'
import BondsEdit from '@/components/BondsEdit.vue'
import config from '@/utils/config'
import * as util from '@/utils/util'
import moment from 'moment'
let tableFinishClassName = ''
let currentFinishCode = ''
// 合并单元格
let finishCode = ''
let finishCodeSameCount = 0
export default {
  mixins: [animationMixin, pageMixin],
  components: {
    BondsCover,
    NoBondsEdit,
    BondsEdit
  },
  data() {
    return {
      config,
      loading: false,
      // 表格行内样式
      rowClassNameList: ['warning-row'],
      // tabs
      tablist: ['未平仓', '已平仓'],
      // 表头
      tableHead: [],
      tableData: [],
      tableHeadFinish: [],
      tableDataFinish: [],
      defaultExpandAll: false,
      // 平仓弹框
      dialogBondsCoverFormVisible: false,
      currentRow: {},
      // 买
      businessInList: [],
      // 卖
      businessOutList: [],
      // 未平仓编辑弹框
      dialogNoBondsFormVisible: false,
      nobondsRow: [],
      // 已平仓编辑弹框
      dialogBondsFormVisible: false,
      bondsRow: []
    }
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
    // 获取用户模版id下设置的column
    dispatchUserColumn() {
      apiAdmin.getUserColumn({
        templateId: 2,
        userId: null,
      }).then(response => {
        if (response && response.code === '00000') {
          const headContent = JSON.parse(response.value.headContent)
          for (let i = 0; i < headContent.length; i++) {
            if (config.bondsHead[headContent[i]]) {
              config.bondsHead[headContent[i]].formatter = this.funcFormat
              this.tableHead.push(config.bondsHead[headContent[i]])
            }
          }
        }
      })
    },
    dispatchUserBondedColumn() {
      apiAdmin.getUserColumn({
        templateId: 3,
        userId: null,
      }).then(response => {
        if (response && response.code === '00000') {
          const headContent = JSON.parse(response.value.headContent)
          for (let i = 0; i < headContent.length; i++) {
            if (config.bondsHead[headContent[i]]) {
              config.bondsHead[headContent[i]].formatter = this.funcFormat
              this.tableHeadFinish.push(config.bondsHead[headContent[i]])
            }
          }
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
        if (response && response.code === 200 && response.rows) {
          let rowId = 0
          response.rows.forEach(element => {
            if (element.children && element.children.length > 0) {
              const realTradeIdList = []
              element.children.forEach(element => {
                rowId++
                realTradeIdList.push(element.realTradeId)
                element.rowId = rowId
              })
              rowId++
              element.realTradeIdList = realTradeIdList
              element.rowId = rowId
            }
          });
          this.tableData = response.rows;
          this.totalCount = response.total;
        } else {
          this.tableData = [];
          this.totalCount = 0;
        }
        this.loading = false;
      });
    },
    // 初始化已平仓数据
    loadInitDataFinish() {
      this.loading = true;
      api.getFinish({
        deliveryDateEnd: null,
        deliveryDateStart: null,
        realTradeId: null,
        tradeNum: null,
        tscode: null,
        userName: null,
        userTradeId: null
      }).then((response) => {
        if (response && response.code === 200 && response.rows) {
          response.rows.forEach(element => {
            element.breakStatus = false
          });
          this.tableDataFinish = response.rows;
          this.totalCount = response.total;
        } else {
          this.tableDataFinish = [];
          this.totalCount = 0;
        }
        this.loading = false;
      });
    },
    handleTabsClick(tab, event) {
      finishCode = ''
      finishCodeSameCount = 0
      if (tab.label === this.tablist[0]) {
        this.tableData = []
        this.loadInitData()
      }
      if (tab.label === this.tablist[1]) {
        this.tableDataFinish = []
        this.loadInitDataFinish()
      }
    },
    // 平仓弹框
    handleBondsCover(row) {
      Promise.all([this.currentRow = JSON.parse(JSON.stringify(row))]).then(() => {
        switch (row.direction) {
          case 'bond_0':
            this.initRightBusinessList({
              tscode: row.tscode,
              bidtype: 0,
              deliveryTime2: row.deliveryTime
            })
            break
          case 'bond_1':
            this.initRightBusinessList({
              tscode: row.tscode,
              bidtype: 1,
              deliveryTime2: row.deliveryTime
            })
            break
        }
      })
    },
    // 平仓弹框回参接收
    handleBondsCoverDialogVisible(obj) {
      this.dialogBondsCoverFormVisible = obj.dialogVisible
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
    // 行样式
    tableRowClassName({ row, rowIndex }) {
      if (row.children) {
        if (moment(moment(row.deliveryTime).format('YYYY-MM-DD')).isBefore(moment(new Date()).format('YYYY-MM-DD'))) {
          return 'history-row'
        } else if (moment(moment(row.deliveryTime).format('YYYY-MM-DD')).isSame(moment(new Date()).format('YYYY-MM-DD'))) {
          return 'warning-row'
        } else {
          return 'success-row'
        }
      }
    },
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
    // 盒子样式
    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label === '方向') {
        switch (row.row.direction) {
          case 'bond_1': // 卖出
            return 'color:#e88585';
          case 'bond_0': // 买入
            return 'color:#00da3c';
        }
      }
    },
    // 已平仓盒子样式
    finishCellStyle(row, column, rowIndex, columnIndex) {
      if (moment(moment(row.row.deliveryTime).format('YYYY-MM-DD')).isBefore(moment(new Date()).format('YYYY-MM-DD'))) {
        return 'color:#5d0b0b';
      }
      if (row.column.label === '方向') {
        switch (row.row.direction) {
          case 'bond_1': // 卖出
            return 'color:#e88585';
          case 'bond_0': // 买入
            return 'color:#00da3c';
        }
      }
    },
    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.label === '交割操作') {
        // 1、根据当前finishCode查找个数作为合并行数
        finishCodeSameCount = 0
        let flag = false
        if (finishCode !== row.finishCode) {
          finishCode = row.finishCode
          for (let i = 0; i < this.tableDataFinish.length; i++) {
            if (this.tableDataFinish[i].finishCode === row.finishCode) {
              finishCodeSameCount = finishCodeSameCount + 1
              flag = true
            } else {
              if (flag) {
                break
              }
            }
          }
          return {
            rowspan: finishCodeSameCount,
            colspan: columnIndex
          }
        } else {
          return {
            rowspan: 0,
            colspan: columnIndex
          };
        }
      }
    },
    // 卖出，买入数据
    initRightBusinessList(params) {
      const self = this
      apiBondPool.businessList(params).then(res => {
        if (res.code === '00000') {
          switch (params.bidtype) {
            case 1:
              self.businessOutList = res.value
              self.currentRow.price = self.funcGetBestPrice('max', res.value)
              break;
            case 0:
              self.businessInList = res.value
              self.currentRow.price = self.funcGetBestPrice('min', res.value)
              break;
          }
          self.dialogBondsCoverFormVisible = true
        }
      })
    },
    // 买卖最优值(type:min最小，type:max最大;arr:初始数组;)
    funcGetBestPrice(type, arr) {
      switch (type) {
        case 'min':
          let minVal = ''
          for (let i = 0; i < arr.length; i++) {
            if (i === 0) {
              minVal = arr[i].price
            } else {
              if (arr[i].price < minVal) {
                minVal = arr[i].price
              }
            }
          }
          return minVal
        case 'max':
          let maxVal = ''
          for (let i = 0; i < arr.length; i++) {
            if (i === 0) {
              maxVal = arr[i].price
            } else {
              if (arr[i].price > maxVal) {
                maxVal = arr[i].price
              }
            }
          }
          return maxVal
      }
    },
    // 交割
    handleDeliveryClick(scope) {
      let jiaogeIdlist = []
      let weiyueIdlist = []
      let flag = false
      for (let i = 0; i < this.tableDataFinish.length; i++) {
        if (scope.row.finishCode === this.tableDataFinish[i].finishCode) {
          if (this.tableDataFinish[i].breakStatus) {
            weiyueIdlist.push(this.tableDataFinish[i].realTradeId)
          } else {
            jiaogeIdlist.push(this.tableDataFinish[i].realTradeId)
          }
          flag = true
        } else {
          if (flag) {
            break
          }
        }
      }
      api.dealDelivery({ jiaogeIdlist: jiaogeIdlist, weiyueIdlist: weiyueIdlist }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.handlePopoverClose(scope, `popover-delivery-${scope.$index}`)
          this.loadInitDataFinish()
        } else {
          this.$message({
            message: response.data.message,
            type: 'error'
          })
        }
      })
    },
    // 违约
    handleBreakClick(scope) {
      api.dealBreak({ realTradeId: scope.row.realTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.handlePopoverClose(scope, `popover-break-${scope.$index}`)
          this.loadInitDataBreak()
        } else {
          this.$message({
            message: response.data.message,
            type: 'error'
          })
        }
      })
    },
    // 未平仓弹框变化
    handleNoBondsDialogVisible(obj) {
      this.dialogNoBondsFormVisible = obj.dialogVisible
      this.loadInitData()
    },
    // 未平仓编辑弹框
    handleNoBondsEditClick(row) {
      Promise.all([
        this.nobondsRow = JSON.parse(JSON.stringify(row))
      ]).then(() => {
        this.dialogNoBondsFormVisible = true
      })
    },
    // 已平仓弹框变化
    handleBondsDialogVisible(obj) {
      this.dialogBondsFormVisible = obj.dialogVisible
      this.loadInitDataFinish()
    },
    // 已平仓编辑弹框
    handleBondsEditClick(row) {
      Promise.all([
        this.bondsRow = JSON.parse(JSON.stringify(row))
      ]).then(() => {
        this.dialogBondsFormVisible = true
      })
    },
    // 同意修改未平仓单
    handleAgreeNoBondsUpdateClick(scope) {
      api.dealNoBondsEditComfirm({ realTradeId: scope.row.realTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "已审核",
            type: 'success'
          })
          this.handlePopoverClose(scope, `popover-agreeupdatenobonds-${scope.$index}`)
          this.loadInitData()
        }
      })
    },
    // 拒绝修改未平仓单
    handleRejectNoBondsUpdateClick(scope) {
      api.dealNoBondsEditRejection({ realTradeId: scope.row.realTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "已拒绝修改",
            type: 'warning'
          })
          this.handlePopoverClose(scope, `popover-agreeupdatenobonds-${scope.$index}`)
          this.loadInitData()
        }
      })
    },
    // 同意修改已平仓单
    handleAgreeBondsUpdateClick(scope) {
      api.dealBondsEditComfirm({ realTradeId: scope.row.realTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "已审核",
            type: 'success'
          })
          this.handlePopoverClose(scope, `popover-agreeupdatebonds-${scope.$index}`)
          this.loadInitDataFinish()
        }
      })
    },
    // 拒绝修改已平仓单
    handleRejectBondsUpdateClick(scope) {
      api.dealBondsEditRejection({ realTradeId: scope.row.realTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "已拒绝修改",
            type: 'warning'
          })
          this.handlePopoverClose(scope, `popover-agreeupdatebonds-${scope.$index}`)
          this.loadInitDataFinish()
        }
      })
    },
    // 全展 ， 全收
    handleDefaultExpandAll() {
      this.defaultExpandAll = !this.defaultExpandAll
    },
    // 是否可违约
    funcIsBreak(scope) {
      return moment(
        moment(scope.row.deliveryTime).format('YYYY-MM-DD')
      ).isSameOrAfter(moment(new Date()).format('YYYY-MM-DD'))
    }
  },
  mounted() {
    this.dispatchUserColumn()
    this.dispatchUserBondedColumn()
    if (this.$refs.eltabs.panes.length > 0) {
      switch (this.$refs.eltabs.panes[0].label) {
        case this.tablist[0]:
          this.loadInitData()
          break
        case this.tablist[1]:
          this.loadInitDataBreak()
          break
      }
    }
    window.onresize = () => {
      // const width = 1920
      // const height = 1080
      // const clientWith = document.body.clientWidth
      // const clientHeight = document.body.clientHeight
    }
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
  .table-height {
    height: 800px !important;
  }
}
</style>
