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
    asideLeftWidth: '0px',
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
    urlParams: {},
    // 询价单的一些默认设置默认设置
    defaultSet: {},
    userInfo: {}
  },
  getters: {
    getMenus(state) {
      if (state.menus.length > 0) {
        localStorage.setItem(config.keys.menusKey, state.menus)
      } else {
        state.menus = localStorage.getItem(config.keys.menusKey)
      }
      return JSON.parse(state.menus)
    },
    getRoleId(state) {
      if (state.roleId === '') {
        state.roleId = localStorage.getItem(config.keys.roleIdKey)
      }
      return state.roleId
    },
    getNavigator(state) {
      if (state.navigator.length > 0) {
      } else {
        const navigator = localStorage.getItem(config.keys.navigatorKey)
        if (navigator) {
          state.navigator = navigator.split(',')
        }
      }
      return state.navigator
    },
    getNavigatorId(state) {
      if (state.navigatorId.length > 0) {

      } else {
        const navigatorId = localStorage.getItem(config.keys.navigatorIdKey)
        if (navigatorId) {
          state.navigatorId = navigatorId.split(',')
        }
      }
      return state.navigatorId
    },
    getRouters(state) {
      if (Object.keys(state.routers).length > 0) {

      } else {
        const routers = JSON.parse(localStorage.getItem(config.keys.routersKey))
        if (routers) {
          state.routers = routers
        }
      }
      return state.routers
    },
    getUrlParams(state) {
      if (Object.keys(state.urlParams).length > 0) {

      } else {
        const urlParams = JSON.parse(localStorage.getItem(config.keys.urlParams))
        if (urlParams) {
          state.urlParams = urlParams
        }
      }
      return state.urlParams
    },
    // 获取当前tscode
    getTscodeGlobal(state) {
      if (state.tscodeGlobal === '') {
        state.tscodeGlobal = localStorage.getItem(config.keys.currentTscode)
      }
      return state.tscodeGlobal || ''
    },
    // 获取默认设置
    getDefaultSet(state) {
      if (localStorage.getItem(config.keys.defaultSet)) {
        state.defaultSet = JSON.parse(localStorage.getItem(config.keys.defaultSet))
      } else {
        state.defaultSet = {
          // 默认交易量
          volume: 0,
          // 是否快速提交
          quickSubmit: false,
        }
      }
      return state.defaultSet
    },
    // 获取用户信息
    getUserInfo(state) {
      if (localStorage.getItem(config.keys.userInfo)) {
        state.userInfo = JSON.parse(localStorage.getItem(config.keys.userInfo))
      } else {
        state.userInfo = {
          // 权限
          permissions: [],
          // 用户名
          userName: '',
          // 菜单
          menutree: []
        }
      }
      return state.userInfo
    }
  },
  actions: {},
  mutations: {
    // 菜单收起与展开
    SET_IS_COLLAPSE(state, params) {
      console.log(params)
      state.isCollapse = params.isCollapse
      state.asideLeftWidth = params.val + 'px'
    },
    // 设置登录名
    SET_LOGINNAME(state, loginName) {
      state.loginName = loginName
      localStorage.setItem(config.keys.loginNameKey, loginName)
    },
    // 设置token
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem(config.keys.tokenKey, token)
    },
    // 设置用户信息
    SET_USER_INFO(state, userInfo) {
      state.userInfo = JSON.stringify(userInfo)
      localStorage.setItem(config.keys.userInfo, JSON.stringify(userInfo))
    },
    // 设置角色id
    SET_ROLEID(state, roleId) {
      state.roleId = roleId.toString()
      localStorage.setItem(config.keys.roleIdKey, roleId.toString())
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
      localStorage.setItem(config.keys.menusKey, state.menus)
    },
    // 设置导航
    SET_NAVIGATOR(state, params) {
      state.navigator = params.val1
      state.navigatorId = params.val2
      state.routers[params.val3] = {
        navigator: params.val1,
        navigatorId: params.val2
      }
      localStorage.setItem(config.keys.navigatorKey, params.val1)
      localStorage.setItem(config.keys.navigatorIdKey, params.val2)
      localStorage.setItem(config.keys.routersKey, JSON.stringify(state.routers))
    },
    // 设置当前导航索引
    SET_CRUMENUSINDEX(state, index) {
      state.curMenuIndex = index
    },
    SET_URLPARAMS(state, params) {
      localStorage.setItem(config.keys.urlParams, JSON.stringify(params))
      state.urlParams = params
    },
    // 设置当前选中的tscode（刷新恢复使用）
    SET_TSCODE_GLOBAL(state, params) {
      state.tscodeGlobal = params.tscodeGlobal
      localStorage.setItem(config.keys.currentTscode, params.tscodeGlobal)
    },
    // 设置默认设置
    SET_DEFAULT_SET(state, params) {
      state.defaultSet = params
      localStorage.setItem(config.keys.defaultSet, params)
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
