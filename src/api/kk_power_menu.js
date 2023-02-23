// 登录
import Vue from 'vue'
import request from '@/utils/request'
export default {
    // 系统菜单列表查询
    get() {
        return request({
            url: `${Vue.prototype.$apiUrl}/system/menu/treelist`,
            method: 'get'
        })
    },
    // 新增菜单
    add(params) {
        return request({
            url: `${Vue.prototype.$apiUrl}/system/menu`,
            method: 'post',
            data: {
                // vue组件路由
                component: params.component,
                // 图标class
                icon: params.icon,
                // 菜单功能名称
                menuName: params.menuName,
                // 菜单类型
                menuType: params.menuType,
                // 排序
                orderNum: params.orderNum,
                // 父级菜单功能id
                parentId: params.parentId,
                // 功能码
                perms: params.perms
            }
        })
    },
    // 编辑
    edit(params) {
        return request({
            url: `${Vue.prototype.$apiUrl}/system/menu`,
            method: 'put',
            data: {
                // 菜单功能id
                menuId: params.menuId,
                // vue组件路由
                component: params.component,
                // 图标class
                icon: params.icon,
                // 菜单功能名称
                menuName: params.menuName,
                // 菜单类型
                menuType: params.menuType,
                // 排序
                orderNum: params.orderNum,
                // 父级菜单功能id
                parentId: params.parentId,
                // 功能码
                perms: params.perms
            }
        })
    },
    // 加载对应角色菜单列表树
    getRoleMenuTree(params) {
        return request({
            url: `${Vue.prototype.$apiUrl}/system/menu/roleMenuTreeselect/${params.roleId}`,
            method: 'get'
        })
    },
    // 系统菜单树查询
    getSystemMenuTree() {
        return request({
            url: `${Vue.prototype.$apiUrl}/system/menu/treeselect`,
            method: 'get'
        })
    },
    // 系统菜单明细查询
    getSystemMenuDetail(params) {
        return request({
            url: `${Vue.prototype.$apiUrl}/system/menu/${params.menuId}`,
            method: 'get'
        })
    },
    // 删除
    delete(params) {
        return request({
            url: `${Vue.prototype.$apiUrl}/system/menu/${params.menuId}`,
            method: 'delete'
        })
    },
}
