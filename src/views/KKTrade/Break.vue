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
          class="table-height"
          border
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
            width="120"
          >
            <template slot-scope="scope">
              <el-popover
                v-if="setAuth('break:back')"
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
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import api from "@/api/kk_break";
import { pageMixin } from '@/utils/pageMixin'
import config from '@/utils/config'
import * as util from '@/utils/util'
import moment from 'moment'
export default {
  mixins: [pageMixin],
  data() {
    return {
      tableHead: [
        { label: '券码', prop: 'tscode', formatter: this.funcFormat, width: '130', align: 'left', show: true },
        { label: '方向', prop: 'direction', formatter: this.funcFormat, width: '60', align: 'left', show: true },
        { label: '成交价', prop: 'price', formatter: this.funcFormat, width: '120', align: 'right', show: true },
        { label: '交易量', prop: 'volume', width: '100', align: 'right', show: true },
        { label: '交割日期', prop: 'deliveryTime', formatter: this.funcFormat, width: '100', align: 'left', show: true },
        { label: '交易员id', prop: 'realTradeId', width: '120', align: 'left', show: false },
        { label: '备注', prop: 'remark', width: '500', align: 'left', show: true },
        { label: '单据号', prop: 'tradeNum', width: '150', align: 'left', show: true }
      ],
      tableData: [],
    }
  },
  created() {
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
    handleBreakBackClick(scope) {
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
            message: response.data.message,
            type: 'error'
          })
        }
      })
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
