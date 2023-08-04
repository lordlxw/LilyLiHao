<template>
  <div style="background-color: #202020">
    <div class="head">
      <ul class="k-nav">
        <li class="top-type">
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
        <li class="tscode">
          {{ tscode }}
        </li>
        <li class="nav-right">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ userInfo ? userInfo.userName : "" }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="updatePassword"
                >修改密码</el-dropdown-item
              >
              <el-dropdown-item divided command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
        <!-- <li class="nav-right">
          <span class="i-text" style="color: white">
            <el-badge is-dot class="item">
              <i class="el-icon-message-solid" @click="showMsg()"></i>
            </el-badge>
          </span>
        </li> -->
        <li class="nav-right">
          <router-link
            target="_blank"
            :to="{ path: '/trade/bonds' }"
            class="i-text"
            style="color: white"
            ><i class="el-icon-s-home"></i
          ></router-link>
        </li>
      </ul>
    </div>
    <div class="container" style="background-color: #202020">
      <!-- 左侧 -->
      <div
        class="left-group"
        :style="{
          width: leftWith + 'px',
        }"
      >
        <!-- 关闭和打开左侧侧面板 -->
        <div
          class="open-colse"
          :class="leftFold"
          @click="handleLeftOpenOrClose"
        ></div>
        <ul class="left-tabs">
          <li
            :class="activeTab == tabList[0] ? 'active' : ''"
            @click="handleClickTab(tabList[0])"
          >
            单券
          </li>
          <!-- <li
            :class="activeTab == tabList[1] ? 'active' : ''"
            @click="handleClickTab(tabList[1])"
          >
            JC
          </li> -->
          <li
            :class="activeTab == tabList[1] ? 'active' : ''"
            @click="handleClickTab(tabList[1])"
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
          <hr color="#ec0000" size="1" style="margin: 0" />
          <el-scrollbar>
            <ul>
              <li
                v-for="item in tscodeList"
                :key="item.id"
                @click="handlerTscode(item)"
                :class="{ active: activeTscode == item.tscode }"
              >
                {{ item.bondname }}<br />
                <strong class="l-strong">{{ item.tscode }}</strong>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <div class="tab-common tab-2" v-if="activeTab == tabList[1]">
          <hr color="#ec0000" size="1" style="margin: 0" />
          <el-scrollbar>
            <ul>
              <draggable
                v-model="tscodeListFavorite"
                animation="300"
                @start="onStart"
                @end="onEnd"
              >
                <li
                  v-for="item in tscodeListFavorite"
                  :key="item.id"
                  @click="handlerTscode(item)"
                  :class="{ active: activeTscode == item.tscode }"
                >
                  <strong class="l-strong">{{ item.tscode }}</strong>
                </li>
              </draggable>
            </ul>
          </el-scrollbar>
        </div>
      </div>
      <!-- 中间 -->
      <div class="center">
        <div ref="refKline" if="data0.length>0" class="kline"></div>
        <div class="volume"></div>
        <!-- 交易框 -->
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
                  :label-width="`${widthList.w100}px`"
                >
                  <el-form-item label="交易量" prop="volume">
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
            <li class="txt-red txt-bold">
              总差 {{ forwardDiffPrice ? forwardDiffPrice : "0.00BP" }}
            </li>
            <li class="txt-red txt-bold">
              总卖 {{ saleFormForwardPrice | moneyFormat(4) }}
            </li>
            <li class="txt-green txt-bold">
              总买 {{ buyFormForwardPrice | moneyFormat(4) }}
            </li>
            <li class="txt-red txt-bold">
              近差 {{ currentDiffPrice ? currentDiffPrice : "0.00BP" }}
            </li>
            <li class="txt-red txt-bold">
              近卖 {{ saleFormPrice | moneyFormat(4) }}
            </li>
            <li class="txt-green txt-bold">
              近买 {{ buyFormPrice | moneyFormat(4) }}
            </li>
            <li>
              <el-button
                v-if="
                  (activeName === 'buy' && buyForm.isMarketRoll === false) ||
                  (activeName === 'sale' && saleForm.isMarketRoll === false)
                "
                type="default"
                size="mini"
                @click="handleGetPrice"
                >市价</el-button
              >
            </li>
          </ul>
          <el-tabs v-model="activeName">
            <el-tab-pane label="买(F1)" name="buy">
              <el-form
                :inline="true"
                label-position="top"
                ref="buyForm"
                :model="buyForm"
                :rules="buyFormRules"
                label-width="`${widthList.w80}px`"
                size="mini"
                class="buy-form"
              >
                <el-form-item label="券码">
                  <span class="txt-green">{{
                    buyForm.tscode.replace(/.IB/, "")
                  }}</span>
                </el-form-item>
                <el-form-item label="价格 | 允许浮动" prop="price">
                  <el-input-number
                    v-model="buyForm.price"
                    step="0.001"
                    placeholder="请输入价格"
                    @focus="handleMaxWait('buyForm')"
                    class="pricew"
                  ></el-input-number
                  ><br />
                  <el-form-item prop="worstPrice">
                    <el-input-number
                      v-model="buyForm.worstPrice"
                      step="0.05"
                      class="mt10 numbw"
                    ></el-input-number>
                    <span class="txt-green">BP</span>
                  </el-form-item>
                </el-form-item>
                <el-form-item label="交易量" prop="volume">
                  <el-input
                    class="ipt-volume"
                    v-model="buyForm.volume"
                    placeholder="请输入交易量"
                  ></el-input
                  ><br />
                  <el-button-group class="mt10" style="display: flex">
                    <el-button
                      type="primary"
                      style="background: white; color: #202020"
                      @click="funcVolumeAdd('buyForm', 0)"
                      >0</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('buyForm', 5000)"
                      >5</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('buyForm', 3000)"
                      >3</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('buyForm', 10000)"
                      >10</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('buyForm', 2000)"
                      >2</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('buyForm', 1000)"
                      >1</el-button
                    >
                  </el-button-group>
                </el-form-item>
                <el-form-item label="交割日期" prop="deliveryTime">
                  <delivery-canlendar
                    :w="`${canlendarW}px`"
                    ref="buyDeliveryCanlendar"
                    @change="handleBuyDeliveryCanlendar"
                  ></delivery-canlendar>
                  <!-- <el-button-group>
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
                  </el-button-group> -->
                  <br />
                  <span class="txt-green">{{ buyForm.deliveryTimeMsg }}</span>
                </el-form-item>
                <el-form-item label="交易员" prop="tradeuserId">
                  <el-select
                    v-model="buyForm.tradeuserId"
                    placeholder="请选择"
                    class="slt-user"
                  >
                    <el-option
                      v-for="item in tradeUsersOption"
                      :key="item.userId"
                      :label="item.nickName"
                      :value="item.userId"
                    >
                    </el-option>
                  </el-select>
                  <br />
                  <el-button
                    v-if="
                      setAuth('inquiry:insert') &&
                      activeTscode.indexOf('.CTD') === -1
                    "
                    class="btn-green mt10"
                    :disabled="loading"
                    :loading="loading"
                    @click="submitForm('buyForm')"
                    >发送</el-button
                  >
                </el-form-item>
                <el-form-item label="备注" style="width: 100%">
                  <el-input
                    type="textarea"
                    v-model="buyForm.remark"
                    placeholder="请输入内容"
                    resize="none"
                    rows="3"
                    class="ipt-remark"
                  ></el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="卖(F2)" name="sale">
              <el-form
                :inline="true"
                label-position="top"
                ref="saleForm"
                :model="saleForm"
                :rules="saleFormRules"
                :label-width="`${widthList.w80}px`"
                size="mini"
                class="sale-form"
              >
                <el-form-item label="券码">
                  <span class="txt-red">{{
                    saleForm.tscode.replace(/.IB/, "")
                  }}</span>
                </el-form-item>
                <el-form-item label="价格 | 允许浮动" prop="price">
                  <el-input-number
                    v-model="saleForm.price"
                    step="0.001"
                    placeholder="请输入价格"
                    @focus="handleMaxWait('saleForm')"
                    class="pricew"
                  ></el-input-number
                  ><br />
                  <el-form-item prop="worstPrice">
                    <el-input-number
                      v-model="saleForm.worstPrice"
                      step="0.05"
                      class="mt10 numbw"
                    ></el-input-number>
                    <span class="txt-red">BP</span>
                  </el-form-item>
                </el-form-item>
                <el-form-item label="交易量" prop="volume">
                  <el-input
                    class="ipt-volume"
                    v-model="saleForm.volume"
                    placeholder="请输入交易量"
                  ></el-input
                  ><br />
                  <el-button-group class="mt10" style="display: flex">
                    <el-button
                      type="primary"
                      style="background: white; color: #202020"
                      @click="funcVolumeAdd('saleForm', 0)"
                      >0</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('saleForm', 5000)"
                      >5</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('saleForm', 3000)"
                      >3</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('saleForm', 10000)"
                      >10</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('saleForm', 2000)"
                      >2</el-button
                    >
                    <el-button
                      type="primary"
                      @click="funcVolumeAdd('saleForm', 1000)"
                      >1</el-button
                    >
                  </el-button-group>
                </el-form-item>
                <el-form-item label="交割日期" prop="deliveryTime">
                  <delivery-canlendar
                    :w="`${canlendarW}px`"
                    ref="saleDeliveryCanlendar"
                    @change="handleSaleDeliveryCanlendar"
                  ></delivery-canlendar>
                  <!-- <el-button-group>
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
                  </el-button-group> -->
                  <br />
                  <span class="txt-red">{{ saleForm.deliveryTimeMsg }}</span>
                </el-form-item>
                <el-form-item label="交易员" prop="tradeuserId">
                  <el-select
                    v-model="saleForm.tradeuserId"
                    placeholder="请选择"
                    class="slt-user"
                  >
                    <el-option
                      v-for="item in tradeUsersOption"
                      :key="item.userId"
                      :label="item.nickName"
                      :value="item.userId"
                    >
                    </el-option>
                  </el-select>
                  <br />
                  <el-button
                    v-if="setAuth('inquiry:insert')"
                    class="btn-red mt10"
                    :disabled="loading"
                    :loading="loading"
                    @click="submitForm('saleForm')"
                    >发送</el-button
                  >
                </el-form-item>
                <el-form-item label="备注" style="width: 100%">
                  <el-input
                    type="textarea"
                    v-model="saleForm.remark"
                    placeholder="请输入内容"
                    resize="none"
                    rows="3"
                    class="ipt-remark"
                  ></el-input>
                </el-form-item>
              </el-form>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
      <!-- 右侧 -->
      <div
        class="right-group"
        :style="{
          width: rightWith + 'px',
        }"
      >
        <!-- 关闭和打开右侧面板 -->
        <div
          class="open-colse"
          :class="rightFold"
          @click="handleRightOpenOrClose"
        ></div>
        <!-- 及期卖出 -->
        <div class="r-out" style="height: 120px">
          <el-scrollbar v-if="businessOutList && businessOutList.length > 0">
            <ul>
              <li
                v-for="(item, index) in businessOutList"
                :key="index"
                :title="item.volumecomment ? item.volumecomment : item.volume"
                style="height: 20px; line-height: 20px"
              >
                <span :style="`width: ${widthList.w50}px`">{{
                  item.brokerName
                }}</span>
                <span style="flex: 1" class="ellipsis">
                  {{ item.volumecomment ? item.volumecomment : item.volume }}
                </span>
                <span :style="`width: ${widthList.w50}px`">{{
                  item.price | moneyFormat(4)
                }}</span>
                <span :style="`width: ${widthList.w60}px`">{{
                  item.updatetime
                }}</span>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <!-- 及期买入 -->
        <div class="r-in" style="height: 120px">
          <el-scrollbar v-if="businessInList && businessInList.length > 0">
            <ul>
              <li
                v-for="(item, index) in businessInList"
                :key="index"
                :title="item.volumecomment ? item.volumecomment : item.volume"
                style="height: 20px; line-height: 20px"
              >
                <span :style="`width: ${widthList.w50}px`">{{
                  item.brokerName
                }}</span>
                <span class="ellipsis" style="flex: 1">
                  {{ item.volumecomment ? item.volumecomment : item.volume }}
                </span>
                <span :style="`width: ${widthList.w50}px`">{{
                  item.price | moneyFormat(4)
                }}</span>
                <span :style="`width: ${widthList.w60}px`">{{
                  item.updatetime
                }}</span>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <!-- 远期卖出 -->
        <div class="r-out" style="height: 120px">
          <el-scrollbar
            v-if="businessForwardOutList && businessForwardOutList.length > 0"
          >
            <ul>
              <li
                v-for="(item, index) in businessForwardOutList"
                :key="index"
                :title="item.volumecomment ? item.volumecomment : item.volume"
                style="height: 20px; line-height: 20px"
              >
                <span :style="`width: ${widthList.w50}px`">{{
                  item.brokerName
                }}</span>
                <span style="flex: 1" class="ellipsis">
                  {{ item.volumecomment ? item.volumecomment : item.volume }}
                </span>
                <span :style="`width: ${widthList.w50}px`">{{
                  item.price | moneyFormat(4)
                }}</span>
                <span :style="`width: ${widthList.w60}px`">{{
                  item.updatetime
                }}</span>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <!-- 远期买入 -->
        <div class="r-in" style="height: 120px">
          <el-scrollbar
            v-if="businessForwardInList && businessForwardInList.length > 0"
          >
            <ul>
              <li
                v-for="(item, index) in businessForwardInList"
                :key="index"
                :title="item.volumecomment ? item.volumecomment : item.volume"
                style="height: 20px; line-height: 20px"
              >
                <span :style="`width: ${widthList.w50}px`">{{
                  item.brokerName
                }}</span>
                <span class="ellipsis" style="flex: 1">
                  {{ item.volumecomment ? item.volumecomment : item.volume }}
                </span>
                <span :style="`width: ${widthList.w50}px`">{{
                  item.price | moneyFormat(4)
                }}</span>
                <span :style="`width: ${widthList.w60}px`">{{
                  item.updatetime
                }}</span>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <!-- 交易 -->
        <div class="r-trans" v-if="transactionAllList.length > 0">
          <el-scrollbar>
            <ul class="mt20" style="margin-top: 20px">
              <li class="li-first" style="height: 20px; line-height: 20px">
                <span class="colume1">方向</span>
                <span class="colume2">价格</span>
                <span class="colume3">中介</span>
                <span class="colume4">交易时间</span>
                <!-- <span style="width: 60px">净价</span> -->
              </li>
              <li
                v-for="(item, index) in transactionAllList"
                :key="index"
                :class="funcSelectColor(item.dealtype)"
                style="height: 20px; line-height: 20px"
              >
                <span class="colume1">{{ item.dealtype }}</span>
                <span class="colume2">{{
                  item.tradeprice | moneyFormat(4)
                }}</span>
                <span class="colume3">{{ item.brokerName }}</span>
                <span class="colume4">{{ item.tradetime }}</span>
                <!-- <span style="width: 60px">{{ item.netprice }}</span> -->
              </li>
            </ul>
          </el-scrollbar>
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

    <!-- 暂时不用 -->
    <!-- <el-dialog title="消息框" width="80%" :visible.sync="dialogTableVisible">
      <trade-enquiry ref="tradeEnquiry"></trade-enquiry>
      <div class="both-clear"></div>
    </el-dialog> -->
    <audio controls ref="playAudio" style="display: none">
      <source src="@/assets/audio/1.wav" type="audio/wav" />
    </audio>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
      <span>请确认需要提交询价单？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="
            quickSubmit(
              `${
                activeName === 'buy'
                  ? 'buyForm'
                  : activeName === 'sale'
                  ? 'saleForm'
                  : ''
              }`
            )
          "
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="新建询价单"
      :visible.sync="dialogEnquiryAddVisible"
      width="40%"
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <enquiry-edit
        :row="currentDifficultData"
        @change="handleDialogEnquiryAddVisible"
      ></enquiry-edit>
    </el-dialog>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogUpdatePasswordVisible"
      width="30%"
      center
      append-to-body
      :destroy-on-close="true"
      :close-on-click-modal="false"
    >
      <update-password
        @change="handleDialogUpdatePasswordVisible"
      ></update-password>
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
import moment from 'moment'
let socket
let lockReconnect = false
export default {
  mixins: [pageMixin, commMixin],
  components: {
    ComTscodeSelect,
    // TradeEnquiry,
    DeliveryCanlendar,
    EnquiryEdit,
    UpdatePassword,
    Draggable
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
      config,
      dialogVisible: false,
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
        volume: 5000,
        // 债券号
        tscode: '',
        // 交割速度
        deliverySpeed: 0,
        // 交割日期
        deliveryTime: '',
        // 交易员
        tradeuserId: '',
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
        isMarketRoll: true
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
        volume: 5000,
        // 债券号
        tscode: '',
        // 交割速度
        deliverySpeed: 0,
        // 交割日期
        deliveryTime: '',
        // 交易员
        tradeuserId: '',
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
        isMarketRoll: true
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
        volume: 0,
        quickSubmit: false
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
      dialogUpdatePasswordVisible: false
    }
  },
  computed: {
    ...mapGetters({
      tscodeGlobal: 'getTscodeGlobal',
      defaultSet: 'getDefaultSet',
      userInfo: 'getUserInfo'
    })
  },
  watch: {
    activeTscode(newVal, oldVal) {
      if (newVal !== oldVal) {
        if (newVal && socket != null) {
          socket.send(JSON.stringify({ "dataKey": newVal, "dataType": "tscode" }))
          this.calcFavoriteIcon()
        }
      }
    }
  },
  created() {
    if (!this.setAuth('kline:view')) {
      this.$router.push({ path: '/main' })
    }
    this.initFrameW('leftWith', 200)
    this.initFrameW('rightWith', 360)
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
            this.klineTimer = setInterval(() => {
              this.klinemethods[this.klineactive]()
            }, 30 * 1000)
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
                  // let ma5 = params[1].data // ma5的值
                  params = params[0] // 开盘收盘最低最高数据汇总
                  let currentItemData = params.data;
                  return params.name + '<br>' +
                    params.marker + '1分钟线' + '<br>' +
                    '开盘：' + currentItemData[1] + '<br>' +
                    '收盘：' + currentItemData[2] + '<br>' +
                    '最低：' + currentItemData[3] + '<br>' +
                    '最高：' + currentItemData[4] + '<br>'
                  // 'MA5:' + ma5
                },
                position: function (pos, params, el, elRect, size) {
                  const obj = {
                    top: 10
                  };
                  // obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
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
                borderColor: '#ec0000'
              },
              xAxis: {
                type: 'category',
                data: this.data0.categoryData,
                boundaryGap: true,
                axisLine: {
                  onZero: false,
                  lineStyle: {
                    color: '#ec0000',
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
                boundaryGap: true,
                splitArea: {
                  show: false
                },
                axisLine: {
                  onZero: false,
                  lineStyle: {
                    color: '#ec0000',
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
                // {
                //   name: 'MA5',
                //   type: 'line',
                //   data: this.calculateMA(5, this.data0),
                //   smooth: true,
                //   lineStyle: {
                //     opacity: 0.8
                //   }
                // },
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
                // let ma5 = params[1].data // ma5的值
                params = params[0] // 开盘收盘最低最高数据汇总
                let currentItemData = params.data;
                return params.name + '<br>' +
                  params.marker + '5分钟线' + '<br>' +
                  '开盘：' + currentItemData[1] + '<br>' +
                  '收盘：' + currentItemData[2] + '<br>' +
                  '最低：' + currentItemData[3] + '<br>' +
                  '最高：' + currentItemData[4] + '<br>'
                // 'MA5:' + ma5
              },
              position: function (pos, params, el, elRect, size) {
                const obj = {
                  top: 10
                };
                // obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
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
              borderColor: '#ec0000'
            },
            xAxis: {
              type: 'category',
              data: this.data0.categoryData,
              boundaryGap: true,
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: '#ec0000',
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
              boundaryGap: true,
              splitArea: {
                show: false
              },
              axisLine: {
                onZero: false,
                lineStyle: {
                  color: '#ec0000',
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
              // {
              //   name: 'MA5',
              //   type: 'line',
              //   data: this.calculateMA(5, this.data0),
              //   smooth: true,
              //   lineStyle: {
              //     opacity: 0.8
              //   }
              // },
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
              animation: false,
              // darkMode: true,
              // backgroundColor: 'transparent',
              // gradientColor: [],
              // tooltip: {
              //   show: true,
              //   trigger: 'axis',
              //   formatter: function (params) {
              //     // console.log(params.data)
              //     // 修改鼠标划过显示为中文
              //     // let ma5 = params[1].data // ma5的值
              //     // let ma10 = params[2].data // ma10的值
              //     // let ma20 = params[3].data // ma20的值
              //     // let ma30 = params[4].data // ma30的值
              //     params = params[0] // 开盘收盘最低最高数据汇总
              //     let currentItemData = params.data;
              //     return params.name + '<br>' +
              //       params.marker + params.seriesName + '<br>' +
              //       '开盘：' + currentItemData[1] + '<br>' +
              //       '收盘：' + currentItemData[2] + '<br>' +
              //       '最低：' + currentItemData[3] + '<br>' +
              //       '最高：' + currentItemData[4] + '<br>' +
              //       '交易量：' + currentItemData[5]
              //     // 'MA5日均线：' + ma5 + '<br>' +
              //     // 'MA10日均线：' + ma10 + '<br>' +
              //     // 'MA20日均线：' + ma20 + '<br>' +
              //     // 'MA30日均线：' + ma30
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
              //   position: function (pos, params, el, elRect, size) {
              //     const obj = {
              //       top: 10
              //     };
              //     // obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
              //     if (pos[0] < (size.viewSize[0] / 2)) {
              //       obj.right = 80
              //     } else {
              //       obj.left = 30
              //     }
              //     return obj;
              //   }
              // },
              tooltip: {
                trigger: 'axis',
                axisPointer: {
                  type: 'cross'
                },
                position: function (pos, params, el, elRect, size) {
                  const obj = {
                    top: 10
                  };
                  // obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30;
                  if (pos[0] < (size.viewSize[0] / 2)) {
                    obj.right = 80
                  } else {
                    obj.left = 30
                  }
                  return obj;
                }
              },
              // legend: {
              //   data: ['日线', 'MA5', 'MA10', 'MA20', 'MA30'],
              //   show: true,
              //   textStyle: {
              //     color: '#ec0000'
              //   },
              //   selected: {
              //     'MA10': false,
              //     'MA20': false,
              //     'MA30': false
              //   }
              // },
              axisPointer: {
                link: [
                  {
                    xAxisIndex: [0, 1]
                  }
                ]
              },
              xAxis: [{
                type: 'category',
                data: this.data0.categoryData,
                boundaryGap: true,
                axisLine: {
                  show: true,
                  onZero: false,
                  lineStyle: {
                    color: '#ec0000',
                    width: 1,
                    type: 'solid'
                  }
                },
                splitLine: { show: false },
                min: 'dataMin',
                max: 'dataMax'
              }, {
                type: 'category',
                gridIndex: 1,
                data: this.data0.categoryData,
                boundaryGap: true,
                splitLine: { show: false },
                axisLabel: { show: false },
                axisTick: { show: false },
                axisLine: { lineStyle: { color: '#ec0000' } },
                min: 'dataMin',
                max: 'dataMax',
                axisPointer: {
                  type: 'shadow',
                  label: { show: false },
                  triggerTooltip: true,
                  handle: {
                    show: false,
                    margin: 30,
                    color: '#B80C00'
                  }
                }
              }],
              yAxis: [{
                scale: true,
                position: 'right',
                boundaryGap: true,
                splitArea: {
                  show: false
                },
                axisLine: {
                  onZero: false,
                  lineStyle: {
                    color: '#ec0000',
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
              }, {
                scale: true,
                position: 'right',
                gridIndex: 1,
                splitNumber: 2,
                axisLabel: { show: false },
                axisLine: { show: false },
                axisTick: { show: false },
                splitLine: { show: false }
              }],
              grid: [{
                left: '0%',
                right: '60px',
                bottom: '25%',
                top: '2%',
                // containLabel: true,
                show: true,
                borderColor: '#ec0000'
              }, {
                left: '0%',
                right: '60px',
                bottom: '1%',
                top: '80%',
              }],
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
              dataZoom: [
                {
                  type: 'inside',
                  xAxisIndex: [0, 1],
                  start: 50,
                  end: 100
                }
              ],
              series: [
                {
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
                },
                // {
                //   name: 'MA5',
                //   type: 'line',
                //   data: this.calculateMA(5, this.data0),
                //   smooth: true,
                //   lineStyle: {
                //     opacity: 0.5
                //   }
                // },
                // {
                //   name: 'MA10',
                //   type: 'line',
                //   data: this.calculateMA(10, this.data0),
                //   smooth: true,
                //   lineStyle: {
                //     opacity: 0.5
                //   }
                // },
                // {
                //   name: 'MA20',
                //   type: 'line',
                //   data: this.calculateMA(20, this.data0),
                //   smooth: true,
                //   lineStyle: {
                //     opacity: 0.5
                //   }
                // },
                // {
                //   name: 'MA30',
                //   type: 'line',
                //   data: this.calculateMA(30, this.data0),
                //   smooth: true,
                //   lineStyle: {
                //     opacity: 0.5
                //   }
                // },
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
    // 拖拽
    onStart() { },
    onEnd() {
      // 准备数据
      const tscodeList = []
      for (let i = 0; i < this.tscodeListFavorite.length; i++) {
        tscodeList.push(this.tscodeListFavorite[i].tscode)
      }
      api.favoriteOrder({ tscodeList }).then(resposne => {
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
      })
    },
    // 债券点击事件
    handlerTscode: debounce(function (item) {
      Promise.all([
        this.activeId = item.id,
        this.tscode = item.tscode,
        this.activeTscode = item.tscode,
        this.activeTab === this.tabList[0] ? this.$refs.refComTscodeSelect.value = '' : ''
      ]).then(() => {
        this.klinemethods[this.klineactive]()
        this.calcFavoriteIcon()
        this.initRightTransactionList()
      })
    }),
    // 图表数据分类方法
    splitData(rawData, xAxisKey) {
      const categoryData = []
      const values = []
      const volumes = []
      for (let i = 0; i < rawData.length; i++) {
        categoryData.push(rawData[i][xAxisKey])
        values.push([util.moneyFormat(rawData[i].openprice, 4), util.moneyFormat(rawData[i].closeprice, 4), util.moneyFormat(rawData[i].lowprice, 4), util.moneyFormat(rawData[i].highprice, 4), rawData[i].volume])
        volumes.push([i, rawData[i].volume, rawData[i].openprice > rawData[i].closeprice ? 1 : -1])
      }
      return {
        categoryData,
        values,
        volumes
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
        switch (keyCode) {
          case 13:
            // 检查K线轮询个数
            // const klineLoopCount = self.loopmethodskey.length
            // const indecator = self.loopmethodskey.indexOf(self.klineactive)
            // if (klineLoopCount - 1 <= indecator) {
            //   self.klinemethods[self.loopmethodskey[0]]()
            // } else {
            //   self.klinemethods[self.loopmethodskey[indecator + 1]]()
            // }
            // if (e && e.preventDefault) {
            //   e.preventDefault()
            // } else {
            //   window.event.returnValue = false
            // }
            if (self.activeName === 'buy') {
              self.submitForm('buyForm')
            }
            if (self.activeName === 'sale') {
              self.submitForm('saleForm')
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
          Promise.all([
            this.tscodeList = res.value
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
    handleClickTab: debounce(function (tab) {
      this.activeTab = tab;
      if (tab === this.tabList[1]) {
        this.favoriteList()
      }
    }),
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
    quickSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
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
            worstPrice: this[formName].worstPrice
          }).then(res => {
            if (res && res.code === '00000' && res.value) {
              const h = this.$createElement;
              this.$notify({
                title: '提醒',
                message: h('i', { style: 'color: teal' }, '询价单发送成功'),
                position: 'top-left'
              });
              this.dialogVisible = false
            } else {
              this.$message({
                message: `${res.message}`,
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
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.$store.commit('SET_DEFAULT_SET', JSON.stringify(this[formName]))
              this.buyForm.volume = parseInt(this[formName].volume)
              this.saleForm.volume = parseInt(this[formName].volume)
              this.buyForm.quickSubmit = this[formName].quickSubmit
              this.saleForm.quickSubmit = this[formName].quickSubmit
              this.$refs['popover-set'].doClose()
            }
          })
          this.loading = false
          break
        case 'buyForm':
        case 'saleForm':
          if (this.defaultSet.quickSubmit) {
            this.quickSubmit(formName)
          } else {
            this.dialogVisible = true
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
          clearInterval(self.socketTimer)
          self.socketTimer = null
          self.socketHeart()
          if (self.activeTscode) {
            socket.send(JSON.stringify({ "dataKey": self.activeTscode, "dataType": "tscode" }))
          }
        }
        // 浏览器端收消息，获得从服务端发送过来的文本消息
        socket.onmessage = function (msg) {
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
                self.transactionAllList.unshift(msgJson.data)
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
              self.buyForm.price = self.funcGetBestPrice('max', self.businessOutList, true)
            }
            // 近卖
            self.saleFormPrice = self.funcGetBestPrice('min', self.businessInList, false)
            if (self.saleForm.isMarketRoll) {
              self.saleForm.price = self.funcGetBestPrice('min', self.businessInList, true)
            }
            self.calcuDiffPrice(1)
            // 远买
            self.buyFormForwardPrice = self.funcGetBestPrice('max', self.businessForwardOutList.concat(self.businessOutList), false)
            // 远卖
            self.saleFormForwardPrice = self.funcGetBestPrice('min', self.businessForwardInList.concat(self.businessInList), true)
            self.calcuDiffPrice(2)
          } else {
            switch (msgJson.dataType) {
              // 返回研究员待接收询价单（买）
              // case 'start_bond_0':
              //   console.log(msgJson.data)
              //   msgJson.data.status = 'start_bond'
              //   self.gridDataMsg.unshift(msgJson.data)
              //   self.showMsg()
              //   break
              // case 'start_bond_1':
              //   msgJson.data.status = 'start_bond'
              //   self.gridDataMsg.unshift(msgJson.data)
              //   self.showMsg()
              //   break
              // 交易员待接收询价单（买）
              // case 'delegate_bond_0':
              //   msgJson.data.status = 'delegate_bond_0'
              //   self.gridDataMsg.unshift(msgJson.data)
              //   self.showMsg()
              //   break
              // 交易员待接收询价单（卖）
              // case 'delegate_bond_1':
              //   msgJson.data.status = 'delegate_bond_1'
              //   self.gridDataMsg.unshift(msgJson.data)
              //   self.showMsg()
              //   break
              case 'accept_bond_0':
              case 'accept_bond_1':
                if (msgJson.actionType === 'refresh') {
                  break
                }
                self.$notify({
                  title: `${msgJson.data.tradeuser} 已接收`,
                  dangerouslyUseHTMLString: true,
                  position: 'top-left',
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
                  duration: 5000
                });
                self.tryPlay()
                break;
              case 'error':
                if (msgJson.data.errorCode === '0001') {
                  Router.push({ path: '/login' })
                }
                break
              case 'deal_bond_0':
              case 'deal_bond_1':
                self.$notify({
                  title: `${msgJson.data.tradeuser} 已成交`,
                  dangerouslyUseHTMLString: true,
                  position: 'top-left',
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
                  duration: 5000
                });
                self.tryPlay()
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
                self.$notify({
                  title: `${msgJson.data.tradeuser} 拒绝撤单`,
                  dangerouslyUseHTMLString: true,
                  position: 'top-left',
                  customClass: 'notify-yellow',
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
                  duration: 0
                });
                self.tryPlay()
                break
              case 'confirm_cancel_bond_0':
              case 'confirm_cancel_bond_1':
                self.$notify({
                  title: `${msgJson.data.tradeuser} 已接受撤单`,
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
              case 'tradecompare_bond_0':
              case 'tradecompare_bond_1':
                notify = self.$notify({
                  title: `${msgJson.data.ut.tradeuser} 等待确认成交`,
                  dangerouslyUseHTMLString: true,
                  position: 'top-left',
                  message: h(
                    "div",
                    { class: "notify" },
                    [
                      h("dl", null, [
                        h("dt", null, "创建时间"),
                        h("dd", null, `${msgJson.data.ut.createTime}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "债券码"),
                        h("dd", null, `${msgJson.data.ut.tscode}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "方向"),
                        h("dd", null, `${msgJson.data.ut.direction === 'bond_0' ? '买入' : msgJson.data.ut.direction === 'bond_1' ? '卖出' : ''}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交价"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? util.moneyFormat(msgJson.data.ut.price, 4) + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? { style: "color:#ec0000" } : null, util.moneyFormat(msgJson.data.dto.price, 4))
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交量"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('restVolume') !== -1 ? msgJson.data.ut.restVolume + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('restVolume') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.volume)
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "交割日期"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? msgJson.data.ut.deliveryTime.substr(0, 10) + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.deliveryTime.substr(0, 10))
                        ])
                      ]),
                      h("dl", { style: "margin-top:20px;" }, [
                        h("dd", null, [
                          h("button", {
                            class: "notigy-agree",
                            on: {
                              click: function () {
                                self.handleInquiryDealConfirmClick(msgJson.data.ut.userTradeId, timestamp)
                              }
                            }
                          }, "同意"),
                          h("button", {
                            class: "notigy-cancel",
                            on: {
                              click: function () {
                                self.handleInquiryDealRejectionClick(msgJson.data.ut.userTradeId, timestamp)
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
              case 'weipingchangerequest_bond_0':
              case 'weipingchangerequest_bond_1':
                notify = self.$notify({
                  title: `${msgJson.data.changer} 等待未平仓修改审核`,
                  dangerouslyUseHTMLString: true,
                  position: 'top-left',
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
                        h("dd", null, `${msgJson.data.rt.tscode.replace(/.IB/, '')}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "方向"),
                        h("dd", null, `${msgJson.data.rt.direction === 'bond_0' ? '买入' : msgJson.data.rt.direction === 'bond_1' ? '卖出' : ' '}`)
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
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('volume') !== -1 ? msgJson.data.rt.volume + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('volume') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.volume)
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "交割日期"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? msgJson.data.rt.deliveryTime.substr(0, 10) + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.deliveryTime.substr(0, 10))
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "交割速度"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('deliverySpeed') !== -1 ? msgJson.data.rt.deliverySpeed : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('deliverySpeed') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.deliverySpeed)
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "交易对手"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('counterParty') !== -1 ? msgJson.data.rt.counterParty : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('counterParty') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.counterParty)
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "联系人"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('contactPerson') !== -1 ? msgJson.data.rt.contactPerson : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('contactPerson') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.contactPerson)
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "联系方式"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('contactType') !== -1 ? msgJson.data.rt.contactType : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('contactType') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.contactType)
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "备注"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('remark') !== -1 ? msgJson.data.rt.remark : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('remark') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.remark)
                        ])
                      ]),
                      h("dl", { style: "margin-top:20px;" }, [
                        // h("dt", null, ""),
                        h("dd", null, [
                          h("button", {
                            class: "notigy-agree",
                            on: {
                              click: function () {
                                self.handleAgreeNoBondsUpdateClick(msgJson.data.rt.realTradeId, timestamp)
                              }
                            }
                          }, "同意"),
                          h("button", {
                            class: "notigy-cancel",
                            on: {
                              click: function () {
                                self.handleRejectNoBondsUpdateClick(msgJson.data.rt.realTradeId, timestamp)
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
              case 'yipingchangerequest_bond_0':
              case 'yipingchangerequest_bond_1':
                notify = self.$notify({
                  title: `${msgJson.data.changer} 等待已平仓修改审核`,
                  dangerouslyUseHTMLString: true,
                  position: 'top-left',
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
                        h("dd", null, `${msgJson.data.rt.tscode.replace(/.IB/, '')}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "方向"),
                        h("dd", null, `${msgJson.data.rt.direction === 'bond_0' ? '买入' : msgJson.data.rt.direction === 'bond_1' ? '卖出' : ''}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交价"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000;padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? util.moneyFormat(msgJson.data.rt.price, 4) + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('price') !== -1 ? { style: "color:#ec0000" } : null, util.moneyFormat(msgJson.data.dto.price, 4))
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交量"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('volume') !== -1 ? msgJson.data.rt.volume + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('volume') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.volume)
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "交割日期"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? msgJson.data.rt.deliveryTime.substr(0, 10) + ' ' : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('deliveryTime') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.deliveryTime.substr(0, 10))
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "交割速度"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('deliverySpeed') !== -1 ? msgJson.data.rt.deliverySpeed : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('deliverySpeed') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.deliverySpeed)
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "交易对手"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('counterParty') !== -1 ? msgJson.data.rt.counterParty : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('counterParty') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.counterParty)
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "联系人"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('contactPerson') !== -1 ? msgJson.data.rt.contactPerson : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('contactPerson') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.contactPerson)
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "联系方式"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('contactType') !== -1 ? msgJson.data.rt.contactType : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('contactType') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.contactType)
                        ])
                      ]),
                      h("dl", null, [
                        h("dt", null, "备注"),
                        h("dd", null, [
                          h("span", { style: "text-decoration: line-through #ec0000; padding-right:5px;" }, msgJson.data.compareResult.fieldlist.indexOf('remark') !== -1 ? msgJson.data.rt.remark : ''),
                          h("span", msgJson.data.compareResult.fieldlist.indexOf('remark') !== -1 ? { style: "color:#ec0000" } : null, msgJson.data.dto.remark)
                        ])
                      ]),
                      h("dl", { style: "margin-top:20px;" }, [
                        // h("dt", null, ""),
                        h("dd", null, [
                          h("button", {
                            class: "notigy-agree",
                            on: {
                              click: function () {
                                self.handleAgreeBondsUpdateClick(msgJson.data.rt.realTradeId, timestamp)
                              }
                            }
                          }, "同意"),
                          h("button", {
                            class: "notigy-cancel",
                            on: {
                              click: function () {
                                self.handleRejectBondsUpdateClick(msgJson.data.rt.realTradeId, timestamp)
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
              case 'koutouweiyuerequest_bond_0':
              case 'koutouweiyuerequest_bond_1':
                notify = self.$notify({
                  title: `${msgJson.data.tradeuser} 发起口头违约`,
                  dangerouslyUseHTMLString: true,
                  position: 'top-left',
                  customClass: 'notify-red',
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
                  <div class="notify">
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
            socket.send(JSON.stringify({ "dataType": "ack", "data": { "dataKey": msgJson.dataKey, "dataType": msgJson.dataType } }))
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
    // socket心跳
    socketHeart() {
      this.socketTimer = setInterval(() => {
        if (socket) {
          socket.send(JSON.stringify({ "dataKey": 'HELLO', "dataType": 'ping' }))
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
        if (socket) {
          socket.close()
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
        socket.send(JSON.stringify({ "dataKey": `${row.userTradeId}`, "dataType": 'accept_bond_0' }))
      } else if (row.status === 'delegate_bond_1') {
        socket.send(JSON.stringify({ "dataKey": `${row.userTradeId}`, "dataType": 'accept_bond_1' }))
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
    // 消息
    // showMsg() {
    //   Promise.all([
    //     this.dialogTableVisible = true
    //   ]).then(() => {
    //     this.$refs.tradeEnquiry.loadInitData()
    //   })
    // },
    /* 下拉指令 */
    handleCommand: debounce(function (command) {
      switch (command) {
        case "logout":
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
    }
  },
  mounted() {
    this.initTSType()
    this.getAllBondPool()
    this.getByCodeBondPool()
    this.favoriteList()
    this.getTradeUserList()
    // 初始化默认设置和询价单表格默认设置
    this.setForm.volume = this.defaultSet.volume
    this.setForm.quickSubmit = this.defaultSet.quickSubmit
    this.buyForm.volume = parseInt(this.setForm.volume)
    this.saleForm.volume = parseInt(this.setForm.volume)
    this.buyForm.quickSubmit = this.setForm.quickSubmit
    this.saleForm.quickSubmit = this.setForm.quickSubmit

    // this.initPriceWait()
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
  unmounted() {
    socket.close()
    clearInterval(this.timer)
    this.timer = null
    clearInterval(this.socketTimer)
    this.socketTimer = null
    clearInterval(this.klineTimer)
    this.klineTimer = null
  }
}
</script>

<style lang="scss" scoped>
// @import "@/assets/css/kline.scss";
.head {
  border-bottom: 1px solid #ec0000;
  height: 50px;
  line-height: 50px;

  .k-nav {
    overflow: hidden;

    .top-type {
      width: 190px;
    }

    .tscode {
      font-weight: bold;
      font-size: 20px;
      color: #ec0000;
    }

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
  width: 160px;
}

.slt-user {
  width: 140px;
}

.kline {
  height: 500px;
}

.ipt-remark {
  width: 100%;
}

.container {
  position: absolute;
  width: 100%;
  display: flex;
  top: 50px;
  bottom: 0px;

  .left-group {
    border-right: 1px solid #ec0000;
    position: relative;

    .open-colse {
      position: absolute;
      width: 16px;
      height: 16px;
      right: -16px;
      top: -5px;
      color: #54ffff;
      font-size: 16px;
      cursor: pointer;
      z-index: 1000;
    }
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
      overflow: hidden;
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
          border-bottom: 1px solid #ec0000;
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
    display: flex;
    flex-direction: column;
    .volume {
      flex: 1;
    }
    .chatbox {
      width: 100%;
      height: 200px;
      position: relative;
      bottom: 0;
      color: #ec0000;
      border-top: 1px solid #ec0000;
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
        }
        li.chat-set:hover {
          cursor: pointer;
          background: #333131;
        }
      }
      .pricew {
        width: 140px;
      }
      .numbw {
        width: 100px;
      }
    }
  }

  .right-group {
    display: flex;
    flex-direction: column;
    position: relative;
    border-top: 1px solid #ec0000;
    border-left: 1px solid #ec0000;
    .open-colse {
      position: absolute;
      width: 16px;
      height: 16px;
      left: -16px;
      top: -5px;
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
      border-bottom: 1px solid #ec0000;
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
            color: #ec0000;
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
          .colume1 {
            width: 60px;
          }
          .colume2 {
            width: 100px;
          }
          .colume3 {
            width: 100px;
          }
          .colume4 {
            width: 100px;
            text-align: center;
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
  .el-form-item__label {
    font-size: 12px;
    font-weight: normal;
  }
}
.chatbox {
  // .el-button--mini,
  // .el-button--mini.is-round {
  //   padding: 6px 10px;
  // }
  .sale-form {
    width: 100%;
    display: flex;
    justify-content: flex-start;
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
    display: flex;
    justify-content: flex-start;
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
    color: rgb(113, 112, 112);
    font-size: 12px;
    padding: 0 10px;
    font-weight: bold;
  }
  #tab-buy.el-tabs__item.is-active {
    color: #00da3c;
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

  .el-form-item--mini .el-form-item__content,
  .el-form-item--mini .el-form-item__label {
    line-height: 18px;
  }

  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 14px;
  }
}
</style>
