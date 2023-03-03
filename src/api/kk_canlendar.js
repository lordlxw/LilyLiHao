import Vue from 'vue'
import request from '@/utils/request'

export default {
  // 下个工作日
  nextDealDay() {
    return request({
      url: `${Vue.prototype.$apiUrl}/holidays/getNextWorkday`,
      method: 'get'
    })
  },
  // 一月内节假日
  holidayOfMonth() {
    return request({
      url: `${Vue.prototype.$apiUrl}/holidays/getHolidayInOneMonth`,
      method: 'get'
    })
  },
  // 节假日查询
  holiday() {
    return request({
      url: `${Vue.prototype.$apiUrl}/holidays/getAll`,
      method: 'get'
    })
  }
}
