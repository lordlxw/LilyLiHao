// 交割回报
import Vue from 'vue'
import request from '@/utils/request'
export default {
  /**
   *交割列表
   * @param {*} params
   */
  get(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/listJiaogeTrade`,
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
  /**
   * 交割撤回
   * @param {*} params
   * @returns
   */
  deliverBack(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/jiaogereturn`,
      method: 'post',
      data: {
        realTradeId: params.realTradeId
      }
    })
  },
  /**
   * 改违约
   * @param {*} params
   * @returns
   */
  deliverBreak(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/gaiweiyue`,
      method: 'post',
      data: {
        realTradeId: params.realTradeId
      }
    })
  }
}
