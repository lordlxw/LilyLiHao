/* 债券池 */
import Vue from 'vue'
import request from '@/utils/request'

export default {
  /**
   * 债券池全量查询
   * @returns
   */
  getAll() {
    return request({
      url: `${Vue.prototype.$apiUrl}/tsinfo/getAll`,
      method: 'get'
    })
  },
  /**
   * 债券类型查询
   * @returns
   */
  getPoolType() {
    return request({
      url: `${Vue.prototype.$apiUrl}/tstype/list`,
      method: 'get'
    })
  },
  /**
   * 债券池按类型全量查询
   * @returns
   */
  getAllByType(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/tspool/getAll/${params.tstype}/${params.tslength}`,
      method: 'get'
    })
  },
  /**
   * 债券池根据债券码查询
   * @param {*} params
   */
  getByCode(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/tsinfo/getByCode`,
      method: 'get',
      params: {
        tscode: params.tscode
      }
    })
  },
  /**
   * 债券码根据债权池code模糊匹配查询
   * @param {*} params
   * @returns
   */
  getByCodeLike(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/tsinfo/likeTscode/${params.tscode}`,
      method: 'get'
    })
  },
  /**
   * 个人喜好列表
   * @returns
   */
  favoriteList() {
    return request({
      url: `${Vue.prototype.$apiUrl}/favorite/list`,
      method: 'get'
    })
  },
  /**
   * 添加个人喜好
   * @param {*} params
   */
  favoriteAdd(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/favorite/add?tscode=${params.tscode}`,
      method: 'post'
    })
  },
  /**
   * 删除个人喜好
   * @param {*} params
   */
  favoriteDelete(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/favorite/delete?tscode=${params.tscode}`,
      method: 'delete'
    })
  },
  /**
   * 摆单数据
   * 0：买单
   * 1：卖单
   * @param {*} params
   * @returns
   */
  businessList(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/latestbid/realtime`,
      method: 'get',
      params: {
        tscode: params.tscode,
        bidtype: params.bidtype
      }
    })
  },
  /**
   * 交易数据
   * @param {*} params
   * @returns
   */
  transactionList(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/tradehistory/realtime`,
      method: 'get',
      params: {
        tscode: params.tscode
      }
    })
  },
  /**
   * 新增询价单
   * @param {*} params
   * @returns
   */
  inquirySheetAdd(params) {
    console.log('新建询价单' + JSON.stringify(params))
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
