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
    }
  ],
  // 导航激活样式
  linkActiveClass: 'active-link'
})
export default router
