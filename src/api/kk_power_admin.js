// 用户
import Vue from 'vue'
import request from '@/utils/request'
export default {
  // 系统用户列表查询
  get(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/system/user/list`,
      method: 'get',
      params: {
        pageNum: params.pageNum,
        pageSize: params.pageSize
      }
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
        password: params.password,
        nickName: params.nickName,
        phonenumber: params.phonenumber,
        remark: params.remark
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
        userName: params.userName,
        roleIds: params.roleIds,
        nickName: params.nickName,
        phonenumber: params.phonenumber,
        remark: params.remark
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
      url: `${Vue.prototype.$apiUrl}/system/user/${params.userIds}`,
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
  },
  // 平仓时选择交易员优先级
  realTradeUserList(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/realtrade/listTrader?realTradeIdList=${params.realTradeIdList}`,
      method: 'get'
    })
  },
  // ****** 设置表头
  // column查询
  getColumn(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/syscolumn/columnlist?templateId=${params.templateId}`,
      method: 'get'
    })
  },
  // template查询
  getTemplate() {
    return request({
      url: `${Vue.prototype.$apiUrl}/syscolumn/templatelist`,
      method: 'get'
    })
  },
  // 个人设置查询 ?templateId=${params.templateId}&userId=${params.userId}
  getUserColumn(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/sysusercolumn/list`,
      method: 'get',
      params: {
        templateId: params.templateId,
        userId: params.userId
      }
    })
  },
  // 个人列设置保存
  saveColumn(params) {
    return request({
      url: `${Vue.prototype.$apiUrl}/sysusercolumn/save`,
      method: 'post',
      data: {
        fieldValue: params.fieldValue,
        headContent: params.headContent,
        templateId: params.templateId,
        userId: params.userId
      }
    })
  }
}
