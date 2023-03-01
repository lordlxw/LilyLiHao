// 交易管理
import Vue from 'vue'
import request from '@/utils/request'
export default {
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
   * 询价单接收
   * @param {*} params
   */
  inquiryAccept(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/usertrade/accept?usertradeId=${params.usertradeId}`,
      method: 'POST'
    })
  },
  /**
   * 询价单拒绝
   * @param {*} params
   */
  inquiryRejection(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/usertrade/deny?usertradeId=${params.usertradeId}`,
      method: 'post'
    })
  },
  /**
   * 成交
   * @param {*} params
   * @returns
   */
  inquiryDeal(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/usertrade/deal`,
      method: 'post',
      data: {
        // 询价单单号ID
        userTradeId: params.usertradeId,
        // 成交价格
        price: params.price,
        // 成交量
        volume: params.volume,
        // 交割速度
        deliverySpeed: 0,
        // 交割时间
        deliveryTime: params.deliveryTime,
        // 备注
        remark: params.remark
      }
    })
  },
  /**
   * 撤单
   * @param {*} params
   * @returns
   */
  inquiryCancel(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/usertrade/cancel?usertradeId=${params.usertradeId}`,
      method: 'post'
    })
  },
  // 确认撤单
  inquiryCancelConfirm(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/usertrade/confirmcancel?usertradeId=${params.usertradeId}`,
      method: 'post'
    })
  },
  // 拒绝撤单
  inquiryCancelRejection(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/usertrade/denycancel?usertradeId=${params.usertradeId}`,
      method: 'post'
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
        // 单号
        tradeNum: params.tradeNum,
        // 债券代码
        tscode: params.tscode,
        // 用户名称
        userName: params.userName,
        // 交易ID
        userTradeId: params.userTradeId
        // 当前页
        // pageNum: params.pageNum,
        // 显示条数
        // pageSize: params.pageSize
      }
    })
  },
  /**
   * 确认成交
   * @param {*} params
   */
  inquiryDealConfirm(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/usertrade/confirmdeal`,
      method: 'post',
      data: {
        userTradeId: params.userTradeId
      }
    })
  },
  /**
   * 拒绝成交
   * @param {*} params
   */
  inquiryDealRejection(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/usertrade/denydeal`,
      method: 'post',
      data: {
        userTradeId: params.userTradeId
      }
    })
  }
}
