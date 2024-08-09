<!-- 用户汇总 -->
<template>
  <div class="content">
    <!-- <div class="filter-condition"></div> -->
    <div class="list">
      <!-- <div class="do mb10">
        <el-tag type="success" class="mr20">总买入：<b>{{ rewardBuyVolume }}</b></el-tag>
        <el-tag type="danger" class="mr20">总卖入：<b>{{ rewardSaleVolume }}</b></el-tag>
        <el-tag :type="rewardFloatProfit.toString().indexOf('-') !== -1
          ? 'danger'
          : 'success'
          " class="mr20" v-if="setAuth('reward:datatotal')">总盈亏：<b>{{ rewardFloatProfit }}</b></el-tag>
      </div> -->
      <el-table v-swipe-copy v-loading="loading" :data="tableData" tooltip-effect="dark" style="width: 100%"
        show-summary :height="height" :header-row-style="{ height: '30px', lineHeight: '30px' }"
        header-cell-class-name="list-row" :header-cell-style="{ background: '#f8f8f8' }" :key="Math.random()"
        highlight-current-row :cell-style="cellStyleUpdate" :row-class-name="tableRowFinishClassName">
        <template v-for="itemHead in tableHead">
          <el-table-column v-if="itemHead.show" :sortable="itemHead.sortable" :key="itemHead.label"
            :align="itemHead.align" :prop="itemHead.prop" :formatter="itemHead.formatter
              ? itemHead.formatter
              : (row, column, cellValue, index) => {
                return cellValue;
              }
              " :label="itemHead.label" :width="itemHead.width ? itemHead.width : ''"
            :show-overflow-tooltip="itemHead.showOverflowTooltip ? true : false">
          </el-table-column>
        </template>
      </el-table>
    </div>
  </div>
</template>

<script>
import apiAdmin from "@/api/kk_power_admin";
import { pageMixin } from "@/utils/pageMixin";
import { commMixin } from "@/utils/commMixin";
import config from "@/utils/config";
import * as util from "@/utils/util";
import moment from "moment";
let tableFinishClassName = "";
export default {
  props: {
    height: Number,
    searchParam: Object
  },
  mixins: [pageMixin, commMixin],
  data() {
    return {
      config,
      loading: false,
      // 表头
      tableHead: [],
      tableData: [],
      errorMsg: "",
      rewardBuyVolume: "",
      rewardSaleVolume: "",
      rewardFloatProfit: ""
    };
  },
  watch: {
    'searchParam.date': {
      immediate: true, // 将立即以表达式的当前值触发回调
      handler: function (val, oldVal) {
        this.loadInitData(this.searchParam)
      },
      deep: true,
    },
    'searchParam.userIds': {
      immediate: true, // 将立即以表达式的当前值触发回调
      handler: function (val, oldVal) {
        this.loadInitData(this.searchParam)
      },
      deep: true,
    },
  },
  methods: {
    // 已平仓行样式
    tableRowFinishClassName({ row, rowIndex }) {
      if (row.solidProfit > 0) {
        tableFinishClassName = "gd-green-row";
      } else {
        tableFinishClassName = "even-row";
      }
      return tableFinishClassName + ' list-row';
    },
    // 导出
    handleExport() { },
    // 获取用户模版id下设置的column
    dispatchUserColumn() {
      console.log("dispatchUserColumn ", config.transHistory)
      const headContent = config.transHistory;
      Object.entries(headContent).forEach(([key, value]) => {
        value.formatter = this.funcFormat;
        this.tableHead.push(value);
      });
      // this.loadInitData();
    },
    // 初始化数据
    loadInitData(searchParam) {
      if (!searchParam.date[0]) {
        return
      }
      this.loading = true;
      apiAdmin.getTransHistory({
        deliveryDateStart: this.searchParam.date[0],
        deliveryDateEnd: this.searchParam.date[1],
        userIds: this.searchParam.userIds
      }).then(response => {
        const { code, value } = response;
        if (code === "00000" && value) {
          // this.tableData = response.value.map(n => {
          //   return { ...n }
          // });
          const groupByFinishCode = util.groupArrayToMap(response.value, item => item.finishCode, item => item)
          this.tableData = [];
          Array.from(groupByFinishCode.entries()).forEach(([key, value]) => {
            value.sort(function (a, b) {
              return a.createTime < b.createTime ? -1 : 1
            })
            const itemStart = value[0];
            const itemEnd = value[value.length - 1];
            const res = {
              finishCode: key,
              dateStart: itemStart.createTime,
              dateEnd: itemEnd.createTime,
              tscode: itemStart.tscode,
              volume: value.reduce((sum, item) => {
                return sum + parseInt(item.volume || 0)
              }, 0),
              direction: itemStart.direction,
              priceStart: util.moneyFormat(itemStart.price, 4),
              priceEnd: util.moneyFormat(itemEnd.price, 4),
              solidProfit: util.moneyFormat(value.reduce((sum, item) => {
                return sum + parseFloat(item.profit || 0) * 10000
              }, 0) / 10000, 4),
              fee: value.reduce((sum, item) => {
                return sum + parseFloat(item.fee || 0) * 10000
              }, 0) / 10000,
              yanjiuyuanName: itemStart.yanjiuyuanName,
              transNum: value.length,
            }

            this.tableData.push(res)
          })
          // this.rewardFloatProfit = this.tableData.reduce((sum, item) => {
          //   return sum + parseFloat(item.solidProfit) * 10000
          // }, 0) / 10000

          // this.rewardBuyVolume = this.tableData.reduce((sum, item) => {
          //   return sum + item.limitBid
          // }, 0)

          // this.rewardSaleVolume = this.tableData.reduce((sum, item) => {
          //   return sum + item.limitOffer
          // }, 0)

          this.$emit("init", value)
        } else {
          this.tableData = [];
          this.$message({
            message: `${response.message}`,
            type: "warning"
          });
        }
        this.loading = false;
      })
    },
    // 更新记录表
    cellStyleUpdate(row, column, rowIndex, columnIndex) {
      if (
        row.column.label === "交割量" &&
        parseInt(row.row.volume) < row.row.chengjiaoAmount
      ) {
        return "color:orange";
      }
      if (row.column.label === "方向") {
        switch (row.row.direction) {
          case "bond_1": // 卖出
            return "color:#e88585";
          case "bond_0": // 买入
            return "color:#00da3c";
        }
      }
    },
    // 数据格式化
    funcFormat(row, column) {
      switch (column.property) {
        case "status":
          return config.funcKeyValue(row.status.toString(), "userStatus");
        case "direction":
          return config.funcKeyValue(row.direction, "directionMeta");
        case "deliveryTime":
          return moment(row.deliveryTime).format("YYYY-MM-DD"); // + `（T+${row.deliverySpeed}）`
        case "realDeliveryTime":
          return row.realDeliveryTime
            ? moment(row.realDeliveryTime).format("YYYY-MM-DD")
            : "--";
        case "price":
          return util.moneyFormat(row.price, 4);
        case "realPrice":
          return row.realPrice ? util.moneyFormat(row.realPrice, 4) : "--";
        case "realVolume":
          return row.realVolume ? row.realVolume : "--";
        case "tscode":
          return row.tscode.replace(/.IB/, "");
        case "minProfitDaily":
          return row.minProfitDaily + 'w';
        case "minProfitAlltime":
          return row.minProfitAlltime + 'w';
      }
      return row[column.property];
    },
  },
  mounted() {
    this.dispatchUserColumn();
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/style.scss";

.content {
  height: 100%;
  // background-color: $body-main-box;

  .list {
    padding: 0 10px;

    .el-table {
      border-radius: 3px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    }

    .do {
      height: 50px;
      line-height: 50px;
      background-color: #fff;
      border-radius: 3px;
      padding: 0 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    }

    .table {
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    }

    >>>.list-row {
      height: 40px;
      line-height: 40px;
      color: #000;
    }
  }

  .navigator {
    position: relative;
    background-color: #f8f8f8;

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
