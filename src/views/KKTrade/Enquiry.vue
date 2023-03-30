<!-- 询价单 -->
<template>
  <div class="content">
    <!-- <div class="filter-condition"></div> -->
    <div class="list">
      <div class="do">
        <el-button
          type="default"
          v-if="setAuth('inquiry:insert')"
          @click="dialogEnquiryFormVisible = true"
          >添加</el-button
        >
      </div>
      <div class="table mt10">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          :height="enquiryH"
          border
          row-key="userTradeId"
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
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
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="160"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="setAuth('inquiry:accept') && scope.row.status === 0"
                @click="handleAcceptClick(scope)"
                >接收</el-button
              >
              <el-popover
                v-if="setAuth('inquiry:rejection') && scope.row.status === 0"
                placement="bottom-end"
                :ref="`popover-notaccept-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">拒收</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”？
                </p>
                <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      handlePopoverClose(
                        scope,
                        `popover-notaccept-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button type="text" @click="handleNotAcceptClick(scope)"
                    >确认</el-button
                  >
                </div>
                <el-button type="text" slot="reference" class="ml10"
                  >拒收</el-button
                >
              </el-popover>
              <el-button
                @click="handleDealClick(scope.row)"
                type="text"
                size="small"
                v-if="
                  ['1', '4', '8'].indexOf(scope.row.status.toString()) !== -1 &&
                  setAuth('inquiry:deal')
                "
                >成交</el-button
              >
              <el-popover
                v-if="
                  ['0', '1', '4'].indexOf(scope.row.status.toString()) !== -1 &&
                  setAuth('inquiry:cancel')
                "
                placement="bottom-end"
                :ref="`popover-cancel-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">撤销</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”{{ scope.row.tscode }}？
                </p>
                <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      handlePopoverClose(
                        scope,
                        `popover-cancel-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button
                    type="text"
                    @click="handleInquiryCancelClick(scope)"
                    >确认</el-button
                  >
                </div>
                <el-button type="text" slot="reference" class="ml10"
                  >撤单</el-button
                >
              </el-popover>
              <el-popover
                v-if="
                  ['7'].indexOf(scope.row.status.toString()) !== -1 &&
                  setAuth('inquiry:agreecancel')
                "
                placement="bottom-end"
                :ref="`popover-agreecancel-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">同意撤销</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”{{ scope.row.tscode }}？
                </p>
                <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      handlePopoverClose(
                        scope,
                        `popover-agreecancel-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button
                    type="text"
                    @click="handleInquiryCancelConfirmClick(scope)"
                    >确认</el-button
                  >
                </div>
                <el-button type="text" slot="reference" class="ml10"
                  >同意撤单</el-button
                >
              </el-popover>
              <el-popover
                v-if="
                  ['7'].indexOf(scope.row.status.toString()) !== -1 &&
                  setAuth('inquiry:rejectioncancel')
                "
                placement="bottom-end"
                :ref="`popover-rejectioncancel-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">拒绝撤销</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”{{ scope.row.tscode }}？
                </p>
                <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      handlePopoverClose(
                        scope,
                        `popover-rejectioncancel-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button
                    type="text"
                    @click="handleInquiryCancelRejectionClick(scope)"
                    >确认</el-button
                  >
                </div>
                <el-button type="text" slot="reference" class="ml10"
                  >拒绝撤单</el-button
                >
              </el-popover>
              <el-popover
                v-if="
                  ['9'].indexOf(scope.row.status.toString()) !== -1 &&
                  setAuth('inquiry:agreedeal')
                "
                placement="bottom-end"
                :ref="`popover-agreedeal-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">同意成交</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”{{ scope.row.tscode }}？
                </p>
                <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      handlePopoverClose(
                        scope,
                        `popover-agreedeal-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button
                    type="text"
                    @click="handleInquiryDealConfirmClick(scope)"
                    >确认</el-button
                  >
                </div>
                <el-button type="text" slot="reference" class="ml10"
                  >同意成交</el-button
                >
              </el-popover>
              <el-popover
                v-if="
                  ['9'].indexOf(scope.row.status.toString()) !== -1 &&
                  setAuth('inquiry:rejectiondeal')
                "
                placement="bottom-end"
                :ref="`popover-rejectiondeal-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">拒绝成交</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”{{ scope.row.tscode }}？
                </p>
                <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      handlePopoverClose(
                        scope,
                        `popover-rejectiondeal-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button
                    type="text"
                    @click="handleInquiryDealRejectionClick(scope)"
                    >确认</el-button
                  >
                </div>
                <el-button type="text" slot="reference" class="ml10"
                  >拒绝成交</el-button
                >
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      title="成交信息"
      width="500px;"
      :visible.sync="dialogDealFormVisible"
      append-to-body
    >
      <el-form
        :model="dealForm"
        :rules="rulesDealForm"
        ref="dealForm"
        :label-width="formLabelWidth + 'px'"
        :close-on-click-modal="false"
      >
        <el-form-item label="债券代码" prop="tscode">
          {{ dealRows.tscode }}
        </el-form-item>
        <el-form-item label="交易方向" prop="direction">
          {{
            dealRows.direction === "bond_0"
              ? "买入"
              : dealRows.direction === "bond_1"
              ? "卖出"
              : ""
          }}
        </el-form-item>
        <el-form-item label="成交价格" prop="price">
          <el-input v-model="dealForm.price" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="成交量" prop="volume">
          <el-input v-model="dealForm.volume" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="交割日期" prop="deliveryTime">
          <delivery-canlendar-update
            ref="deliveryCanlendarUpdate"
            @change="handleDeliveryCanlendarUpdate"
          ></delivery-canlendar-update>
        </el-form-item>
        <el-form-item label="交易对手" prop="counterParty">
          <el-input
            v-model="dealForm.counterParty"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="contactPerson">
          <el-input
            v-model="dealForm.contactPerson"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="contactType">
          <el-input
            v-model="dealForm.contactType"
            autocomplete="off"
          ></el-input>
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
    <el-dialog
      title="询价"
      width="500px;"
      :visible.sync="dialogEnquiryFormVisible"
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <enquiry-edit @change="handleDialogVisible"></enquiry-edit>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import api from "@/api/kk_trade";
import apiAdmin from '@/api/kk_power_admin'
import DeliveryCanlendarUpdate from '@/components/DeliveryCanlendarUpdate.vue'
import EnquiryEdit from '@/components/EnquiryEdit.vue'
import { pageMixin } from '@/utils/pageMixin'
import { commMixin } from '@/utils/commMixin'
import config from '@/utils/config'
import * as util from '@/utils/util'
import moment from 'moment'
export default {
  mixins: [pageMixin, commMixin],
  props: {
    status: ''
  },
  components: {
    DeliveryCanlendarUpdate,
    EnquiryEdit
  },
  data() {
    // 金额格式验证
    const moneyTest = async (rule, value, callback) => {
      if (!config.regExpSet.money.test(value)) {
        callback(new Error('请输入正确格式（-.----）'))
      } else {
        callback()
      }
    }
    // 大于0格式验证
    const plusAmountTest = async (rule, value, callback) => {
      if (!config.regExpSet.gtzero.test(value)) {
        callback(new Error('请输入大于0的正整数'))
      } else {
        callback()
      }
    }
    return {
      config,
      loading: false,
      // 表头
      tableHead: [],
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
        // 交割日期
        deliveryTime: '',
        // 交易对手
        counterParty: '',
        // 联系人
        contactPerson: '',
        // 联系方式
        contactType: ''
      },
      rulesDealForm: {
        price: [
          { required: true, message: '价格必选', trigger: 'blur' },
          { validator: moneyTest, trigger: 'blur' }
        ],
        volume: [
          { required: true, message: '交易量必填', trigger: 'blur' },
          { validator: plusAmountTest, trigger: 'blur' }
        ],
        deliveryTime: [
          { required: true, message: '交割日期必选', trigger: 'blur' }
        ],
        counterParty: [
          { required: true, message: '交易对手必填', trigger: 'blur' }
        ]
      },
      dealRows: {},
      dialogEnquiryFormVisible: false,
      enquiryH: '0',
      formLabelWidth: '0'
    }
  },
  created() {
    this.initFrameH('enquiryH', 200)
  },
  watch: {
    enquiryInfo() {
      this.loadInitData()
    }
  },
  computed: {
    ...mapState({
      enquiryInfo: (state) => state.enquiryInfo
    })
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
        templateId: 1,
        userId: null,
      }).then(response => {
        if (response && response.code === '00000') {
          const headContent = JSON.parse(response.value.headContent)
          for (let i = 0; i < headContent.length; i++) {
            if (config.enquiryHead[headContent[i]]) {
              config.enquiryHead[headContent[i]].formatter = this.funcFormat
              this.tableHead.push(config.enquiryHead[headContent[i]])
            }
          }
          this.loadInitData()
        }
      })
    },
    // 初始化数据
    loadInitData() {
      this.loading = true;
      api.inquiryQuery({
        pageNum: this.pageNum,
        pageSize: this.pageSize
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
            message: '已接收',
            type: 'success'
          })
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
          this.handlePopoverClose(
            scope,
            `popover-notaccept-${scope.$index}`
          )
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
        row.deliveryTime = moment(row.deliveryTime).format('YYYY-MM-DD')
        this.dealRows = row
        this.dealForm.usertradeId = row.userTradeId
        this.dealForm.price = row.price
        this.dealForm.volume = row.restVolume
        this.dealForm.remark = row.remark
        this.dealForm.deliveryTime = row.deliveryTime
        this.$refs.deliveryCanlendarUpdate.deliveryTime = row.deliveryTime
        this.dealForm.counterParty = row.counterParty
        this.dealForm.contactPerson = row.contactPerson
        this.dealForm.contactType = row.contactType
      })
    },
    // 表单提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log(this.ruleForm)
          api.inquiryDeal({
            usertradeId: this.dealForm.usertradeId,
            price: this.dealForm.price,
            volume: this.dealForm.volume,
            remark: this.dealForm.remark,
            deliveryTime: util.dateFormat(this.dealForm.deliveryTime, "YYYY-MM-DD 00:00:00"),
            counterParty: this.dealForm.counterParty,
            contactPerson: this.dealForm.contactPerson,
            contactType: this.dealForm.contactType
          }).then((response) => {
            if (response && response.code === "00000") {
              this.$message({
                message: "已提交，如有变动请等待审核",
                type: "success",
              });
              this.dialogDealFormVisible = false
              this.dealForm.price = ''
              this.dealForm.volume = ''
              this.dealForm.remark = ''
              this.dealForm.deliveryTime = ''
              this.dealForm.counterParty = ''
              this.dealForm.contactPerson = ''
              this.dealForm.contactType = ''
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
          this.handlePopoverClose(
            scope,
            `popover-cancel-${scope.$index}`
          )
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
          this.handlePopoverClose(
            scope,
            `popover-agreecancel-${scope.$index}`
          )
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
          this.handlePopoverClose(
            scope,
            `popover-rejectioncancel-${scope.$index}`
          )
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
          this.handlePopoverClose(
            scope,
            `popover-agreedeal-${scope.$index}`
          )
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
          this.handlePopoverClose(
            scope,
            `popover-rejectiondeal-${scope.$index}`
          )
          self.loadInitData()
        }
      })
    },
    // 交割日期
    handleDeliveryCanlendarUpdate(obj) {
      this.dealForm.deliveryTime = obj.value
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
    handleDialogVisible(obj) {
      this.dialogEnquiryFormVisible = obj.dialogVisible
    }
  },
  mounted() {
    this.dispatchUserColumn()
    this.initFrameW('formLabelWidth', 120)
    window.onresize = () => {
      this.initFrameW('formLabelWidth', 120)
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
