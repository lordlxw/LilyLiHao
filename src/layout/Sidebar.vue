<template>
  <div>
    <el-menu
      default-active="1"
      background-color="#202020"
      text-color="#fff"
      active-text-color="#fff"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      router
    >
      <el-submenu index="1">
        <template slot="title">
          <i class="fa fa-superpowers"></i>
          <span>权限管理</span>
        </template>
        <el-menu-item index="1-1" route="/power/menu">菜单管理</el-menu-item>
        <el-menu-item index="1-2" route="/power/role">角色管理</el-menu-item>
        <!-- <el-menu-item index="1-3" route="/power/admin">用户管理</el-menu-item> -->
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="fa fa-rmb"></i>
          <span>交易管理</span>
        </template>
        <el-menu-item index="2-1" route="/trade/enquiry">询价单</el-menu-item>
        <el-menu-item index="2-2" route="/trade/bonds">当前持仓</el-menu-item>
        <el-menu-item index="2-3" route="/trade/reward">成交回报</el-menu-item>
      </el-submenu>
    </el-menu>

    <!-- <el-menu
      :default-active="this.$route.path"
      @open="handleOpen"
      @close="handleClose"
      background-color="#202020"
      text-color="#fff"
      active-text-color="#fff"
      router
      :collapse="isCollapse"
      v-if="
        menus[curMenuIndex - 1] && menus[curMenuIndex - 1].children.length > 0
      "
    >
      <template v-for="item in menus[curMenuIndex - 1].children">
        <el-submenu
          v-if="
            setAuth(item.index) &&
            item.children &&
            item.children.length > 0 &&
            item.type === 'menu'
          "
          :index="item.url"
          :key="item.name + '-' + item.index"
        >
          <template slot="title">
            <i :class="item.icon" class="mr10"></i>
            <span style="font-size: 15px; font-weight: bold">{{
              item.name
            }}</span>
          </template>
          <el-menu-item-group>
            <div v-for="item2 in item.children" :key="item2.name">
              <el-menu-item
                v-if="setAuth(item2.index)"
                :route="item2.url"
                :index="item2.url"
                :key="item2.url"
                @click="
                  handleNavigator(
                    [`${item.name}`, `${item2.name}`],
                    [item.id, item2.id],
                    `${item2.url}`
                  )
                "
                ><i :class="item2.icon" class="mr10"></i
                >{{ item2.name }}</el-menu-item
              >
            </div>
          </el-menu-item-group>
        </el-submenu>
        <el-menu-item
          v-else-if="setAuth(item.index)"
          :index="item.url"
          :route="item.url"
          :key="item.index"
          @click="
            handleNavigator([`${item.name}`], [item.index], `${item.url}`)
          "
        >
          <i :class="item.icon" class="mr10"></i>
          <span slot="title" style="font-size: 15px; font-weight: bold">{{
            item.name
          }}</span>
        </el-menu-item>
      </template>
    </el-menu> -->
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import config from '@/utils/config.js'
export default {
  data() {
    return {
      menus: []
    }
  },
  computed: {
    ...mapState({
      isCollapse: state => state.isCollapse,
      curMenuIndex: state => state.curMenuIndex
    }),
    ...mapGetters({
      routers: 'getRouters',
      menus_ids: 'getMenus',
      roleId: 'getRoleId'
    })
  },
  watch: {
    $route(to, from) {
      if (this.routers[to.path]) {
        this.handleNavigator(this.routers[to.path].navigator, this.routers[to.path].navigatorId, to.path)
      }
    }
  },
  methods: {
    setAuth(index) {
      return this.roleId === '1' || this.menus_ids.indexOf(index) !== -1
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath)
    },
    fetchMenus() {
      this.menus = config.menus
    },
    handleNavigator(val1, val2, val3) {
      const params = {
        val1,
        val2,
        val3
      }
      this.$store.commit('SET_NAVIGATOR', params)
    }
  },
  mounted() {
    this.fetchMenus()
  }
}
</script>
