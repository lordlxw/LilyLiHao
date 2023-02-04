import Vue from 'vue'
import request from '@/utils/request'

export default {
  /**
   * 分钟线
   * @param {*} params
   * @returns
   */
  getKLineMinute(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/oneminute/listByAmount`,
      method: 'get',
      params: {
        tscode: params.tscode,
        starttime: params.starttime,
        endtime: params.endtime,
        noForward: params.noForward
      }
    })
  },
  // 5分钟线
  getKLineFiveMinute(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/fiveminute/listByAmount`,
      method: 'get',
      params: {
        tscode: params.tscode,
        starttime: params.starttime,
        endtime: params.endtime,
        noForward: params.noForward
      }
    })
  },
  // 日K线
  getKLineDay(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/tradechart/listByAmount`,
      method: 'get',
      params: {
        tscode: params.tscode,
        startdate: params.startdate,
        enddate: params.enddate,
        noForward: params.noForward
      }
    })
  }
}
