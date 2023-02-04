import Vue from 'vue'
import Vuex from 'vuex'
import config from '@/utils/config.js'
import * as util from '@/utils/util.js'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 记录当前选中的tscode,刷新恢复使用
    tscodeGlobal: '',
    isCollapse: false,
    asideLeftWidth: '200px',
    userId: 0,
    roleId: '',
    nickName: '',
    loginName: '',
    token: '',
    menus: [],
    navigator: [],
    navigatorId: [],
    routers: {},
    imgList: {
    },
    curMenuIndex: '',
    // url 连接传参
    urlParams: {}
  },
  getters: {
    getMenus(state) {
      if (state.menus.length > 0) {
        sessionStorage.setItem(config.keys.menusKey, state.menus)
      } else {
        state.menus = sessionStorage.getItem(config.keys.menusKey)
      }
      return JSON.parse(state.menus)
    },
    getRoleId(state) {
      if (state.roleId === '') {
        state.roleId = sessionStorage.getItem(config.keys.roleIdKey)
      }
      return state.roleId
    },
    getNavigator(state) {
      if (state.navigator.length > 0) {
      } else {
        const navigator = sessionStorage.getItem(config.keys.navigatorKey)
        if (navigator) {
          state.navigator = navigator.split(',')
        }
      }
      return state.navigator
    },
    getNavigatorId(state) {
      if (state.navigatorId.length > 0) {

      } else {
        const navigatorId = sessionStorage.getItem(config.keys.navigatorIdKey)
        if (navigatorId) {
          state.navigatorId = navigatorId.split(',')
        }
      }
      return state.navigatorId
    },
    getRouters(state) {
      if (Object.keys(state.routers).length > 0) {

      } else {
        const routers = JSON.parse(sessionStorage.getItem(config.keys.routersKey))
        if (routers) {
          state.routers = routers
        }
      }
      return state.routers
    },
    getUrlParams(state) {
      if (Object.keys(state.urlParams).length > 0) {

      } else {
        const urlParams = JSON.parse(sessionStorage.getItem(config.keys.urlParams))
        if (urlParams) {
          state.urlParams = urlParams
        }
      }
      return state.urlParams
    },
    // 获取当前tscode
    getTscodeGlobal(state) {
      if (state.tscodeGlobal === '') {
        state.tscodeGlobal = sessionStorage.getItem(config.keys.currentTscode)
      }
      return state.tscodeGlobal || ''
    }
  },
  actions: {},
  mutations: {
    // 菜单收起与展开
    SET_IS_COLLAPSE(state, isCollapse) {
      state.isCollapse = isCollapse
      state.asideLeftWidth = isCollapse ? '64px' : '200px'
    },
    // 设置登录名
    SET_LOGINNAME(state, loginName) {
      state.loginName = loginName
      sessionStorage.setItem(config.keys.loginNameKey, loginName)
    },
    // 设置token
    SET_TOKEN(state, token) {
      state.token = token
      sessionStorage.setItem(config.keys.tokenKey, token)
    },
    // 设置角色id
    SET_ROLEID(state, roleId) {
      state.roleId = roleId.toString()
      sessionStorage.setItem(config.keys.roleIdKey, roleId.toString())
    },
    // 设置menus
    SET_MENUS(state, menus) {
      const lazyMenuIds = []
      const menusIds = JSON.parse(menus)
      menusIds.forEach(element => {
        let temp = element
        let flag = true
        while (flag) {
          const position = temp.lastIndexOf('-')
          const curMenuId = temp.substring(0, position)
          if (lazyMenuIds.indexOf(curMenuId) === -1 && curMenuId !== '') {
            lazyMenuIds.push(curMenuId)
          }
          temp = curMenuId
          if (position === -1) {
            flag = false
          }
        }
      });
      state.menus = JSON.stringify(util.mergeArray(JSON.parse(menus), lazyMenuIds))
      sessionStorage.setItem(config.keys.menusKey, state.menus)
    },
    // 设置导航
    SET_NAVIGATOR(state, params) {
      state.navigator = params.val1
      state.navigatorId = params.val2
      state.routers[params.val3] = {
        navigator: params.val1,
        navigatorId: params.val2
      }
      sessionStorage.setItem(config.keys.navigatorKey, params.val1)
      sessionStorage.setItem(config.keys.navigatorIdKey, params.val2)
      sessionStorage.setItem(config.keys.routersKey, JSON.stringify(state.routers))
    },
    // 设置当前导航索引
    SET_CRUMENUSINDEX(state, index) {
      state.curMenuIndex = index
    },
    SET_URLPARAMS(state, params) {
      sessionStorage.setItem(config.keys.urlParams, JSON.stringify(params))
      state.urlParams = params
    },
    // 设置当前选中的tscode（刷新恢复使用）
    SET_TSCODE_GLOBAL(state, params) {
      state.tscodeGlobal = params.tscodeGlobal
      sessionStorage.setItem(config.keys.currentTscode, params.tscodeGlobal)
    }
  }
})
export default store

// // 保存数据到sessionStorage
// sessionStorage.setItem('key', 'value');
// // 从sessionStorage获取数据
// var data = sessionStorage.getItem('key');
// // 从sessionStorage删除保存的数据
// sessionStorage.removeItem('key');
// // 从sessionStorage删除所有保存的数据
// sessionStorage.clear();
