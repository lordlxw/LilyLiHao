<!-- 违约单 -->
<template>
  <div class="content">
    <!-- <div class="filter-condition"></div> -->
    <div class="list">
      <div class="table mt20">
        <el-table
          v-loading="loading"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          :height="breakH"
          border
          :key="Math.random()"
          header-row-style="height:30px;line-height:30px;"
          header-cell-style="background:#f8f8f8;"
          highlight-current-row
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
              :width="itemHead.width ? returnFrameW(itemHead.width) : ''"
            >
            </el-table-column>
          </template>
          <el-table-column></el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            :width="returnFrameW(180)"
          >
            <template slot-scope="scope">
              <el-popover
                v-if="
                  setAuth('break:back') &&
                  [3, 4].indexOf(scope.row.jiaogeStatus) !== -1
                "
                placement="bottom-end"
                :ref="`popover-breakback-${scope.$index}`"
              >
                <p>
                  确认"{{ scope.row.tscode }}"<span class="color-red">
                    改交割
                  </span>
                  ？
                </p>
                <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      handlePopoverClose(
                        scope,
                        `popover-breakback-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button type="text" @click="handleBreakBackClick(scope)"
                    >确认</el-button
                  >
                </div>
                <el-button type="text" slot="reference" class="ml10"
                  >改交割</el-button
                >
              </el-popover>
              <el-popover
                v-if="
                  setAuth('break:upgrade') &&
                  [3].indexOf(scope.row.jiaogeStatus) !== -1
                "
                placement="bottom-end"
                :ref="`popover-breakupgrade-${scope.$index}`"
              >
                <p>
                  确认"{{ scope.row.tscode }}"<span class="color-red">
                    违约升级
                  </span>
                  ？
                </p>
                <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      handlePopoverClose(
                        scope,
                        `popover-breakupgrade-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button type="text" @click="handleBreakUpgradeClick(scope)"
                    >确认</el-button
                  >
                </div>
                <el-button type="text" slot="reference" class="ml10"
                  >违约升级</el-button
                >
              </el-popover>
              <el-button
                v-if="
                  [3].indexOf(scope.row.jiaogeStatus) !== -1 &&
                  setAuth('break:redo')
                "
                type="text"
                @click="handleOpenBreakEditDialog(1, scope.row)"
                class="ml10"
                >续作</el-button
              >
              <!-- <el-button
                v-if="
                  [2].indexOf(scope.row.jiaogeStatus) !== -1 &&
                  setAuth('break:addupdate')
                "
                type="text"
                @click="handleOpenBreakEditDialog(2, scope.row)"
                class="ml10"
                >增改</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :title="currentType === 1 ? '违约续作' : ''"
      :width="returnFrameW(600) + 'px'"
      :visible.sync="dialogBreakEditFormVisible"
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <break-edit
        :row="currentRow"
        :type="currentType"
        @change="handleBreakEditDialogVisible"
      ></break-edit>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/kk_break";
import { pageMixin } from '@/utils/pageMixin'
import { commMixin } from '@/utils/commMixin'
import BreakEdit from '@/components/BreakEdit.vue'
import config from '@/utils/config'
import * as util from '@/utils/util'
import { debounce } from '@/utils/debounce'
import moment from 'moment'
export default {
  mixins: [pageMixin, commMixin],
  components: {
    BreakEdit
  },
  data() {
    return {
      loading: false,
      tableHead: [
        { label: '券码', prop: 'tscode', formatter: this.funcFormat, width: '130', align: 'left', show: true },
        { label: '方向', prop: 'direction', formatter: this.funcFormat, width: '60', align: 'left', show: true },
        { label: '成交价', prop: 'price', formatter: this.funcFormat, width: '120', align: 'right', show: true },
        { label: '交易量', prop: 'volume', width: '100', align: 'right', show: true },
        { label: '交割日期', prop: 'deliveryTime', formatter: this.funcFormat, width: '120', align: 'left', show: true },
        { label: '状态', prop: 'jiaogeStatus', formatter: this.funcFormat, width: '100', align: 'left', show: true },
        { label: '交易员id', prop: 'realTradeId', width: '120', align: 'left', show: false },
        { label: '备注', prop: 'remark', width: '500', align: 'left', show: true },
        { label: '单据号', prop: 'tradeNum', width: '160', align: 'left', show: true }
      ],
      tableData: [],
      breakH: '0',
      // 违约续作和违约增改行
      dialogBreakEditFormVisible: false,
      currentRow: [],
      // 当前类型
      currentType: ''
    }
  },
  created() {
    this.initFrameH('breakH', 200)
  },
  methods: {
    // 初始化违约成交
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
          this.tableData = response.value;
        } else {
          this.tableData = [];
        }
        this.loading = false;
      });
    },
    // 改交割
    handleBreakBackClick: debounce(function (scope) {
      api.dealBreakReturn({ realTradeId: scope.row.realTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.handlePopoverClose(scope, `popover-breakback-${scope.$index}`)
          this.loadInitData()
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
      })
    }),
    // 违约升级
    handleBreakUpgradeClick: debounce(function (scope) {
      api.dealBreakUpgrade({ realTradeId: scope.row.realTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.handlePopoverClose(scope, `popover-breakupgrade-${scope.$index}`)
          this.loadInitData()
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
      })
    }),
    // 数据格式化
    funcFormat(row, column) {
      switch (column.property) {
        case "status":
          return config.funcKeyValue(row.status.toString(), "inquiryStatus");
        case "direction":
          return config.funcKeyValue(row.direction, "directionMeta")
        case "deliveryTime":
          return moment(row.deliveryTime).format('YYYY-MM-DD')
        case "realDeliveryTime":
          return row.realDeliveryTime ? moment(row.realDeliveryTime).format('YYYY-MM-DD') : "--"
        case "price":
          return util.moneyFormat(row.price, 4)
        case "realPrice":
          return row.realPrice ? util.moneyFormat(row.realPrice, 4) : "--"
        case "realVolume":
          return row.realVolume ? row.realVolume : "--"
        case "tscode":
          return row.tscode ? row.tscode.replace(/.IB/, '') : ''
        case 'jiaogeStatus':
          return config.funcKeyValue(row.jiaogeStatus, 'bondStatus')
      }
      return row[column.property]
    },
    // 违约修改
    handleOpenBreakEditDialog(type, row) {
      this.currentType = type
      this.currentRow = JSON.parse(JSON.stringify(row))
      this.dialogBreakEditFormVisible = true
    },
    handleBreakEditDialogVisible(obj) {
      this.dialogBreakEditFormVisible = obj.dialogVisible
      this.loadInitData()
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
  .table-height {
    height: 800px !important;
  }
}
.notify {
  dl {
    line-height: 24px;
  }
}
</style>
