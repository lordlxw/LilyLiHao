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
  }
}
