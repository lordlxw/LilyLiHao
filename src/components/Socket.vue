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
              //   console.log('周佳洪：' + msgJson.data)
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
                        h("dt", null, "询量"),
                        h("dd", null, `${msgJson.data.volume}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "交割日期"),
                        h("dd", null, `${msgJson.data.deliveryTime.substr(0, 10)}`)
                      ]),
                      h("dl", { style: "margin-top:20px;" }, [
                        h("dt", null, ""),
                        h("dd", { style: "padding-left:76px;" }, [
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
                console.log(2222)
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime())
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
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime())
                break;
              case 'error':
                if (msgJson.data.errorCode === '0001') {
                  Router.push({ path: '/login' })
                }
                break
              case 'deal_bond_0':
              case 'deal_bond_1':
                self.$notify({
                  title: `${msgJson.data.xunjiayuanName} 已确认成交`,
                  dangerouslyUseHTMLString: true,
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
                      <dd>${msgJson.data.price}</dd>
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
                  duration: 3000
                });
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime())
                self.tryPlay()
                break
              case 'deny_bond_0':
              case 'deny_bond_1':
                self.$notify({
                  title: `${msgJson.data.tradeuser} 已拒收`,
                  dangerouslyUseHTMLString: true,
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
                      <dd>${msgJson.data.price}</dd>
                    </dl>
                    <dl>
                      <dt>成交量</dt>
                      <dd>${msgJson.data.volume}</dd>
                    </dl>
                    <dl>
                      <dt>交割日期</dt>
                      <dd>${msgJson.data.deliveryTime.substr(0, 10)}（T+${msgJson.data.deliverySpeed}）</dd>
                    </dl>
                  </div>
                  `,
                  duration: 3000
                });
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime())
                self.tryPlay()
                break
              // 直接撤单
              case 'cancel_bond_0':
              case 'cancel_bond_1':
              case 'delegate_feedback_bond_0':
              case 'delegate_feedback_bond_1':
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime())
                break
              // 撤单确认
              case 'request_cancel_bond_0':
              case 'request_cancel_bond_1':
                notify = self.$notify({
                  title: `${msgJson.data.tradeuser} 发起撤单`,
                  dangerouslyUseHTMLString: true,
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
                        h("dd", null, `${msgJson.data.price}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "成交量"),
                        h("dd", null, `${msgJson.data.volume}`)
                      ]),
                      h("dl", null, [
                        h("dt", null, "交割日期"),
                        h("dd", null, `${msgJson.data.deliveryTime.substr(0, 10)}（T+${msgJson.data.deliverySpeed}）`)
                      ]),
                      h("dl", { style: "margin-top:20px;" }, [
                        h("dt", null, ""),
                        h("dd", { style: "padding-left:76px;" }, [
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
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime())
                self.$refs.playAudio.play()
                self.notifyRejection[msgJson.data.userTradeId] = notify
                // if (self.dialogTableVisible) {
                //   self.$refs.tradeEnquiry.loadInitData()
                // }
                break
              case 'deny_deal_bond_0':
              case 'deny_deal_bond_1':
                self.$notify({
                  title: `${msgJson.data.xunjiayuanName} 已拒绝成交`,
                  dangerouslyUseHTMLString: true,
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
                      <dd>${msgJson.data.price}</dd>
                    </dl>
                    <dl>
                      <dt>成交量</dt>
                      <dd>${msgJson.data.volume}</dd>
                    </dl>
                    <dl>
                      <dt>交割日期</dt>
                      <dd>${msgJson.data.deliveryTime.substr(0, 10)}（T+${msgJson.data.deliverySpeed}）</dd>
                    </dl>
                  </div>
                  `,
                  duration: 3000
                });
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime())
                self.tryPlay()
                break
              case 'weipingchangeconfirm_bond_0':
              case 'weipingchangeconfirm_bond_1':
                self.$notify({
                  title: `${msgJson.data.xunjiayuanName} 已同意未平仓修改`,
                  dangerouslyUseHTMLString: true,
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
                      <dd>${msgJson.data.price}</dd>
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
                  duration: 3000
                });
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime())
                self.tryPlay()
                break;
              case 'weipingchangedeny_bond_0':
              case 'weipingchangedeny_bond_1':
                self.$notify({
                  title: `${msgJson.data.xunjiayuanName} 已拒绝未平仓修改`,
                  dangerouslyUseHTMLString: true,
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
                      <dd>${msgJson.data.price}</dd>
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
                  duration: 3000
                });
                self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime())
                self.tryPlay()
                break;
              case 'yipingchangeconfirm_bond_0':
              case 'yipingchangeconfirm_bond_1':
                self.$notify({
                  title: `${msgJson.data.xunjiayuanName} 已同意已平仓修改`,
                  dangerouslyUseHTMLString: true,
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
                      <dd>${msgJson.data.price}</dd>
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
                  duration: 3000
                });
                self.tryPlay()
                break;
              case 'yipingchangedeny_bond_0':
              case 'yipingchangedeny_bond_1':
                self.$notify({
                  title: `${msgJson.data.xunjiayuanName} 已拒绝已平仓修改`,
                  dangerouslyUseHTMLString: true,
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
                      <dd>${msgJson.data.price}</dd>
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
                  duration: 3000
                });
                self.tryPlay()
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
          self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime())
          self.notifyRejection[parseInt(obj.userTradeId)].close()
          delete self.notifyRejection[parseInt(obj.userTradeId)]
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
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
          self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime())
          self.notifyRejection[parseInt(obj.userTradeId)].close()
          delete self.notifyRejection[parseInt(obj.userTradeId)]
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
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
          self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime())
          self.notifyRejection[parseInt(usertradeId)].close()
          delete self.notifyRejection[parseInt(usertradeId)]
          // if (self.dialogTableVisible) {
          //   self.$refs.tradeEnquiry.loadInitData()
          // }
        }
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
          self.$store.commit('SET_ENQUIRY_INFO', new Date().getTime())
          self.notifyRejection[parseInt(usertradeId)].close()
          delete self.notifyRejection[parseInt(usertradeId)]
          // if (self.dialogTableVisible) {
          //   self.$refs.tradeEnquiry.loadInitData()
          // }
        }
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
