<template>
  <div style="background-color: #202020">
    <div
      class="head"
      :style="{ height: `${headH}px`, lineHeight: `${headH}px` }"
    >
      <ul class="k-nav">
        <li style="width: 190px">
          <el-row class="slt-type">
            <el-col :span="14">
              <div class="grid-content">
                <el-select
                  v-model="tstype"
                  clearable
                  placeholder="债券类型"
                  @change="handleChangeTSType"
                >
                  <el-option
                    v-for="item in optionTSType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="10">
              <div class="grid-content">
                <el-select
                  v-model="tslength"
                  clearable
                  placeholder="年限"
                  @change="handleChangeTSType"
                >
                  <el-option
                    v-for="item in optionYear"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-col>
          </el-row>
        </li>
        <li
          v-for="item in loopmethodskey"
          @click="klinemethods[item]"
          :class="{ active: klineactive == item }"
          :key="item"
        >
          {{ item }}
        </li>
        <li style="font-weight: bold; font-size: 20px; color: red">
          {{ tscode }}
        </li>
        <li
          class="nav-right"
          v-if="favoriteTscodeIcon == favoriteTscodeIconList[0]"
          @click="handleFavorite"
        >
          <span class="i-text">
            <i :class="favoriteTscodeIconList[0]"></i>
          </span>
        </li>
        <li
          class="nav-right"
          v-if="favoriteTscodeIcon == favoriteTscodeIconList[1]"
          @click="handleFavoriteCancel"
        >
          <span class="i-text" style="color: yellow">
            <i :class="favoriteTscodeIconList[1]"></i>
          </span>
        </li>
        <li class="nav-right">
          <span class="i-text" style="color: white">
            <el-badge is-dot class="item">
              <i class="el-icon-message-solid" @click="showMsg()"></i>
            </el-badge>
          </span>
        </li>
        <li class="nav-right">
          <router-link
            target="_blank"
            :to="{ path: '/main' }"
            class="i-text"
            style="color: white"
            ><i class="el-icon-s-home"></i
          ></router-link>
        </li>
      </ul>
    </div>
    <div class="container" style="background-color: #202020">
      <!-- 左侧 -->
      <div class="left-group">
        <ul class="left-tabs">
          <li
            :class="activeTab == tabList[0] ? 'active' : ''"
            @click="handleClickTab(tabList[0])"
          >
            单券
          </li>
          <li
            :class="activeTab == tabList[1] ? 'active' : ''"
            @click="handleClickTab(tabList[1])"
          >
            价差
          </li>
          <li
            :class="activeTab == tabList[2] ? 'active' : ''"
            @click="handleClickTab(tabList[2])"
          >
            收藏
          </li>
        </ul>
        <div class="tab-common tab-0" v-if="activeTab == tabList[0]">
          <div class="search-box">
            <com-tscode-select
              ref="refComTscodeSelect"
              @change="handlerTscodeSelect"
              style="width: 100%"
            >
            </com-tscode-select>
          </div>
          <hr color="red" size="1" style="margin: 0" />
          <el-scrollbar>
            <ul>
              <li
                v-for="item in tscodeList"
                :key="item.id"
                @click="handlerTscode(item)"
                :class="{ active: activeTscode == item.tscode }"
              >
                {{ item.bondname }}<br /><strong style="font-size: 16px">{{
                  item.tscode
                }}</strong>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <div class="tab-common tab-2" v-if="activeTab == tabList[2]">
          <hr color="red" size="1" style="margin: 0" />
          <el-scrollbar>
            <ul>
              <li
                v-for="item in tscodeListFavorite"
                :key="item.id"
                @click="handlerTscode(item)"
                :class="{ active: activeTscode == item.tscode }"
              >
                <strong style="font-size: 16px">{{ item.tscode }}</strong>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </div>
      <!-- 中间 -->
      <div class="center">
        <div ref="refKline" if="data0.length>0" style="height: 500px"></div>
      </div>
      <!-- 右侧 -->
      <div
        class="right-group"
        :style="{
          width: rightWith,
        }"
      >
        <!-- 关闭和打开右侧面板 -->
        <div class="open-colse" :class="fold" @click="handleOpenOrClose"></div>
        <!-- 卖出 -->
        <div class="r-out" v-if="businessOutList && businessOutList.length > 0">
          <el-scrollbar>
            <ul>
              <li
                v-for="(item, index) in businessOutList"
                :key="index"
                :title="item.volumecomment ? item.volumecomment : item.volume"
              >
                <span style="width: 50px">{{ item.brokerName }}</span>
                <span style="flex: 1" class="ellipsis">
                  {{ item.volumecomment ? item.volumecomment : item.volume }}
                </span>
                <span style="width: 50px">{{ item.price }}</span>
                <span style="width: 50px">{{ item.updatetime }}</span>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <!-- 买入 -->
        <div class="r-in" v-if="businessInList && businessInList.length > 0">
          <el-scrollbar>
            <ul>
              <li
                v-for="(item, index) in businessInList"
                :key="index"
                :title="item.volumecomment ? item.volumecomment : item.volume"
              >
                <span style="width: 50px">{{ item.brokerName }}</span>
                <span class="ellipsis" style="flex: 1">
                  {{ item.volumecomment ? item.volumecomment : item.volume }}
                </span>
                <span style="width: 50px">{{ item.price }}</span>
                <span style="width: 50px">{{ item.updatetime }}</span>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <!-- 交易 -->
        <div class="r-trans" v-if="transactionAllList.length > 0">
          <el-scrollbar>
            <ul style="margin-top: 20px">
              <li class="li-first">
                <span style="width: 60px">方向</span>
                <span style="width: 120px">价格</span>
                <span style="width: 100px">中介</span>
                <span style="width: 80px">交易时间</span>
                <!-- <span style="width: 60px">净价</span> -->
              </li>
              <li
                v-for="(item, index) in transactionAllList"
                :key="index"
                :class="funcSelectColor(item.dealtype)"
              >
                <span style="width: 60px">{{ item.dealtype }}</span>
                <span style="width: 120px">{{ item.tradeprice }}</span>
                <span style="width: 100px">{{ item.brokerName }}</span>
                <span style="width: 80px">{{ item.tradetime }}</span>
                <!-- <span style="width: 60px">{{ item.netprice }}</span> -->
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <!-- 交易聊天框 -->
        <div class="chatbox">
          <ul class="best-price-wapper">
            <el-popover
              placement="bottom-end"
              width="300"
              trigger="manual"
              ref="popover-set"
              v-model="popoverSetVisible"
            >
              <div class="default-set-wrapper">
                <el-form
                  ref="setForm"
                  :model="setForm"
                  :rules="setFormRules"
                  label-width="100px"
                >
                  <el-form-item label="交易量（万）" prop="volume">
                    <el-input v-model="setForm.volume"></el-input>
                  </el-form-item>
                  <el-form-item label="快速提交">
                    <el-checkbox
                      label="是"
                      v-model="setForm.quickSubmit"
                      name="quickSubmit"
                    ></el-checkbox>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="submitForm('setForm')"
                      >保存默认设置</el-button
                    >
                    <el-button type="default" @click="popoverSetVisible = false"
                      >取消</el-button
                    >
                  </el-form-item>
                </el-form>
              </div>
              <li
                slot="reference"
                class="txt-white chat-set"
                @click="popoverSetVisible = !popoverSetVisible"
              >
                <i class="el-icon-setting"></i>
              </li>
            </el-popover>
            <li class="txt-red txt-bold">卖 {{ saleForm.price }}</li>
            <li class="txt-green txt-bold">买 {{ buyForm.price }}</li>
          </ul>
          <el-tabs v-model="activeName">
            <el-tab-pane label="买(F1)" name="buy">
              <el-form
                ref="buyForm"
                :model="buyForm"
                label-width="70px"
                size="mini"
                class="buy-form"
              >
                <el-form-item label="债券代码">
                  <span class="txt-green">{{ buyForm.tscode }}</span>
                </el-form-item>
                <el-form-item label="价格">
                  <span class="txt-green">{{ buyForm.price }}</span>
                </el-form-item>
                <el-form-item label="交易量(万)">
                  <el-input
                    v-model="buyForm.volume"
                    placeholder="请输入交易量"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button-group>
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('buyForm', 0)"
                      >清零</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('buyForm', 1000)"
                      >1</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('buyForm', 2000)"
                      >2</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('buyForm', 3000)"
                      >3</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('buyForm', 5000)"
                      >5</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('buyForm', 10000)"
                      >10</el-button
                    >
                  </el-button-group>
                </el-form-item>
                <el-form-item label="交易速度">
                  <el-date-picker
                    v-model="buyForm.deliveryTime"
                    type="date"
                    placeholder="选择日期"
                    style="width: 130px"
                    :clearable="false"
                  >
                  </el-date-picker>
                  <el-button-group>
                    <el-button
                      icon="el-icon-plus"
                      :class="funcDeliverySpeed('buyForm', 0)"
                      @click="handleDelivertySpeed('buyForm', 0)"
                      >0</el-button
                    >
                    <el-button
                      icon="el-icon-plus"
                      :class="funcDeliverySpeed('buyForm', 1)"
                      @click="handleDelivertySpeed('buyForm', 1)"
                      >1</el-button
                    >
                  </el-button-group>
                </el-form-item>
                <el-form-item label="交易员">
                  <el-select
                    v-model="buyForm.tradeuserId"
                    placeholder="请选择交易员"
                  >
                    <el-option
                      v-for="item in tradeUsersOption"
                      :key="item.userId"
                      :label="item.userName"
                      :value="item.userId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input
                    type="textarea"
                    v-model="buyForm.remark"
                    placeholder="请输入内容"
                    resize="none"
                    rows="2"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button class="btn-green" @click="submitForm('buyForm')"
                    >发送</el-button
                  >
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="卖(F2)" name="sale">
              <el-form
                ref="saleForm"
                :model="saleForm"
                label-width="70px"
                size="mini"
                class="sale-form"
              >
                <el-form-item label="债券代码">
                  <span class="txt-red">{{ saleForm.tscode }}</span>
                </el-form-item>
                <el-form-item label="价格">
                  <span class="txt-red">{{ saleForm.price }}</span>
                </el-form-item>
                <el-form-item label="交易量(万)">
                  <el-input
                    v-model="saleForm.volume"
                    placeholder="请输入交易量"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button-group>
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('saleForm', 0)"
                      >清零</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('saleForm', 1000)"
                      >1</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('saleForm', 2000)"
                      >2</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('saleForm', 3000)"
                      >3</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('saleForm', 5000)"
                      >5</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('saleForm', 10000)"
                      >10</el-button
                    >
                  </el-button-group>
                </el-form-item>
                <el-form-item label="交易速度">
                  <el-date-picker
                    v-model="saleForm.deliveryTime"
                    type="date"
                    placeholder="选择日期"
                    style="width: 130px"
                    :clearable="false"
                  >
                  </el-date-picker>
                  <el-button-group>
                    <el-button
                      icon="el-icon-plus"
                      :class="funcDeliverySpeed('saleForm', 0)"
                      @click="handleDelivertySpeed('saleForm', 0)"
                      >0</el-button
                    >
                    <el-button
                      icon="el-icon-plus"
                      :class="funcDeliverySpeed('saleForm', 1)"
                      @click="handleDelivertySpeed('saleForm', 1)"
                      >1</el-button
                    >
                  </el-button-group>
                </el-form-item>
                <el-form-item label="交易员">
                  <el-select
                    v-model="saleForm.tradeuserId"
                    placeholder="请选择交易员"
                  >
                    <el-option
                      v-for="item in tradeUsersOption"
                      :key="item.userId"
                      :label="item.userName"
                      :value="item.userId"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="备注">
                  <el-input
                    type="textarea"
                    v-model="saleForm.remark"
                    placeholder="请输入内容"
                    resize="none"
                    rows="2"
                  ></el-input>
                </el-form-item>
                <el-form-item>
                  <el-button class="btn-red" @click="submitForm('saleForm')"
                    >发送</el-button
                  >
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>

    <!-- <el-dialog title="消息框" :visible.sync="dialogTableVisible">
      <el-table :data="gridDataMsg">
        <el-table-column
          property="tscode"
          label="债券编号"
          width="150"
        ></el-table-column>
        <el-table-column property="status" label="状态" width="150">
          <template slot-scope="scope">
            <span
              v-if="
                scope.row.status === 'start_bond' ||
                scope.row.status === 'delegate_bond'
              "
              >待接收</span
            >
            <span
              v-if="
                ['accept_bond_0', 'accept_bond_1'].indexOf(scope.row.status) !==
                -1
              "
              >已接收</span
            >
          </template>
        </el-table-column>
        <el-table-column property="direction" label="方向" width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.direction === 'bond_0'">买入</span>
            <span v-if="scope.row.direction === 'bond_1'">卖出</span>
          </template>
        </el-table-column>
        <el-table-column
          property="price"
          label="价格"
          width="200"
        ></el-table-column>
        <el-table-column property="volume" label="交易量"></el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              @click="handleReceiveClick(scope.row)"
              type="text"
              size="small"
              v-if="
                ['delegate_bond_0', 'delegate_bond_1'].indexOf(
                  scope.row.status
                ) !== -1
              "
              >接收</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-dialog> -->

    <el-dialog title="消息框" width="80%" :visible.sync="dialogTableVisible">
      <trade-enquiry ref="tradeEnquiry"></trade-enquiry>
      <div class="both-clear"></div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import Router from '@/router'
import { mapGetters } from 'vuex'
import api from '@/api/kk_bond_pool'
import apiTrade from '@/api/kk_trade'
import apiKLine from '@/api/kk_kline'
import apiAdmin from '@/api/kk_power_admin'
import ComTscodeSelect from '@/components/ComTscodeSelect.vue'
import * as echarts from 'echarts'
import configUtil from '@/utils/config.js'
import * as util from '@/utils/util'
import TradeEnquiry from '@/views/KKTrade/Enquiry.vue'
let socket
let lockReconnect = false
export default {
  components: {
    ComTscodeSelect,
    TradeEnquiry
  },
  data() {
    return {
      // 框架
      headH: 50,
      // k线栏目
      klineactive: '日线',
      loopmethodskey: ['1分钟', '5分钟', '日线'],
      klinemethods: {
        '1分钟': () => {
          this.getKLineMinute('1分钟')
        },
        '5分钟': () => {
          this.getKLineFiveMinute('5分钟')
        },
        '日线': () => {
          this.getKLineDay('日线')
        }
      },
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
      fold: 'el-icon-s-unfold',
      rightWith: '360px',
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
      // 买
      businessInList: [],
      // 卖
      businessOutList: [],
      // 买卖成交长度
      inOutLength: 26,
      // 所有
      businessAllList: [],
      // {
      //       "tscode": "220019.IB",
      //       "volume": "5000",
      //       "price": 2.9500,
      //       "updatetime": "17:41:20",
      //       "updatedatetime": "2023-01-18 17:41:20",
      //       "brokerid": 2,
      //       "brokerName": null,
      //       "bidtype": 0,
      //       "barginflag": 0,
      //       "volumecomment": "5000(明天+0)",
      //       "lasttransaction": 2.9375,
      //       "netprice": 0.0000
      //   },
      // 交易数据
      transactionAllList: [],
      // {
      //       "id": 675851,
      //       "tscode": "220019.IB",
      //       "tradetime": "13:52:22",
      //       "tradedate": "2023-01-19 13:52:22",
      //       "tradeprice": 2.9425,
      //       "brokerid": 1,
      //       "dealtype": "TKN",
      //       "forwardcontact": true,
      //       "tradeid": "TPSHe1065629800410025985",
      //       "duration": "8.3392",
      //       "changebp": "+0.5",
      //       "netprice": 97.1486
      //   },
      createSocketIO: null,
      createSocketEmitter: null,
      activeName: 'buy',
      // chart
      saleForm: {
        // 交易类型
        direction: '卖',
        // 价格
        price: '',
        // 交易量
        volume: 5000,
        // 债券号
        tscode: '',
        // 交割速度
        deliverySpeed: 0,
        // 交割时间
        deliveryTime: '',
        // 交易员
        tradeuserId: '',
        // 备注
        remark: '',
        // 快速交易
        quickSubmit: false,
      },
      saleFormRules: [],
      buyForm: {
        // 交易类型
        direction: '买',
        // 价格
        price: '',
        // 交易量
        volume: 5000,
        // 债券号
        tscode: '',
        // 交割速度
        deliverySpeed: 0,
        // 交割时间
        deliveryTime: '',
        // 交易员
        tradeuserId: '',
        // 备注
        remark: '',
        // 快速交易
        quickSubmit: false
      },
      buyFormRules: [],
      setForm: {
        volume: 0,
        quickSubmit: false
      },
      setFormRules: [],
      popoverSetVisible: false,
      gridDataMsg: [],
      dialogTableVisible: false,
      tradeUsersOption: []
    }
  },
  computed: {
    ...mapGetters({
      tscodeGlobal: 'getTscodeGlobal',
      defaultSet: 'getDefaultSet'
    })
  },
  watch: {
    activeTscode(newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal && socket != null) {
          console.log(JSON.stringify({ "dataKey": newVal, "dataType": "tscode" }))
          socket.send(JSON.stringify({ "dataKey": newVal, "dataType": "tscode" }))
          this.calcFavoriteIcon()
        }
      }
    }
  },
  created() {
    this.keyDown()
    this.initSocket()
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
  },
  methods: {
    // 获取所有债券号相关信息
    getAllBondPool() {
      api.getAll({}).then(res => {
        if (res.code === '00000') {
          Promise.all([
            this.tscodeList = res.value
          ]).then(() => {
            if (this.tscodeGlobal !== '') {
              this.activeTscode = this.tscode = this.tscodeGlobal
            } else {
              this.activeTscode = this.tscode = this.tscodeList.length > 0 ? this.tscodeList[0].tscode : ''
            }
            this.klinemethods[this.klineactive]()
            this.initCommonData()
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
    getKLineMinute(klinekey) {
      Promise.all([
        this.data0 = [],
        this.klineactive = klinekey
      ]).then(() => {
        apiKLine.getKLineMinute({
          tscode: this.tscode,
          starttime: this.starttime,
          endtime: this.endtime,
          noForward: this.noForward
        }).then(res => {
          if (res.code === '00000') {
            const chartDom = this.$refs.refKline
            this.myChart = echarts.init(chartDom)
            this.data0 = this.splitData(res.value, 'endtime')
            const upColor = '#ec0000';
            const upBorderColor = '#8A0000';
            const downColor = '#00da3c';
            const downBorderColor = '#008F28';
            const option = {
              darkMode: true,
              backgroundColor: 'transparent',
              gradientColor: [],
              // title: {
              //   text: '分钟线',
              //   left: 0
              // },
              tooltip: {
                show: true,
                trigger: 'axis',
                formatter: function (params) {
                  // 修改鼠标划过显示为中文
                  let ma5 = params[1].data // ma5的值
                  params = params[0] // 开盘收盘最低最高数据汇总
                  let currentItemData = params.data;
                  return params.name + '<br>' +
                    params.marker + '1分钟线' + '<br>' +
                    '开盘：' + currentItemData[1] + '<br>' +
                    '收盘：' + currentItemData[2] + '<br>' +
                    '最低：' + currentItemData[3] + '<br>' +
                    '最高：' + currentItemData[4] + '<br>' +
                    'MA5:' + ma5
                },
                axisPointer: {
                  type: 'cross',
                  lineStyle: {
                    opacity: 0
                  },
                  crossStyle: {
                    opacity: 0
                  }
                },
              },
              legend: {
                data: ['日线'],
                show: false
              },
              grid: {
                left: '5px',
                right: '5px',
                bottom: '5px',
                top: 10,
                containLabel: true,
                show: true,
                borderColor: 'red'
              },
              xAxis: {
                type: 'category',
                data: this.data0.categoryData,
                boundaryGap: false,
                axisLine: {
                  onZero: false,
                  lineStyle: {
                    color: 'red',
                    width: 1,
                    type: 'dotted'
                  }
                },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax'
              },
              yAxis: {
                scale: true,
                position: 'right',
                splitArea: {
                  show: false
                },
                axisLine: {
                  onZero: false,
                  lineStyle: {
                    color: 'red',
                    width: 1,
                    type: 'dotted'
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: ['rgb(51,51,51)'],
                    width: 1,
                    type: 'dashed'
                  }
                }
              },
              dataZoom: [
                {
                  type: 'inside',
                  start: 50,
                  end: 100
                },
                {
                  show: false,
                  type: 'slider',
                  top: '90%',
                  start: 50,
                  end: 100
                }
              ],
              series: [
                {
                  name: '1分钟线',
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
                  markPoint: {
                    itemStyle: {
                      opacity: 0
                    }
                  },
                  markLine: {
                    lineStyle: {
                      opacity: 0
                    }
                  }
                },
                {
                  name: 'MA5',
                  type: 'line',
                  data: this.calculateMA(5, this.data0),
                  smooth: true,
                  lineStyle: {
                    opacity: 0.8
                  }
                },
              ]
            }
            option && this.myChart.setOption(option, true)
          }
        })
      })
    },
    // 5分钟线
    getKLineFiveMinute(klinekey) {
      this.data0 = []
      this.klineactive = klinekey
      apiKLine.getKLineFiveMinute({
        tscode: this.tscode,
        starttime: this.starttime,
        endtime: this.endtime,
        noForward: this.noForward
      }).then(res => {
        if (res.code === '00000') {
          const chartDom = this.$refs.refKline
          this.myChart = echarts.init(chartDom)
          this.data0 = this.splitData(res.value, 'endtime')
          const upColor = '#ec0000';
          const upBorderColor = '#8A0000';
          const downColor = '#00da3c';
          const downBorderColor = '#008F28';
          const option = {
            darkMode: true,
            backgroundColor: 'transparent',
            gradientColor: [],
            tooltip: {
              show: true,
              trigger: 'axis',
              formatter: function (params) {
                // 修改鼠标划过显示为中文
                let ma5 = params[1].data // ma5的值
                params = params[0] // 开盘收盘最低最高数据汇总
                let currentItemData = params.data;
                return params.name + '<br>' +
                  params.marker + '5分钟线' + '<br>' +
                  '开盘：' + currentItemData[1] + '<br>' +
                  '收盘：' + currentItemData[2] + '<br>' +
                  '最低：' + currentItemData[3] + '<br>' +
                  '最高：' + currentItemData[4] + '<br>' +
                  'MA5:' + ma5
              },
              axisPointer: {
                type: 'cross',
                lineStyle: {
                  opacity: 0
                },
                crossStyle: {
                  opacity: 0
                }
              },
            },
            legend: {
              data: ['日线'],
              show: false
            },
            grid: {
              left: '5px',
              right: '5px',
              bottom: '5px',
              top: 10,
              containLabel: true,
              show: true,
              borderColor: 'red'
            },
            xAxis: {
              type: 'category',
              data: this.data0.categoryData,
              boundaryGap: false,
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: 'red',
                  width: 1,
                  type: 'dotted'
                }
              },
              splitLine: { show: false },
              min: 'dataMin',
              max: 'dataMax'
            },
            yAxis: {
              scale: true,
              position: 'right',
              splitArea: {
                show: false
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: 'red',
                  width: 1,
                  type: 'dotted'
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: ['rgb(51,51,51)'],
                  width: 1,
                  type: 'dashed'
                }
              }
            },
            dataZoom: [
              {
                type: 'inside',
                start: 50,
                end: 100
              },
              {
                show: false,
                type: 'slider',
                top: '90%',
                start: 50,
                end: 100
              }
            ],
            series: [
              {
                name: '5分钟线',
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
                markPoint: {
                  itemStyle: {
                    opacity: 0
                  }
                },
                markLine: {
                  lineStyle: {
                    opacity: 0
                  }
                }
              },
              {
                name: 'MA5',
                type: 'line',
                data: this.calculateMA(5, this.data0),
                smooth: true,
                lineStyle: {
                  opacity: 0.8
                }
              },
            ]
          }
          option && this.myChart.setOption(option, true)
        }
      })
    },
    // 日线
    getKLineDay(klinekey) {
      Promise.all([
        this.data0 = [],
        this.klineactive = klinekey
      ]).then(() => {
        apiKLine.getKLineDay({
          tscode: this.tscode,
          startdate: this.startdate,
          enddate: this.enddate,
          noForward: this.noForward
        }).then(res => {
          if (res.code === '00000') {
            const chartDom = this.$refs.refKline
            this.myChart = echarts.init(chartDom)
            this.data0 = this.splitData(res.value, 'tradedate')
            const upColor = '#ec0000';
            const upBorderColor = '#8A0000';
            const downColor = '#00da3c';
            const downBorderColor = '#008F28';
            const option = {
              darkMode: true,
              backgroundColor: 'transparent',
              gradientColor: [],
              // tooltip: {
              //   show: true,
              //   trigger: 'axis',
              //   formatter: function (params) {
              //     console.log(params)
              //     // 修改鼠标划过显示为中文
              //     let ma5 = params[1].data // ma5的值
              //     let ma10 = params[2].data // ma10的值
              //     let ma20 = params[3].data // ma20的值
              //     let ma30 = params[4].data // ma30的值
              //     params = params[0] // 开盘收盘最低最高数据汇总
              //     let currentItemData = params.data;
              //     return params.name + '<br>' +
              //       params.marker + params.seriesName + '<br>' +
              //       '开盘：' + currentItemData[1] + '<br>' +
              //       '收盘：' + currentItemData[2] + '<br>' +
              //       '最低：' + currentItemData[3] + '<br>' +
              //       '最高：' + currentItemData[4] + '<br>' +
              //       'MA5日均线：' + ma5 + '<br>' +
              //       'MA10日均线：' + ma10 + '<br>' +
              //       'MA20日均线：' + ma20 + '<br>' +
              //       'MA30日均线：' + ma30
              //   },
              //   axisPointer: {
              //     type: 'cross',
              //     lineStyle: {
              //       opacity: 0
              //     },
              //     crossStyle: {
              //       opacity: 0
              //     }
              //   },
              // },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross'
                }
              },
              legend: {
                data: ['日线', 'MA5', 'MA10', 'MA20', 'MA30'],
                show: true,
                textStyle: {
                  color: 'red'
                },
                selected: {
                  'MA10': false,
                  'MA20': false,
                  'MA30': false
                }
              },
              grid: {
                left: '0px',
                right: '5px',
                bottom: '0px',
                top: 50,
                containLabel: true,
                show: true,
                borderColor: 'red'
              },
              xAxis: {
                type: 'category',
                data: this.data0.categoryData,
                boundaryGap: false,
                axisLine: {
                  show: false,
                  onZero: false,
                  lineStyle: {
                    color: 'red',
                    width: 1,
                    type: 'dotted'
                  }
                },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax'
              },
              yAxis: {
                scale: true,
                position: 'right',
                splitArea: {
                  show: false
                },
                axisLine: {
                  onZero: false,
                  lineStyle: {
                    color: 'red',
                    width: 1,
                    type: 'dashed'
                  }
                },
                splitLine: {
                  show: true,
                  lineStyle: {
                    color: ['rgb(51,51,51)'],
                    width: 1,
                    type: 'dashed'
                  }
                }
              },
              dataZoom: [
                {
                  type: 'inside',
                  start: 50,
                  end: 100
                },
                {
                  show: false,
                  type: 'slider',
                  top: '90%',
                  start: 50,
                  end: 100
                }
              ],
              series: [
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
                  // markPoint: {
                  //   itemStyle: {
                  //     opacity: 0
                  //   }
                  // },
                  // markLine: {
                  //   lineStyle: {
                  //     opacity: 0
                  //   }
                  // }
                  // markPoint: {
                  //   label: {
                  //     formatter: function (param) {
                  //       return param != null ? Math.round(param.value) + '' : '';
                  //     }
                  //   },
                  //   data: [
                  //     {
                  //       name: 'Mark',
                  //       coord: ['2013/5/31', 2300],
                  //       value: 2300,
                  //       itemStyle: {
                  //         color: 'rgb(41,60,85)'
                  //       }
                  //     },
                  //     {
                  //       name: 'highest value',
                  //       type: 'max',
                  //       valueDim: 'highest'
                  //     },
                  //     {
                  //       name: 'lowest value',
                  //       type: 'min',
                  //       valueDim: 'lowest'
                  //     },
                  //     {
                  //       name: 'average value on close',
                  //       type: 'average',
                  //       valueDim: 'close'
                  //     }
                  //   ],
                  //   tooltip: {
                  //     formatter: function (param) {
                  //       return param.name + '<br>' + (param.data.coord || '');
                  //     }
                  //   }
                  // },
                  // markLine: {
                  //   symbol: ['none', 'none'],
                  //   data: [
                  //     [
                  //       {
                  //         name: 'from lowest to highest',
                  //         type: 'min',
                  //         valueDim: 'lowest',
                  //         symbol: 'circle',
                  //         symbolSize: 10,
                  //         label: {
                  //           show: false
                  //         },
                  //         emphasis: {
                  //           label: {
                  //             show: false
                  //           }
                  //         }
                  //       },
                  //       {
                  //         type: 'max',
                  //         valueDim: 'highest',
                  //         symbol: 'circle',
                  //         symbolSize: 10,
                  //         label: {
                  //           show: false
                  //         },
                  //         emphasis: {
                  //           label: {
                  //             show: false
                  //           }
                  //         }
                  //       }
                  //     ],
                  //     {
                  //       name: 'min line on close',
                  //       type: 'min',
                  //       valueDim: 'close'
                  //     },
                  //     {
                  //       name: 'max line on close',
                  //       type: 'max',
                  //       valueDim: 'close'
                  //     }
                  //   ]
                  // }
                },
                {
                  name: 'MA5',
                  type: 'line',
                  data: this.calculateMA(5, this.data0),
                  smooth: true,
                  lineStyle: {
                    opacity: 0.5
                  }
                },
                {
                  name: 'MA10',
                  type: 'line',
                  data: this.calculateMA(10, this.data0),
                  smooth: true,
                  lineStyle: {
                    opacity: 0.5
                  }
                },
                {
                  name: 'MA20',
                  type: 'line',
                  data: this.calculateMA(20, this.data0),
                  smooth: true,
                  lineStyle: {
                    opacity: 0.5
                  }
                },
                {
                  name: 'MA30',
                  type: 'line',
                  data: this.calculateMA(30, this.data0),
                  smooth: true,
                  lineStyle: {
                    opacity: 0.5
                  }
                },
              ]
            }
            // this.myChart.setOption(option, true) 参数true表示清空之前的数据，默认为false
            option && this.myChart.setOption(option, true)
          }
        })
      })
    },
    // 收藏列表
    favoriteList() {
      api.favoriteList().then(response => {
        if (response && response.code === '00000') {
          this.tscodeListFavorite = response.value
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
    handleFavorite() {
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
    },
    // 取消收藏事件
    handleFavoriteCancel() {
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
    },
    // 下拉框选择债券
    handlerTscodeSelect(obj) {
      Promise.all([
        this.activeTscode = this.tscode = obj.value
      ]).then(res => {
        this.calcFavoriteIcon()
        this.klinemethods[this.klineactive]()
        this.initCommonData()
      })
    },
    // 债券点击事件
    handlerTscode(item) {
      Promise.all([
        this.activeId = item.id,
        this.tscode = item.tscode,
        this.activeTscode = item.tscode,
        this.activeTab === this.tabList[0] ? this.$refs.refComTscodeSelect.value = '' : ''
      ]).then(() => {
        this.klinemethods[this.klineactive]()
        this.calcFavoriteIcon()
        this.initCommonData()
      })
    },
    // 图表数据分类方法
    splitData(rawData, xAxisKey) {
      const categoryData = []
      const values = []
      for (let i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i][xAxisKey])
        values.push([rawData[i].openprice, rawData[i].closeprice, rawData[i].lowprice, rawData[i].highprice])
      }
      return {
        categoryData,
        values
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
        result.push(util.moneyFormat(sum / dayCount, 3));
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
        console.log(keyCode)
        switch (keyCode) {
          case 13:
            // 检查K线轮询个数
            const klineLoopCount = self.loopmethodskey.length
            const indecator = self.loopmethodskey.indexOf(self.klineactive)
            if (klineLoopCount - 1 <= indecator) {
              self.klinemethods[self.loopmethodskey[0]]()
            } else {
              self.klinemethods[self.loopmethodskey[indecator + 1]]()
            }
            if (e && e.preventDefault) {
              e.preventDefault()
            } else {
              window.event.returnValue = false
            }
            break
          case 112:
            self.activeName = 'buy'
            if (e && e.preventDefault) {
              e.preventDefault()
            } else {
              window.event.returnValue = false
            }
            break;
          case 113:
            self.activeName = 'sale'
            if (e && e.preventDefault) {
              e.preventDefault()
            } else {
              window.event.returnValue = false
            }
            break;
        }
      }
    },
    keyDownReview() {
      document.onkeydown = function (event) {
        var e = event || window.event
        e.returnValue = true
      }
    },
    // 右侧面板关闭打开
    handleOpenOrClose() {
      if (this.fold === 'el-icon-s-unfold') {
        this.fold = 'el-icon-s-fold'
        this.rightWith = '0px'
      } else {
        this.fold = 'el-icon-s-unfold'
        this.rightWith = '360px'
      }
      setTimeout(() => {
        this.myChart.resize()
      }, 600)
    },
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
          Promise.all([
            this.tscodeList = res.value
          ]).then(() => {
            Promise.all([
              this.activeTscode = this.tscode = this.tscodeList.length > 0 ? this.tscodeList[0].tscode : ''
            ]).then(() => {
              if (this.tscode !== '') {
                this.klinemethods[this.klineactive]()
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
    handleClickTab(tab) {
      this.activeTab = tab;
      if (tab === this.tabList[2]) {
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
              self.buyForm.price = self.funcGetBestPrice('max', res.value)
              break;
            case 0:
              self.businessInList = res.value
              self.saleForm.price = self.funcGetBestPrice('min', res.value)
              break;
            default:
              self.businessAllList = res.value
          }
        }
      })
    },
    // 右侧
    // 实时成交数据
    initRightTransactionList() {
      api.transactionList({
        tscode: this.activeTscode
      }).then(res => {
        console.log('成交返回')
        console.log(res.value)
        if (res.code === '00000') {
          this.transactionAllList = res.value
        }
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
      // 初始化实时交易数据
      this.initRightTransactionList()
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
          return 'txt-yellow'
      }
    },
    // 买卖最优值(type:min最小，type:max最大;arr:初始数组;)
    funcGetBestPrice(type, arr) {
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
        this[formType].volume += val
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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          switch (formName) {
            case 'setForm':
              this.$store.commit('SET_DEFAULT_SET', JSON.stringify(this[formName]))
              this.buyForm.volume = parseInt(this[formName].volume)
              this.saleForm.volume = parseInt(this[formName].volume)
              this.buyForm.quickSubmit = this[formName].quickSubmit
              this.saleForm.quickSubmit = this[formName].quickSubmit
              this.$refs['popover-set'].doClose()
              break
            case 'buyForm':
            case 'saleForm':
              apiTrade.inquirySheetAdd({
                // 交割速度
                deliverySpeed: this[formName].deliverySpeed,
                // 交割日期
                deliveryTime: util.dateFormat(this[formName].deliveryTime, "yyyy-MM-dd"),
                // 买还是卖
                direction: this[formName].direction === '买' ? 'bond_0' : 'bond_1',
                // 成交价格
                price: this[formName].price,
                // 交易员
                tradeuserId: this[formName].tradeuserId,
                // 债券编号
                tscode: this[formName].tscode,
                // 成交量
                volume: this[formName].volume
              }).then(res => {
                console.log(123456)
                console.log(res)
                if (res && res.code === '00000' && res.value) {
                  const h = this.$createElement;
                  this.$notify({
                    title: '提醒',
                    message: h('i', { style: 'color: teal' }, '询价单发送成功')
                  });
                }
              })
              break
          }
        }
      })
    },
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
        if (socket != null) {
          socket.close();
          socket = null;
        }
        // 开启一个websocket服务
        socket = new WebSocket(socketUrl);
        console.log('socket链接：' + socketUrl)
        // 打开事件
        socket.onopen = function () {
          console.log("websocket已打开");
        }
        // 浏览器端收消息，获得从服务端发送过来的文本消息
        socket.onmessage = function (msg) {
          console.log("收到数据====" + msg.data);
          let msgJson = JSON.parse(msg.data)
          console.log(msgJson.dataType)
          if (msgJson && msgJson.dataKey === self.activeTscode) {
            switch (msgJson.dataType) {
              case 'bid_1':
                // self.businessOutList.pop()
                // self.businessOutList.unshift(msgJson.data)
                self.businessOutList = msgJson.data
                self.buyForm.price = self.funcGetBestPrice('max', msgJson.data)
                break
              case 'bid_0':
                // self.businessInList.pop()
                // self.businessInList.unshift(msgJson.data)
                self.businessInList = msgJson.data
                self.saleForm.price = self.funcGetBestPrice('min', msgJson.data)
                break
              case 'trade':
                self.transactionAllList.pop()
                self.transactionAllList.unshift(msgJson.data)
                break
            }
          } else {
            switch (msgJson.dataType) {
              // 返回研究员待接收询价单（买）
              case 'start_bond_0':
                console.log('周佳洪：' + msgJson.data)
                console.log(msgJson.data)
                msgJson.data.status = 'start_bond'
                self.gridDataMsg.unshift(msgJson.data)
                self.dialogTableVisible = true
                break
              case 'start_bond_1':
                msgJson.data.status = 'start_bond'
                self.gridDataMsg.unshift(msgJson.data)
                self.dialogTableVisible = true
                break
              // 交易员待接收询价单（买）
              case 'delegate_bond_0':
                msgJson.data.status = 'delegate_bond_0'
                self.gridDataMsg.unshift(msgJson.data)
                self.dialogTableVisible = true
                break
              // 交易员待接收询价单（卖）
              case 'delegate_bond_1':
                msgJson.data.status = 'delegate_bond_1'
                self.gridDataMsg.unshift(msgJson.data)
                self.dialogTableVisible = true
                break
              // 通知研究员确认接收(买)
              case 'accept_bond_0':
                msgJson.data.status = 'accept_bond_0'
                self.gridDataMsg.unshift(msgJson.data)
                self.dialogTableVisible = true
                break
              // 通知研究员确认接收（卖）
              case 'accept_bond_1':
                msgJson.data.status = 'accept_bond_1'
                self.gridDataMsg.unshift(msgJson.data)
                self.dialogTableVisible = true
                break
              case 'error':
                if (msgJson.data.errorCode === '0001') {
                  Router.push({ path: '/login' })
                }
                break
            }
          }
        }
        // 关闭事件
        socket.onclose = function () {
          console.log("websocket已关闭");
          self.reconnect()
        }
        // 发生了错误事件
        socket.onerror = function () {
          console.log("websocket发生了错误");
          // 重连
          self.reconnect()
        }
      }
    },
    // 重连
    reconnect() {
      if (socket.readyState === 1) {
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
        self.initRightTransactionList()
        this.initSocket()
        lockReconnect = false
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
      socket.send(JSON.stringify({
        "dataKey": this.activeTscode,
        "dataType": dataType,
        "data": {
          "tscode": this.activeTscode,
          "volume": this.chartAmount,
          "price": this.chartPrice
        }
      }))
    },
    // 接收单据
    handleReceiveClick(row) {
      console.log(111)
      console.log(JSON.stringify({ "dataKey": `${row.userTradeId}`, "dataType": 'accept_bond_0' }))
      if (row.status === 'delegate_bond_0') {
        socket.send(JSON.stringify({ "dataKey": `${row.userTradeId}`, "dataType": 'accept_bond_0' }))
      } else if (row.status === 'delegate_bond_1') {
        socket.send(JSON.stringify({ "dataKey": `${row.userTradeId}`, "dataType": 'accept_bond_1' }))
      }
      this.dialogTableVisible = false
    },
    // 获取交易员列表
    getTradeUserList() {
      apiAdmin.tradeUserList().then(response => {
        if (response && response.code === '00000' && response.value) {
          this.tradeUsersOption = response.value
        }
      })
    },
    // 获取询价单列表信息
    getInquiryList() {
      apiTrade.inquiryQuery({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then(response => {

      })
    },
    // 消息
    showMsg() {
      Promise.all([
        this.dialogTableVisible = true
      ]).then(() => {
        this.$refs.tradeEnquiry.loadInitData()
      })
    }
  },
  mounted() {
    this.getInquiryList()
    this.initTSType()
    this.getAllBondPool()
    this.getByCodeBondPool()
    this.favoriteList()
    this.getTradeUserList()
    // 创建询价单默认日期
    const date = new Date();
    date.setTime(date.getTime() + 3600 * 1000 * 24);
    this.buyForm.deliveryTime = date
    this.saleForm.deliveryTime = date
    // 初始化默认设置和询价单表格默认设置
    this.setForm.volume = this.defaultSet.volume
    this.setForm.quickSubmit = this.defaultSet.quickSubmit
    this.buyForm.volume = parseInt(this.setForm.volume)
    this.saleForm.volume = parseInt(this.setForm.volume)
    this.buyForm.quickSubmit = this.setForm.quickSubmit
    this.saleForm.quickSubmit = this.setForm.quickSubmit
    window.onresize = () => {
      if (this.myChart) {
        this.myChart.resize()
      }
    }
  },
  destroyed() {
    socket.close()
  }
}
</script>

<style lang="scss" scoped>
// @import "@/assets/css/kline.scss";
.head {
  border-bottom: 1px solid red;

  .k-nav {
    overflow: hidden;

    .slt-type {
      .grid-content {
        padding: 0 2px;
      }
    }

    li {
      float: left;
      padding: 0px 5px;
      font-size: 12px;
      cursor: pointer;
      color: rgb(240, 239, 239);
    }

    li.active {
      color: #54ffff;
    }

    .nav-right {
      float: right;

      .i-text {
        display: flex;
        height: 50px;
        flex-direction: column;
        justify-content: center;
        text-align: center;
        line-height: 20px;
        i {
          font-size: 18px;
        }
      }
    }
  }
}

.container {
  position: absolute;
  width: 100%;
  display: flex;
  top: 50px;
  bottom: 0px;

  .left-group {
    width: 200px;
    border-right: 1px solid red;

    .left-tabs {
      overflow: hidden;
      display: flex;
      justify-content: center;
      flex: 3;
      line-height: 40px;

      li {
        flex: 1;
        text-align: center;
        color: white;
        font-size: 14px;
        cursor: pointer;
      }

      li.active {
        color: #54ffff;
      }
    }

    .tab-common {
      height: 100%;
    }

    .search-box {
      padding: 5px 4px;
    }

    .el-scrollbar {
      width: 100%;

      .el-scrollbar__wrap {
        height: 100%;
        overflow: scroll;
        overflow-x: auto;

        ul {
          padding-right: 10px;
        }

        ul li {
          color: #f0f888;
          box-sizing: border-box;
          padding: 10px 20px;
          font-size: 12px;
          border-bottom: 1px solid red;
          cursor: pointer;
        }

        ul li.active {
          background-color: #000080;
        }
      }
    }
    .tab-0 {
      .el-scrollbar {
        height: calc(100% - 81px);
      }
    }
    .tab-2 {
      .el-scrollbar {
        height: calc(100% - 40px);
      }
    }
  }

  .center {
    flex: 1;
  }

  .right-group {
    display: flex;
    flex-direction: column;
    position: relative;
    border-top: 1px solid red;
    border-left: 1px solid red;
    transition: width 0.5s;
    .open-colse {
      position: absolute;
      width: 16px;
      height: 16px;
      left: -16px;
      top: 0;
      color: #54ffff;
      font-size: 16px;
      cursor: pointer;
    }
    .r-in,
    .r-out {
      position: relative;
    }
    .r-in:after {
      content: "买单";
      color: #00da3c;
    }
    .r-out:after {
      content: "卖单";
      color: red;
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
      height: 100px;
      border-bottom: 1px solid red;
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
            color: red;
            box-sizing: border-box;
            font-size: 12px;
            display: flex;
            padding: 0 5px;
            cursor: pointer;
            border-bottom: 1px dashed rgb(51, 51, 51);
            span {
              justify-content: flex-start;
              padding: 0 5px;
            }
          }
          ul li:hover {
            background: #3f3f3f;
          }
          ul li:last-child {
            border-bottom: none;
          }
        }
      }
    }
    .r-in {
      .el-scrollbar {
        .el-scrollbar__wrap {
          ul li {
            color: #00da3c;
          }
        }
      }
    }
    .r-trans {
      flex: 1;
      transform: scale(1);
      .el-scrollbar {
        width: 100%;
      }
      ul {
        .li-first {
          font-weight: bold;
          background: #202020;
          border-bottom: 1px solid rgb(51, 51, 51) !important;
          position: fixed;
          top: 0px;
          right: 0;
          left: 0;
        }
      }
    }

    .chatbox {
      width: 100%;
      height: 380px;
      position: relative;
      bottom: 0;
      color: red;
      box-sizing: border-box;
      padding: 0px;
      background: #202020;
      overflow: hidden;
      .best-price-wapper {
        position: absolute;
        overflow: hidden;
        right: 0;
        z-index: 1;
        li {
          height: 40px;
          line-height: 40px;
          float: right;
          padding: 0 10px;
          line-height: 40px;
        }
        li.chat-set:hover {
          cursor: pointer;
          background: #333131;
        }
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
  color: red !important;
}
.txt-green {
  color: #00da3c !important;
}
.txt-yellow {
  color: yellow !important;
}
.txt-white {
  color: white !important;
}
.txt-bold {
  font-weight: bold;
}
.default-set-wrapper {
  .el-form-item__label {
    font-size: 12px;
    font-weight: normal;
  }
}
.chatbox {
  .el-button--mini,
  .el-button--mini.is-round {
    padding: 6px 10px;
  }
  .sale-form {
    .el-button--primary {
      background-color: red;
      border-color: red;
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
      background: red !important;
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
      color: red !important;
    }
  }
  .buy-form {
    .el-button--primary {
      background-color: #00da3c;
      border-color: #00da3c;
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
      color: #00da3c !important;
    }
  }
  .el-tabs__item {
    color: white;
    font-size: 12px;
    padding: 0 10px;
    font-weight: bold;
  }
  #tab-buy.el-tabs__item.is-active {
    color: #00da3c;
  }
  #tab-sale.el-tabs__item.is-active {
    color: red;
  }
  .el-tabs__nav-wrap::after {
    background-color: red;
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
}
</style>
