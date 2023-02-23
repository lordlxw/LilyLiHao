// 交易管理
import Vue from 'vue'
import request from '@/utils/request'
export default {
  /**
   * 询价单接受
   * @param {*} params
   */
  inquiryAccept(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/usertrade/accept`,
      method: 'post',
      data: {
        // 询价单id
        usertradeId: params.usertradeId
      }
    })
  },
  /**
   * 新增询价单
   * @param {*} params
   * @returns
   */
  inquirySheetAdd(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/usertrade/add`,
      method: 'post',
      data: {
        // 交割速度
        deliverySpeed: params.deliverySpeed,
        // 交割日期
        deliveryTime: params.deliveryTime,
        // 买还是卖
        direction: params.direction,
        // 成交价格
        price: params.price,
        // 交易员
        tradeuserId: params.tradeuserId,
        // 债券编号
        tscode: params.tscode,
        // 成交量
        volume: params.volume
      }
    })
  },
  /**
   * 询价单拒绝接收
   * @param {*} params
   */
  inquiryRejection(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/usertrade/deny`,
      method: 'post',
      data: {
        // 询价单id
        usertradeId: params.usertradeId
      }
    })
  },
  /**
   * 询价单查询列表
   * @param {*} params
   */
  inquiryQuery(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/usertrade/listByCurrentUser`,
      method: 'get',
      params: {
        // 交割结束日期,示例值(2022-10-10)
        deliveryDateEnd: params.deliveryDateEnd,
        // 交割起始日期,示例值(2022-10-01)
        deliveryDateStart: params.deliveryDateStart,
        // 状态
        status: params.status,
        // 交易结束日期,示例值(2022-10-10)
        tradeDateEnd: params.tradeDateEnd,
        // 交易起始日期,示例值(2022-10-01)
        tradeDateStart: params.tradeDateStart,
        // 债券代码
        tscode: params.tscode,
        // 用户名称
        userName: params.userName,
        // 交易ID
        userTradeId: params.userTradeId
      }
    })
  }
}
