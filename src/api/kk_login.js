import Vue from 'vue'
import request from '@/utils/request'

export default {
  // 登录
  login(params) {
    console.log(params)
    return request({
      url: `${Vue.prototype.$apiUrl}/login`,
      method: 'post',
      data: {
        username: params.username,
        password: params.password,
        uuid: params.uuid,
        code: params.code
      }
    })
  },
  // 权限
  auth() {
    return request({
      url: `${Vue.prototype.$apiUrl}/getUserInfo`,
      method: 'get',
    })
  },
}
