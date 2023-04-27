// 违约
import Vue from 'vue'
import request from '@/utils/request'
export default {
  // 违约查询列表
  get(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/listweiyueTrade`,
      method: 'get',
      params: {
        deliveryDateEnd: params.deliveryDateEnd,
        deliveryDateStart: params.deliveryDateStart,
        realTradeId: params.realTradeId,
        tradeNum: params.tradeNum,
        tscode: params.tscode,
        userName: params.userName,
        userTradeId: params.userTradeId
      }
    })
  },
  // 改交割
  dealBreakReturn(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/gaijiaoge`,
      method: 'post',
      data: {
        realTradeId: params.realTradeId
      }
    })
  },
  // 违约续作
  dealBreakRedo(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/weiyuexuzuo`,
      method: 'post',
      data: {
        realTradeId: params.realTradeId,
        tscode: params.tscode,
        direction: params.direction,
        deliverySpeed: params.deliverySpeed,
        deliveryTime: params.deliveryTime,
        price: params.price,
        volume: params.volume,
        remark: params.remark,
        contactPerson: params.contactPerson,
        contactType: params.contactType,
        counterParty: params.counterParty
      }
    })
  },
  // 违约续作确认
  dealBreakRedoConfirm(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/xuzuoconfirm`,
      method: 'post',
      data: {
        userTradeId: params.userTradeId
      }
    })
  },
  // 违约续作拒绝
  dealBreakRedoRejection(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/xuzuodeny`,
      method: 'post',
      data: {
        userTradeId: params.userTradeId
      }
    })
  },
  // 违约续作修改内容查看
  dealBreakRedoCheckField(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/checkxuzuo`,
      method: 'post',
      data: {
        userTradeId: params.userTradeId
      }
    })
  },
  // 违约升级
  dealBreakUpgrade(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/weiyueshengji`,
      method: 'post',
      data: {
        realTradeId: params.realTradeId
      }
    })
  },
  // 违约增改 - 作废
  dealBreakAddUpdate(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/weiyuezenggai`,
      method: 'post',
      data: {
        realTradeId: params.realTradeId,
        tscode: params.tscode,
        direction: params.direction,
        deliverySpeed: params.deliverySpeed,
        deliveryTime: params.deliveryTime,
        price: params.price,
        volume: params.volume,
        remark: params.remark,
        contactPerson: params.contactPerson,
        contactType: params.contactType,
        counterParty: params.counterParty
      }
    })
  }
}
