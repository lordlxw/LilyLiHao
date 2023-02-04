<template>
  <div class="topbar">
    <div
      class="topbar-left"
      ref="animateLogo"
      :style="'width:' + asideLeftWidth + ';'"
    >
      <el-image :src="require('../assets/images/logo.png')" class="logo" />
    </div>
    <div class="topbar-right">
      <div class="l">
        <i
          :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"
          @click="changeFoldState"
        ></i>
        <el-menu
          :default-active="activeIndex"
          mode="horizontal"
          @select="handleSelect"
          background-color="#1678B0"
          text-color="#fff"
          active-text-color="#ffd04b"
          router
        >
          <template v-for="item in menus">
            <el-menu-item
              v-if="setAuth(item.index)"
              :route="item.url"
              :index="item.index"
              :key="item.name"
              style="font-size: 15px; font-weight: bold"
              >{{ item.name }}</el-menu-item
            >
          </template>
        </el-menu>
      </div>
      <div class="r">
        <i
          class="fa mr10"
          :class="screenfullClass"
          @click="handleScreenfull"
        ></i>
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ loginName }}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="updatePassword"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item divided command="logout">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
import apiLogin from "@/api/login_login";
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
      roleId: 'getRoleId'
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
      apiLogin.logout({}).then((response) => {
        sessionStorage.removeItem(config.keys.tokenKey);
        sessionStorage.removeItem(config.keys.menusKey);
        sessionStorage.removeItem(config.keys.loginNameKey);
        this.$router.push({ path: "/login" });
      });
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
  background-color: $main-color;
  height: 60px;
  display: flex;
  .topbar-left {
    display: flex;
    justify-content: center;
    align-items: center;
    .logo {
      padding: 10px;
      width: 40px;
    }
  }
  .topbar-right {
    padding-right: 15px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    i:hover {
      cursor: pointer;
      color: $hover-color;
    }
    .l {
      flex: 1;
      display: flex;
      align-items: center;
    }
    .r {
      display: flex;
      justify-content: center;
      align-items: center;
      .el-icon-full-screen {
        font-size: 26px;
        font-weight: bold;
        margin: 0 10px;
      }
      .el-dropdown-link {
        cursor: pointer;
        color: white;
      }
      .el-dropdown-link:hover {
        color: $hover-color;
      }
      .el-icon-arrow-down {
        font-size: 12px;
      }
    }
  }
}
</style>
