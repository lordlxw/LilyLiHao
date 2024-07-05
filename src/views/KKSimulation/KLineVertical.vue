<template>
  <div style="height: 100%; user-select: none;">
    <title-bar>
      <div slot="left_bar">
        <div class="head">
          <ul class="k-nav">
            <li class="noDrag" v-for="item in loopmethodskey" :class="{ active: klineactive == item }" :key="item">
              <div v-if="item === 'Ticket图'" @click="klinemethods[item]">
                <div class="el-dropdown-link">{{ item }}</div>
                <el-dropdown @command="handleTicket" trigger="click">
                  <span class="el-dropdown-link">
                    <i class="el-icon-arrow-down "></i>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="key in 10" :key="key" :command="key">{{ key }}日</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
              <div v-else-if="dailyLine" @click="klinemethods[item]">
                {{ item }}
              </div>
            </li>
            <li class="tscode">
              {{ tscode }}
            </li>
            <li class="tscode noDrag" v-if="tscode && favoriteTscodeIcon == favoriteTscodeIconList[0]"
              @click="handleFavorite">
              <span class="i-text">
                <i :class="favoriteTscodeIconList[0]"></i>
              </span>
            </li>
            <li class="tscode noDrag" v-if="tscode && favoriteTscodeIcon == favoriteTscodeIconList[1]"
              @click="handleFavoriteCancel">
              <span class="i-text" style="color: yellow">
                <i :class="favoriteTscodeIconList[1]"></i>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </title-bar>
    <div style="background-color: #202020; min-width: 480px; padding-top: 10px;height: calc(100% - 40px);">
      <div class="container" style="background-color: #202020">

        <!-- 中间 -->
        <div class="center">
          <div ref="refKline" class="kline"></div>
          <!-- 交易框 -->
          <div class="chatbox" v-loading="leftChangeLoad || loading">
            <el-tabs type="border-card" style="border-radius: 3px;" v-model="activeName">
              <el-tab-pane label="买（F1）" class="buy-form" name="buy">
                <el-form :inline="true" label-width="65px" :model="buyForm" ref="buyForm" :rules="buyFormRules">
                  <el-form-item label="价格">
                    <el-input-number v-model="buyForm.price" :precision="4" :step="0.001" placeholder="请输入价格"
                      @blur="keyDown" @focus="keyDownReview(), handleMaxWait('buyForm')"
                      class="pricew"></el-input-number>
                    <!-- <el-input-number v-model="buyForm.worstPrice" :step="0.05" class=" numbw"></el-input-number>
                    <span class="txt-green"> BP</span> -->
                  </el-form-item>
                  <el-form-item label="债券号">
                    <el-select v-model="buyForm.tscode" filterable placeholder="请选择" class="slt-user"
                      @change="handlerTscodeSelectWin">
                      <el-option v-for="item in tscodeList" :key="item.tscode" :label="item.tscode"
                        :value="item.tscode">
                        <span style="float: left">{{ item.tscode }}</span>
                        <span style="float: right;margin-left: 10px;">{{ item.bondname }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="交易量">
                    <!-- <el-input class="ipt-volume"  v-model.number="buyForm.volume" placeholder="请输入交易量"></el-input> -->

                    <el-input-number class="ipt-volume" v-model="buyForm.volume" :step="1000" :min="2000" :max="100000"
                      @focus="keyDownReview" @blur="keyDown" step-strictly></el-input-number>
                  </el-form-item>
                  <el-form-item label="中介">
                    <el-select v-model="buyForm.brokerid" clearable placeholder="系统选择" class="slt-user">
                      <el-option v-for="item in intendComerOption" :key="item.id" :label="item.company"
                        :value="item.brokerid">
                        <div style="width: 50px; float: left">{{ item.company }}</div>
                        <div class="text-left" style="width: 50px;">{{ item.target }}</div>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="交易员" v-if="false">
                    <el-select v-model="saleForm.tradeuserId" placeholder="请选择" class="slt-user">
                      <el-option v-for="item in tradeUsersOption" :key="item.userId" :label="item.nickName"
                        :value="item.userId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="交割日期">
                    <delivery-canlendar :w="`${canlendarW}px`" ref="buyDeliveryCanlendar"
                      @change="handleBuyDeliveryCanlendar"></delivery-canlendar>
                    <span class="txt-green">{{ buyForm.deliveryTimeMsg }}</span>
                  </el-form-item>
                  <el-form-item label=" ">
                    <el-button type="primary" v-if="setAuth('inquiry:insert')"
                      @click="submitForm('buyForm')">提交(enter)</el-button>
                  </el-form-item>

                </el-form>

              </el-tab-pane>
              <el-tab-pane label="卖（F2）" class="sale-form" name="sale">
                <el-form :inline="true" label-width="65px" :model="saleForm" ref="saleForm" :rules="saleFormRules">
                  <el-form-item label="价格">
                    <el-input-number v-model="saleForm.price" :precision="4" :step="0.001" placeholder="请输入价格"
                      @blur="keyDown" @focus="keyDownReview(), handleMaxWait('saleForm')"
                      class="pricew"></el-input-number>
                    <!-- <el-input-number v-model="buyForm.worstPrice" :step="0.05" class=" numbw"></el-input-number>
                    <span class="txt-green"> BP</span> -->
                  </el-form-item>
                  <el-form-item label="债券号">
                    <el-select v-model="saleForm.tscode" filterable placeholder="请选择" class="slt-user"
                      @change="handlerTscodeSelectWin">
                      <el-option v-for="item in tscodeList" :key="item.tscode" :label="item.tscode"
                        :value="item.tscode">
                        <span style="float: left">{{ item.tscode }}</span>
                        <span style="float: right;margin-left: 10px;">{{ item.bondname }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="交易量">
                    <!-- <el-input class="ipt-volume" v-model.number="saleForm.volume" placeholder="请输入交易量"></el-input> -->
                    <el-input-number class="ipt-volume" v-model="saleForm.volume" :step="1000" :min="2000"
                      @focus="keyDownReview" @blur="keyDown" step-strictly></el-input-number>
                  </el-form-item>
                  <el-form-item label="中介">
                    <el-select v-model="saleForm.brokerid" clearable placeholder="系统选择" class="slt-user">
                      <el-option v-for="item in intendComerOption" :key="item.id" :label="item.company"
                        :value="item.brokerid">
                        <span style="float: left">{{ item.company }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.target }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="交易员" v-if="false">
                    <el-select v-model="saleForm.tradeuserId" placeholder="请选择" class="slt-user">
                      <el-option v-for="item in tradeUsersOption" :key="item.userId" :label="item.nickName"
                        :value="item.userId">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="交割日期">
                    <delivery-canlendar :w="`${canlendarW}px`" ref="buyDeliveryCanlendar"
                      @change="handleSaleDeliveryCanlendar"></delivery-canlendar>
                    <span class="txt-green">{{ saleForm.deliveryTimeMsg }}</span>
                  </el-form-item>
                  <el-form-item label=" ">
                    <el-button v-if="setAuth('inquiry:insert')" @click="submitForm('saleForm')"
                      type="primary">提交(enter)</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
            <div class="shijia">
              <el-button
                v-if="(activeName === 'buy' && buyForm.isMarketRoll === false) || (activeName === 'sale' && saleForm.isMarketRoll === false)"
                type="default" size="mini" @click="handleGetPrice">市价</el-button>
            </div>
            <el-popover width="425" placement="bottom-start" trigger="manual" ref="popover-set"
              v-model="popoverSetVisible">
              <div class="default-set-wrapper">
                <div class="default-title">用户个性配置</div>
                <el-form :inline="true" ref="setForm" :model="setForm" :rules="setFormRules" :label-width="`65px`">
                  <el-form-item label="快速提交" prop="isKlineSubmit">
                    <el-switch v-model="setForm.isKlineSubmit"></el-switch>
                  </el-form-item>
                  <el-form-item label="显示日线" prop="dailyLine">
                    <el-switch v-model="setForm.dailyLine"></el-switch>
                  </el-form-item>
                  <el-form-item label="交易量" prop="defVolume">
                    <!-- <el-slider style="padding-left: 10px;" v-model="setForm.volume" :step="1000" :min="2000" :max="10000" show-stops>
                  </el-slider> -->
                    <el-input-number v-model="setForm.defVolume" :step="1000" :min="2000" @focus="keyDownReview"
                      @blur="keyDown" step-strictly></el-input-number>
                  </el-form-item>
                  <el-form-item label="看板背景" prop="klineColor">
                    <el-color-picker v-model="setForm.klineColor"></el-color-picker>
                  </el-form-item>
                  <!-- <el-form-item label="快速提交">
                  <el-checkbox label="是" v-model="setForm.quickSubmit" name="quickSubmit"></el-checkbox>
                </el-form-item> -->
                  <el-form-item label=" " style="width: max-content;">
                    <el-button type="primary" @click="submitForm('setForm')">保存默认设置</el-button>
                    <el-button type="default" @click="popoverSetVisible = false">取消</el-button>
                  </el-form-item>
                </el-form>
              </div>
              <div slot="reference" class="txt-white chat-set" @click="popoverSetVisible = !popoverSetVisible">
                <i class="el-icon-setting"></i>
              </div>
            </el-popover>
          </div>
          <div class="right-group">
            <!-- 及期卖出 -->
            <div class="r-out" style="height: 120px" v-loading="leftChangeLoad">
              <el-scrollbar v-if="businessOutList && businessOutList.length > 0">
                <ul>
                  <li v-for="(item, index) in businessOutList" :key="index"
                    :title="item.volumecomment ? item.volumecomment : item.volume"
                    style="height: 20px; line-height: 20px" @dblclick="changeForm(item.price, item.brokerid)">
                    <span>{{
                      item.brokerName
                    }}</span>
                    <span style="flex: 1" class="ellipsis">
                      {{ item.volumecomment ? item.volumecomment : item.volume }}
                    </span>
                    <span class="txt-red">{{
                      item.price | moneyFormat(4)
                    }}</span>
                    <span>{{
                      item.updatetime
                    }}</span>
                  </li>
                </ul>
              </el-scrollbar>
              <!-- <el-skeleton v-else animated>
            <template #template>
              <el-skeleton-item v-for="item in 6" :key="item" class="custom-skeleton-item" />
            </template>
</el-skeleton> -->
            </div>
            <!-- 及期买入 -->
            <div class="r-in" style="height: 120px" v-loading="leftChangeLoad">
              <el-scrollbar v-if="businessInList && businessInList.length > 0">
                <ul>
                  <li v-for="(item, index) in businessInList" :key="index"
                    :title="item.volumecomment ? item.volumecomment : item.volume"
                    style="height: 20px; line-height: 20px" @dblclick="changeForm(item.price, item.brokerid)">
                    <span>{{
                      item.brokerName
                    }}</span>
                    <span style="flex: 1" class="ellipsis">
                      {{ item.volumecomment ? item.volumecomment : item.volume }}
                    </span>
                    <span class="txt-green">{{
                      item.price | moneyFormat(4)
                    }}</span>
                    <span>{{
                      item.updatetime
                    }}</span>
                  </li>
                </ul>
              </el-scrollbar>
              <!-- <el-skeleton v-else animated>
            <template #template>
              <el-skeleton-item v-for="item in 6" :key="item" class="custom-skeleton-item" />
            </template>
          </el-skeleton> -->
            </div>
            <!-- 交易 -->
            <div class="r-trans" v-loading="leftChangeLoad" :style="{ height: recordHeight }">
              <!-- <el-scrollbar v-if="transactionAllList.length > 0">
                <ul class="mt20" style="margin-top: 25px">
                  <li class="li-first" style="height: 25px; line-height: 25px">
                    <span class="colume1">方向</span>
                    <span class="colume2">价格</span>
                    <span class="colume3">中介</span>
                    <span class="colume4">交易时间</span>
                  </li>
                  <li v-for="(item, index) in transactionAllList" :key="index" class="trans_item" v-if="!item.unToday"
                    :class="funcSelectColor(item.dealtype)" style="height: 20px; line-height: 20px"
                    @dblclick="changeForm(item.tradeprice, item.brokerid)">
                    <span class="colume1"><span>{{ item.dealtype }}</span></span>
                    <span class="colume2">{{
                      item.tradeprice | moneyFormat(4)
                    }}</span>
                    <span class="colume3">{{ item.brokerName }}</span>
                    <span class="colume4">{{ item.tradetime }}</span>
                  </li>
                </ul>
              </el-scrollbar> -->
              <div style="height: 100%">
                <el-row :gutter="0" class="trans-header pr10">
                  <el-col :span="5">
                    <div class="grid-content txt-white">方向</div>
                  </el-col>
                  <el-col :span="6">
                    <div class="grid-content txt-white">价格</div>
                  </el-col>
                  <el-col :span="5">
                    <div class="grid-content txt-white">中介</div>
                  </el-col>
                  <el-col :span="8">
                    <div class="grid-content txt-white">交易时间</div>
                  </el-col>
                </el-row>
                <virtual-list class="trans-body custom-scrollbar " :data-key="'tradeid'" :extra-props="{ changeForm }"
                  :data-sources="transactionAllList" :data-component="itemComponent" :keeps="50">
                </virtual-list>
              </div>
            </div>
          </div>
        </div>
      </div>
      <audio controls ref="playAudio" style="display: none">
        <source src="@/assets/audio/1.wav" type="audio/wav" />
      </audio>
      <el-dialog :title="dialogVisible.title" :visible.sync="dialogVisible.show" width="300px"
        :before-close="() => { dialogVisible.show = false, loading = false }">
        <span>{{ dialogVisible.message }}</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible.show = false, loading = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible.fun()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="新建询价单" :visible.sync="dialogEnquiryAddVisible" width="40%" append-to-body
        :destroy-on-close="true" :close-on-click-modal="false">
        <enquiry-edit :row="currentDifficultData" @change="handleDialogEnquiryAddVisible"></enquiry-edit>
      </el-dialog>
      <el-dialog title="修改密码" :visible.sync="dialogUpdatePasswordVisible" width="30%" center append-to-body
        :destroy-on-close="true" :close-on-click-modal="false">
        <update-password @change="handleDialogUpdatePasswordVisible"></update-password>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import Router from '@/router'
import { mapGetters, mapMutations, mapState } from 'vuex'
import api from '@/api/kk_bond_pool'
import apiTrade from '@/api/kk_trade'
import apiKLine from '@/api/kk_kline'
import apiAdmin from '@/api/kk_power_admin'
import apiLogin from '@/api/kk_login'
import apiBonds from "@/api/kk_bonds"
import apiBreak from '@/api/kk_break'
import ComTscodeSelect from '@/components/ComTscodeSelect.vue'
import * as echarts from 'echarts'
import configUtil from '@/utils/config.js'
import * as util from '@/utils/util'
import { debounce } from '@/utils/debounce'
import Draggable from 'vuedraggable'
// import TradeEnquiry from '@/views/KKTrade/Enquiry.vue'
import EnquiryEdit from '@/components/EnquiryEdit.vue'
import UpdatePassword from '@/components/UpdatePassword.vue'
import DeliveryCanlendar from '@/components/DeliveryCanlendar.vue'
import { pageMixin } from '@/utils/pageMixin'
import { commMixin } from '@/utils/commMixin'
import config from '@/utils/config'
import VirtualList from 'vue-virtual-scroll-list'
import RTransItem from './RTransItem';
import moment from 'moment'
let lockReconnect = false
export default {
  mixins: [pageMixin, commMixin],
  components: {
    ComTscodeSelect,
    // TradeEnquiry,
    DeliveryCanlendar,
    EnquiryEdit,
    UpdatePassword,
    Draggable,
    VirtualList
  },
  data() {
    // 金额格式验证
    const moneyTest = async (rule, value, callback) => {
      if (!config.regExpSet.money.test(value)) {
        callback(new Error('大于0的格式-.----'))
      } else {
        callback()
      }
    }
    // 金额格式验证
    const floatTest = async (rule, value, callback) => {
      console.log(rule)
      if (!config.regExpSet.floatPrice.test(value)) {
        callback(new Error('大于0的格式-.--'))
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
      itemComponent: RTransItem,
      config,
      dialogVisible: {
        title: "提示",
        show: false,
        message: "请确认需要提交询价单？",
        fun: () => { }
      },
      // k线栏目
      klineactive: 'Ticket图',
      loopmethodskey: ['1分钟', '5分钟', '日线', 'Ticket图'],
      klinemethods: {
        '1分钟': () => {
          this.getKLine('1分钟')
        },
        '5分钟': () => {
          this.getKLine('5分钟')
        },
        '日线': () => {
          this.getKLine('日线')
        },
        'Ticket图': () => {
          this.getKLine('Ticket图')
        }
      },
      // K线定时器
      klineTimer: null,
      // 左侧所有债券码
      tscodeList: [],
      // 左侧收藏
      tscodeListFavorite: [],
      // 左侧激活的债券id
      activeTscode: '',
      favoriteTscodeIconList: ['el-icon-star-off', 'el-icon-star-on'],
      favoriteTscodeIcon: 'el-icon-star-off',
      // 左侧当前tab
      tabList: ['first', 'second', 'third'],
      activeTab: 'first',
      // 债券码(搜索)
      tscode: '',
      // k线分钟线参数
      starttime: '2020-10-01 18:00:00',
      endtime: '2092-11-01 08:00:00',
      startdate: '2020-10-01',
      enddate: '2092-11-01',
      noForward: null,
      data0: [],
      myChart: '',
      leftWith: '',
      leftFold: 'el-icon-s-fold',
      rightFold: 'el-icon-s-unfold',
      rightWith: '',
      widthList: {
        w50: 50,
        w60: 60,
        w80: 80,
        w100: 100,
        w120: 120
      },
      optionTSType: [],
      optionYear: [
        {
          value: '1',
          label: '1年'
        }, {
          value: '3',
          label: '3年'
        }, {
          value: '5',
          label: '5年'
        }, {
          value: '7',
          label: '7年'
        }, {
          value: '10',
          label: '10年'
        }, {
          value: '20',
          label: '20年'
        }, {
          value: '30',
          label: '30年'
        }
      ],
      tstype: '',
      tslength: '1',
      // 摆单数据
      // 近期买
      businessInList: [],
      // 近期卖
      businessOutList: [],
      // 远期卖
      businessForwardOutList: [],
      // 远期买
      businessForwardInList: [],
      // 买卖成交长度
      inOutLength: 26,
      // 所有
      businessAllList: [],
      // 交易数据
      transactionAllList: [],
      createSocketIO: null,
      createSocketEmitter: null,
      activeName: 'buy',
      // 询价单提交表单
      loading: false,
      saleForm: {
        // 交易类型
        direction: '卖',
        // 价格
        price: '',
        // 交易量
        volume: 2000,
        // 债券号
        tscode: '',
        // 交割速度
        deliverySpeed: 0,
        // 交割日期
        deliveryTime: '',
        // 交易员
        tradeuserId: '18',
        // 备注
        remark: '',
        // 快速交易
        quickSubmit: false,
        // 交割日期消息
        deliveryTimeMsg: '',
        // 允许浮动
        worstPrice: 0.1,
        // 等待时长
        maxWait: 0,
        // 是否开启市价滚动
        isMarketRoll: true,

        brokerid: null,
      },
      saleFormRules: {
        direction: [
          { required: true, message: '方向必选', trigger: 'blur' }
        ],
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
        tradeuserId: [
          { required: true, message: '交易员必选', trigger: 'change' }
        ],
        worstPrice: [
          { required: true, message: '允许浮动必填', trigger: 'blur' },
          { validator: floatTest, trigger: 'blur' }
        ]
      },
      saleFormPrice: '',
      buyForm: {
        // 交易类型
        direction: '买',
        // 价格
        price: '',
        // 交易量
        volume: 2000,
        // 债券号
        tscode: '',
        // 交割速度
        deliverySpeed: 0,
        // 交割日期
        deliveryTime: '',
        // 交易员
        tradeuserId: '18',
        // 备注
        remark: '',
        // 快速交易
        quickSubmit: false,
        // 交割日期消息
        deliveryTimeMsg: '',
        // 允许浮动
        worstPrice: 0.1,
        // 等待时长
        maxWait: 0,
        // 是否开启市价滚动
        isMarketRoll: true,
        brokerid: null
      },
      buyFormRules: {
        direction: [
          { required: true, message: '方向必选', trigger: 'blur' }
        ],
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
        tradeuserId: [
          { required: true, message: '交易员必选', trigger: 'change' }
        ],
        worstPrice: [
          { required: true, message: '允许浮动必填', trigger: 'blur' },
          { validator: floatTest, trigger: 'blur' }
        ]
      },
      canlendarW: 120,
      buyFormPrice: '',
      saleFormForwardPrice: '',
      buyFormForwardPrice: '',
      // 总差
      forwardDiffPrice: '',
      // 近差
      currentDiffPrice: '',
      setForm: {
        id: 0,
        defVolume: 2000,
        isKlineSubmit: false,
        klineColor: '#f0ffff',
        dailyLine: false,
        wins: ""
      },
      setFormRules: {
        volume: [
          { required: true, message: '交易量必填', trigger: 'blur' },
          { validator: plusAmountTest, trigger: 'blur' }
        ],
      },
      popoverSetVisible: false,
      // gridDataMsg: [],
      // dialogTableVisible: false,
      tradeUsersOption: [],
      intendComerOption: [],
      // 消息通知
      notifyRejection: {},
      // 交割日期选择
      pickerOptions: {},
      // 价格变动定时器
      timer: null,
      // socket timer
      socketTimer: null,
      // 难成撤单新建询价单
      dialogEnquiryAddVisible: false,
      currentDifficultData: {},
      // 修改密码
      dialogUpdatePasswordVisible: false,
      leftChangeLoad: false,
      isElectron: false,
      dailyLine: false,
      dataZoom: {
        start: 0,
        end: 100,
      }
    }
  },
  computed: {
    ...mapGetters({
      tscodeGlobal: 'getTscodeGlobal',
      // defaultSet: 'getDefaultSet',
      userInfo: 'getUserInfo'
    }),
    ...mapState({
      socketKLine: (state) => state.socketKLine,
    }),
    recordHeight: function () {
      return (window.innerHeight - 870) + 'px';
    }
  },
  watch: {
    activeTscode(newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal && this.socketKLine != null) {
          // socket.send(JSON.stringify({ "dataKey": newVal, "dataType": "tscode" }))
          // this.socketKLine.send(JSON.stringify({ "dataKey": "", "dataType": "rank" }))
          this.socketKLine.send(JSON.stringify({ "dataKey": newVal, "dataType": "sub_tscode" }))
          this.calcFavoriteIcon()
        }
      }
    }
  },
  created() {
    // if (!this.setAuth('kline:view')) {
    //   this.$router.push({ path: '/main' })
    // }
    // this.initFrameW('leftWith', 200)
    // this.initFrameW('rightWith', 360)
    this.keyDown()
    this.initSocket()
    if (window.v1) {
      this.isElectron = window.v1.isElectron()
    }
  },
  beforeDestroy() {
    this.keyDownReview()
    if (this.myChart != null) {
      this.myChart.dispose()
    }
    // 订阅事件记得要取消
    if (this.createSocketIO) {
      this.createSocketEmitter.removeListener('msgContent', this)
      this.createSocketIO.close()
    }
    this.socketKLine.close()
    this["SET_SOCKET_MAIN"](null)
    clearInterval(this.timer)
    this.timer = null
    clearInterval(this.socketTimer)
    this.socketTimer = null
    clearInterval(this.klineTimer)
    this.klineTimer = null
  },
  methods: {
    ...mapMutations(["SET_SOCKET_MAIN", "SET_SOCKET_KLINE"]),
    // 获取所有债券号相关信息
    getAllBondPool() {
      api.getAll({}).then(res => {
        if (res.code === '00000') {
          localStorage.setItem("tscodeAll", JSON.stringify(res.value))
          Promise.all([
            this.tscodeList = res.value
          ]).then(async () => {
            if (this.isElectron && this.activeTscode === '') {
              const response = await window.v1.getWinThis();
              this.activeTscode = this.tscode = response.data.tscode
            } else {
              if (this.tscodeGlobal !== '') {
                this.activeTscode = this.tscode = this.tscodeGlobal
              } else {
                this.activeTscode = this.tscode = this.tscodeList.length > 0 ? this.tscodeList[0].tscode : ''
              }
            }

            this.klinemethods[this.klineactive]()
            // 初始化实时交易数据
            this.initRightTransactionList()
          })
        }
      })
    },
    getByCodeBondPool() {
      api.getByCode({
        tscode: this.tscode
      }).then(res => {
        console.log(res)
      })
    },
    getByCodeLikeBondPool() {
      api.getByCodeLike({
        tscode: this.tscode
      }).then(res => {

      })
    },
    // 一分钟线
    async getKLine(klinekey) {
      console.log(klinekey)
      clearInterval(this.klineTimer);
      const upColor = '#ec0000';
      const upBorderColor = '#8A0000';
      const downColor = '#00da3c';
      const downBorderColor = '#008F28';
      this.data0 = []
      this.klineactive = klinekey;
      let option = {
        darkMode: true,
        backgroundColor: 'transparent',
        gradientColor: [],
        trigger: "axis",
        axisPointer: {
          type: "cross", // 十字准星指示器,
          link: [
            {
              xAxisIndex: [0, 1]
            }
          ]
        },
        tooltip: {
          show: true,
          trigger: 'axis',
          position: function (pos, params, el, elRect, size) {
            const obj = {
              top: 10
            };
            if (pos[0] < (size.viewSize[0] / 2)) {
              obj.right = 80
            } else {
              obj.left = 30
            }
            return obj;
          },
          axisPointer: {
            type: 'cross',
            lineStyle: {
              opacity: 1
            },
            crossStyle: {
              opacity: 1
            }
          },
        },
        padding: 10,
        textStyle: {
          color: "#000"
        },
        grid: {
          left: '5px',
          right: '5px',
          bottom: '5px',
          top: 10,
          containLabel: true,
          show: false,
        },
        visualMap: {
          show: false,
          seriesIndex: 0,
          dimension: 2,
          pieces: [
            {
              value: 1,
              color: downColor
            },
            {
              value: -1,
              color: upColor
            }
          ]
        },
        xAxis: [{
          type: 'category',
          data: [],
          boundaryGap: true,
          axisLine: {
            show: false,
            onZero: false,
          },
          splitLine: { show: false },
          min: 'dataMin',
          max: 'dataMax',
          axisLabel: {
            fontWeight: 'bold',
            fontSize: '0.2rem',
          },
        }],
        yAxis: [{
          scale: true,
          position: 'right',
          boundaryGap: true,
          axisLine: {
            onZero: false,
          },
          axisLabel: {
            // inside: true,
            // position: 'outer',
            // interval: 2,
            // fontWeight: 'bold',
            // formatter: (val, key) => {
            //   if (key % 2 === 1) {
            //     return val
            //   }
            // },
            fontSize: '0.2rem',
            position: 'outer',
            interval: 2,
            fontWeight: 'bold',
          },
          splitArea: {
            show: true,
            interval: '1',
            areaStyle: {
              color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)'],
              opacity: 1,
            },
          },
        }],
        dataZoom: [
          {
            type: 'inside',
            start: this.dataZoom.start,
            end: this.dataZoom.end
          },
          {
            show: false,
            type: 'slider',
            top: '90%',
            start: this.dataZoom.start,
            end: this.dataZoom.end
          }
        ],
        series: [
          {
            name: klinekey + "线",
            type: "line",
            data: [],
            symbol: "none", // 无标记图案
            lineStyle: {
              width: 2,
              color: 'rgba(0,128,0,1)'
            },
          }
        ]
      }
      let result = null;
      if (klinekey === '1分钟') {
        result = await apiKLine.getKLineMinute({
          tscode: this.tscode,
          starttime: this.starttime,
          endtime: this.endtime,
          noForward: this.noForward
        })

        this.klineTimer = setInterval(() => {
          this.klinemethods[this.klineactive]()
        }, 60 * 1000)
      } else if (klinekey === '5分钟') {
        result = await apiKLine.getKLineFiveMinute({
          tscode: this.tscode,
          starttime: this.starttime,
          endtime: this.endtime,
          noForward: this.noForward
        })

        this.klineTimer = setInterval(() => {
          this.klinemethods[this.klineactive]()
        }, 5 * 60 * 1000)
      } else if (klinekey === 'Ticket图') {
        if (this.transactionAllList && this.transactionAllList.length > 0) {
          result = {
            code: '00000',
            value: [...this.transactionAllList].reverse()
          }
        }
      } else if (klinekey === '日线') {
        result = await apiKLine.getKLineDay({
          tscode: this.tscode,
          startdate: this.startdate,
          enddate: this.enddate,
          noForward: this.noForward
        })

        option.animation = false;
        option.grid = [{
          left: '0px',
          right: '0px',
          bottom: '25%',
          top: '2%',
          show: false,
        }, {
          left: '0%',
          right: '0px',
          bottom: '1%',
          top: '80%',
        }]

        this.klineTimer = setInterval(() => {
          this.klinemethods[this.klineactive]()
        }, 30 * 1000)
      }
      if (result && result.code === '00000') {
        const chartDom = this.$refs.refKline
        this.myChart = echarts.init(chartDom)

        if (klinekey === 'Ticket图') {
          const rawData = result.value;
          const categoryData = []
          const values = []
          const volumes = []
          const minData = [];
          for (let i = 0; i < rawData.length; i++) {
            categoryData.push(rawData[i]['tradedate'])
            minData.push([rawData[i]['tradedate'], util.moneyFormat(rawData[i].tradeprice, 4), util.moneyFormat(rawData[i].netprice, 4), rawData[i].tscode, rawData[i].dealtype, rawData[i].brokerName])
          }
          this.data0 = {
            categoryData,
            values,
            volumes,
            minData
          }

          option.xAxis[0].data = this.data0.categoryData
          option.series[0].data = this.data0.minData
          option.tooltip.formatter = function (params) {
            params = params[0] // 开盘收盘最低最高数据汇总
            let currentItemData = params.data;
            const therolineMarker = `<span style="display:inline-block;margin-right:4px;width:10px;height:3px;line-height:3px;vertical-align:middle;background-color:rgba(0,128,0,1);"></span>`
            return `${params.name}<br>
               ${therolineMarker} ${klinekey}线<br>
              方向：${currentItemData[4]}<br>
              价格：${currentItemData[1]}<br>
              中介：${currentItemData[5]} <br>
              债券：${currentItemData[3]}<br>`
            // 'MA5:' + ma5
          }
        } else if (klinekey === '日线') {
          this.data0 = this.splitData(result.value, 'tradedate')
          option.xAxis = [{
            type: 'category',
            data: this.data0.categoryData,
            boundaryGap: true,
            axisLine: {
              show: false,
              onZero: false,
            },
            splitLine: { show: false },
            min: 'dataMin',
            max: 'dataMax',
            axisLabel: {
              fontWeight: 'bold',
            },
          }, {
            type: 'category',
            gridIndex: 1,
            data: this.data0.categoryData,
            boundaryGap: true,
            splitLine: { show: false },
            axisLabel: { show: false },
            axisTick: { show: false },
            axisLine: { onZero: false },
            // axisLine: { lineStyle: { color: '#ec0000' } },
            min: 'dataMin',
            max: 'dataMax',
            axisPointer: {
              type: 'shadow',
              label: { show: false },
              triggerTooltip: true,
              handle: {
                show: false,
                margin: 30,
                // color: '#B80C00'
              }
            }
          }]
          option.yAxis = [{
            scale: true,
            position: 'right',
            boundaryGap: false,
            axisLine: {
              onZero: false,
            },
            splitLine: {
              show: true,
            },
            axisLabel: {
              inside: true,
              formatter: (val, key) => {
                if (key % 2 === 1) {
                  return val
                }
              },
              fontWeight: 'bold',
            },
            splitArea: {
              show: true,
              interval: '1',
              areaStyle: {
                color: ['rgba(250,250,250,0.3)', 'rgba(200,200,200,0.3)'],
                opacity: 1,
              },
            },
          }, {
            scale: true,
            position: 'right',
            gridIndex: 1,
            splitNumber: 2,
            axisLabel: { show: false },
            axisLine: { show: false },
            axisTick: { show: false },
            splitLine: { show: false }
          }]
          option.series = [{
            name: '交易量',
            type: 'bar',
            xAxisIndex: 1,
            yAxisIndex: 1,
            data: this.data0.volumes
          },
          {
            name: '日线',
            type: 'candlestick',
            data: this.data0.values,
            legendHoverLink: false,
            itemStyle: {
              color: upColor,
              color0: downColor,
              borderColor: upBorderColor,
              borderColor0: downBorderColor,
              opacity: 1
            },
          }]
        } else {
          this.data0 = this.splitData(result.value, 'endtime')
          option.xAxis[0].data = this.data0.categoryData
          option.series[0].data = this.data0.minData
          option.tooltip.formatter = function (params) {
            params = params[0] // 开盘收盘最低最高数据汇总
            let currentItemData = params.data;
            return params.name + '<br>' +
              params.marker + " " + klinekey + '线' + '<br>' +
              '开盘：' + currentItemData[1] + '<br>' +
              '收盘：' + currentItemData[2] + '<br>' +
              '最低：' + currentItemData[3] + '<br>' +
              '最高：' + currentItemData[4] + '<br>'
            // 'MA5:' + ma5
          }
        }
        option && this.myChart.setOption(option, true)

        let that = this;
        that.myChart.on('dataZoom', function (event) {
          if (event.batch) {
            that.dataZoom.start = event.batch[0].start
            that.dataZoom.end = event.batch[0].end
          } else {
            that.dataZoom.start = event.start
            that.dataZoom.end = event.end
          }
        })
      }
    },
    // 收藏列表
    favoriteList() {
      api.favoriteList().then(response => {
        if (response && response.code === '00000') {
          const tscodeAll = JSON.parse(localStorage.getItem('tscodeAll') || [])
          if (tscodeAll.length > 0) {
            let arr = response.value
            this.tscodeListFavorite = tscodeAll.filter((item) => arr.find(a => a.tscode === item.tscode));
          } else {
            this.tscodeListFavorite = response.value
          }
          this.calcFavoriteIcon()
        }
      })
    },
    // 计算收藏按钮样式
    calcFavoriteIcon() {
      for (let i = 0; i < this.tscodeListFavorite.length; i++) {
        if (this.tscodeListFavorite[i].tscode === this.activeTscode) {
          this.favoriteTscodeIcon = this.favoriteTscodeIconList[1]
          break;
        } else {
          this.favoriteTscodeIcon = this.favoriteTscodeIconList[0]
        }
      }
      if (this.tscodeListFavorite.length === 0) {
        this.favoriteTscodeIcon = this.favoriteTscodeIconList[0]
      }
    },
    // 收藏事件
    handleFavorite: debounce(function () {
      if (this.activeTscode !== '') {
        api.favoriteAdd({
          tscode: this.activeTscode
        }).then(response => {
          if (response && response.code === '00000') {
            this.$message({
              message: '收藏成功',
              type: 'success'
            });
          }
          this.favoriteList()
        })
      } else {
        this.$message('请选择一条收藏项');
      }
    }),
    // 取消收藏事件
    handleFavoriteCancel: debounce(function () {
      if (this.activeTscode !== '') {
        api.favoriteDelete({
          tscode: this.activeTscode
        }).then(response => {
          if (response && response.code === '00000') {
            this.$message({
              message: '成功取消收藏',
              type: 'success'
            });
            this.favoriteList()
          }
        })
      } else {
        this.$message('请选择一条取消收藏项');
      }
    }),
    // 下拉框选择债券
    handlerTscodeSelect(obj) {
      Promise.all([
        this.activeTscode = this.tscode = obj.value
      ]).then(res => {
        this.calcFavoriteIcon()
        this.klinemethods[this.klineactive]()
        this.initRightTransactionList()
        // this.scrollToTscode(this.activeTscode)
      })
    },
    handlerTscodeSelectWin(val) {
      this.leftChangeLoad = true;
      Promise.all([
        this.activeTscode = this.tscode = val
      ]).then(res => {
        if (this.isElectron) {
          window.v1.setArgs({ data: { tscode: this.activeTscode } });
        }
        this.calcFavoriteIcon()
        this.initRightTransactionList()
        this.klinemethods[this.klineactive]()
        // this.scrollToTscode(this.activeTscode)
        setTimeout(() => {
          this.leftChangeLoad = false;
        }, 100)
      })
    },
    scrollToTscode(activeTscode) {
      console.log("============================", activeTscode)
      const item = this.$refs.scrollTscodes.wrap; // 获取滚动条的 DOM 容器
      const element = item.getElementsByClassName("left-tabs-item")[10]; // 获取指定索引的列表项
      if (element) {
        const scrollTop = element.offsetTop; // 计算需要滚动的距离
        this.$refs.scrollTscodes.setScrollTop(scrollTop); // 使用 setScrollTop 方法滚动到指定位置
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    },
    // 债券点击事件
    handlerTscode: debounce(function (item) {
      this.leftChangeLoad = true;
      Promise.all([
        this.activeId = item.id,
        this.tscode = item.tscode,
        this.activeTscode = item.tscode,
        this.activeTab === this.tabList[0] ? this.$refs.refComTscodeSelect.value = '' : ''
      ]).then(() => {
        this.klinemethods[this.klineactive]()
        this.calcFavoriteIcon()
        this.initRightTransactionList()
        setTimeout(() => {
          this.leftChangeLoad = false;
        }, 100)
      })
    }),
    // 图表数据分类方法
    splitData(rawData, xAxisKey) {
      const categoryData = []
      const values = []
      const volumes = []
      const minData = [];
      for (let i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i][xAxisKey])
        values.push([util.moneyFormat(rawData[i].openprice, 4), util.moneyFormat(rawData[i].closeprice, 4), util.moneyFormat(rawData[i].lowprice, 4), util.moneyFormat(rawData[i].highprice, 4), rawData[i].volume])
        volumes.push([i, rawData[i].volume, rawData[i].openprice > rawData[i].closeprice ? 1 : -1])
        minData.push([rawData[i][xAxisKey], util.moneyFormat(rawData[i].openprice, 4), util.moneyFormat(rawData[i].closeprice, 4), util.moneyFormat(rawData[i].lowprice, 4), util.moneyFormat(rawData[i].highprice, 4), rawData[i].volume])
      }
      return {
        categoryData,
        values,
        volumes,
        minData
      }
    },
    calculateMA(dayCount, data0) {
      var result = [];
      for (var i = 0, len = data0.values.length; i < len; i++) {
        if (i < dayCount) {
          result.push('-');
          continue;
        }
        var sum = 0;
        for (var j = 0; j < dayCount; j++) {
          sum += +data0.values[i - j][1];
        }
        result.push(util.moneyFormat(sum / dayCount, 4));
      }
      return result;
    },
    // 键盘监听
    keyDown() {
      const self = this
      // 监听键盘按钮
      document.onkeydown = function (event) {
        var e = event || window.event
        var keyCode = e.keyCode || e.which
        console.log("keyCode: ", keyCode)

        const setPrice = setp => {
          if (self.activeName === 'buy') {
            self.buyForm.price = (self.buyForm.price * 1000 + setp) / 1000;
          }
          if (self.activeName === 'sale') {
            self.saleForm.price = (self.saleForm.price * 1000 + setp) / 1000;
          }
        }
        const volumeKeys = {
          96: 10000,
          97: 1000,
          98: 2000,
          99: 3000,
          100: 4000,
          101: 5000,
          102: 6000,
          103: 7000,
          104: 8000,
          105: 9000,
          38: () => { return setPrice(1) },
          40: () => { return setPrice(-1) },
          13: () => {
            if (self.activeName === 'buy') {
              self.submitForm('buyForm')
            }
            if (self.activeName === 'sale') {
              self.submitForm('saleForm')
            }
          },
          112: () => {
            self.activeName = 'buy'
            if (e && e.preventDefault) {
              e.preventDefault()
            } else {
              window.event.returnValue = false
            }
          },
          113: () => {
            self.activeName = 'sale'
            if (e && e.preventDefault) {
              e.preventDefault()
            } else {
              window.event.returnValue = false
            }
          }
        }

        // const key = Object.keys(volumeKeys).filter(key => key === keyCode).find(num => true);
        if (keyCode >= 96 && keyCode <= 105) {
          self.saleForm.volume = volumeKeys[keyCode]
          self.buyForm.volume = volumeKeys[keyCode]
        } else if (volumeKeys[keyCode] instanceof Function) {
          volumeKeys[keyCode]();
        }
      }
    },
    keyDownReview() {
      document.onkeydown = function (event) {
        var e = event || window.event
        e.returnValue = true
      }
    },
    // 左侧面板关闭打开
    handleLeftOpenOrClose: debounce(function () {
      if (this.leftFold === 'el-icon-s-fold') {
        this.leftFold = 'el-icon-s-unfold'
        this.leftWith = 0
      } else {
        this.leftFold = 'el-icon-s-fold'
        this.leftWith = this.returnFrameW(200)
      }
      setTimeout(() => {
        this.myChart.resize()
      }, 50)
    }),
    // 右侧面板关闭打开
    handleRightOpenOrClose: debounce(function () {
      if (this.rightFold === 'el-icon-s-unfold') {
        this.rightFold = 'el-icon-s-fold'
        this.rightWith = '0'
      } else {
        this.rightFold = 'el-icon-s-unfold'
        this.rightWith = this.returnFrameW(360)
      }
      setTimeout(() => {
        this.myChart.resize()
      }, 50)
    }),
    // 初始化债券类型
    initTSType() {
      Promise.all([
        this.optionTSType = []
      ]).then(() => {
        api.getPoolType().then(res => {
          if (res.code === '00000') {
            this.optionTSType = this.handleTSType(res.value)
          }
        })
      })
    },
    // 债券类型
    handleTSType(array) {
      const tsType = []
      array.forEach(element => {
        tsType.push({ value: element.id, label: element.tstype })
      });
      return tsType
    },
    handleChangeTSType() {
      this.$refs.refComTscodeSelect.value = ''
      api.getAllByType({
        tstype: this.tstype,
        tslength: this.tslength
      }).then(res => {
        if (res.code === '00000') {
          const tscodeAll = JSON.parse(localStorage.getItem('tscodeAll') || [])
          Promise.all([
            // this.tscodeList = res.value
            this.tscodeList = tscodeAll.filter((item) => res.value.find(a => a.tscode === item.tscode))
          ]).then(() => {
            Promise.all([
              this.activeTscode = this.tscode = this.tscodeList.length > 0 ? this.tscodeList[0].tscode : ''
            ]).then(() => {
              if (this.tscode !== '') {
                this.calcFavoriteIcon()
                this.klinemethods[this.klineactive]()
                this.initRightTransactionList()
              } else {
                this.data0 = ''
                this.myChart.clear()
                this.myChart.dispose()
              }
            })
          })
        }
      })
    },
    // 左侧tab切换
    handleClickTab(tab, event) {
      this.activeTab = this.tabList[tab.index];
      if (tab.index === '1') {
        this.favoriteList()
      }
    },
    // 右侧
    // 卖出，买入数据
    initRightBusinessList(params) {
      const self = this
      api.businessList(params).then(res => {
        if (res.code === '00000') {
          switch (params.bidtype) {
            case 1:
              self.businessOutList = res.value
              self.buyForm.price = self.funcGetBestPrice('max', res.value, true)
              self.buyFormForwardPrice = self.buyFormPrice = self.funcGetBestPrice('max', res.value, false)
              break;
            case 0:
              self.businessInList = res.value
              self.saleForm.price = self.funcGetBestPrice('min', res.value, true)
              self.saleFormForwardPrice = self.saleFormPrice = self.funcGetBestPrice('min', res.value, false)
              break;
            default:
              self.businessAllList = res.value
          }
        }
        this.calcuDiffPrice(1)
        this.calcuDiffPrice(2)
      })
    },
    // 右侧
    // 实时成交数据
    initRightTransactionList() {
      api.transactionList({
        tscode: this.activeTscode
      }).then(res => {
        if (res.code === '00000') {
          this.transactionAllList = res.value
          this.initCommonData()

          if (this.klineactive === 'Ticket图') {
            this.klinemethods[this.klineactive]()
          }
        }
      })
    },
    handleTicket(command) {
      this.leftChangeLoad = true;
      Promise.all([
        this.transactionAllList = []
      ]).then(async () => {
        if (command === 1) {
          const res = await api.transactionList({ tscode: this.activeTscode })
          if (res.code === '00000') {
            this.transactionAllList = res.value
            if (this.klineactive === 'Ticket图') {
              this.klinemethods[this.klineactive]()
            }
          }
        } else {
          const currentDate = new Date();
          currentDate.setDate(currentDate.getDate() + 1);
          const dtEnd = currentDate.toISOString().split('T')[0];
          currentDate.setDate(currentDate.getDate() - command);
          const dtStart = currentDate.toISOString().split('T')[0]; // 格式化为 "YYYY-MM-DD"
          const res = await api.tradehistory({
            tscode: this.activeTscode,
            dtStart,
            dtEnd,
            noForward: false
          })

          if (res.code === '00000') {
            res.value.forEach(item => {
              item.unToday = new Date(item.tradedate).toDateString() !== new Date().toDateString()
            })
            this.transactionAllList = [...res.value].reverse()
            if (this.klineactive === 'Ticket图') {
              this.klinemethods[this.klineactive]()
            }
          }
        }
        this.initCommonData()
        this.leftChangeLoad = false;
      })
    },
    // 初始化公共数据
    initCommonData() {
      // 初始化买卖数据,bidtype:0，买单；1，卖单
      // 初始化买卖数据
      this.initRightBusinessList({
        tscode: this.activeTscode,
        bidtype: 1
      })
      this.initRightBusinessList({
        tscode: this.activeTscode,
        bidtype: 0
      })
      // 初始化表单数据
      this.buyForm.tscode = this.activeTscode
      this.saleForm.tscode = this.activeTscode
      this.$store.commit('SET_TSCODE_GLOBAL', { tscodeGlobal: this.activeTscode })
    },
    // 根据主动方显示颜色
    funcSelectColor(dealtype) {
      switch (dealtype) {
        case 'GVN':
          return 'txt-red'
        case 'TKN':
          return 'txt-green'
        case 'TRD':
        case 'REF':
          return 'txt-orange'
        default:
          return 'txt-orange'
      }
    },
    changeForm(price, brokerid) {
      if (this.activeName === 'buy') {
        this.buyForm.price = price
        this.buyForm.brokerid = brokerid
      } else if (this.activeName === 'sale') {
        this.saleForm.price = price
        this.saleForm.brokerid = brokerid
      }
    },
    // 买卖最优值(type:min最小，type:max最大;arr:初始数组;flag:true参与最近一笔交易进行计算)
    funcGetBestPrice(type, arr, flag) {
      const self = this
      switch (type) {
        case 'min':
          let minVal = ''
          for (let i = 0; i < arr.length; i++) {
            if (i === 0) {
              minVal = arr[i].price
              self.saleForm.remark = arr[i].tscode + " " + arr[i].brokerName + " " + (arr[i].volumecomment ? arr[i].volumecomment : arr[i].volume)
            } else {
              if (arr[i].price < minVal) {
                minVal = arr[i].price
                self.saleForm.remark = arr[i].tscode + " " + arr[i].brokerName + " " + (arr[i].volumecomment ? arr[i].volumecomment : arr[i].volume)
              }
            }
          }
          // 与最近一笔交易对比
          if (flag && this.transactionAllList.length > 0 && this.transactionAllList[0].tradeprice < minVal) {
            minVal = this.transactionAllList[0].tradeprice
          }
          return minVal
        // return Math.min.apply(Math, arr.map(item => {
        //   self.saleForm.remark = item.tscode + " " + item.brokerName + " " + (item.volumecomment ? item.volumecomment : item.volume)
        //   return item.price
        // }))
        case 'max':
          let maxVal = ''
          for (let i = 0; i < arr.length; i++) {
            if (i === 0) {
              maxVal = arr[i].price
              self.buyForm.remark = arr[i].tscode + " " + arr[i].brokerName + " " + (arr[i].volumecomment ? arr[i].volumecomment : arr[i].volume)
            } else {
              if (arr[i].price > maxVal) {
                maxVal = arr[i].price
                self.buyForm.remark = arr[i].tscode + " " + arr[i].brokerName + " " + (arr[i].volumecomment ? arr[i].volumecomment : arr[i].volume)
              }
            }
          }
          // 与最近一笔交易对比
          if (flag && this.transactionAllList.length > 0 && this.transactionAllList[0].tradeprice > maxVal) {
            maxVal = this.transactionAllList[0].tradeprice
          }
          return maxVal
        // return Math.max.apply(Math, arr.map(item => {
        //   self.buyForm.remark = item.tscode + " " + item.brokerName + " " + (item.volumecomment ? item.volumecomment : item.volume)
        //   return item.price
        // }))
      }
    },
    // 交易量加法函数
    funcVolumeAdd(formType, val) {
      if (val === 0) {
        this[formType].volume = 0
      } else {
        this[formType].volume = (this[formType].volume ? parseInt(this[formType].volume) : 0) + val
      }
    },
    // 交割速度方法
    funcDeliverySpeed(formType, val) {
      if (this[formType].deliverySpeed === val) {
        return 'btn-active'
      }
      return ''
    },
    // 点击交易速度
    handleDelivertySpeed(formType, val) {
      this[formType].deliverySpeed = val
    },
    // 快速提交
    quickSubmit(formName, dostandard = true) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (dostandard) {
            const transPrice = this.transactionAllList.length > 0 ? util.moneyFormat(this.transactionAllList[0].tradeprice, 4) : 0;
            let standard = transPrice;
            console.log(transPrice)
            if (formName === 'buyForm') {
              const inPrice = this.businessInList.length > 0 ? (this.businessInList.length > 1 ? (this.businessInList[0].volume.includes("+") ? util.moneyFormat(this.businessInList[0].price, 4) : util.moneyFormat(this.businessInList[1].price, 4)) : util.moneyFormat(this.businessInList[0].price, 4)) : 0;
              standard = inPrice < transPrice ? inPrice : transPrice

              if (standard - util.moneyFormat(this[formName].price, 4) > 0.0025) {
                this.dialogVisible.title = "警告"
                this.dialogVisible.message = "当前下单价格与市价偏离超过0.25BP!是否继续？"
                this.dialogVisible.fun = () => { this.quickSubmit("buyForm", false) }
                this.dialogVisible.show = true;
                return;
              }
            } else {
              const outPrice = this.businessOutList.length > 0 ? (this.businessOutList.length > 1 ? (this.businessOutList[0].volume.includes("+") ? util.moneyFormat(this.businessOutList[0].price, 4) : util.moneyFormat(this.businessOutList[1].price, 4)) : util.moneyFormat(this.businessOutList[0].price, 4)) : 0;
              standard = outPrice > transPrice ? outPrice : transPrice

              if (util.moneyFormat(this[formName].price, 4) - standard > 0.0025) {
                this.dialogVisible.title = "警告"
                this.dialogVisible.message = "当前卖出价格与市价偏离超过0.25BP!是否继续？"
                this.dialogVisible.fun = () => { this.quickSubmit("saleForm", false) }
                this.dialogVisible.show = true;
                return;
              }
            }
          }

          apiTrade.inquirySheetAdd({
            // 交割速度
            deliverySpeed: this[formName].deliverySpeed,
            // 交割日期
            deliveryTime: util.dateFormat(this[formName].deliveryTime, "YYYY-MM-DD"),
            // 买还是卖
            direction: this[formName].direction === '买' ? 'bond_0' : 'bond_1',
            // 成交价格
            price: util.moneyFormat(this[formName].price, 4),
            // 交易员
            tradeuserId: this[formName].tradeuserId,
            // 债券编号
            tscode: this[formName].tscode,
            // 成交量
            volume: this[formName].volume,
            // 备注
            remark: this[formName].remark,
            // 允许浮动
            worstPrice: this[formName].worstPrice,

            brokerId: this[formName].brokerid

          }).then(res => {
            const { code, value, message } = res;
            if (value && (code === '00000' || code === '00002')) {
              const { message: chatMessage, brokerId, channelId, userTradeId } = value;
              const broker = this.intendComerOption.filter(n => { return n.brokerid === brokerId });
              const notifyMsg = `<div>询价单发送成功！</div><div class="txt-red">${code === '00002' ? message : ''}</div><div>优先使用：<span class="txt-red">${broker[0].company}</span> 发送</div > `
              this.$notify({
                title: '提醒',
                message: notifyMsg,
                position: 'top-left',
                dangerouslyUseHTMLString: true,
                duration: 20000,
                type: 'success'
              });
              // bid 240205 2.3500 4月26日+0 2k

              // const md = new Date(deliveryTime);
              // const chatMessage = `${direction === 'bond_0' ? 'bid' : 'ofr'} ${tscode.split('.')[0]} ${price} ${md.getMonth() + 1}月${md.getDate()} 日 + 0 ${volume} `
              // console.log(chatMessage)
              const data = {
                chatId: this.userInfo.userId,
                message: chatMessage,
                brokerId: brokerId,
                channelId: channelId,
                direction: 0,
                tradeId: userTradeId
              }
              apiTrade.sendChatMessages(data, 'sim')
              this.dialogVisible.show = false
            } else if (value && code === '00003') {
              this.$message({
                message: `${res.message} `,
                type: 'error'
              })
              this.loading = false;
            } else {
              this.$message({
                message: `${res.message} `,
                type: 'error'
              })
            }
            this.loading = false;
          })
        } else {
          this.loading = false
        }
      })
    },
    // 市价
    handleGetPrice: debounce(function () {
      if (this.activeName === 'buy') {
        this.buyForm.isMarketRoll = true
        this.buyForm.price = this.funcGetBestPrice('max', this.businessOutList, true)
      }
      if (this.activeName === 'sale') {
        this.saleForm.isMarketRoll = true
        this.saleForm.price = this.funcGetBestPrice('min', this.businessInList, true)
      }
    }),
    submitForm: debounce(function (formName) {
      this.loading = true;
      switch (formName) {
        case 'setForm':
          this.$refs[formName].validate(async (valid) => {
            if (valid) {
              if (this.isElectron) {
                const wins = await window.v1.getProfile()
                this[formName].wins = JSON.stringify(wins)
              }
              this[formName].userId = this.userInfo.userId
              apiLogin.saveProfile(this[formName])
              // this.$store.commit('SET_DEFAULT_SET', JSON.stringify(this[formName]))
              this.buyForm.volume = parseInt(this[formName].defVolume)
              this.saleForm.volume = parseInt(this[formName].defVolume)
              this.buyForm.quickSubmit = this[formName].isKlineSubmit
              this.saleForm.quickSubmit = this[formName].isKlineSubmit
              this.dailyLine = this[formName].dailyLine
              this.$refs['popover-set'].doClose()

              this.$message({
                message: '用户个性配置 保存成功！',
                type: 'success'
              });
            }
          })
          this.loading = false
          break
        case 'buyForm':
        case 'saleForm':
          if (this.setForm.isKlineSubmit) {
            this.quickSubmit(formName)
          } else {
            this.dialogVisible.message = "请确认需要提交询价单？"
            this.dialogVisible.title = "提示"
            this.dialogVisible.fun = () => { this.quickSubmit(formName, true) }
            this.dialogVisible.show = true
          }
          break
      }
    }),
    // ************websocket start**************************
    // 初始化
    initSocket() {
      const self = this
      if (typeof WebSocket === "undefined") {
        console.log("您的浏览器不支持WebSocket");
      } else {
        console.log("您的浏览器支持WebSocket");
        if (localStorage.getItem(configUtil.keys.tokenKey) === null || localStorage.getItem(configUtil.keys.tokenKey) === '') {
          Router.push({ path: '/login' })
          return;
        }
        let socketUrl =
          `${Vue.prototype.$wsUrl}/${localStorage.getItem(configUtil.keys.tokenKey)}`;
        if (self.socketKLine != null) {
          self.socketKLine.close();
          self["SET_SOCKET_KLINE"](null)
        }
        // 开启一个websocket服务
        self["SET_SOCKET_KLINE"](new WebSocket(socketUrl));
        console.log('socket链接：' + socketUrl)
        // 打开事件
        self.socketKLine.onopen = function () {
          console.log("websocket已打开");
          clearInterval(self.socketTimer)
          self.socketTimer = null
          self.socketHeart()
          if (self.activeTscode) {
            // socket.send(JSON.stringify({ "dataKey": self.activeTscode, "dataType": "tscode" }))
            self.socketKLine.send(JSON.stringify({ "dataKey": self.activeTscode, "dataType": "sub_tscode" }))
          }
        }
        // 浏览器端收消息，获得从服务端发送过来的文本消息
        self.socketKLine.onmessage = function (msg) {
          const timestamp = moment().valueOf()
          console.log("收到数据====" + msg.data);
          let msgJson = JSON.parse(msg.data)
          const h = self.$createElement;
          let notify = null
          if (msgJson && msgJson.dataKey === self.activeTscode) {
            switch (msgJson.dataType) {
              case 'noforward_1':
                self.businessOutList = msgJson.data
                break
              case 'noforward_0':
                self.businessInList = msgJson.data
                break
              case 'isforward_1':
                self.businessForwardOutList = msgJson.data
                break
              case 'isforward_0':
                self.businessForwardInList = msgJson.data
                break
              case 'trade':
                if (['REF'].indexOf(msgJson.data.dealtype) !== -1) {
                  self.transactionAllList = []
                  self.initRightTransactionList()
                } else {
                  self.transactionAllList.unshift(msgJson.data)

                  if (self.klineactive === 'Ticket图') {
                    self.klinemethods[self.klineactive]()
                  }
                }

                break
              case 'error':
                if (msgJson.data.errorCode === '0001') {
                  Router.push({ path: '/login' })
                }
                break
            }
            // 近买
            self.buyFormPrice = self.funcGetBestPrice('max', self.businessOutList, false)
            if (self.buyForm.isMarketRoll) {
              // self.buyForm.price = self.funcGetBestPrice('max', self.businessOutList, true)
            }
            // 近卖
            self.saleFormPrice = self.funcGetBestPrice('min', self.businessInList, false)
            if (self.saleForm.isMarketRoll) {
              // self.saleForm.price = self.funcGetBestPrice('min', self.businessInList, true)
            }
            self.calcuDiffPrice(1)
            // 远买
            self.buyFormForwardPrice = self.funcGetBestPrice('max', self.businessForwardOutList.concat(self.businessOutList), false)
            // 远卖
            self.saleFormForwardPrice = self.funcGetBestPrice('min', self.businessForwardInList.concat(self.businessInList), true)
            self.calcuDiffPrice(2)
          } else {
            switch (msgJson.dataType) {
              case 'accept_bond_0':
              case 'accept_bond_1':
                if (msgJson.actionType === 'refresh') {
                  break
                }
                // self.$notify({
                //   title: `${msgJson.data.tradeuser} 已接收`,
                //   dangerouslyUseHTMLString: true,
                //   position: 'top-left',
                //   message: `
                //   <div class="notify">
                //     <dl>
                //       <dt>创建时间</dt>
                //       <dd>${msgJson.data.createTime}</dd>
                //     </dl>
                //     <dl>
                //       <dt>债券码</dt>
                //       <dd>${msgJson.data.tscode}</dd>
                //     </dl>
                //     <dl>
                //       <dt>方向</dt>
                //       <dd>${msgJson.data.direction === 'bond_0' ? '买入' : msgJson.data.direction === 'bond_1' ? '卖出' : ''}</dd>
                //     </dl>
                //     <dl>
                //       <dt>成交价</dt>
                //       <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                //     </dl>
                //     <dl>
                //       <dt>成交量</dt>
                //       <dd>${msgJson.data.volume}</dd>
                //     </dl>
                //     <dl>
                //       <dt>交割日期</dt>
                //       <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                //     </dl>
                //   </div>
                //   `,
                //   duration: 5000
                // });
                // self.tryPlay()
                break;
              case 'error':
                if (msgJson.data.errorCode === '0001') {
                  Router.push({ path: '/login' })
                }
                break
              case 'deal_bond_0':
              case 'deal_bond_1':
                // self.$notify({
                //   title: `${msgJson.data.tradeuser} 已成交`,
                //   dangerouslyUseHTMLString: true,
                //   position: 'top-left',
                //   message: `
                //   <div class="notify">
                //     <dl>
                //       <dt>创建时间</dt>
                //       <dd>${msgJson.data.createTime}</dd>
                //     </dl>
                //     <dl>
                //       <dt>债券码</dt>
                //       <dd>${msgJson.data.tscode}</dd>
                //     </dl>
                //     <dl>
                //       <dt>方向</dt>
                //       <dd>${msgJson.data.direction === 'bond_0' ? '买入' : msgJson.data.direction === 'bond_1' ? '卖出' : ''}</dd>
                //     </dl>
                //     <dl>
                //       <dt>成交价</dt>
                //       <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                //     </dl>
                //     <dl>
                //       <dt>成交量</dt>
                //       <dd>${msgJson.data.volume}</dd>
                //     </dl>
                //     <dl>
                //       <dt>交割日期</dt>
                //       <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                //     </dl>
                //   </div>
                //   `,
                //   duration: 5000
                // });
                // self.tryPlay()
                break
              case 'deny_bond_0':
              case 'deny_bond_1':
                self.$notify({
                  title: `${msgJson.data.tradeuser} 已拒收`,
                  dangerouslyUseHTMLString: true,
                  position: 'top-left',
                  customClass: 'notify-yellow',
                  message: `
                  <div class="notify">
                    <dl>
                      <dt>创建时间</dt>
                      <dd>${msgJson.data.createTime}</dd>
                    </dl>
                    <dl>
                      <dt>债券码</dt>
                      <dd>${msgJson.data.tscode}</dd>
                    </dl>
                    <dl>
                      <dt>方向</dt>
                      <dd>${msgJson.data.direction === 'bond_0' ? '买入' : msgJson.data.direction === 'bond_1' ? '卖出' : ''}</dd>
                    </dl>
                    <dl>
                      <dt>成交价</dt>
                      <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                    </dl>
                    <dl>
                      <dt>成交量</dt>
                      <dd>${msgJson.data.volume}</dd>
                    </dl>
                    <dl>
                      <dt>交割日期</dt>
                      <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                    </dl>
                  </div>
                  `,
                  duration: 0
                });
                self.tryPlay()
                break
              case 'deny_cancel_bond_0':
              case 'deny_cancel_bond_1':
                // self.$notify({
                //   title: `${msgJson.data.tradeuser} 拒绝撤单`,
                //   dangerouslyUseHTMLString: true,
                //   position: 'top-left',
                //   customClass: 'notify-yellow',
                //   message: `
                //   <div class="notify">
                //     <dl>
                //       <dt>债券码</dt>
                //       <dd>${msgJson.data.tscode}</dd>
                //     </dl>
                //     <dl>
                //       <dt>方向</dt>
                //       <dd>${msgJson.data.direction === 'bond_0' ? '买入' : msgJson.data.direction === 'bond_1' ? '卖出' : ''}</dd>
                //     </dl>
                //     <dl>
                //       <dt>成交价</dt>
                //       <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                //     </dl>
                //     <dl>
                //       <dt>成交量</dt>
                //       <dd>${msgJson.data.volume}</dd>
                //     </dl>
                //     <dl>
                //       <dt>交割日期</dt>
                //       <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                //     </dl>
                //   </div>
                //   `,
                //   duration: 0
                // });
                self.tryPlay()
                break
              case 'confirm_cancel_bond_0':
              case 'confirm_cancel_bond_1':
                // self.$notify({
                //   title: `${msgJson.data.tradeuser} 已接受撤单`,
                //   dangerouslyUseHTMLString: true,
                //   position: 'top-left',
                //   message: `
                //   <div class="notify">
                //     <dl>
                //       <dt>债券码</dt>
                //       <dd>${msgJson.data.tscode}</dd>
                //     </dl>
                //     <dl>
                //       <dt>方向</dt>
                //       <dd>${msgJson.data.direction === 'bond_0' ? '买入' : msgJson.data.direction === 'bond_1' ? '卖出' : ''}</dd>
                //     </dl>
                //     <dl>
                //       <dt>成交价</dt>
                //       <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                //     </dl>
                //     <dl>
                //       <dt>成交量</dt>
                //       <dd>${msgJson.data.volume}</dd>
                //     </dl>
                //     <dl>
                //       <dt>交割日期</dt>
                //       <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                //     </dl>
                //   </div>
                //   `,
                //   duration: 5000
                // });
                self.tryPlay()
                break
              case 'tradecompare_bond_0':
              case 'tradecompare_bond_1':
                // notify = self.$notify({
                //   title: `${msgJson.data.ut.tradeuser} 等待确认成交`,
                //   dangerouslyUseHTMLString: true,
                //   position: 'top-left',
                //   message: h(
                //     "div",
                //     { class: "notify" },
                //     [
                //       h("dl", null, [
                //         h("dt", null, "创建时间"),
                //         h("dd", null, `${msgJson.data.ut.createTime}`)
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "债券码"),
                //         h("dd", null, `${msgJson.data.ut.tscode}`)
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "方向"),
                //         h("dd", null, `${msgJson.data.ut.direction === 'bond_0' ? '买入' : msgJson.data.ut.direction === 'bond_1' ? '卖出' : ''}`)
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "成交价"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? util.moneyFormat(msgJson.data.ut.price, 4) + ' ' : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? { style: "color:#ec0000" } : null, util.moneyFormat(msgJson.data.dto.price, 4))
                //         ])
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "成交量"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('restVolume') !== -1 ? msgJson.data.ut.restVolume + ' ' : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('restVolume') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.volume)
                //         ])
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "交割日期"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? msgJson.data.ut.deliveryTime.substr(0, 10) + ' ' : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.deliveryTime.substr(0, 10))
                //         ])
                //       ]),
                //       h("dl", { style: "margin-top:20px;" }, [
                //         h("dd", null, [
                //           h("button", {
                //             class: "notigy-agree",
                //             on: {
                //               click: function () {
                //                 self.handleInquiryDealConfirmClick(msgJson.data.ut.userTradeId, timestamp)
                //               }
                //             }
                //           }, "同意"),
                //           h("button", {
                //             class: "notigy-cancel",
                //             on: {
                //               click: function () {
                //                 self.handleInquiryDealRejectionClick(msgJson.data.ut.userTradeId, timestamp)
                //               }
                //             }
                //           }, "拒绝")
                //         ])
                //       ]),
                //     ],
                //   ),
                //   duration: 0
                // });
                // self.notifyRejection[timestamp] = notify
                self.tryPlay()
                break
              case 'weipingchangerequest_bond_0':
              case 'weipingchangerequest_bond_1':
                // notify = self.$notify({
                //   title: `${msgJson.data.changer} 等待未平仓修改审核`,
                //   dangerouslyUseHTMLString: true,
                //   position: 'top-left',
                //   message: h(
                //     "div",
                //     { class: "notify" },
                //     [
                //       h("dl", null, [
                //         h("dt", null, "创建时间"),
                //         h("dd", null, `${msgJson.data.rt.createTime}`)
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "债券码"),
                //         h("dd", null, `${msgJson.data.rt.tscode.replace(/.IB/, '')}`)
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "方向"),
                //         h("dd", null, `${msgJson.data.rt.direction === 'bond_0' ? '买入' : msgJson.data.rt.direction === 'bond_1' ? '卖出' : ' '}`)
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "成交价"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? util.moneyFormat(msgJson.data.rt.price, 4) + ' ' : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? { style: "color:#ec0000" } : null, util.moneyFormat(msgJson.data.dto.price, 4))
                //         ])
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "成交量"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('volume') !== -1 ? msgJson.data.rt.volume + ' ' : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('volume') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.volume)
                //         ])
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "交割日期"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? msgJson.data.rt.deliveryTime.substr(0, 10) + ' ' : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.deliveryTime.substr(0, 10))
                //         ])
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "交割速度"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('deliverySpeed') !== -1 ? msgJson.data.rt.deliverySpeed : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('deliverySpeed') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.deliverySpeed)
                //         ])
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "交易对手"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('counterParty') !== -1 ? msgJson.data.rt.counterParty : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('counterParty') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.counterParty)
                //         ])
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "联系人"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('contactPerson') !== -1 ? msgJson.data.rt.contactPerson : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('contactPerson') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.contactPerson)
                //         ])
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "联系方式"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('contactType') !== -1 ? msgJson.data.rt.contactType : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('contactType') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.contactType)
                //         ])
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "备注"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('remark') !== -1 ? msgJson.data.rt.remark : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('remark') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.remark)
                //         ])
                //       ]),
                //       h("dl", { style: "margin-top:20px;" }, [
                //         // h("dt", null, ""),
                //         h("dd", null, [
                //           h("button", {
                //             class: "notigy-agree",
                //             on: {
                //               click: function () {
                //                 self.handleAgreeNoBondsUpdateClick(msgJson.data.rt.realTradeId, timestamp)
                //               }
                //             }
                //           }, "同意"),
                //           h("button", {
                //             class: "notigy-cancel",
                //             on: {
                //               click: function () {
                //                 self.handleRejectNoBondsUpdateClick(msgJson.data.rt.realTradeId, timestamp)
                //               }
                //             }
                //           }, "拒绝")
                //         ])
                //       ]),
                //     ],
                //   ),
                //   duration: 0
                // });
                // self.notifyRejection[timestamp] = notify
                // self.tryPlay()
                break
              case 'yipingchangerequest_bond_0':
              case 'yipingchangerequest_bond_1':
                // notify = self.$notify({
                //   title: `${msgJson.data.changer} 等待已平仓修改审核`,
                //   dangerouslyUseHTMLString: true,
                //   position: 'top-left',
                //   message: h(
                //     "div",
                //     { class: "notify" },
                //     [
                //       h("dl", null, [
                //         h("dt", null, "创建时间"),
                //         h("dd", null, `${msgJson.data.rt.createTime}`)
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "债券码"),
                //         h("dd", null, `${msgJson.data.rt.tscode.replace(/.IB/, '')}`)
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "方向"),
                //         h("dd", null, `${msgJson.data.rt.direction === 'bond_0' ? '买入' : msgJson.data.rt.direction === 'bond_1' ? '卖出' : ''}`)
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "成交价"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000;padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? util.moneyFormat(msgJson.data.rt.price, 4) + ' ' : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? { style: "color:#ec0000" } : null, util.moneyFormat(msgJson.data.dto.price, 4))
                //         ])
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "成交量"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('volume') !== -1 ? msgJson.data.rt.volume + ' ' : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('volume') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.volume)
                //         ])
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "交割日期"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? msgJson.data.rt.deliveryTime.substr(0, 10) + ' ' : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.deliveryTime.substr(0, 10))
                //         ])
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "交割速度"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('deliverySpeed') !== -1 ? msgJson.data.rt.deliverySpeed : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('deliverySpeed') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.deliverySpeed)
                //         ])
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "交易对手"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('counterParty') !== -1 ? msgJson.data.rt.counterParty : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('counterParty') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.counterParty)
                //         ])
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "联系人"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('contactPerson') !== -1 ? msgJson.data.rt.contactPerson : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('contactPerson') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.contactPerson)
                //         ])
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "联系方式"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('contactType') !== -1 ? msgJson.data.rt.contactType : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('contactType') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.contactType)
                //         ])
                //       ]),
                //       h("dl", null, [
                //         h("dt", null, "备注"),
                //         h("dd", null, [
                //           h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('remark') !== -1 ? msgJson.data.rt.remark : ''),
                //           h("span", msgJson.data.compareResult.fieldlist.indexOf('remark') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.remark)
                //         ])
                //       ]),
                //       h("dl", { style: "margin-top:20px;" }, [
                //         // h("dt", null, ""),
                //         h("dd", null, [
                //           h("button", {
                //             class: "notigy-agree",
                //             on: {
                //               click: function () {
                //                 self.handleAgreeBondsUpdateClick(msgJson.data.rt.realTradeId, timestamp)
                //               }
                //             }
                //           }, "同意"),
                //           h("button", {
                //             class: "notigy-cancel",
                //             on: {
                //               click: function () {
                //                 self.handleRejectBondsUpdateClick(msgJson.data.rt.realTradeId, timestamp)
                //               }
                //             }
                //           }, "拒绝")
                //         ])
                //       ]),
                //     ],
                //   ),
                //   duration: 0
                // });
                // self.notifyRejection[timestamp] = notify
                // self.tryPlay()
                break
              case 'koutouweiyuerequest_bond_0':
              case 'koutouweiyuerequest_bond_1':
                notify = self.$notify({
                  title: `${msgJson.data.tradeuser} 发起口头违约`,
                  dangerouslyUseHTMLString: true,
                  position: 'top-left',
                  customClass: 'notify-red',
                  message: h(
                    "div",
                    { class: "notify notify-dd-red" },
                    [
                      h("dl", null, [
                        h("dt", null, "创建时间"),
                        h("dd", null, `${msgJson.data.createTime}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "债券码"),
                        h("dd", null, `${msgJson.data.tscode.replace(/.IB/, '')}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "方向"),
                        h("dd", null, `${msgJson.data.direction === 'bond_0' ? '买入' : msgJson.data.direction === 'bond_1' ? '卖出' : ''}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交价"),
                        h("dd", null, `${util.moneyFormat(msgJson.data.price, 4)}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交量"),
                        h("dd", null, `${msgJson.data.volume}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "交割日期"),
                        h("dd", null, `${msgJson.data.deliveryTime.substr(0, 10)}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "交易对手"),
                        h("dd", null, `${msgJson.data.counterParty}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "备注"),
                        h("dd", null, `${msgJson.data.remark}`)]),
                      h("dl", { style: "margin-top:20px;" }, [
                        // h("dt", null, ""),
                        h("dd", null, [
                          h("button", {
                            class: "notigy-agree",
                            on: {
                              click: function () {
                                self.handleSayBreakConfirmClick(msgJson.data.realTradeId, timestamp)
                              }
                            }
                          }, "同意"),
                          h("button", {
                            class: "notigy-cancel",
                            on: {
                              click: function () {
                                self.handleSayBreakRejectionClick(msgJson.data.realTradeId, timestamp)
                              }
                            }
                          }, "拒绝")
                        ])
                      ]),
                    ],
                  ),
                  duration: 0
                });
                self.notifyRejection[timestamp] = notify
                self.tryPlay()
                break
              case 'nancheng_bond_0':
              case 'nancheng_bond_1':
                notify = self.$notify({
                  title: `${msgJson.data.tradeuser} 发起难成`,
                  dangerouslyUseHTMLString: true,
                  position: 'top-left',
                  customClass: 'notify-yellow',
                  message: h(
                    "div",
                    { class: "notify" },
                    [
                      h("dl", null, [
                        h("dt", null, "创建时间"),
                        h("dd", null, `${msgJson.data.createTime}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "债券码"),
                        h("dd", null, `${msgJson.data.tscode.replace(/.IB/, '')}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "方向"),
                        h("dd", null, `${msgJson.data.direction === 'bond_0' ? '买入' : msgJson.data.direction === 'bond_1' ? '卖出' : ''}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交价"),
                        h("dd", null, `${util.moneyFormat(msgJson.data.price, 4)}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交量"),
                        h("dd", null, `${msgJson.data.restVolume}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "交割日期"),
                        h("dd", null, `${msgJson.data.deliveryTime.substr(0, 10)}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "备注"),
                        h("dd", null, `${msgJson.data.remark}`)
                      ]),
                      h("dl", null, [
                        h("dt", { style: "color: #ec0000;" }, "难成原因"),
                        h("dd", { style: "color: #ec0000;" }, `${msgJson.data.reason}`)
                      ]),
                      h("dl", { style: "margin-top:20px;" }, [
                        // h("dt", null, ""),
                        h("dd", null, [
                          h("button", {
                            class: "notigy-agree",
                            on: {
                              click: function () {
                                self.handleEnquiryDifficultAddClick(msgJson.data, timestamp)
                              }
                            }
                          }, "新建"),
                          h("button", {
                            class: "notigy-cancel",
                            on: {
                              click: function () {
                                self.handleEnquiryDifficultCanncelClick(msgJson.data, timestamp)
                              }
                            }
                          }, "撤单"),
                          h("button", {
                            class: "notigy-cancel",
                            on: {
                              click: function () {
                                self.handleEnquiryDifficultDotMoveClick(msgJson.data, timestamp)
                              }
                            }
                          }, "保留")
                        ])
                      ]),
                    ],
                  ),
                  duration: 0
                });
                self.notifyRejection[timestamp] = notify
                self.tryPlay()
                break
              case 'xuzuo_tradecompare_bond_0':
              case 'xuzuo_tradecompare_bond_1':
                notify = self.$notify({
                  title: `${msgJson.data.rt.tradeuser} 发起违约续作`,
                  dangerouslyUseHTMLString: true,
                  position: 'top-left',
                  customClass: 'notify-red',
                  message: h(
                    "div",
                    { class: "notify" },
                    [
                      h("dl", null, [
                        h("dt", null, "创建时间"),
                        h("dd", null, `${msgJson.data.rt.createTime}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "债券码"),
                        h("dd", null, `${msgJson.data.rt.tscode}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "方向"),
                        h("dd", null, `${msgJson.data.rt.direction === 'bond_0' ? '买入' : msgJson.data.rt.direction === 'bond_1' ? '卖出' : ''}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交价"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? util.moneyFormat(msgJson.data.rt.price, 4) + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? { style: "color:#ec0000" } : null, util.moneyFormat(msgJson.data.dto.price, 4))
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交量"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('restVolume') !== -1 ? msgJson.data.rt.restVolume + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('restVolume') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.volume)
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "交割日期"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? msgJson.data.rt.deliveryTime.substr(0, 10) + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.deliveryTime.substr(0, 10))
                        ])
                      ]),
                      h("dl", { style: "margin-top:20px;" }, [
                        h("dd", null, [
                          h("button", {
                            class: "notigy-agree",
                            on: {
                              click: function () {
                                self.handleDealBreakRedoConfirmClick(msgJson.data.dto.userTradeId, timestamp)
                              }
                            }
                          }, "同意"),
                          h("button", {
                            class: "notigy-cancel",
                            on: {
                              click: function () {
                                self.handleDealBreakRedoRejectionClick(msgJson.data.dto.userTradeId, timestamp)
                              }
                            }
                          }, "拒绝")
                        ])
                      ]),
                    ],
                  ),
                  duration: 0
                });
                self.notifyRejection[timestamp] = notify
                self.tryPlay()
                break
              case 'xuzuo_deal_bond_0':
              case 'xuzuo_deal_bond_1':
                self.$notify({
                  title: `${msgJson.data.tradeuser} 续作交易已成功`,
                  dangerouslyUseHTMLString: true,
                  position: 'top-left',
                  message: `
                  <div class="notify">
                    <dl>
                      <dt>债券码</dt>
                      <dd>${msgJson.data.tscode}</dd>
                    </dl>
                    <dl>
                      <dt>方向</dt>
                      <dd>${msgJson.data.direction === 'bond_0' ? '买入' : msgJson.data.direction === 'bond_1' ? '卖出' : ''}</dd>
                    </dl>
                    <dl>
                      <dt>成交价</dt>
                      <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                    </dl>
                    <dl>
                      <dt>成交量</dt>
                      <dd>${msgJson.data.volume}</dd>
                    </dl>
                    <dl>
                      <dt>交割日期</dt>
                      <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                    </dl>
                  </div>
                  `,
                  duration: 5000
                });
                self.tryPlay()
                break
              case 'xiugaichangedeny_bond_0':
              case 'xiugaichangedeny_bond_1':
                notify = self.$notify({
                  title: `${msgJson.data.tradeuser} 已拒绝修改询价单`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-left',
                  customClass: 'notify-yellow',
                  message: h(
                    "div",
                    { class: "notify" },
                    [
                      h("dl", null, [
                        h("dt", null, "单据号"),
                        h("dd", null, `${msgJson.data.ut.tradeNum}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "债券码"),
                        h("dd", null, `${msgJson.data.ut.tscode.replace(/.IB/, '')}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "方向"),
                        h("dd", null, `${msgJson.data.ut.direction === 'bond_0' ? '买入' : msgJson.data.ut.direction === 'bond_1' ? '卖出' : ' '}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交价"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? util.moneyFormat(msgJson.data.ut.price, 4) + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? { style: "color:#ec0000" } : null, util.moneyFormat(msgJson.data.dto.price, 4))
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "允许浮动"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('worstPrice') !== -1 ? util.moneyFormat(msgJson.data.ut.worstPrice, 4) + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('worstPrice') !== -1 ? { style: "color:#ec0000" } : null, util.moneyFormat(msgJson.data.dto.worstPrice, 4))
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交量"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('volume') !== -1 ? msgJson.data.ut.volume + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('volume') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.volume)
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "交割日期"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? msgJson.data.ut.deliveryTime.toString().substr(0, 10) + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.deliveryTime.toString().substr(0, 10))
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "备注"),
                        h("dd", null, `${msgJson.data.ut.remark}`)
                      ]),
                    ],
                  ),
                  duration: 0
                });
                self.notifyRejection[timestamp] = notify
                self.tryPlay()
                break
              case 'xiugaichangeconfirm_bond_0':
              case 'xiugaichangeconfirm_bond_1':
                notify = self.$notify({
                  title: `${msgJson.data.tradeuser} 已同意修改询价单`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-left',
                  message: h(
                    "div",
                    { class: "notify" },
                    [
                      h("dl", null, [
                        h("dt", null, "单据号"),
                        h("dd", null, `${msgJson.data.ut.tradeNum}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "债券码"),
                        h("dd", null, `${msgJson.data.ut.tscode.replace(/.IB/, '')}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "方向"),
                        h("dd", null, `${msgJson.data.ut.direction === 'bond_0' ? '买入' : msgJson.data.ut.direction === 'bond_1' ? '卖出' : ' '}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交价"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? util.moneyFormat(msgJson.data.ut.price, 4) + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? { style: "color:#ec0000" } : null, util.moneyFormat(msgJson.data.dto.price, 4))
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "允许浮动"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('worstPrice') !== -1 ? util.moneyFormat(msgJson.data.ut.worstPrice, 4) + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('worstPrice') !== -1 ? { style: "color:#ec0000" } : null, util.moneyFormat(msgJson.data.dto.worstPrice, 4))
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交量"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('volume') !== -1 ? msgJson.data.ut.volume + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('volume') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.volume)
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "交割日期"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? msgJson.data.ut.deliveryTime.toString().substr(0, 10) + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.deliveryTime.toString().substr(0, 10))
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "备注"),
                        h("dd", null, `${msgJson.data.ut.remark}`)
                      ]),
                    ],
                  ),
                  duration: 5000
                });
                self.notifyRejection[timestamp] = notify
                self.tryPlay()
                break
              case 'jiaogeweiyueNotice_bond_0':
              case 'jiaogeweiyueNotice_bond_1':
                self.$notify({
                  title: `${msgJson.data.jiaogeyuanName} 发起违约`,
                  dangerouslyUseHTMLString: true,
                  position: 'top-left',
                  customClass: 'notify-red',
                  message: `
                  <div class="notify notify-dd-red">
                    <dl>
                      <dt>单据号</dt>
                      <dd>${msgJson.data.tradeNum}</dd>
                    </dl>
                    <dl>
                      <dt>债券码</dt>
                      <dd>${msgJson.data.tscode}</dd>
                    </dl>
                    <dl>
                      <dt>方向</dt>
                      <dd>${msgJson.data.direction === 'bond_0' ? '买入' : msgJson.data.direction === 'bond_1' ? '卖出' : ''}</dd>
                    </dl>
                    <dl>
                      <dt>成交价</dt>
                      <dd>${util.moneyFormat(msgJson.data.price, 4)}</dd>
                    </dl>
                    <dl>
                      <dt>成交量</dt>
                      <dd>${msgJson.data.volume}</dd>
                    </dl>
                    <dl>
                      <dt>交割日期</dt>
                      <dd>${msgJson.data.deliveryTime.substr(0, 10)}</dd>
                    </dl>
                    <dl>
                      <dt>违约方</dt>
                      <dd>${config.funcKeyValue(msgJson.data.weiyuePerson ? msgJson.data.weiyuePerson.toString() : '', "breakTypeOptions")}</dd>
                    </dl>
                    <dl>
                      <dt>违约量</dt>
                      <dd>${msgJson.data.weiyueAmount}</dd>
                    </dl>
                    <dl>
                      <dt>做市商</dt>
                      <dd>${msgJson.data.marketMakerName}</dd>
                    </dl>
                    <dl>
                      <dt>提示</dt>
                      <dd>请去违约页面处理后续！</dd>
                    </dl>
                  </div>
                  `,
                  duration: 0
                });
                self.tryPlay()
                break;
            }
            self.socketKLine.send(JSON.stringify({ "dataType": "ack", "data": { "dataKey": msgJson.dataKey, "dataType": msgJson.dataType } }))
          }
        }
        // 关闭事件
        self.socketKLine.onclose = function () {
          console.log("websocket已关闭");
          self.reconnect()
        }
        // 发生了错误事件
        self.socketKLine.onerror = function () {
          console.log("websocket发生了错误");
          // 重连
          self.reconnect()
        }
      }
    },
    // socket心跳
    socketHeart() {
      this.socketTimer = setInterval(() => {
        if (self.socketKLine) {
          self.socketKLine.send(JSON.stringify({ "dataKey": 'HELLO', "dataType": 'ping' }))
        }
      }, 30 * 1000)
    },
    // 播放提示音
    tryPlay() {
      const self = this
      try {
        // if (self.dialogTableVisible) {
        //   self.$refs.tradeEnquiry.loadInitData()
        // }
        self.$refs.playAudio.play()
      } catch (error) {
        console.log(error)
      }
    },
    // 重连
    reconnect() {
      const self = this
      if (self.socketKLine && self.socketKLine.readyState === 1) {
        // 如果状态等于1代表websocket连接正常
        return
      }
      if (lockReconnect) {
        return
      }
      // 让重连锁变为true,阻止进入下一个循环锁
      lockReconnect = true
      setTimeout(() => {
        console.log("尝试重连")
        if (self.socketKLine) {
          self.socketKLine.close()
        }
        Promise.all([
          lockReconnect = false
        ]).then(() => {
          self.initRightTransactionList()
          self.initSocket()
        })
      }, 5000)
    },
    // ***************websocket end***************************
    // 发送交易
    sendTransation() {
      let dataType = ''
      if (this.chartType === '卖') {
        dataType = 'bond_1'
      } else if (this.chartType === '买') {
        dataType = 'bond_0'
      }
      console.log('发送的交易询价单数据：' + JSON.stringify({
        "dataKey": this.activeTscode,
        "dataType": dataType,
        "data": {
          "tscode": this.activeTscode,
          "volume": this.chartAmount,
          "price": this.chartPrice
        }
      }))
      this.socketKLine.send(JSON.stringify({
        "dataKey": this.activeTscode,
        "dataType": dataType,
        "data": {
          "tscode": this.activeTscode,
          "volume": this.chartAmount,
          "price": this.chartPrice
        }
      }))
    },

    // 同意成交
    handleInquiryDealConfirmClick: debounce(function (userTradeId, timestamp) {
      const self = this
      apiTrade.inquiryDealConfirm({ userTradeId }).then(response => {
        if (response && response.code === '00000') {
          self.$message({
            message: "已成交",
            type: 'success'
          })
        } else {
          self.$message({
            message: `${response.message}`,
            type: 'warning'
          })
        }
        self.notifyRejection[timestamp].close()
        delete self.notifyRejection[timestamp]
      })
    }),
    // 拒绝成交
    handleInquiryDealRejectionClick: debounce(function (userTradeId, timestamp) {
      const self = this
      apiTrade.inquiryDealRejection({ userTradeId }).then(response => {
        if (response && response.code === '00000') {
          self.$message({
            message: "已拒绝",
            type: 'success'
          })
        } else {
          self.$message({
            message: `${response.message}`,
            type: 'warning'
          })
        }
        self.notifyRejection[timestamp].close()
        delete self.notifyRejection[timestamp]
      })
    }),
    // 续作同意
    handleDealBreakRedoConfirmClick: debounce(function (userTradeId, timestamp) {
      const self = this
      apiBreak.dealBreakRedoConfirm({ userTradeId }).then(response => {
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
        self.notifyRejection[timestamp].close()
        delete self.notifyRejection[timestamp]
      })
    }),
    // 续作拒绝
    handleDealBreakRedoRejectionClick: debounce(function (userTradeId, timestamp) {
      const self = this
      apiBreak.dealBreakRedoRejection({ userTradeId }).then(response => {
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
        self.notifyRejection[timestamp].close()
        delete self.notifyRejection[timestamp]
      })
    }),
    // 同意修改未平仓单
    handleAgreeNoBondsUpdateClick: debounce(function (realTradeId, timestamp) {
      const self = this
      apiBonds.dealNoBondsEditComfirm({ realTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "已审核",
            type: 'success'
          })
        } else {
          this.$message({
            message: `${response.message}`,
            type: 'warning'
          })
        }
        self.notifyRejection[timestamp].close()
        delete self.notifyRejection[timestamp]
      })
    }),
    // 拒绝修改未平仓单
    handleRejectNoBondsUpdateClick: debounce(function (realTradeId, timestamp) {
      const self = this
      apiBonds.dealNoBondsEditRejection({ realTradeId }).then(response => {
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
        self.notifyRejection[timestamp].close()
        delete self.notifyRejection[timestamp]
      })
    }),
    // 同意修改已平仓单
    handleAgreeBondsUpdateClick: debounce(function (realTradeId, timestamp) {
      const self = this
      apiBonds.dealBondsEditComfirm({ realTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "已审核",
            type: 'success'
          })
        } else {
          this.$message({
            message: `${response.message}`,
            type: 'warning'
          })
        }
        self.notifyRejection[timestamp].close()
        delete self.notifyRejection[timestamp]
      })
    }),
    // 口头违约确认
    handleSayBreakConfirmClick: debounce(function (realTradeId, timestamp) {
      const self = this
      apiBonds.bondsSayBreakConfirm({ realTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "口头违约已确认",
            type: 'success'
          })
        } else {
          this.$message({
            message: `${response.message}`,
            type: 'warning'
          })
        }
        self.notifyRejection[timestamp].close()
        delete self.notifyRejection[timestamp]
      })
    }),
    // 口头违约拒绝
    handleSayBreakRejectionClick: debounce(function (realTradeId, timestamp) {
      const self = this
      apiBonds.bondsSayBreakRejection({ realTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "口头违约已拒绝",
            type: 'success'
          })
        } else {
          this.$message({
            message: `${response.message}`,
            type: 'warning'
          })
        }
        self.notifyRejection[timestamp].close()
        delete self.notifyRejection[timestamp]
      })
    }),
    // 拒绝修改已平仓单
    handleRejectBondsUpdateClick: debounce(function (realTradeId, timestamp) {
      const self = this
      apiBonds.dealBondsEditRejection({ realTradeId }).then(response => {
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
        self.notifyRejection[timestamp].close()
        delete self.notifyRejection[timestamp]
      })
    }),
    handleEnquiryDifficultAddClick: debounce(function (data, timestamp) {
      // 撤单
      const self = this
      apiTrade.difficultAcheveCannel({ userTradeId: data.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          // 锁住方向
          data.lockDirection = true
          Promise.all([
            self.currentDifficultData = JSON.parse(JSON.stringify(data)),
            self.currentDifficultData.volume = self.currentDifficultData.restVolume,
            self.currentDifficultData.relativeNum = response.value.relativeNum,
            self.currentDifficultData.sourceNum = response.value.sourceNum,
            self.currentDifficultData.isYouxian = response.value.isYouxian,
            self.currentDifficultData.youxianLevel = response.value.youxianLevel
          ]).then(() => {
            console.log(self.currentDifficultData)
            self.dialogEnquiryAddVisible = true
          })
        } else {
          self.$message({
            message: `${response.message}`,
            type: 'warning'
          })
        }
        self.notifyRejection[timestamp].close()
        delete self.notifyRejection[timestamp]
      })
    }),
    // 询价单难成撤单
    handleEnquiryDifficultCanncelClick: debounce(function (data, timestamp) {
      const self = this
      apiTrade.difficultAcheveCannel({ userTradeId: data.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "难成已撤单",
            type: 'success'
          })
        } else {
          this.$message({
            message: `${response.message}`,
            type: 'warning'
          })
        }
        self.notifyRejection[timestamp].close()
        delete self.notifyRejection[timestamp]
      })
    }),
    // 询价单难成保留
    handleEnquiryDifficultDotMoveClick: debounce(function (data, timestamp) {
      const self = this
      apiTrade.difficultStay({ userTradeId: data.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: "难成已保留",
            type: 'success'
          })
        } else {
          this.$message({
            message: `${response.message}`,
            type: 'warning'
          })
        }
        self.notifyRejection[timestamp].close()
        delete self.notifyRejection[timestamp]
      })
    }),
    // 接收单据
    handleReceiveClick: debounce(function (row) {
      if (row.status === 'delegate_bond_0') {
        this.socketKLine.send(JSON.stringify({ "dataKey": `${row.userTradeId}`, "dataType": 'accept_bond_0' }))
      } else if (row.status === 'delegate_bond_1') {
        this.socketKLine.send(JSON.stringify({ "dataKey": `${row.userTradeId}`, "dataType": 'accept_bond_1' }))
      }
      // this.dialogTableVisible = false
    }),
    // 获取交易员列表
    getTradeUserList() {
      apiAdmin.tradeUserList().then(response => {
        if (response && response.code === '00000' && response.value) {
          this.tradeUsersOption = response.value
        }
      })
    },
    // 获取意向列表
    getIntendComerList() {
      apiAdmin.chatReceiverList().then(response => {
        if (response && response.code === '00000' && response.value) {
          this.intendComerOption = [...response.value]
        }
      })
    },
    // 买单交割日期变化
    handleBuyDeliveryCanlendar(obj) {
      this.buyForm.deliveryTime = obj.value
      if (moment(obj.value).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD') && moment(moment(new Date()).format('YYYY-MM-DD HH:mm:ss')).isAfter(moment(new Date()).format('YYYY-MM-DD 11:00:00'))) {
        this.buyForm.deliveryTimeMsg = '即将收市'
      } else {
        this.buyForm.deliveryTimeMsg = ''
      }
    },
    // 卖单交割日期变化
    handleSaleDeliveryCanlendar(obj) {
      this.saleForm.deliveryTime = obj.value
      if (moment(obj.value).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD') && moment(moment(new Date()).format('YYYY-MM-DD HH:mm:ss')).isAfter(moment(new Date()).format('YYYY-MM-DD 11:00:00'))) {
        this.saleForm.deliveryTimeMsg = '即将收市'
      } else {
        this.saleForm.deliveryTimeMsg = ''
      }
    },
    // 难成撤单询价弹出框
    handleDialogEnquiryAddVisible(obj) {
      this.dialogEnquiryAddVisible = obj.dialogVisible
    },
    /* 下拉指令 */
    handleCommand: debounce(function (command) {
      switch (command) {
        case "logout":
          if (this.isElectron) {
            window.v1.quit()
          } else {
            apiLogin.logout().then(response => {
              if (response && response.code === 200) {
                this.$store.commit('SET_TOKEN', null)
                this.$store.commit('SET_USER_INFO', null)
                this.$router.push({ path: '/' })
              } else {
                this.$message({
                  message: '退出失败',
                  type: 'error'
                })
              }
            })
          }

          break;
        case "updatePassword":
          this.dialogUpdatePasswordVisible = true
          break;
      }
    }),
    // 修改密码弹出框
    handleDialogUpdatePasswordVisible(obj) {
      this.dialogUpdatePasswordVisible = obj.dialogVisable
    },
    // 价格修改等待时间
    initPriceWait() {
      this.timer = setInterval(() => {
        if (this.buyForm.maxWait > 0) {
          this.buyForm.maxWait -= 1
        }
        if (this.saleForm.maxWait > 0) {
          this.saleForm.maxWait -= 1
        }
      }, 1000)
    },
    handleMaxWait(formName) {
      // this[formName].maxWait = 5
      this[formName].isMarketRoll = false
    },
    // 计算近差和总差 1:近差；2：总差
    calcuDiffPrice(type) {
      if (type === 1) {
        this.currentDiffPrice = (util.moneyFormat((this.buyFormPrice - this.saleFormPrice) * 100, 2)) + 'BP'
      }
      if (type === 2) {
        this.forwardDiffPrice = (util.moneyFormat((this.buyFormForwardPrice - this.saleFormForwardPrice) * 100, 2)) + 'BP'
      }
    },
    initDefaultSet() {
      Promise.all([

      ]).then(() => {
        apiLogin.getProfile(this.userInfo.userId).then(res => {
          if (res.code === '00000' && res.value !== null) {
            this.setForm = res.value

            this.buyForm.volume = res.value.defVolume ? parseInt(res.value.defVolume) : 2000;
            this.saleForm.volume = res.value.defVolume ? parseInt(res.value.defVolume) : 2000;
            this.buyForm.quickSubmit = res.value.isKlineSubmit;
            this.saleForm.quickSubmit = res.value.isKlineSubmit;
            this.dailyLine = res.value.dailyLine;
          }
        })
      })
    },
    openMoreThis($path) {
      if (this.isElectron) {
        window.v1.getAllDisplays().then((response) => {
          const maxWidth = Math.max(...response.map(display => display.bounds.width));
          const maxHeight = Math.max(...response.map(display => display.bounds.height));

          if ($path === '/simulation/chat') {
            const args = {
              width: maxWidth / 2, // 窗口宽度
              height: maxHeight - 50, // 窗口高度
              minWidth: maxWidth / 2, // 窗口最小宽度
              minHeight: maxHeight - 50, // 窗口最小高度
              isMainWin: false,
              resize: false, // 是否支持缩放
              maximize: false, // 最大化窗口
              isMultiWin: false, // 是否支持多开窗口
              route: $path
            }

            window.v1.createWin(args)
          }
        });
      } else {
        const href = this.$router.resolve({
          path: $path
        }).href;
        window.open(href, "_blank");
      }
    }
  },
  mounted() {
    this.initDefaultSet()
    this.initTSType()
    this.getAllBondPool()
    this.getByCodeBondPool()
    this.favoriteList()
    this.getTradeUserList()
    this.getIntendComerList()
    // 初始化默认设置和询价单表格默认设置
    // this.buyForm.volume = parseInt(this.setForm.defVolume)
    // this.saleForm.volume = parseInt(this.setForm.defVolume)
    // this.buyForm.quickSubmit = this.setForm.isKlineSubmit
    // this.saleForm.quickSubmit = this.setForm.isKlineSubmit

    this.initPriceWait()
    window.onresize = () => {
      this.initFrameW('leftWith', 200)
      this.initFrameW('rightWith', 360)
      this.initFrameW('canlendarW', 150)
      this.widthList.w50 = this.returnFrameW(50)
      this.widthList.w60 = this.returnFrameW(60)
      this.widthList.w80 = this.returnFrameW(80)
      this.widthList.w100 = this.returnFrameW(100)
      this.widthList.w120 = this.returnFrameW(120)
      setTimeout(() => {
        if (this.myChart) {
          this.myChart.resize()
        }
      }, 300)
    }
  },
}
</script>

<style lang="scss" scoped>
// @import "@/assets/css/kline.scss";
.head {
  height: 40px;
  line-height: 40px;
  padding: 0 10px;

  .k-nav {
    overflow: hidden;

    .el-dropdown-link {
      color: white;
      font-size: 14px;
      display: inline-block;
    }

    .active>>>.el-dropdown-link {
      color: #54ffff;
    }

    .top-type {
      min-width: 240px;
      max-width: 240px;
      padding: 0;
    }

    .tscode {
      font-weight: bold;
      font-size: 18px;
      color: #ec0000;

      .i-text {
        display: flex;
        height: 40px;
        flex-direction: column;
        justify-content: center;
        text-align: center;

        .el-icon-star-off,
        .el-icon-star-on {
          line-height: 40px;
          font-size: 18px;
          margin: 0;
        }
      }
    }

    .slt-type {
      .grid-content {
        padding: 0 2px;
      }
    }

    li {
      float: left;
      padding-left: 5px;
      font-size: 14px;
      cursor: pointer;
      color: rgb(240, 239, 239);
      font-weight: bold;
      font-family: fangsong;
    }

    li.active {
      color: #54ffff;
    }

    .nav-right {
      float: right;

      .i-text {
        justify-content: center;
        text-align: center;
        line-height: 50px;
        font-size: 18px;

        padding: 9px 15px;
        font-size: 12px;
        border-radius: 3px;
        color: #fff;
        background-color: #2cad98;
        border-color: #2cad98;

        .el-icon-star-on {
          font-size: 20px;
        }
      }

      .el-dropdown {
        color: white;
      }
    }
  }
}

.l-strong {
  font-size: 16px;
}

.ipt-volume {
  width: 140px;
}

.slt-user {
  width: 140px;
}

.kline {
  min-height: 300px;
  min-width: 300px;
  padding: 0px;
  border-radius: 3px;
  background-color: azure;
}

.ipt-remark {
  width: 100%;
}

.container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  bottom: 0px;

  .left-group {
    //border-right: 1px solid #ec0000;
    min-width: 220px;
    max-width: 220px;
    position: relative;
    padding: 8px;
    border-radius: 5px;
    background-color: #2f3032;
    margin: 0 10px 10px 10px;
    text-align: left;
    color: #fff;
    overflow: inherit;
    width: max-content;

    .open-colse {
      position: absolute;
      width: 16px;
      height: 16px;
      right: -16px;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      z-index: 1000;
    }

    // 修改el-tabs
    .left-tabs>>>.el-tabs__item.is-active {
      background: #fff;
      color: #000;
      border-radius: 4px 4px 3px 3px;
    }

    .left-tabs>>>.el-tabs__active-bar {
      background-color: #166fe8;
      /* 修改底部横杠的颜色 */
      height: 3px;
      /* 修改底部横杠的高度 */
      // width: 100px !important;
      // left: 30%;
    }

    .left-tabs>>>.el-tabs__active-bar::after {
      //给激活的时底部tab横线添加三角
      content: "";
      width: 0;
      height: 0;
      position: absolute;
      left: 39%;
      bottom: 2px;
      border-top: 10px solid transparent;
      border-right: 10px solid transparent;
      border-left: 10px solid transparent;
      border-bottom: 5px solid #166fe8;
    }

    .left-tabs>>>.el-tabs__item {
      //
      padding: 0 !important;
      color: #fff;
    }

    .left-tabs>>>.el-tabs__nav.is-top {
      display: flex;
    }

    .tab-common {
      height: 100%;
      overflow: hidden;
    }

    .search-box {
      //padding: 5px 4px;
    }

    .el-scrollbar {
      .left-tabs-item {
        line-height: 23px;
        padding: 10px 0 0;
        margin: 5px 0 !important;
        border-radius: 3px;
        cursor: pointer;

      }

      .left-tabs-item.active {
        background-color: #e4e7ed;
        border-radius: 3px;
        color: #303133;
      }

      .left-tabs-item:hover {
        background-color: #e4e7ed;
        color: #303133;
      }

      ul {
        padding-right: 10px;
      }

      ul li {
        color: #fff;
        box-sizing: border-box;
        padding: 5px 10px;
        margin: 5px 0;
        font-size: 12px;
        //border-bottom: 1px solid #ec0000;
        cursor: pointer;
      }

      ul li.active {
        background-color: #606266;
        border-radius: 3px;
        color: red;
      }
    }

    .tab-0 {
      .el-scrollbar {
        height: calc(100% - 160px);
      }
    }

    .tab-2 {
      .el-scrollbar {
        height: calc(100% - 120px);
      }
    }
  }

  .center {
    flex: 1;
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 0 10px;

    .volume {
      flex: 1;
    }

    .chatbox {
      width: 100%;
      height: 200px;
      position: relative;
      // bottom: 10px;
      margin-top: 10px;
      color: #ec0000;
      padding: 0px;
      background-color: #2f3032;
      border-radius: 3px;

      .chat-set {
        line-height: 40px;
        width: 40px;
        text-align: center;
        position: absolute;
        top: 0;
        right: 0;

        i {
          color: #000;
          font-size: 16px;
        }
      }

      .shijia {
        position: absolute;
        top: 0;
        right: 50px;
        line-height: 40px;
      }

      .pricew {
        width: 140px;
      }

      .numbw {
        width: 140px;
      }

      .buyBtn,
      .itemContent,
      .saleBtn {
        height: 140px;
      }

      // .itemContent>>>.el-form-item__label {
      //   font-size: 12px;
      //   font-weight: normal;
      //   color: #ffffff !important;
      // }

      .itemContent {
        min-width: 505px;

        >>>.el-form-item__label {
          font-size: 12px;
          font-weight: normal;
          color: #ffffff !important;
        }

      }

      .saleBtn .btn,
      .buyBtn .btn {
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 5px;
        width: 80px;
        height: 80px;
        box-shadow: 2px 2px 10px rgba(121, 130, 160, .55),
          -2px -2px 10px rgb(255, 255, 255);
        user-select: none;
        transition: box-shadow 50ms ease-out;
        margin: auto;
        margin-top: 20px;
        color: #fff;
        font-size: 12px;
        font-weight: bold;
      }

      .saleBtn .btn:active,
      .buyBtn .btn:active {
        box-shadow: 0 0 0 rgba(0, 0, 0, 0),
          0 0 0 rgba(0, 0, 0, 0),
          inset 2px 2px 10px rgba(121, 130, 160, .55),
          inset -2px -2px 10px rgb(255, 255, 255);
        font-weight: 700;
        color: #fff;
      }

      .buyBtn .btn {
        background-color: #00da3c;
        color: #fff;
      }

      .saleBtn .btn {
        background-color: #ec0000;
        color: #fff;
      }
    }

    .record {
      width: 100%;
    }
  }

  .right-group {
    display: flex;
    flex-direction: column;
    position: relative;
    min-width: 100%;
    // border-top: 1px solid #ec0000;
    // border-left: 1px solid #ec0000;

    .open-colse {
      position: absolute;
      width: 16px;
      height: 16px;
      left: -20px;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
    }

    .open-colse:hover {
      color: #00da3c;
      font-size: 20px;
    }

    .r-in,
    .r-out {
      position: relative;

      span {
        width: 50px;
      }
    }

    .r-in:after {
      content: "买单";
      color: #00da3c;
    }

    .r-out:after {
      content: "卖单";
      color: #ec0000;
    }

    .r-in:after,
    .r-out:after {
      position: absolute;
      top: 30px;
      left: 120px;
      font-size: 40px;
      line-height: 40px;
      z-index: -1;
      opacity: 0.2;
      transform: rotate(320deg);
      -webkit-transform: rotate(320deg);
    }

    .r-in,
    .r-out,
    .r-trans {
      height: 120px;
      //border-bottom: 1px solid #ec0000;

      .el-scrollbar {
        width: 100%;
        height: 100%;

        .el-scrollbar__wrap {
          height: 100%;
          overflow: scroll;
          overflow-x: hidden;

          ul li {
            height: 20px;
            line-height: 20px;
            color: #ffffff;
            box-sizing: border-box;
            font-size: 12px;
            display: flex;
            padding: 0 5px;
            cursor: pointer;
            // border-bottom: 1px dashed rgb(51, 51, 51);
            font-family: fangsong;
            font-weight: normal;

            span {
              justify-content: flex-start;
              padding: 0 3px;
              font-size: 14px;
            }
          }

          ul li:hover {
            background: #3f3f3f;
          }

          ul li:last-child {
            border-bottom: none;
          }

          .colume1 {
            min-width: 30px;
            width: 20%;
            border-radius: 3px;
            margin: 1px;
            color: #fff;
            text-align: center;
          }

          .trans_item {
            padding-left: 0;
          }

          .trans_item .colume1 span {
            min-width: 30px;
            width: 45px;
            border-radius: 2px;
            display: inline-block;
            background-color: #289c89;
            height: 18px;
            line-height: 18px;

          }

          .colume2 {
            width: 25%;
            min-width: 30px;
            text-align: center;
          }

          .colume3 {
            width: 25%;
            min-width: 30px;
            text-align: center;
          }

          .colume4 {
            width: 25%;
            min-width: 30px;
            text-align: center;
          }
        }
      }
    }

    .r-out {
      padding: 8px;
      border-radius: 3px;
      background-color: rgb(236 0 0 / 20%);
      margin-top: 10px;
      overflow: hidden;
    }

    .r-in {
      padding: 8px;
      border-radius: 3px;
      background-color: rgb(0 128 0 / 20%);
      margin-top: 10px;
      overflow: hidden;

    }

    .r-trans {
      transform: scale(1);
      border-radius: 3px;
      background-color: hsl(220 3% 19% / 1);
      margin-top: 10px;
      overflow: hidden;

      .grid-content {
        text-align: center;
        height: 35px;
        line-height: 35px;
        font-weight: bold;
        font-family: fangsong;
      }

      .trans-header {
        background-color: #000;
      }

      .trans-body {
        height: calc(100% - 35px);
        overflow-y: auto;
      }

    }

    .custom-skeleton-item {
      background: -webkit-gradient(linear, left top, right top, color-stop(25%, #f2f2f2), color-stop(37%, #e6e6e6), color-stop(63%, #f2f2f2));
      background: linear-gradient(90deg, #656565 25%, #938b8b 37%, #6f5353 63%);
      background-size: 400% 100%;
      -webkit-animation: el-skeleton-loading 1.4s ease infinite;
      animation: el-skeleton-loading 1.4s ease infinite;
    }

    .custom-skeleton-item {
      margin: 2px 0;

      .el-skeleton__text {
        width: 100%;
        height: 14px;
        line-height: 20px;
      }
    }
  }
}

.ellipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  -o-text-overflow: ellipsis;
}
</style>
<style lang="scss">
.txt-red {
  color: #ec0000 !important;
}

.txt-green {
  color: #00da3c !important;
}

.txt-yellow {
  color: yellow !important;
}

.txt-orange {
  color: orange !important;
}

.txt-white {
  color: white !important;
}

.txt-bold {
  font-weight: bold;
}

.default-set-wrapper {
  padding: 0 0px;

  .default-title {
    width: 100%;
    line-height: 45px;
    color: black;
    font-size: 18px;
    text-align: center;
    font-weight: bold;
  }

  .el-form-item__label {
    font-size: 12px;
    font-weight: normal;
    color: #000;
  }

  .el-form-item--small.el-form-item {
    width: 200px;
  }
}

.chatbox {

  // .el-button--mini,
  // .el-button--mini.is-round {
  //   padding: 6px 10px;
  // }
  .sale-form {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    padding: 10px 0;

    .el-button--primary {
      background-color: #ec0000;
      border-color: #ec0000;
    }

    .el-button--primary:hover {
      background-color: rgb(221, 28, 28);
      border-color: rgb(221, 28, 28);
    }

    .el-button--primary:last-child {
      border-left-color: rgba(255, 255, 255, 0.5);
    }

    .btn-red,
    .btn-active {
      background: #ec0000 !important;
      color: white;
      border: 1px solid rgb(238, 3, 3);
    }

    .btn-red:hover {
      background: rgb(250, 64, 64) !important;
      color: white;
    }

    .el-form-item__label {
      font-size: 12px;
      font-weight: normal;
      color: #ec0000 !important;
    }
  }

  .buy-form {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: flex-start;
    padding: 10px 0;

    .el-button--primary {
      background-color: #008000;
      border-color: #008000;
    }

    .el-button--primary:hover {
      background-color: rgb(6, 156, 6);
      border-color: rgb(6, 156, 6);
    }

    .el-button--primary:last-child {
      border-left-color: rgba(255, 255, 255, 0.5);
    }

    .btn-green,
    .btn-active {
      background: #00da3c !important;
      color: white;
      border: 1px solid #00da3c;
    }

    .btn-green:hover {
      background: rgb(8, 145, 8) !important;
      color: white;
      border: 1px solid #00da3c;
    }

    .el-form-item__label {
      font-size: 12px;
      font-weight: normal;
      color: #008000 !important;
    }
  }

  .el-tabs__item {
    font-size: 12px;
    padding: 0 10px;
    font-weight: bold;
  }

  .el-tabs__item:hover {
    color: rgb(0, 0, 0) !important;
  }

  #tab-buy.el-tabs__item.is-active {
    color: #008000;
  }

  #tab-sale.el-tabs__item.is-active {
    color: #ec0000;
  }

  .el-tabs__nav-wrap::after {
    background-color: #ec0000;
    height: 1px;
  }

  .el-tabs__active-bar {
    background-color: white;
  }

  .el-tabs__nav-scroll {
    padding: 0 10px;
  }

  .el-tabs__content {
    padding: 0 10px;
  }

  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 14px;
  }
}
</style>
