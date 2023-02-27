<template>
  <div>
    <el-dialog title="消息框" width="80%" :visible.sync="dialogTableVisible">
      <trade-enquiry ref="tradeEnquiry"></trade-enquiry>
      <div class="both-clear"></div>
    </el-dialog>
  </div>
</template>

<script>
import Vue from 'vue'
import Router from '@/router'
import configUtil from '@/utils/config.js'
import TradeEnquiry from '@/views/KKTrade/Enquiry.vue'
let socket
let lockReconnect = false
export default {
  components: {
    TradeEnquiry
  },
  data() {
    return {
      dialogTableVisible: false,
    }
  },
  created() {
    this.initSocket()
  },
  methods: {
    // 消息
    showMsg() {
      Promise.all([
        this.dialogTableVisible = true
      ]).then(() => {
        this.$refs.tradeEnquiry.loadInitData()
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
          if (msgJson) {
            switch (msgJson.dataType) {
              // 返回研究员待接收询价单（买）
              case 'start_bond_0':
                console.log('周佳洪：' + msgJson.data)
                console.log(msgJson.data)
                msgJson.data.status = 'start_bond'
                self.showMsg()
                break
              case 'start_bond_1':
                msgJson.data.status = 'start_bond'
                self.showMsg()
                break
              // 交易员待接收询价单（买）
              case 'delegate_bond_0':
                msgJson.data.status = 'delegate_bond_0'
                self.showMsg()
                break
              // 交易员待接收询价单（卖）
              case 'delegate_bond_1':
                msgJson.data.status = 'delegate_bond_1'
                self.showMsg()
                break
              // 通知研究员确认接收(买)
              case 'accept_bond_0':
                msgJson.data.status = 'accept_bond_0'
                self.showMsg()
                break
              // 通知研究员确认接收（卖）
              case 'accept_bond_1':
                msgJson.data.status = 'accept_bond_1'
                self.showMsg()
                break
              case 'error':
                if (msgJson.data.errorCode === '0001') {
                  Router.push({ path: '/login' })
                }
                break
              case 'deal_bond_0':
              case 'deal_bond_1':
              case 'deal_null':
                self.$notify({
                  title: '交易提醒',
                  dangerouslyUseHTMLString: true,
                  message: `
                  <div class="notify">
                    <dl>
                      <dt>交易员</dt>
                      <dd>${msgJson.data.tradeuser}</dd>
                    </dl>
                    <dl>
                      <dt>债券码</dt>
                      <dd>${msgJson.data.tscode}</dd>
                    </dl>
                    <dl>
                      <dt>成交量（万）</dt>
                      <dd>${msgJson.data.volume}</dd>
                    </dl>
                    <dl>
                      <dt>成交价</dt>
                      <dd>${msgJson.data.price}</dd>
                    </dl>
                    <dl>
                      <dt>方向</dt>
                      <dd>${msgJson.data.direction === 'bond_0' ? '买入' : msgJson.data.direction === 'bond_1' ? '卖出' : ''}</dd>
                    </dl>
                  </div>
                  `,
                  duration: 0
                });
                break
              case 'deny_bond_0':
              case 'deny_bond_1':
                self.$notify({
                  title: '拒收提醒',
                  dangerouslyUseHTMLString: true,
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
                      <dt>成交量（万）</dt>
                      <dd>${msgJson.data.volume}</dd>
                    </dl>
                    <dl>
                      <dt>成交价</dt>
                      <dd>${msgJson.data.price}</dd>
                    </dl>
                    <dl>
                      <dt>方向</dt>
                      <dd>${msgJson.data.direction === 'bond_0' ? '买入' : msgJson.data.direction === 'bond_1' ? '卖出' : ''}</dd>
                    </dl>
                  </div>
                  `,
                  duration: 0
                });
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
        this.initSocket()
        lockReconnect = false
      }, 5000)
    }
  },
  unmounted() {
    socket.close()
  }
}
</script>

<style>
</style>
