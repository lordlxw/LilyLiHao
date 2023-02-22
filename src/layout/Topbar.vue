<template>
  <div class="topbar">
    <div class="navigator">
      <i
        class="collapse"
        :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
        @click="changeFoldState"
      ></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item :to="{ path: '/main' }">仪表盘</el-breadcrumb-item> -->
        <el-breadcrumb-item
          v-for="(item, index) in navigator"
          :key="item + index"
          >{{ item }}</el-breadcrumb-item
        >
      </el-breadcrumb>
    </div>
  </div>
</template>
<script>
import { mapMutations, mapState, mapGetters } from "vuex";
import Velocity from "velocity-animate";
import screenfull from "screenfull";
import config from "@/utils/config.js";
export default {
  data() {
    return {
      memus: [],
      screenfullClassArr: ["fa-arrows-alt", "fa-compress"],
      screenfullClass: "fa-arrows-alt",
      loginName: sessionStorage.getItem(config.keys.loginNameKey),
      dialogFormVisible: false,
    };
  },
  watch: {
    /* 监听左侧菜单宽度变化，改变顶部logo大小 */
    asideLeftWidth(newVal, oldVal) {
      Velocity(this.$refs["animateLogo"], {
        width: newVal,
      });
    },
  },
  created() {
    this.menus = config.menus
  },
  computed: {
    ...mapState({
      isCollapse: (state) => state.isCollapse,
      asideLeftWidth: (state) => state.asideLeftWidth,
      activeIndex: (state) => state.curMenuIndex
    }),
    ...mapGetters({
      menus_ids: 'getMenus',
      roleId: 'getRoleId',
      navigator: 'getNavigator'
    })
  },
  methods: {
    setAuth(index) {
      return this.roleId === '1' || this.menus_ids.indexOf(index) !== -1
    },
    ...mapMutations(["SET_IS_COLLAPSE", "SET_CRUMENUSINDEX"]),
    /* 折叠展开 */
    changeFoldState() {
      this["SET_IS_COLLAPSE"](!this.isCollapse);
    },
    /* 全屏与退出全屏 */
    handleScreenfull() {
      if (screenfull.isEnabled) {
        screenfull.toggle();
        if (this.screenfullClass !== this.screenfullClassArr[1]) {
          this.screenfullClass = this.screenfullClassArr[1];
        } else {
          this.screenfullClass = this.screenfullClassArr[0];
        }
      } else {
        this.$message({
          message: "您的浏览器不支持全屏",
          type: "warning",
        });
      }
    },
    /* 下拉指令 */
    handleCommand(command) {
      switch (command) {
        case "updatePassword":
          this.$store.commit("SET_NAVIGATOR", {
            val1: ["修改密码"],
            val2: [0],
            val3: ["/update"],
          });
          this.$router.push({ path: "/update" });
          break;
        case "logout":
          this.fetchLogout();
          break;
      }
    },
    /* 用户登出 */
    fetchLogout() {
      // apiLogin.logout({}).then((response) => {
      //   sessionStorage.removeItem(config.keys.tokenKey);
      //   sessionStorage.removeItem(config.keys.menusKey);
      //   sessionStorage.removeItem(config.keys.loginNameKey);
      //   this.$router.push({ path: "/login" });
      // });
    },
    handleSelect(key, keyPath) {
      this["SET_CRUMENUSINDEX"](key)
    },
    // handleNavigator(val1, val2, val3) {
    //   const params = {
    //     val1,
    //     val2,
    //     val3
    //   }
    //   this.$store.commit('SET_NAVIGATOR', params)
    // }
  },
  mounted() {
    let index = 1
    if (/^\/system/.test(this.$route.path)) {
      index = '1'
      // this.handleNavigator(['用户权限', '用户角色'], ['1-1', '1-1-1'], '/system/power/role')
    } else if (/^\/product/.test(this.$route.path)) {
      index = '2'
      // this.handleNavigator(['平台代售', '作品管理'], ['2-1', '2-1-1'], '/product/agent/works')
    } else if (/^\/market/.test(this.$route.path)) {
      index = '3'
      // this.handleNavigator(['空投活动', '空投管理'], ['3-1', '3-1-1'], '/market/airdrop/manage')
    } else if (/^\/account/.test(this.$route.path)) {
      index = '4'
      // this.handleNavigator(['平台账户'], ['4-1'], '/account/account')
    } else if (/^\/member/.test(this.$route.path)) {
      index = '5'
      // this.handleNavigator(['会员管理'], ['51'], '/member/memberlist')
    }
    this["SET_CRUMENUSINDEX"](index)
  },
};
</script>
<style lang="scss" scoped>
@import "../assets/css/style.scss";
.topbar {
  background-color: #e9e6e6;
  height: 40px;
  .collapse {
    font-size: 20px;
  }
  i:hover {
    cursor: pointer;
    color: $hover-color;
  }
  .navigator {
    line-height: 40px;
    padding: 0 15px;
    .el-breadcrumb {
      height: 40px;
      line-height: 40px;
      float: left;
    }
  }
}
</style>
