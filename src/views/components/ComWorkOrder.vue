<!-- 用户汇总 -->
<template>
  <div class="content">
    <div class="list">
      <div class="do mb10">
        <el-row>
          <el-col :span="12">
            <el-tag type="success" class="mr20">已处理: <b>{{ 11 }}</b></el-tag>
            <el-tag type="danger" class="mr20">未处理: <b>{{ 25 }}</b></el-tag>
          </el-col>
          <el-col :span="12" class="text-right">
            <el-date-picker v-model="orderDate" type="date" placeholder="选择日期" :clearable="false"
              value-format="yyyy-MM-dd" @change="loadInitData">
            </el-date-picker>
          </el-col>
        </el-row>
        <!-- <el-tag :type="rewardFloatProfit.toString().indexOf('-') !== -1
          ? 'danger'
          : 'success'
          " class="mr20" v-if="setAuth('reward:datatotal')">总盈亏：<b>{{ rewardFloatProfit }}</b></el-tag> -->
      </div>
      <el-table v-swipe-copy v-loading="loading" :data="tableData" tooltip-effect="dark" style="width: 100%"
        :height="height * 0.6 - 88" :header-row-style="{ height: '30px', lineHeight: '30px' }"
        header-cell-class-name="list-row" :header-cell-style="{ background: '#f8f8f8' }" :key="Math.random()"
        :cell-style="cellStyleUpdate" :row-class-name="tableRowFinishClassName">
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
        <el-table-column></el-table-column>
        <el-table-column fixed="right" label="操作" algin="center" width="150px">
          <template slot-scope="scope">
            <el-button type="text" v-if="
              setAuth('system:order:edit') &&
              [0].indexOf(scope.row.status) !== -1
            " @click="receiveOrder(scope.row, 1)">接收</el-button>
            <el-button type="text" v-if="
              setAuth('system:order:edit') && scope.row.reviewedBy === userInfo.userId &&
              [1].indexOf(scope.row.status) !== -1
            " @click="inquiryQuery(scope.row)">去处理</el-button>
            <!-- <el-button type="text" v-if="
              setAuth('system:order:edit') && scope.row.reviewedBy === userInfo.userId &&
              [1].indexOf(scope.row.status) !== -1
            " @click="receiveOrder(scope.row, 3)">无法处理</el-button> -->

            <el-popover v-if="
              setAuth('system:order:edit') && scope.row.reviewedBy === userInfo.userId &&
              [1].indexOf(scope.row.status) !== -1
            " placement="bottom-end" :ref="`popover-rejectiondeal-${scope.$index}`">
              <p>
                确认要取消处理吗？
              </p>
              <div style="text-align: right">
                <el-button type="text" @click="
                  handlePopoverClose(
                    scope,
                    `popover-rejectiondeal-${scope.$index}`
                  )
                  ">取消</el-button>
                <el-button type="text" @click="receiveOrder(scope.row, 3)">确认</el-button>
              </div>
              <el-button type="text" slot="reference">无法处理</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="list">
      <div class="do mb10">
        <el-tag type="success" class="mr20">可能关联的订单</el-tag>
      </div>
      <el-table v-swipe-copy v-loading="loading" :data="enquiryOrderData" tooltip-effect="dark" style="width: 100%"
        :height="height * 0.4 - 40" :header-row-style="{ height: '30px', lineHeight: '30px' }"
        header-cell-class-name="list-row" :header-cell-style="{ background: '#f8f8f8' }" :key="Math.random()"
        :cell-style="cellStyleUpdate" :row-class-name="table1RowFinishClassName">
        <template v-for="itemHead in enquiryOrder">
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
        <el-table-column></el-table-column>
        <el-table-column fixed="right" label="操作" algin="center" width="150px">
          <template slot-scope="scope">
            <el-button type="text" v-if="setAuth('system:order:edit')" @click="viewChat(scope.row)">查看会话</el-button>
            <el-button type="text" v-if="setAuth('system:order:edit')" @click="orderEdit(scope.row)">异常处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="订单异常处理" width="500px;" :visible.sync="dialogOrderEdit.visible" append-to-body
      :destroy-on-close="true" :close-on-click-modal="false">
      <order-edit :currentRow="dialogOrderEdit.currentRow"></order-edit>
    </el-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import apiAdmin from "@/api/kk_power_admin";
import api from "@/api/kk_trade";
import { pageMixin } from "@/utils/pageMixin";
import { commMixin } from "@/utils/commMixin";
import config from "@/utils/config";
import * as util from "@/utils/util";
import OrderEdit from '@/components/OrderEdit.vue'
import moment from "moment";
let tableFinishClassName = "";
export default {
  props: {
    height: Number,
    searchParam: Object,
    userSummary: []
  },
  mixins: [pageMixin, commMixin],
  components: {
    OrderEdit
  },
  data() {
    return {
      config,
      loading: false,
      // 表头
      tableHead: [],
      enquiryOrder: [],
      tableData: [],
      enquiryOrderData: [],
      errorMsg: "",
      rewardBuyVolume: "",
      rewardSaleVolume: "",
      rewardFloatProfit: "",
      dialogOrderEdit: {
        visible: false,
        currentRow: {}
      },
      orderDate: ''
    };
  },
  watch: {
  },
  computed: {
    ...mapGetters({
      userInfo: "getUserInfo",
    }),
  },
  methods: {
    // 已平仓行样式
    table1RowFinishClassName({ row, rowIndex }) {
      if (row.handle) {
        return "gd-green-row list-row"
      }

      if (row.solidProfit > 0) {
        tableFinishClassName = "gd-green-row";
      } else {
        tableFinishClassName = "even-row";
      }
      return tableFinishClassName + ' list-row';
    },
    tableRowFinishClassName({ row, rowIndex }) {
      if (row.status === 0) {
        return "gd-red-row list-row"
      }
      if (row.solidProfit > 0) {
        tableFinishClassName = "gd-green-row";
      } else {
        tableFinishClassName = "even-row";
      }
      return tableFinishClassName + ' list-row';
    },
    viewChat(row) {
      if (window.v1) {
        window.v1.hasWinsById('chat').then((bool) => {
          if (bool) {
            window.v1.sendWinMsg({ id: "chat", fun: 'window-send', data: row });
          } else {
            window.v1.getAllDisplays().then((response) => {
              console.log(response)
              const maxWidth = Math.max(...response.map(display => display.bounds.width));
              const maxHeight = Math.max(...response.map(display => display.bounds.height));

              const minWidth = (maxWidth / 2) - 10 <= 500 ? 500 : (maxWidth / 2) - 300;
              const minHeight = maxHeight / 3 + 300;
              const args = {
                id: 'chat',
                width: minWidth, // 窗口宽度
                height: minHeight, // 窗口高度
                minWidth: minWidth, // 窗口最小宽度
                minHeight: minHeight, // 窗口最小高度
                isMainWin: false,
                resize: false, // 是否支持缩放
                maximize: false, // 最大化窗口
                isMultiWin: false, // 是否支持多开窗口
                route: "/simulation/chat"
              }
              window.v1.createWin(args)
            })
          }
        })
      }
    },
    orderEdit(row) {
      this.dialogOrderEdit.visible = true;
      this.dialogOrderEdit.currentRow = row;
    },
    // 导出
    handleExport() { },
    // 获取用户模版id下设置的column
    dispatchUserColumn() {
      console.log("dispatchUserColumn ", config.transHistory)
      const headContent = config.workOrder;
      Object.entries(headContent).forEach(([key, value]) => {
        value.formatter = this.funcFormat;
        this.tableHead.push(value);
      });

      const enquiryOrder = config.enquiryOrderHead;
      Object.entries(enquiryOrder).forEach(([key, value]) => {
        value.formatter = this.funcFormatOrder;
        this.enquiryOrder.push(value);
      });
      // this.loadInitData();
    },
    // 初始化数据
    loadInitData() {
      this.loading = true;
      const createTime = this.orderDate ? this.orderDate + ' 00:00:00' : ''
      apiAdmin.findWorkOrder({ createTime }).then(response => {
        const { code, value } = response;
        if (code === "00000" && value) {
          this.tableData = value.map(n => {
            return { ...n }
          });
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
          return config.funcKeyValue(row.status.toString(), "orderStatus");
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
        case "createBy":
          return this.userSummary.lenght > 0 ? '666' : row.createBy;
        case "minProfitAlltime":
          return row.minProfitAlltime + 'w';
      }
      return row[column.property];
    },
    funcFormatOrder(row, column) {
      switch (column.property) {
        case "status":
          return config.funcKeyValue(row.status.toString(), "inquiryStatus");
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
        case "createBy":
          return this.userSummary.lenght > 0 ? '666' : row.createBy;
        case "minProfitAlltime":
          return row.minProfitAlltime + 'w';
      }
      return row[column.property];
    },
    receiveOrder(row, status) {
      apiAdmin.saveAndUpdateWorkOrder({ id: row.id, reviewedBy: this.userInfo.userId, status: status }).then(({ code }) => {
        if (code === "00000") {
          this.loadInitData()
        }
      })
    },
    inquiryQuery(row) {
      console.log(row)
      const tradeDateStart = moment(row.createTime).format("YYYY-MM-DD"); // 创建一个新的日期对象，以免修改原始日期
      const tradeDateEnd = moment(row.createTime).add(1, 'days').format("YYYY-MM-DD");
      api.inquiryQuery({
        tradeDateStart: tradeDateStart,
        tradeDateEnd: tradeDateEnd,
      }).then(({ code, rows }) => {
        let list = rows.filter(n => n.createBy === row.createBy)
        list.forEach(n => {
          n.handle = row.tradeIds.includes(n.userTradeId) ? true : false
        })
        this.enquiryOrderData = list
      });
    }
  },
  mounted() {
    this.dispatchUserColumn();
    this.loadInitData()
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/style.scss";

.content {
  height: 100%;
  // background-color: $body-main-box;

  .list {
    padding: 10px 10px 0px;

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
      // margin-top: 10px;
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

.el-table tbody tr:hover>td {
  background-color: unset !important //修改成自己想要的颜色即可
}

// .el-table--enable-row-hover .el-table__body tr:hover>td {
//   background-color: rgba(0, 0, 0, 0) !important;
// }</style>
