// 持仓单
import Vue from 'vue'
import request from '@/utils/request'
export default {
  /**
   * 列表
   * @param {*} params
   */
  get(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/listByCurrentUser`,
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
   * 平仓
   * @param {*} params
   */
  bondsCover(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/pingcang`,
      method: 'post',
      data: {
        // 交割速度
        deliverySpeed: params.deliverySpeed,
        // 交割时间
        deliveryTime: params.deliveryTime,
        // 方向
        direction: params.direction,
        // 成交价格
        price: params.price,
        // 交易单号ID 数组
        realTradeIdList: params.realTradeIdList,
        // 备注
        remark: params.remark,
        // 债券编号
        tscode: params.tscode,
        // 交易员ID
        userId: params.userId,
        // 成交量
        volume: params.volume
      }
    })
  },
  /**
   * 交易员列表查询
   * @param {*} params
   */
  dealPersionList(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/listTrader`,
      method: 'post',
      data: {
        // 交易单号ID
        realTradeIdList: params.realTradeIdList
      }
    })
  },
  /**
   *
   * @param {*} params
   */
  dealRoll(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/gundan`,
      method: 'post'
    })
  }
}
