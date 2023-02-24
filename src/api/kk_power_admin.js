// 用户
import Vue from 'vue'
import request from '@/utils/request'
export default {
  // 系统用户列表查询
  get() {
    return request({
      url: `${Vue.prototype.$apiUrl}/system/user/list`,
      method: 'get'
    })
  },
  // 角色全量查询
  getAll() {
    return request({
      url: `${Vue.prototype.$apiUrl}/system/role/optionselect`,
      method: 'get'
    })
  },
  // 系统用户新增
  add(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/system/user`,
      method: 'post',
      data: {
        userName: params.userName,
        roleIds: params.roleIds,
        password: params.password
      }
    })
  },
  // 系统用户修改
  edit(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/system/user`,
      method: 'put',
      data: {
        userId: params.userId,
        roleIds: params.roleIds
      }
    })
  },
  // 修改状态
  updateStatus(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/system/user/changeStatus`,
      method: 'put',
      data: {
        // 用户id
        userId: params.userId,
        // 状态 0：正常，1：已禁用
        status: params.status
      }
    })
  },
  // 删除
  delete(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/system/user${params.userIds}`,
      method: 'delete'
    })
  },
  // 系统用户明细查询
  detail(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/system/user/${params.userId}`,
      method: 'get'
    })
  },
  // 重置用户密码
  // 交易员选择列表
  tradeUserList() {
    return request({
      url: `${Vue.prototype.$apiUrl}/system/user/listTraders`,
      method: 'get'
    })
  }
}
