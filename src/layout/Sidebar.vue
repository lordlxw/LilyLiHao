<template>
  <div>
    <el-menu
      :default-active="this.$route.path"
      background-color="#202020"
      text-color="#fff"
      active-text-color="#fff"
      router
      :default-openeds="defaultOpeneds"
      v-if="userInfo"
    >
      <template v-for="(item, index) in userInfo.menutree">
        <el-submenu
          v-if="item.children && item.children.length > 0"
          :index="index + 1 + ''"
          :key="index"
        >
          <template slot="title">
            <i :class="item.icon" class="mr10 menu-icon"></i>
            <span class="menu-tit">{{ item.menuName }}</span>
          </template>
          <el-menu-item
            v-for="item2 in item.children"
            :route="item2.component"
            :index="item2.component"
            :key="item2.component"
            @click="
              handleNavigator(
                [`${item.menuName}`, `${item2.menuName}`],
                [item.menuId, item2.menuId],
                `${item2.component}`
              )
            "
            ><i :class="item2.icon" class="mr10"></i
            >{{ item2.menuName }}</el-menu-item
          >
        </el-submenu>
        <el-menu-item
          v-else
          :index="item.component === null ? index + 1 + '' : item.component"
          :route="item.component"
          :key="item.component"
          @click="
            handleNavigator(
              [`${item.menuName}`],
              [item.menuId],
              `${item.component}`
            )
          "
        >
          <i :class="item.icon" class="mr10 menu-icon"></i>
          <span slot="title" class="menu-tit">{{ item.menuName }}</span>
        </el-menu-item>
      </template>
    </el-menu>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";
import config from "@/utils/config.js";
export default {
  data() {
    return {
      menus: [],
      defaultOpeneds: []
    };
  },
  computed: {
    ...mapState({
      curMenuIndex: state => state.curMenuIndex
    }),
    ...mapGetters({
      routers: "getRouters",
      menus_ids: "getMenus",
      roleId: "getRoleId",
      userInfo: "getUserInfo"
    })
  },
  watch: {
    $route(to, from) {
      if (this.routers[to.path]) {
        this.handleNavigator(
          this.routers[to.path].navigator,
          this.routers[to.path].navigatorId,
          to.path
        );
      }
    }
  },
  methods: {
    setAuth(index) {
      return this.roleId === "1" || this.menus_ids.indexOf(index) !== -1;
    },

    fetchMenus() {
      this.menus = config.menus;
      this.defaultOpeneds = this.userInfo.menutree.map((n, i) => i + 1 + "");
    },
    handleNavigator(val1, val2, val3) {
      const params = {
        val1,
        val2,
        val3
      };
      this.$store.commit("SET_NAVIGATOR", params);
    }
  },
  mounted() {
    this.fetchMenus();
  }
};
</script>

<style lang="scss" scoped>
.menu-icon,
.menu-tit {
  font-weight: bold;
  font-size: 15px;
}
</style>
