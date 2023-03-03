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
          row-key="userTradeId"
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
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
                  : function (row, column, cellValue, index) {
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
            <template slot-scope="">

            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="pagination mt10">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNum"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        >
        </el-pagination>
      </div> -->
    </div>
    <el-dialog
      title="成交信息"
      width="500px;"
      :visible.sync="dialogDealFormVisible"
      append-to-body
    >
      <div class="notify" style="margin-bottom: 20px">
        <dl>
          <dt>债券代码</dt>
          <dd>{{ dealRows.tscode }}</dd>
        </dl>
        <dl>
          <dt>交易方向</dt>
          <dd>
            {{
              dealRows.direction === "bond_0"
                ? "买入"
                : dealRows.direction === "bond_1"
                ? "卖出"
                : ""
            }}
          </dd>
        </dl>
        <dl>
          <dt>询价</dt>
          <dd>{{ dealRows.price | moneyFormat(4) }}</dd>
        </dl>
        <dl>
          <dt>询面额</dt>
          <dd>{{ dealRows.volume }}</dd>
        </dl>
        <dl>
          <dt>交割日期</dt>
          <dd>
            {{ dealRows.deliveryTime | dateFormat("yyyy-MM-dd") }}（T+{{
              dealRows.deliverySpeed
            }}）
          </dd>
        </dl>
      </div>

      <el-form
        :model="dealForm"
        :rules="rulesDealForm"
        ref="dealForm"
        label-width="90px"
      >
        <el-form-item label="成交价格" prop="price">
          <el-input v-model="dealForm.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="成交量" prop="volume">
          <el-input v-model="dealForm.volume" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="交割日期" prop="volume">
          <el-date-picker
            v-model="dealForm.deliveryTime"
            type="date"
            placeholder="选择日期"
            style="width: 130px"
            :clearable="false"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            row="2"
            resize="none"
            v-model="dealForm.remark"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDealFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('dealForm')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/kk_bonds";
import { pageMixin } from '@/utils/pageMixin'
import { animationMixin } from '@/utils/animationMixin'
import config from '@/utils/config'
import * as util from '@/utils/util'
import moment from 'moment'
export default {
  mixins: [animationMixin, pageMixin],
  props: {
    status: ''
  },
  data() {
    return {
      config,
      loading: false,
      // 表头
      tableHead: [
        // 询价排列显示： 债券代码 交易方向 询价 询面额 交割日期 其他排后
        { label: '研究员id', prop: 'createBy', width: 'auto', align: 'left', show: false },
        { label: '询价时间', prop: 'createTime', width: '190', align: 'left', show: true },
        { label: '交割速度', prop: 'deliverySpeed', width: '90', align: 'left', show: false },
        { label: '询价交割', prop: 'deliveryTime', formatter: this.funcFormat, width: '100', align: 'left', show: true },
        { label: '方向', prop: 'direction', formatter: this.funcFormat, width: '80', align: 'left', show: true },
        { label: '询价', prop: 'price', formatter: this.funcFormat, width: '120', align: 'right', show: true },
        { label: '交易员id', prop: 'realTradeId', width: '120', align: 'left', show: false },
        { label: '备注', prop: 'remark', width: '300', align: 'left', show: true },
        { label: '单据号', prop: 'tradeNum', width: '150', align: 'left', show: true },
        { label: '交易员', prop: 'tradeuser', width: '120', align: 'left', show: true },
        { label: '券码', prop: 'tscode', width: '130', align: 'left', show: true },
        { label: '交易id', prop: 'userTradeId', width: '120', align: 'left', show: false },
        { label: '询量（万）', prop: 'volume', width: '100', align: 'right', show: true },
        { label: '交易员id', prop: 'xunjiayuanId', width: '120', align: 'left', show: false },
        { label: '交易员', prop: 'xunjiayuanName', width: '120', align: 'left', show: true }
        // 询价成交重要排序：成交价格  成交面额 成交交割日期  交易对手 联系方式
      ],
      tableData: [],
      dialogDealFormVisible: false,
      dealForm: {
        // 询价单号
        usertradeId: '',
        // 成交价格
        price: '',
        // 成交量
        volume: '',
        // 备注
        remark: '',
        // 交割时间
        deliveryTime: '',
      },
      rulesDealForm: {},
      dealRows: {}
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
          this.tableData = response.rows;
          this.totalCount = response.total;
        } else {
          this.tableData = [];
          this.totalCount = 0;
        }
        this.loading = false;
      });
    },
    // 接受
    handleAcceptClick(scope) {
      api.inquiryAccept({ usertradeId: scope.row.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: '已接受',
            type: 'success'
          })
          scope._self.$refs[`popover-accept-${scope.$index}`].doClose();
          this.loadInitData()
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
      })
    },
    // 拒收
    handleNotAcceptClick(scope) {
      api.inquiryRejection({ usertradeId: scope.row.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: '已拒收',
            type: 'info'
          })
          scope._self.$refs[`popover-notaccept-${scope.$index}`].doClose();
          this.loadInitData()
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
      })
    },
    // 点击成交
    handleDealClick(row) {
      Promise.all([
        this.dialogDealFormVisible = true
      ]).then(() => {
        this.dealRows = row
        this.dealForm.usertradeId = row.userTradeId
        this.dealForm.price = row.price
        this.dealForm.volume = row.volume
        this.dealForm.remark = row.remark
        this.dealForm.deliveryTime = row.deliveryTime
      })
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.inquiryDeal({
            usertradeId: this.dealForm.usertradeId,
            price: this.dealForm.price,
            volume: this.dealForm.volume,
            remark: this.dealForm.remark,
            deliveryTime: util.dateFormat(this.dealForm.deliveryTime, "yyyy-MM-dd 00:00:00"),
          }).then((response) => {
            if (response && response.code === "00000") {
              this.$message({
                message: "操作成功",
                type: "success",
              });
              this.dialogDealFormVisible = false
              this.dealForm.price = ''
              this.dealForm.volume = ''
              this.dealForm.remark = ''
              this.dealForm.deliveryTime = ''
              this.loadInitData()
            }
          });
        }
      })
    },
    // 提交撤单申请
    handleInquiryCancelClick(scope) {
      api.inquiryCancel({ usertradeId: scope.row.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: `${response.message}`,
            type: 'success'
          })
          scope._self.$refs[`popover-cancel-${scope.$index}`].doClose();
          this.loadInitData()
        }
      })
    },
    // 确认撤单
    handleInquiryCancelConfirmClick(scope) {
      const self = this
      api.inquiryCancelConfirm({ usertradeId: scope.row.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          self.$message({
            message: "已撤单",
            type: 'success'
          })
          scope._self.$refs[`popover-agreecancel-${scope.$index}`].doClose();
          self.loadInitData()
        }
      })
    },
    // 拒绝撤单
    handleInquiryCancelRejectionClick(scope) {
      const self = this
      api.inquiryCancelRejection({ usertradeId: scope.row.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          self.$message({
            message: "已拒绝",
            type: 'success'
          })
          scope._self.$refs[`popover-rejectioncancel-${scope.$index}`].doClose();
          self.loadInitData()
        }
      })
    },
    // 同意成交
    handleInquiryDealConfirmClick(scope) {
      const self = this
      api.inquiryDealConfirm({ userTradeId: scope.row.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "已成交",
            type: 'success'
          })
          self.loadInitData()
        }
      })
    },
    // 拒绝成交
    handleInquiryDealRejectionClick(scope) {
      const self = this
      api.inquiryDealRejection({ userTradeId: scope.row.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "已拒绝",
            type: 'success'
          })
          self.loadInitData()
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
