<template>
  <div>
    <!-- <el-dialog title="消息框" width="80%" :visible.sync="dialogTableVisible">
      <trade-enquiry ref="tradeEnquiry"></trade-enquiry>
      <div class="both-clear"></div>
    </el-dialog> -->
    <audio controls ref="playAudio" style="display: none">
      <source src="@/assets/audio/1.wav" type="audio/wav" />
    </audio>
  </div>
</template>

<script>
import Vue from 'vue'
import Router from '@/router'
import configUtil from '@/utils/config.js'
import { pageMixin } from '@/utils/pageMixin'
import * as util from '@/utils/util'
// import TradeEnquiry from '@/views/KKTrade/Enquiry.vue'
import api from "@/api/kk_trade";

let socket
let lockReconnect = false
export default {
  mixins: [pageMixin],
  components: {
    // TradeEnquiry
  },
  data() {
    return {
      dialogTableVisible: false,
      notifyRejection: {}
    }
  },
  created() {
    this.initSocket()
  },
  methods: {
    // 消息
    // showMsg() {
    //   Promise.all([
    //     this.dialogTableVisible = true
    //   ]).then(() => {
    //     if (this.dialogTableVisible) {
    //       this.$refs.tradeEnquiry.loadInitData()
    //     }
    //   })
    // },
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
        }
        // 浏览器端收消息，获得从服务端发送过来的文本消息
        socket.onmessage = function (msg) {
          console.log("收到数据====" + msg.data);
          let msgJson = JSON.parse(msg.data)
          console.log(msgJson.dataType)
          const h = self.$createElement
          let notify = null
          if (msgJson) {
            switch (msgJson.dataType) {
              case 'bid_1':
                console.log(1111)
                // self.businessOutList = msgJson.data
                // self.buyForm.price = self.funcGetBestPrice('max', msgJson.data)
                break
              case 'bid_0':
                console.log(2222)
                // self.businessInList = msgJson.data
                // self.saleForm.price = self.funcGetBestPrice('min', msgJson.data)
                break
              // 返回研究员待接收询价单（买）
              // case 'start_bond_0':
              //   console.log(msgJson.data)
              //   msgJson.data.status = 'start_bond'
              //   self.showMsg()
              //   break
              // case 'start_bond_1':
              //   msgJson.data.status = 'start_bond'
              //   self.showMsg()
              //   break
              // 交易员待接收询价单（买）
              // case 'delegate_bond_0':
              //   msgJson.data.status = 'delegate_bond_0'
              //   self.showMsg()
              //   break
              // 交易员待接收询价单（卖）
              // case 'delegate_bond_1':
              //   msgJson.data.status = 'delegate_bond_1'
              //   self.showMsg()
              //   break
              // 交易员待接收询价单（买）
              // 交易员待接收询价单（卖）
              case 'delegate_bond_0':
              case 'delegate_bond_1':
                notify = self.$notify({
                  title: `${msgJson.data.createUserName} 发起询价单`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-left',
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
                        h("dd", null, `${msgJson.data.tscode}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "方向"),
                        h("dd", null, `${msgJson.data.direction === 'bond_0' ? '买入' : msgJson.data.direction === 'bond_1' ? '卖出' : ''}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "询价"),
                        h("dd", null, `${util.moneyFormat(msgJson.data.price, 4)}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "允许最差价格"),
                        h("dd", null, `${util.moneyFormat((msgJson.data.direction === 'bond_0' ? (msgJson.data.price - msgJson.data.worstPrice / 100) : (msgJson.data.price + msgJson.data.worstPrice / 100)), 4)}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "询量"),
                        h("dd", null, `${msgJson.data.volume}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "交割日期"),
                        h("dd", null, `${msgJson.data.deliveryTime.substr(0, 10)}`)
                      ]),
                      h("dl", { style: "margin-top:20px;" }, [
                        // h("dt", null, ""),
                        h("dd", null, [
                          h("button", {
                            class: "notigy-agree",
                            on: {
                              click: function () {
                                self.handleAcceptEnquiryClick(msgJson.data)
                              }
                            }
                          }, "接收并复制"),
                          h("button", {
                            class: "notigy-cancel",
                            on: {
                              click: function () {
                                self.handleNotAcceptEnquiryClick(msgJson.data)
                              }
                            }
                          }, "拒收")
                        ])
                      ]),
                    ],
                  ),
                  duration: 0
                });
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                self.$refs.playAudio.play()
                self.notifyRejection[msgJson.data.userTradeId] = notify
                break
              // 通知研究员确认接收(买)
              // case 'accept_bond_0':
              //   msgJson.data.status = 'accept_bond_0'
              //   self.showMsg()
              //   break
              // 通知研究员确认接收（卖）
              // case 'accept_bond_1':
              //   msgJson.data.status = 'accept_bond_1'
              //   self.showMsg()
              //   break
              case 'accept_bond_0':
              case 'accept_bond_1':
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
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
                  position: 'bottom-left',
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
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                self.tryPlay()
                break
              case 'deny_bond_0':
              case 'deny_bond_1':
                self.$notify({
                  title: `${msgJson.data.tradeuser} 已拒收`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-left',
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
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                self.tryPlay()
                break
              // 直接撤单
              case 'cancel_bond_0':
              case 'cancel_bond_1':
              case 'delegate_feedback_bond_0':
              case 'delegate_feedback_bond_1':
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                break
              // 成交确认
              case 'confirmdeal_bond_0':
              case 'confirmdeal_bond_1':
                self.$notify({
                  title: `${msgJson.data.yanjiuyuanName} 已确认成交`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-left',
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
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                self.tryPlay()
                break
              // 撤单确认
              case 'request_cancel_bond_0':
              case 'request_cancel_bond_1':
                notify = self.$notify({
                  title: `${msgJson.data.createuser} 发起撤单`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-left',
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
                        h("dd", null, `${msgJson.data.tscode}`)
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
                      h("dl", { style: "margin-top:20px;" }, [
                        // h("dt", null, ""),
                        h("dd", null, [
                          h("button", {
                            class: "notigy-agree",
                            on: {
                              click: function () {
                                self.handleInquiryCancelConfirmClick(msgJson.data.userTradeId)
                              }
                            }
                          }, "同意"),
                          h("button", {
                            class: "notigy-cancel",
                            on: {
                              click: function () {
                                self.handleInquiryCancelRejectionClick(msgJson.data.userTradeId)
                              }
                            }
                          }, "拒绝")
                        ])
                      ]),
                    ],
                  ),
                  duration: 0
                });
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                self.$refs.playAudio.play()
                self.notifyRejection[msgJson.data.userTradeId] = notify
                // if (self.dialogTableVisible) {
                //   self.$refs.tradeEnquiry.loadInitData()
                // }
                break
              case 'deny_deal_bond_0':
              case 'deny_deal_bond_1':
                self.$notify({
                  title: `${msgJson.data.yanjiuyuanName} 已拒绝成交`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-left',
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
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                self.tryPlay()
                break
              case 'weipingchangeconfirm_bond_0':
              case 'weipingchangeconfirm_bond_1':
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                if (msgJson.actionType === 'refresh') {
                  break
                }
                // self.$notify({
                //   title: `${msgJson.data.yanjiuyuanName} 已同意未平仓修改`,
                //   dangerouslyUseHTMLString: true,
                //   position: 'bottom-left',
                //   message: `
                //   <div class="notify">
                //     <dl>
                //       <dt>债券码</dt>
                //       <dd>${msgJson.data.tscode.replace(/.IB/, '')}</dd>
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
                //     <dl>
                //       <dt>单据号</dt>
                //       <dd>${msgJson.data.tradeNum}</dd>
                //     </dl>
                //     <dl>
                //       <dt>备注</dt>
                //       <dd>${msgJson.data.remark}</dd>
                //     </dl>
                //   </div>
                //   `,
                //   duration: 0
                // });
                notify = self.$notify({
                  title: `${msgJson.data.yanjiuyuanName} 已同意未平仓修改`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-left',
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
                      ])
                    ],
                  ),
                  duration: 0
                });
                self.tryPlay()
                break;
              case 'weipingchangedeny_bond_0':
              case 'weipingchangedeny_bond_1':
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                if (msgJson.actionType === 'refresh') {
                  break
                }
                self.$notify({
                  title: `${msgJson.data.yanjiuyuanName} 已拒绝未平仓修改`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-left',
                  message: `
                  <div class="notify">
                    <dl>
                      <dt>债券码</dt>
                      <dd>${msgJson.data.tscode.replace(/.IB/, '')}</dd>
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
                      <dt>单据号</dt>
                      <dd>${msgJson.data.tradeNum}</dd>
                    </dl>
                    <dl>
                      <dt>备注</dt>
                      <dd>${msgJson.data.remark}</dd>
                    </dl>
                  </div>
                  `,
                  duration: 0
                });
                self.tryPlay()
                break;
              case 'yipingchangeconfirm_bond_0':
              case 'yipingchangeconfirm_bond_1':
                self.$notify({
                  title: `${msgJson.data.yanjiuyuanName} 已同意已平仓修改`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-left',
                  message: `
                  <div class="notify">
                    <dl>
                      <dt>债券码</dt>
                      <dd>${msgJson.data.tscode.replace(/.IB/, '')}</dd>
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
                      <dt>单据号</dt>
                      <dd>${msgJson.data.tradeNum}</dd>
                    </dl>
                    <dl>
                      <dt>备注</dt>
                      <dd>${msgJson.data.remark}</dd>
                    </dl>
                  </div>
                  `,
                  duration: 0
                });
                self.tryPlay()
                break;
              case 'yipingchangedeny_bond_0':
              case 'yipingchangedeny_bond_1':
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                if (msgJson.actionType === 'refresh') {
                  break
                }
                self.$notify({
                  title: `${msgJson.data.yanjiuyuanName} 已拒绝已平仓修改`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-left',
                  message: `
                  <div class="notify">
                    <dl>
                      <dt>债券码</dt>
                      <dd>${msgJson.data.tscode.replace(/.IB/, '')}</dd>
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
                      <dt>单据号</dt>
                      <dd>${msgJson.data.tradeNum}</dd>
                    </dl>
                    <dl>
                      <dt>备注</dt>
                      <dd>${msgJson.data.remark}</dd>
                    </dl>
                  </div>
                  `,
                  duration: 0
                });
                self.tryPlay()
                break
              case 'nancheng_cancel_bond_0':
              case 'nancheng_cancel_bond_1':
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                if (msgJson.actionType === 'refresh') {
                  break
                }
                self.$notify({
                  title: `${msgJson.data.createuser} 难成已撤单`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-left',
                  message: `
                  <div class="notify">
                    <dl>
                      <dt>债券码</dt>
                      <dd>${msgJson.data.tscode.replace(/.IB/, '')}</dd>
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
                      <dt>单据号</dt>
                      <dd>${msgJson.data.tradeNum}</dd>
                    </dl>
                    <dl>
                      <dt>备注</dt>
                      <dd>${msgJson.data.remark}</dd>
                    </dl>
                  </div>
                  `,
                  duration: 0
                });
                self.tryPlay()
                break
              case 'nancheng_baoliu_bond_0':
              case 'nancheng_baoliu_bond_1':
                self.$notify({
                  title: `${msgJson.data.createuser} 难成已保留`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-left',
                  message: `
                  <div class="notify">
                    <dl>
                      <dt>债券码</dt>
                      <dd>${msgJson.data.tscode.replace(/.IB/, '')}</dd>
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
                      <dt>单据号</dt>
                      <dd>${msgJson.data.tradeNum}</dd>
                    </dl>
                    <dl>
                      <dt>备注</dt>
                      <dd>${msgJson.data.remark}</dd>
                    </dl>
                  </div>
                  `,
                  duration: 0
                });
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                self.tryPlay()
                break
              case 'koutouweiyueconfirm_bond_0':
              case 'koutouweiyueconfirm_bond_1':
                self.$notify({
                  title: `${msgJson.data.yanjiuyuanName} 已确认口头违约`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-left',
                  message: `
                  <div class="notify">
                    <dl>
                      <dt>债券码</dt>
                      <dd>${msgJson.data.tscode.replace(/.IB/, '')}</dd>
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
                      <dt>单据号</dt>
                      <dd>${msgJson.data.tradeNum}</dd>
                    </dl>
                    <dl>
                      <dt>备注</dt>
                      <dd>${msgJson.data.remark}</dd>
                    </dl>
                  </div>
                  `,
                  duration: 0
                });
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                self.tryPlay()
                break
              case 'koutouweiyuedeny_bond_0':
              case 'koutouweiyuedeny_bond_1':
                self.$notify({
                  title: `${msgJson.data.yanjiuyuanName} 已拒绝口头违约`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-left',
                  message: `
                  <div class="notify">
                    <dl>
                      <dt>债券码</dt>
                      <dd>${msgJson.data.tscode.replace(/.IB/, '')}</dd>
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
                      <dt>单据号</dt>
                      <dd>${msgJson.data.tradeNum}</dd>
                    </dl>
                    <dl>
                      <dt>备注</dt>
                      <dd>${msgJson.data.remark}</dd>
                    </dl>
                  </div>
                  `,
                  duration: 0
                });
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                self.tryPlay()
                break
              case 'koutouweiyuerequest_bond_0':
              case 'koutouweiyuerequest_bond_1':
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                break
              case 'confirm_cancel_bond_0':
              case 'confirm_cancel_bond_1':
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                break
              case 'tradecompare_bond_0':
              case 'tradecompare_bond_1':
              case 'deny_cancel_bond_0':
              case 'deny_cancel_bond_1':
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                break
              case 'yipingchangerequest_bond_0':
              case 'yipingchangerequest_bond_1':
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                break;
              case 'weipingchangerequest_bond_0':
              case 'weipingchangerequest_bond_1':
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                break;
              case 'xuzuo_confirmdeal_bond_0':
              case 'xuzuo_confirmdeal_bond_1':
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                if (msgJson.actionType === 'refresh') {
                  break
                }
                self.$notify({
                  title: `${msgJson.data.yanjiuyuanName} 已确认续作`,
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
                  duration: 0
                });
                self.tryPlay()
                break
              case 'xuzuo_deal_bond_0':
              case 'xuzuo_deal_bond_1':
                if (msgJson.actionType === 'refresh') {
                  break
                }
                self.$notify({
                  title: `${msgJson.data.tradeuser} 续作交易已成功`,
                  dangerouslyUseHTMLString: true,
                  position: 'bottom-left',
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
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
                self.tryPlay()
                break
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
        Promise.all([
          lockReconnect = false
        ]).then(() => {
          this.initSocket()
        })
      }, 5000)
    },
    // 接收询价单
    handleAcceptEnquiryClick(obj) {
      const self = this
      api.inquiryAccept({ usertradeId: obj.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: '已接收并复制成功',
            type: 'success'
          })
          self.copySocket(obj)
          self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
        console.log(JSON.stringify(obj))
        self.notifyRejection[parseInt(obj.userTradeId)].close()
        delete self.notifyRejection[parseInt(obj.userTradeId)]
      })
    },
    // 拒收询价单
    handleNotAcceptEnquiryClick(obj) {
      const self = this
      api.inquiryRejection({ usertradeId: obj.userTradeId }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: '已拒收',
            type: 'info'
          })
          self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
        self.notifyRejection[parseInt(obj.userTradeId)].close()
        delete self.notifyRejection[parseInt(obj.userTradeId)]
      })
    },
    // 确认撤单
    handleInquiryCancelConfirmClick(usertradeId) {
      const self = this
      api.inquiryCancelConfirm({ usertradeId }).then(response => {
        if (response && response.code === '00000') {
          self.$message({
            message: "已撤单",
            type: 'success'
          })
          self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
        } else {
          self.$message({
            message: `${response.message}`,
            type: 'error'
          })
        }
        self.notifyRejection[parseInt(usertradeId)].close()
        delete self.notifyRejection[parseInt(usertradeId)]
      })
    },
    // 拒绝撤单
    handleInquiryCancelRejectionClick(usertradeId) {
      const self = this
      api.inquiryCancelRejection({ usertradeId }).then(response => {
        if (response && response.code === '00000') {
          self.$message({
            message: "已拒绝",
            type: 'success'
          })
          self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime() + '-' + Math.random(100000))
        } else {
          self.$message({
            message: `${response.message}`,
            type: 'error'
          })
        }
        self.notifyRejection[parseInt(usertradeId)].close()
        delete self.notifyRejection[parseInt(usertradeId)]
      })
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
    }
  },
  unmounted() {
    socket.close()
  }
}
</script>
