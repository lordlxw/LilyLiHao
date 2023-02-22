// 角色
import Vue from 'vue'
import request from '@/utils/request'
export default {
    // 系统角色列表查询
    get() {
        return request({
            url: `${Vue.prototype.$apiUrl}/system/role/list`,
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
    // 系统角色新增
    add(params) {
        return request({
            url: `${Vue.prototype.$apiUrl}/system/role`,
            method: 'post',
            data: {
                // 数据权限 0：查看所有；1：查看自己；2：查看委派
                dataScope: params.dataScope,
                // 菜单id
                menuIds: params.menuIds,
                // 角色关键字
                roleKey: params.roleKey,
                // 角色名称
                roleName: params.roleName,
                // 角色排序
                roleSort: params.roleSort
            }
        })
    },
    // 系统角色修改
    edit(params) {
        return request({
            url: `${Vue.prototype.$apiUrl}/system/role`,
            method: 'put',
            data: {
                // 角色id
                roleId: params.roleId,
                // 数据权限 0：查看所有；1：查看自己；2：查看委派
                dataScope: params.dataScope,
                // 菜单id
                menuIds: params.menuIds,
                // 角色关键字
                roleKey: params.roleKey,
                // 角色名称
                roleName: params.roleName,
                // 角色排序
                roleSort: params.roleSort
            }
        })
    },
    // 修改状态
    updateStatus(params) {
        return request({
            url: `${Vue.prototype.$apiUrl}/system/role/changeStatus`,
            method: 'put',
            data: {
                // 角色id
                roleId: params.roleId,
                // 状态 0：正常，1：已禁用
                status: params.status
            }
        })
    },
    // 删除
    delete(params) {
        return request({
            url: `${Vue.prototype.$apiUrl}/system/role`,
            method: 'delete',
            data: {
                roleIds: params.roleIds
            }
        })
    },
    // 系统角色明细查询
    detail(params) {
        return request({
            url: `${Vue.prototype.$apiUrl}/system/role/${params.roleId}`,
            method: 'get'
        })
    }
}
