<template>
  <div class="topbar">
    <div class="navigator">
      <i class="collapse" :class="isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'" @click="changeFoldState"></i>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <!-- <el-breadcrumb-item :to="{ path: '/main' }">仪表盘</el-breadcrumb-item> -->
        <el-breadcrumb-item v-for="(item, index) in navigator" :key="item + index">{{ item }}</el-breadcrumb-item>
      </el-breadcrumb>
      <ul class="k-nav">
        <li class="nav-right">
          <router-link target="_blank" :to="{ path: '/fourscreen' }" class="i-text"><i
              class="el-icon-menu"></i></router-link>
        </li>
        <li class="nav-right" v-if="setAuth('kline:view')">
          <router-link target="_blank" :to="{ path: '/kline' }" class="i-text"><i
              class="fa fa-line-chart"></i></router-link>
        </li>
        <li class="nav-right">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              {{ userInfo ? userInfo.userName : "" }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="updatePassword">修改密码</el-dropdown-item>
              <el-dropdown-item divided command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
      </ul>
    </div>
    <main-socket></main-socket>
    <el-dialog title="修改密码" :visible.sync="dialogUpdatePasswordVisible" width="30%" append-to-body center
      :destroy-on-close="true" :close-on-click-modal="false">
      <update-password @change="handleDialogUpdatePasswordVisible"></update-password>
    </el-dialog>
  </div>
</template>
<script>
import { mapMutations, mapState, mapGetters } from "vuex";
import screenfull from "screenfull";
import apiLogin from '@/api/kk_login'
import MainSocket from '@/components/Socket.vue'
import UpdatePassword from '@/components/UpdatePassword.vue'
import { pageMixin } from '@/utils/pageMixin'
import config from "@/utils/config.js";
export default {
  mixins: [pageMixin],
  components: {
    MainSocket,
    UpdatePassword
  },
  data() {
    return {
      memus: [],
      screenfullClassArr: ["fa-arrows-alt", "fa-compress"],
      screenfullClass: "fa-arrows-alt",
      loginName: sessionStorage.getItem(config.keys.loginNameKey),
      dialogFormVisible: false,
      // 修改密码弹出框
      dialogUpdatePasswordVisible: false
    };
  },
  created() {
    this.menus = config.menus
  },
  computed: {
    ...mapState({
      isCollapse: (state) => state.isCollapse,
      asideLeftWidth: (state) => state.asideLeftWidth,
      socketMain: (state) => state.socketMain,
    }),
    ...mapGetters({
      userInfo: 'getUserInfo'
    })
  },
  methods: {
    ...mapMutations(["SET_IS_COLLAPSE", "SET_SOCKET_KLINE"]),
    /* 折叠展开 */
    changeFoldState() {
      this["SET_IS_COLLAPSE"]({ isCollapse: !this.isCollapse, val: this.isCollapse ? 200 : 0 });
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
        case "logout":
          if (window.v1 && window.v1.isElectron()) {
            window.v1.quit()
          } else {
            apiLogin.logout().then(response => {
              if (response && response.code === 200) {
                Promise.all([
                  this.$store.commit('SET_TOKEN', null),
                  this.$store.commit('SET_USER_INFO', null)
                ]).then(() => {
                  this.$router.push({ path: '/' })
                })
              } else {
                this.$message({
                  message: '退出失败',
                  type: 'error'
                })
              }
            })
          }

          break;
        case "updatePassword":
          this.dialogUpdatePasswordVisible = true
          break;
      }
    },
    // 修改密码弹出框
    handleDialogUpdatePasswordVisible(obj) {
      this.dialogUpdatePasswordVisible = obj.dialogVisable
    },
    // 计算宽度
    initFrameW(val) {
      const width = 1920
      const clientWith = document.body.clientWidth
      return Math.floor(clientWith / width * val)
    }
  },
  mounted() {
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
    color: $body-main-hover;
  }

  .navigator {
    line-height: 40px;
    padding: 0 15px;

    .el-breadcrumb {
      height: 40px;
      line-height: 40px;
      float: left;
    }

    .k-nav {
      overflow: hidden;
      float: right;

      .i-text {
        color: #333333;

        i {
          font-size: 18px;
        }
      }

      li {
        padding: 0px 5px;
        font-size: 12px;
        cursor: pointer;
        line-height: 40px;
        float: left;
      }
    }
  }
}
</style>
