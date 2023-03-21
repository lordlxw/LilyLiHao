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
  // 违约撤回
  dealBreakReturn(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/weiyuereturn`,
      method: 'post',
      data: {
        realTradeId: params.realTradeId
      }
    })
  }
}
