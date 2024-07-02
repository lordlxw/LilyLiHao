import Vue from "vue";
import request from "@/utils/request";

export default {
  // 登录
  login(params, agent) {
    return request({
      url: `${Vue.prototype.$apiUrl}/login`,
      method: "post",
      data: {
        username: params.username,
        password: params.password,
        uuid: params.uuid,
        code: params.code
      },
      headers: {
        Agent: agent
      }
    });
  },
  // 权限
  auth() {
    return request({
      url: `${Vue.prototype.$apiUrl}/getUserInfo`,
      method: "get"
    });
  },
  // 退出登录
  logout() {
    return request({
      url: `${Vue.prototype.$apiUrl}/logout`,
      method: "get"
    });
  },
  verifyToken(token) {
    return request({
      url: `${Vue.prototype.$apiUrl}/api/verifyToken`,
      method: "post",
      data: {
        token: token
      }
    });
  },
  getProfile(userId) {
    return request({
      url: `${Vue.prototype.$apiUrl}/userProfile/userId/${userId}`,
      method: "get"
    });
  },
  brokerList() {
    return request({
      url: `${Vue.prototype.$apiUrl}/broker`,
      method: 'get'
    })
  },
  chatReceiver() {
    return request({
      url: `${Vue.prototype.$apiUrl}/chatReceiver`,
      method: 'get'
    })
  },
  saveProfile(obj) {
    return request({
      url: `${Vue.prototype.$apiUrl}/userProfile`,
      method: "post",
      data: obj
    });
  }
};
