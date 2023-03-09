<!-- 持仓单 -->
<template>
  <div class="content">
    <!-- <div class="filter-condition"></div> -->
    <div class="list">
      <!-- <div class="do">
        <div class="pagination mt10">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="prev, next"
            :total="totalCount"
            background
          >
          </el-pagination>
        </div>
      </div> -->
      <div class="table mt10">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          height="600"
          border
          row-key="rowId"
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
          :row-class-name="tableRowClassName"
          :cell-style="cellStyle"
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
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="160"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="setAuth('bonds:cover') && scope.row.realTradeId === null"
                @click="handleBondsCover(scope.row)"
                >平仓</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
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
  </div>
</template>

<script>
import api from "@/api/kk_bonds";
import apiBondPool from '@/api/kk_bond_pool'
import { pageMixin } from '@/utils/pageMixin'
import { animationMixin } from '@/utils/animationMixin'
import BondsCover from '@/components/BondsCover.vue'
import config from '@/utils/config'
import * as util from '@/utils/util'
import moment from 'moment'
export default {
  mixins: [animationMixin, pageMixin],
  props: {
    status: ''
  },
  components: {
    BondsCover
  },
  data() {
    return {
      config,
      loading: false,
      // 表格行内样式
      rowClassNameList: ['warning-row'],
      // 表头
      tableHead: [
        // 询价排列显示： 债券代码 交易方向 询价 询面额 交割日期 其他排后
        { label: '研究员id', prop: 'createBy', width: 'auto', align: 'left', show: false },
        { label: '券码', prop: 'tscode', width: '130', align: 'left', show: true },
        { label: '方向', prop: 'direction', formatter: this.funcFormat, width: '60', align: 'left', show: true },
        { label: '成交价', prop: 'price', formatter: this.funcFormat, width: '120', align: 'right', show: true },
        { label: '持仓量', prop: 'volume', width: '100', align: 'right', show: true },
        { label: '交割速度', prop: 'deliverySpeed', width: '90', align: 'left', show: false },
        { label: '交割日期', prop: 'deliveryTime', formatter: this.funcFormat, width: '100', align: 'left', show: true },
        { label: '交易员id', prop: 'realTradeId', width: '120', align: 'left', show: false },
        { label: '备注', prop: 'remark', width: 'auto', align: 'left', show: true },
        { label: '单据号', prop: 'tradeNum', width: '150', align: 'left', show: false },
        { label: '交易员', prop: 'tradeuser', width: '120', align: 'left', show: false },
        { label: '交易id', prop: 'userTradeId', width: '120', align: 'left', show: false },
        { label: '交易员id', prop: 'xunjiayuanId', width: '120', align: 'left', show: false },
        { label: '研究员', prop: 'xunjiayuanName', width: '120', align: 'left', show: false },
        { label: '成交时间', prop: 'createTime', width: '190', align: 'left', show: true }
        // 询价成交重要排序：成交价格  成交面额 成交交割日期  交易对手 联系方式
      ],
      tableData: [],
      // 平仓弹框
      dialogBondsCoverFormVisible: false,
      currentRow: {},
      // 买
      businessInList: [],
      // 卖
      businessOutList: [],
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
    // 平仓弹框
    handleBondsCover(row) {
      Promise.all([this.currentRow = row]).then(() => {
        switch (row.direction) {
          case 'bond_0':
            this.initRightBusinessList({
              tscode: row.tscode,
              bidtype: 0
            })
            break
          case 'bond_1':
            this.initRightBusinessList({
              tscode: row.tscode,
              bidtype: 1
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
      }
    },
    // 行样式
    tableRowClassName({ row, rowIndex }) {
      if (row.children) {
        return 'warning-row'
      }
    },
    // 盒子样式
    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label === '方向') {
        switch (row.row.direction) {
          case 'bond_1': // 卖出
            return 'color:#e88585';
          case 'bond_0': // 买入
            return 'color:green';
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

<style lang="scss">
body {
  background-color: #f8f8f8;
}
</style>
