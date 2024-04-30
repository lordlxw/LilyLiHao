<!-- 询价单 -->
<template>
  <div class="content">
    <!-- <div class="filter-condition"></div> -->
    <div class="list">
      <div class="do">
        <el-button
          type="default"
          v-if="setAuth('inquiry:insert')"
          @click="handleAddInquiry"
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
          :row-class-name="tableRowClassName"
          :cell-style="cellStyle"
          :span-method="objectSpanMethod"
          @expand-change="handleExpandChange"
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
            width="220"
          >
            <template slot-scope="scope">
              <!-- <el-button
                type="text"
                v-if="setAuth('inquiry:accept') && scope.row.status === 0"
                @click="handleAcceptClick(scope)"
                >{{
                  scope.row.youxianLevel === 2
                    ? "接收优先复制"
                    : scope.row.youxianLevel === 1
                    ? "接收后发复制"
                    : "接收并复制"
                }}</el-button
              > -->
              <el-button
                type="text"
                v-if="
                  setAuth('inquiry:edit') &&
                  [0, 1, 4, 10].indexOf(scope.row.status) !== -1
                "
                @click="handleEditEnqury(scope.row)"
                >修改</el-button
              >
              <el-button
                type="text"
                v-if="setAuth('inquiry:accept') && scope.row.status === 0"
                @click="handleAcceptClick(scope)"
                >{{
                  scope.row.youxianLevel === 2
                    ? "接收优先复制"
                    : scope.row.youxianLevel === 1
                    ? "接收优先复制"
                    : "接收并复制"
                }}</el-button
              >
              <el-button
                @click="handleDealClick(scope.row)"
                type="text"
                size="small"
                v-if="
                  ['1', '4', '8', '10'].indexOf(scope.row.status.toString()) !==
                    -1 &&
                  setAuth('inquiry:deal') &&
                  scope.row.relativeNum &&
                  scope.row.relativeNum.indexOf('GD_') === -1
                "
                >成交</el-button
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
                @click="handleEnquiryDifficultClick(scope.row)"
                type="text"
                size="small"
                v-if="
                  [1, 4, 8].indexOf(scope.row.status) !== -1 &&
                  setAuth('inquiry:difficult')
                "
                class="ml10"
                >难成</el-button
              >
              <el-button
                type="text"
                v-if="
                  setAuth('inquiry:difficultcanncel') &&
                  [5, 19].indexOf(scope.row.status) !== -1
                "
                @click="handleDifficultNewEnqury(scope.row)"
                >新建</el-button
              >
              <el-popover
                v-if="
                  setAuth('inquiry:difficultcanncel') && scope.row.status === 19
                "
                placement="bottom-end"
                :ref="`popover-difficultcanncel-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">难成撤单</span>“<span
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
                        `popover-difficultcanncel-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button
                    type="text"
                    @click="handleEnquiryDifficultCanncelClick(scope)"
                    >确认</el-button
                  >
                </div>
                <el-button type="text" slot="reference" class="ml10"
                  >撤单</el-button
                >
              </el-popover>
              <el-popover
                v-if="setAuth('inquiry:notmove') && scope.row.status === 19"
                placement="bottom-end"
                :ref="`popover-notmove-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">难成保留</span>“<span
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
                        `popover-notmove-${scope.$index}`
                      )
                    "
                    >取消</el-button
                  >
                  <el-button
                    type="text"
                    @click="handleEnquiryDifficultDotMoveClick(scope)"
                    >确认</el-button
                  >
                </div>
                <el-button type="text" slot="reference" class="ml10"
                  >保留</el-button
                >
              </el-popover>
              <el-button
                type="text"
                v-if="
                  setAuth('inquiry:accept') &&
                  [1, 4, 7, 8, 9].indexOf(scope.row.status) !== -1
                "
                @click="copy(scope, true)"
                :style="
                  scope.row.youxianLevel === 2
                    ? { fontWeight: 'bold', color: '#ec0000' }
                    : ''
                "
                >{{
                  scope.row.youxianLevel === 2
                    ? "先发复制"
                    : scope.row.youxianLevel === 1
                    ? "后发复制"
                    : "复制"
                }}</el-button
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
              <el-popover
                v-if="
                  setAuth('inquiry:breaktobeconfirm') && scope.row.status === 20
                "
                placement="bottom-end"
                :ref="`popover-breaktobeconfirm-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">同意违约续作</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”{{ scope.row.tscode }}？
                </p>
                <el-table
                  border
                  :data="diffTableData"
                  :cell-style="cellStyleUpdate"
                >
                  <template v-for="itemHead in diffTableHead">
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
                </el-table>
                <div style="text-align: center" class="mt20">
                  <el-button
                    type="primary"
                    @click="handleAgreeBreakContinueClick(scope)"
                    >同意</el-button
                  >
                  <el-button
                    type="default"
                    @click="handleRejectBreakContinueClick(scope)"
                    >拒绝</el-button
                  >
                </div>
                <el-button
                  type="text"
                  slot="reference"
                  class="ml10"
                  @click="handlViewBreakContinueContent(scope)"
                  >违约续作审核</el-button
                >
              </el-popover>
              <el-popover
                v-if="setAuth('inquiry:agreeedit') && scope.row.status === 23"
                placement="bottom-end"
                :ref="`popover-agreeedit-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">同意修改</span>“<span
                    class="color-main"
                    >{{ scope.row.tradeNum }}</span
                  >”{{ scope.row.tscode }}？
                </p>
                <el-table
                  border
                  :data="diffTableData"
                  :cell-style="cellStyleUpdate"
                >
                  <template v-for="itemHead in diffTableHead">
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
                </el-table>
                <div style="text-align: center" class="mt20">
                  <el-button type="primary" @click="handleAgreeEditClick(scope)"
                    >同意</el-button
                  >
                  <el-button
                    type="default"
                    @click="handleRejectEditClick(scope)"
                    >拒绝</el-button
                  >
                </div>
                <el-button
                  type="text"
                  slot="reference"
                  class="ml10"
                  @click="handlViewEditContent(scope)"
                  >修改审核</el-button
                >
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            align="center"
            label="滚单成交"
            width="80"
          >
            <template slot-scope="scope">
              <el-button
                @click="handleRollDealClick(scope.row)"
                type="text"
                size="small"
                v-if="
                  ['1', '3', '4', '8', '10'].indexOf(
                    scope.row.status.toString()
                  ) !== -1 &&
                  setAuth('inquiry:rolldeal') &&
                  scope.row.relativeNum &&
                  scope.row.relativeNum.indexOf('GD_') !== -1 &&
                  !scope.row.gundanFinished
                "
                >成交</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      title="成交信息"
      :width="returnFrameW(600) + 'px'"
      :visible.sync="dialogDealFormVisible"
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
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
            ref="deliveryCanlendar"
            @change="handleDeliveryCanlendar"
          ></delivery-canlendar-update>
        </el-form-item>
        <el-form-item label="交易对手" prop="counterParty">
          <el-input
            v-model="dealForm.counterParty"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!-- <el-form-item label="联系人" prop="contactPerson">
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
        </el-form-item> -->
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
      title="滚单成交"
      width="60%"
      :visible.sync="dialogBondsRollFormVisible"
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <real-enquiry-roll
        :overRow="overRow"
        :openRow="openRow"
        @change="handleBondsRollDialogVisible"
      ></real-enquiry-roll>
    </el-dialog>
    <el-dialog
      :title="`询价${action === 2 ? '修改' : ''}`"
      width="500px;"
      :visible.sync="dialogEnquiryFormVisible"
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <enquiry-edit
        :row="currentDifficultData"
        :action="action"
        @change="handleDialogVisible"
      ></enquiry-edit>
    </el-dialog>
    <el-dialog
      title="难成"
      width="500px;"
      :visible.sync="dialogEnquiryDifficultFormVisible"
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <enquiry-difficult
        :row="currentDifficultRow"
        @change="handleDialogDifficultVisible"
      ></enquiry-difficult>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import api from "@/api/kk_trade";
import apiAdmin from '@/api/kk_power_admin'
import apiBreak from '@/api/kk_break'
import DeliveryCanlendarUpdate from '@/components/DeliveryCanlendarUpdate.vue'
import RealEnquiryRoll from '@/components/RealEnquiryRoll.vue';
import EnquiryEdit from '@/components/EnquiryEdit.vue'
import EnquiryDifficult from '@/components/EnquiryDifficult.vue'
import { pageMixin } from '@/utils/pageMixin'
import { commMixin } from '@/utils/commMixin'
import config from '@/utils/config'
import * as util from '@/utils/util'
import { debounce } from '@/utils/debounce'
import moment from 'moment'
let tableCurrentRelativeNum = ''
let currentRelativeNum = ''
// 合并单元格
let relativeNum = ''
let relativeNumRoll = ''
// let relativeNumSameCount = 0
export default {
  mixins: [pageMixin, commMixin],
  props: {
    status: ''
  },
  components: {
    DeliveryCanlendarUpdate,
    EnquiryEdit,
    EnquiryDifficult,
    RealEnquiryRoll
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
        // counterParty: [
        //   { required: true, message: '交易对手必填', trigger: 'blur' }
        // ]
      },
      dealRows: {},
      dialogEnquiryFormVisible: false,
      enquiryH: '0',
      formLabelWidth: '0',
      // 难成
      dialogEnquiryDifficultFormVisible: false,
      currentDifficultRow: [],
      // 滚单
      dialogBondsRollFormVisible: false,
      overRow: {},
      openRow: {},
      // 修改对比数据
      diffTableData: [],
      diffTableHead: [
        { label: '修改项', prop: 'fieldName', width: '150', align: 'left', show: true },
        { label: '旧值', prop: 'oldValue', width: '200', align: 'left', show: true },
        { label: '新值', prop: 'newValue', width: '200', align: 'left', show: true }
      ],
      expandRollSheetCounts: {},
      // 难成新建
      currentDifficultData: {},
      action: 1
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
        this.calcRollSheetCanSee()
        this.loading = false;
      });
    },
    // 添加
    handleAddInquiry() {
      this.currentDifficultData = {}
      this.action = 1
      this.dialogEnquiryFormVisible = true
    },
    // 编辑
    handleEditEnqury(row) {
      this.currentDifficultData = JSON.parse(JSON.stringify(row))
      this.currentDifficultData.lockDirection = true
      this.action = 2
      this.dialogEnquiryFormVisible = true
    },
    // 接受
    handleAcceptClick: debounce(function (scope) {
      if (scope.row.relativeNum.indexOf('GD_') !== -1) {
        api.bondRollAccept({ relativeNum: scope.row.relativeNum }).then(response => {
          if (response && response.code === '00000') {
            // 根据相关单号查找优先成交行
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].relativeNum === scope.row.relativeNum && this.tableData[i].youxianLevel === 2) {
                let myScope = {}
                myScope.row = this.tableData[i]
                this.copy(myScope)
                this.$message({
                  message: '已接收并复制成功',
                  type: 'success'
                })
                break
              }
            }
            this.loadInitData()
          } else {
            this.$message({
              message: response.message,
              type: 'error'
            })
          }
        })
      } else {
        api.inquiryAccept({ usertradeId: scope.row.userTradeId }).then(response => {
          if (response && response.code === '00000') {
            this.copy(scope)
            this.$message({
              message: '已接收并复制成功',
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
      }
    }),
    // 拒收
    handleNotAcceptClick: debounce(function (scope) {
      if (scope.row.relativeNum.indexOf('GD_') !== -1) {
        api.bondRollReject({ relativeNum: scope.row.relativeNum }).then(response => {
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
      } else {
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
      }
    }),
    // 点击成交
    handleDealClick: debounce(function (row) {
      Promise.all([
        this.dialogDealFormVisible = true
      ]).then(() => {
        this.dealForm.deliveryTime = row.deliveryTime
        this.$refs.deliveryCanlendar.deliveryTime = row.deliveryTime
        if (moment(row.deliveryTime).format('YYYY-MM-DD') > moment(new Date()).format('YYYY-MM-DD')) {
          row.deliveryTime = moment(row.deliveryTime).format('YYYY-MM-DD')
        } else if (moment(row.deliveryTime).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD') && moment(moment(new Date()).format('YYYY-MM-DD HH:mm:ss')).isBefore(moment(new Date()).format('YYYY-MM-DD 15:30:00'))) {
          row.deliveryTime = moment(new Date()).format('YYYY-MM-DD')
        } else {
          this.$refs.deliveryCanlendar.getNextDealDay()
        }
        row.deliveryTime = moment(row.deliveryTime).format('YYYY-MM-DD')
        this.dealRows = row
        this.dealForm.usertradeId = row.userTradeId
        this.dealForm.price = row.price
        this.dealForm.volume = row.restVolume
        this.dealForm.remark = row.remark
        this.dealForm.counterParty = row.counterParty
        this.dealForm.contactPerson = row.contactPerson
        this.dealForm.contactType = row.contactType
      })
    }),
    // 表单提交
    submitForm: debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
                type: "warning",
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
            } else {
              this.$message({
                message: `${response.message}`,
                type: "error",
              })
            }
          });
        }
      })
    }),
    // 提交撤单申请
    handleInquiryCancelClick: debounce(function (scope) {
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
    }),
    // 确认撤单
    handleInquiryCancelConfirmClick: debounce(function (scope) {
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
    }),
    // 拒绝撤单
    handleInquiryCancelRejectionClick: debounce(function (scope) {
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
    }),
    // 同意成交
    handleInquiryDealConfirmClick: debounce(function (scope) {
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
    }),
    // 拒绝成交
    handleInquiryDealRejectionClick: debounce(function (scope) {
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
    }),
    // 难成撤单
    handleEnquiryDifficultCanncelClick: debounce(function (scope) {
      const self = this
      api.difficultAcheveCannel({ userTradeId: scope.row.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "难成已撤单",
            type: 'warning'
          })
          this.handlePopoverClose(
            scope,
            `popover-difficultcanncel-${scope.$index}`
          )
          self.loadInitData()
        }
      })
    }),
    // 保留
    handleEnquiryDifficultDotMoveClick: debounce(function (scope) {
      const self = this
      api.difficultStay({ userTradeId: scope.row.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "难成已保留",
            type: 'warning'
          })
          this.handlePopoverClose(
            scope,
            `popover-notmove-${scope.$index}`
          )
          self.loadInitData()
        }
      })
    }),
    // 交割日期
    handleDeliveryCanlendar(obj) {
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
        case "worstPrice":
          // 允许最差价格
          let worstPrice = row.price
          if (row.worstPrice) {
            if (row.direction === 'bond_0') {
              worstPrice = row.price - row.worstPrice / 100
            }
            if (row.direction === 'bond_1') {
              worstPrice = row.price + row.worstPrice / 100
            }
          }
          return util.moneyFormat(worstPrice, 4)
      }
      return row[column.property]
    },
    handleDialogVisible(obj) {
      this.dialogEnquiryFormVisible = obj.dialogVisible
      this.loadInitData()
    },
    // 难成新建
    handleDifficultNewEnqury(row) {
      const self = this
      this.action = 1
      api.difficultAcheveCannel({ userTradeId: row.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          // 锁住方向
          response.value.lockDirection = true
          Promise.all([
            self.currentDifficultData = JSON.parse(JSON.stringify(response.value))
          ]).then(() => {
            self.dialogEnquiryFormVisible = true
          })
        } else {
          self.$message({
            message: `${response.message}`,
            type: 'warning'
          })
        }
      })
    },
    // 难成点击事件
    handleEnquiryDifficultClick: debounce(function (row) {
      Promise.all([
        this.currentDifficultRow = JSON.parse(JSON.stringify(row))
      ]).then(() => {
        this.dialogEnquiryDifficultFormVisible = true
      })
    }),
    // 关闭难成弹出框
    handleDialogDifficultVisible(obj) {
      this.dialogEnquiryDifficultFormVisible = obj.dialogVisible
      this.loadInitData()
    },
    // 滚单成交颜色框
    tableRowClassName({ row, rowIndex }) {
      if (row.relativeNum && row.relativeNum.indexOf('GD_') !== -1) {
        if (rowIndex === 0) {
          tableCurrentRelativeNum = 'gd-odd-row'
          currentRelativeNum = row.relativeNum
        }
        if (currentRelativeNum !== row.relativeNum) {
          currentRelativeNum = row.relativeNum
          if (tableCurrentRelativeNum === 'gd-even-row') {
            tableCurrentRelativeNum = 'gd-odd-row'
          } else {
            tableCurrentRelativeNum = 'gd-even-row'
          }
        }
      } else {
        tableCurrentRelativeNum = ''
      }
      return tableCurrentRelativeNum
    },
    // 滚单成交弹出框
    handleRollDealClick(row) {
      // for (let i = 0; i < this.tableData.length; i++) {
      //   if (row.relativeNum === this.tableData[i].relativeNum) {
      //     this.overRow = JSON.parse(JSON.stringify(this.tableData[i + 1]))
      //     this.openRow = JSON.parse(JSON.stringify(this.tableData[i]))
      //     break
      //   }
      // }
      const self = this
      this.getDetailByRelativeNum(row.relativeNum, row.createBy, function () { self.dialogBondsRollFormVisible = true })
    },
    getDetailByRelativeNum(relativeNum, yanjiuyuanId, callback) {
      const self = this
      api.detailByRelativeNum({
        relativeNum,
        yanjiuyuanId
      }).then(response => {
        if (response && response.code === '00000') {
          this.overRow = response.value.ping
          this.openRow = response.value.kai
          if (parseInt(this.overRow.restVolume) === 0 && parseInt(this.openRow.restVolume) === 0) {
            self.dialogBondsRollFormVisible = false
            self.loadInitData()
          }
          if (callback) { callback() }
        } else {
          this.$message({
            message: `${response.message}`,
            type: 'error'
          })
        }
      })
    },
    handleBondsRollDialogVisible(obj) {
      // this.dialogBondsRollFormVisible = obj.dialogVisible
      if (!obj.refresh) {
        this.getDetailByRelativeNum(obj.relativeNum, obj.createBy)
      }
      this.loadInitData()
    },
    // 收起和展开事件处理
    handleExpandChange(row, expandedRows) {
      if (row.relativeNum.indexOf('GD_') !== -1) {
        if (expandedRows) {
          this.expandRollSheetCounts[row.relativeNum] += row.children.length
        } else {
          this.expandRollSheetCounts[row.relativeNum] -= row.children.length
        }
      }
    },
    calcRollSheetCanSee() {
      this.expandRollSheetCounts = {}
      let tempRelativeNum = ''
      let relativeNumCount = 0
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].relativeNum && this.tableData[i].relativeNum.indexOf('GD_') !== -1 && [2, 5, 6].indexOf(this.tableData[i].status) === -1) {
          if (tempRelativeNum === '' && this.tableData[i].relativeNum) {
            tempRelativeNum = this.tableData[i].relativeNum
          }
          if (tempRelativeNum === this.tableData[i].relativeNum) {
            relativeNumCount++
            relativeNumCount += this.tableData[i].children.length
            this.expandRollSheetCounts[tempRelativeNum] = relativeNumCount
          } else {
            this.expandRollSheetCounts[tempRelativeNum] = relativeNumCount
            relativeNumCount = 0
            tempRelativeNum = this.tableData[i].relativeNum
            relativeNumCount++
            relativeNumCount += this.tableData[i].children.length
          }
        } else {
          if (tempRelativeNum) {
            this.expandRollSheetCounts[tempRelativeNum] = relativeNumCount
          }
          relativeNumCount = 0
          tempRelativeNum = ''
        }
      }
    },
    // 合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex === 0) {
        // 解决重复渲染问题，清空之前的数据
        relativeNum = ''
        relativeNumRoll = ''
      }
      if (column.label === '滚单成交') {
        if (row.relativeNum && row.relativeNum.indexOf('GD_') !== -1) {
          // 1、根据当前finishCode查找个数作为合并行数
          // relativeNumSameCount = 0
          // let flag = false
          if (relativeNum.toString() !== row.relativeNum) {
            relativeNum = row.relativeNum
            // for (let i = 0; i < this.tableData.length; i++) {
            //   if (this.tableData[i].relativeNum === row.relativeNum) {
            //     relativeNumSameCount = relativeNumSameCount + 1
            //     flag = true
            //     relativeNumSameCount = relativeNumSameCount + this.tableData[i].children.length
            //   } else {
            //     if (flag) {
            //       break
            //     }
            //   }
            // }
            return {
              rowspan: this.expandRollSheetCounts[relativeNum],
              colspan: columnIndex
            }
          } else {
            return {
              rowspan: 0,
              colspan: columnIndex
            }
          }
        }
      }
      if (column.label === '操作') {
        if (row.relativeNum && row.relativeNum.indexOf('GD_') !== -1 && row.status === 0) {
          if (relativeNumRoll.toString() !== row.relativeNum) {
            relativeNumRoll = row.relativeNum
            return {
              rowspan: this.expandRollSheetCounts[relativeNumRoll],
              colspan: columnIndex
            }
          } else {
            return {
              rowspan: 0,
              colspan: columnIndex
            }
          }
        }
      }
    },
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
    // 更新记录表
    cellStyleUpdate(row, column, rowIndex, columnIndex) {
      if (row.column.label === '旧值') {
        return 'color:#2cad98'
      }
      if (row.column.label === '新值') {
        return 'color:#ec0000'
      }
    },
    // 同意违约续作
    handleAgreeBreakContinueClick: debounce(function (scope) {
      apiBreak.dealBreakRedoConfirm({ userTradeId: scope.row.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "已同意续作",
            type: 'success'
          })
        } else {
          this.$message({
            message: `${response.message}`,
            type: 'warning'
          })
        }
        this.loadInitData()
      })
    }),
    // 拒绝违约续作
    handleRejectBreakContinueClick: debounce(function (scope) {
      apiBreak.dealBreakRedoRejection({ userTradeId: scope.row.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "已拒绝续作",
            type: 'success'
          })
        } else {
          this.$message({
            message: `${response.message}`,
            type: 'warning'
          })
        }
        this.loadInitData()
      })
    }),
    // 违约续作内容对比
    handlViewBreakContinueContent: debounce(function (scope) {
      this.diffTableData = []
      apiBreak.dealBreakRedoCheckField({ userTradeId: scope.row.userTradeId }).then(response => {
        if (response && response.code === '00000' && response.value) {
          let diffTableData = [];
          if (response.value.compareResult.fieldlist && response.value.compareResult.fieldlist.length > 0) {
            let fieldlist = response.value.compareResult.fieldlist
            for (let i = 0; i < fieldlist.length; i++) {
              if (fieldlist[i] === 'deliveryTime') {
                diffTableData.push({ 'fieldName': config.bondsHead[fieldlist[i]]['label'], 'oldValue': moment(response.value.rt[fieldlist[i]]).format('YYYY-MM-DD'), 'newValue': moment(response.value.rt[fieldlist[i]]).format('YYYY-MM-DD') })
              } else {
                diffTableData.push({ 'fieldName': config.bondsHead[fieldlist[i]]['label'], 'oldValue': response.value.rt[fieldlist[i]], 'newValue': response.value.dto[fieldlist[i]] })
              }
            }
          }
          this.diffTableData = diffTableData
        }
      })
    }),
    // 同意修改
    handleAgreeEditClick: debounce(function (scope) {
      api.inquiryEditConfirm({ userTradeId: scope.row.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "已同意修改",
            type: 'success'
          })
        } else {
          this.$message({
            message: `${response.message}`,
            type: 'warning'
          })
        }
        this.loadInitData()
      })
    }),
    // 拒绝修改
    handleRejectEditClick: debounce(function (scope) {
      api.inquiryEditReject({ userTradeId: scope.row.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "已拒绝修改",
            type: 'success'
          })
        } else {
          this.$message({
            message: `${response.message}`,
            type: 'warning'
          })
        }
        this.loadInitData()
      })
    }),
    // 修改内容对比
    handlViewEditContent: debounce(function (scope) {
      this.diffTableData = []
      api.inquiryChangeCheck({ userTradeId: scope.row.userTradeId }).then(response => {
        if (response && response.code === '00000' && response.value) {
          let diffTableData = [];
          if (response.value.compareResult.fieldlist && response.value.compareResult.fieldlist.length > 0) {
            let fieldlist = response.value.compareResult.fieldlist
            for (let i = 0; i < fieldlist.length; i++) {
              if (fieldlist[i] === 'deliveryTime') {
                diffTableData.push({ 'fieldName': config.enquiryHead[fieldlist[i]]['label'], 'oldValue': moment(response.value.ut[fieldlist[i]]).format('YYYY-MM-DD'), 'newValue': moment(response.value.ut[fieldlist[i]]).format('YYYY-MM-DD') })
              } else {
                diffTableData.push({ 'fieldName': config.enquiryHead[fieldlist[i]]['label'], 'oldValue': response.value.ut[fieldlist[i]], 'newValue': response.value.dto[fieldlist[i]] })
              }
            }
          }
          this.diffTableData = diffTableData
        }
      })
    }),
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
