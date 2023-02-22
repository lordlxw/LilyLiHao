import Vue from 'vue'
import Router from 'vue-router'
// import apiLogin from '@/api/login_login'
// import { Message } from 'element-ui'

Vue.use(Router)

// const originalPush = Router.prototype.push
// Router.prototype.push = function push(location) {
//   return originalPush.call(this, location).catch(err => err)
// }

const router = new Router({
  routes: [
    // 登录
    {
      path: '/',
      component: () => import('@/views/KKLogin/Index.vue'),
      redirect: '/login',
      children: [
        {
          path: '/login',
          component: () => import('@/views/KKLogin/Login.vue')
        }
      ]
    },
    // K线
    {
      path: '/',
      component: () => import('@/views/KKKLine/Index.vue'),
      redirect: '/kline',
      children: [
        {
          path: '/kline',
          component: () => import('@/views/KKKLine/KLine.vue')
        }
      ]
    },
    {
      path: '/main',
      component: () => import('@/views/Index.vue'),
      redirect: '/dashboard',
      children: [
        {
          path: '/dashboard',
          component: () => import('@/views/Dashboard/Dashboard.vue')
        },
        // 菜单管理
        {
          path: '/power/menu',
          component: () => import('@/views/KKPower/Menu.vue'),
        },
        // 菜单管理 - 添加
        {
          path: '/power/menu/add',
          component: () => import('@/views/KKPower/Menu/Add.vue')
        },
        // 菜单管理 - 编辑
        {
          path: '/power/menu/edit',
          component: () => import('@/views/KKPower/Menu/Edit.vue')
        },
        // 角色管理
        {
          path: '/power/role',
          component: () => import('@/views/KKPower/Role.vue'),
        },
        // 角色管理 - 添加
        {
          path: '/power/role/add',
          component: () => import('@/views/KKPower/Role/Add.vue')
        },
        // 角色管理 - 编辑
        {
          path: '/power/role/edit',
          component: () => import('@/views/KKPower/Role/Edit.vue')
        }
      ]
    }
  ],
  // 导航激活样式
  linkActiveClass: 'active-link'
})
export default router
