// 持仓单
import Vue from 'vue'
import request from '@/utils/request'
export default {
  /**
   * 未平仓列表
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
   * 已平仓列表
   * @param {*} params
   */
  getFinish(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/listFinishTrade`,
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
  // 违约查询列表
  getBreak(params) {
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
        // 交割日期
        deliveryTime: params.deliveryTime,
        // 原交割日期
        deliveryTime2: params.deliveryTime2,
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
   * 滚单
   * @param {*} params
   */
  dealRoll(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/gundan`,
      method: 'post'
    })
  },
  // 已平仓交割
  dealDelivery(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/jiaoge`,
      method: 'post',
      data: {
        jiaogeIdlist: params.jiaogeIdlist,
        weiyueIdlist: params.weiyueIdlist
      }
    })
  },
  // 未平仓修改申请
  dealNoBondsEdit(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/weipingchangerequest`,
      method: 'post',
      data: {
        // 联系人
        contactPerson: params.contactPerson,
        // 联系方式
        contactType: params.contactType,
        // 交易对手
        counterParty: params.counterParty,
        // 交割速度
        deliverySpeed: params.deliverySpeed,
        // 交割时间
        deliveryTime: params.deliveryTime,
        // 成交价格
        price: params.price,
        // 交易单ID
        realTradeId: params.realTradeId,
        // 备注
        remark: params.remark,
        // 成交量
        volume: params.volume
      }
    })
  },
  // 已平仓修改申请
  dealBondsEdit(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/yipingchangerequest`,
      method: 'post',
      data: {
        // 联系人
        contactPerson: params.contactPerson,
        // 联系方式
        contactType: params.contactType,
        // 交易对手
        counterParty: params.counterParty,
        // 交割速度
        deliverySpeed: params.deliverySpeed,
        // 交割时间
        deliveryTime: params.deliveryTime,
        // 成交价格
        price: params.price,
        // 交易单ID
        realTradeId: params.realTradeId,
        // 备注
        remark: params.remark,
        // 成交量
        volume: params.volume
      }
    })
  },
  // 未平仓修改申请确认审核通过
  dealNoBondsEditComfirm(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/weipingchangeconfirm`,
      method: 'post',
      data: {
        realTradeId: params.realTradeId
      }
    })
  },
  // 已平仓修改申请确认审核通过
  dealBondsEditComfirm(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/yipingchangeconfirm`,
      method: 'post',
      data: {
        realTradeId: params.realTradeId
      }
    })
  },
  // 未平仓修改申请拒绝通过
  dealNoBondsEditRejection(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/weipingchangedeny`,
      method: 'post',
      data: {
        realTradeId: params.realTradeId
      }
    })
  },
  // 已平仓修改申请拒绝通过
  dealBondsEditRejection(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/yipingchangedeny`,
      method: 'post',
      data: {
        realTradeId: params.realTradeId
      }
    })
  },
  // 交易违约
  dealBreak(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/weiyue`,
      method: 'post',
      data: {
        realTradeId: params.realTradeId
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
  },
  // 已平导出
  bondsExport() {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/export`,
      method: 'get',
      responseType: 'arraybuffer'
    })
  }
}
