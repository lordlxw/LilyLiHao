<template>
  <div class="form-container height100percent">
    <div>
      <title-bar :isMaximize="true">
        <div slot="left_bar">
          <el-popover placement="bottom-end" width="500" trigger="hover">
            <user-Info :showInfo="false" :userInfo="userInfo"></user-Info>
            <i
              slot="reference"
              class="el-icon-user-solid noDrag txt-white left_bar"
            ></i>
          </el-popover>
        </div>
        <i
          slot="right_bar"
          v-if="setAuth('system:order:edit')"
          @click="openMoreThis(`/simulation/chat`)"
          class="el-icon-chat-dot-round noDrag txt-white right_bar"
        ></i>
      </title-bar>
    </div>
    <div style="height: calc(100% - 40px)">
      <el-container class="height100percent">
        <el-aside :width="asideLeftWidth" class="height100percent">
          <div class="aside-left" ref="animateAsideLeft">
            <el-scrollbar class="scrollbar-aside">
              <sidebar></sidebar>
            </el-scrollbar>
          </div>
        </el-aside>
        <el-main>
          <div
            class="main-content"
            ref="animateContent"
            :style="'padding-left:' + asideLeftWidth + ';'"
          >
            <topbar v-if="false"></topbar>
            <el-scrollbar class="scrollbar-content height100percent">
              <main-content>
                <slot></slot>
              </main-content>
            </el-scrollbar>
          </div>
        </el-main>
      </el-container>
    </div>
  </div>
</template>
<script>
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import MainContent from "./Content";
import { commMixin } from "@/utils/commMixin";
import { pageMixin } from "@/utils/pageMixin";
import { mapState, mapMutations, mapGetters } from "vuex";
import UserInfo from "@/components/UserInfo.vue";
import Vue from "vue";
export default {
  name: "Layout",
  components: {
    Topbar,
    Sidebar,
    MainContent,
    UserInfo
  },
  mixins: [pageMixin, commMixin],
  computed: {
    ...mapState({
      asideLeftWidth: state => state.asideLeftWidth,
      isCollapse: state => state.isCollapse
    }),
    ...mapGetters({
      userInfo: "getUserInfo"
    })
  },
  data() {
    return {
      isElectron: false
    };
  },
  created() {
    if (window.v1) {
      this.isElectron = window.v1.isElectron();
    }
  },
  methods: {
    ...mapMutations(["SET_IS_COLLAPSE"]),
    // 计算宽度
    initFrameW(val) {
      const width = 1920;
      const clientWith = document.body.clientWidth;
      return Math.floor((clientWith / width) * val);
    },
    openMoreThis($path, tscode) {
      console.log(tscode);
      // let $path = '/simulation/klinevertical';
      if (this.isElectron) {
        window.v1.getAllDisplays().then(response => {
          console.log(response);
          const maxWidth = Math.max(
            ...response.map(display => display.bounds.width)
          );
          const maxHeight = Math.max(
            ...response.map(display => display.bounds.height)
          );

          if ($path.includes("/simulation/chat")) {
            const minWidth =
              maxWidth / 2 - 10 <= 500 ? 500 : maxWidth / 2 - 300;
            const minHeight = maxHeight / 3 + 300;
            const args = {
              id: "chat",
              width: minWidth, // 窗口宽度
              height: minHeight, // 窗口高度
              minWidth: minWidth, // 窗口最小宽度
              minHeight: minHeight, // 窗口最小高度
              isMainWin: false,
              resize: false, // 是否支持缩放
              maximize: false, // 最大化窗口
              isMultiWin: false, // 是否支持多开窗口
              route: $path
            };

            window.v1.createWin(args);
          } else {
            const minWidth = maxWidth / 5.5 <= 480 ? 480 : maxWidth / 5.5;
            const args = {
              width: minWidth, // 窗口宽度
              height: maxHeight - 50, // 窗口高度
              minWidth: minWidth, // 窗口最小宽度
              maxWidth: minWidth,
              isMainWin: false,
              resize: true, // 是否支持缩放
              maximizable: false, // 最大化窗口
              isMultiWin: true, // 是否支持多开窗口
              route: $path,
              data: {
                tscode
              }
            };
            window.v1
              .createWin(args)
              .then(response => {})
              .catch(error => {
                // 处理错误
                console.error(error);
              });
          }
        });
      } else {
        const href = this.$router.resolve({
          path: $path
        }).href;
        window.open(href, "_blank");
      }
    }
  },
  mounted() {
    console.log("Main主页面挂载");
    console.log(`${Vue.prototype.$apiUrl}`);

    if (this.isCollapse) {
      this["SET_IS_COLLAPSE"]({ isCollapse: this.isCollapse, val: 0 });
    } else {
      this["SET_IS_COLLAPSE"]({ isCollapse: this.isCollapse, val: 200 });
    }
    window.onresize = () => {
      if (this.asideLeftWidth !== "0px") {
        this["SET_IS_COLLAPSE"]({ isCollapse: this.isCollapse, val: 200 });
      }
    };
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/style.scss";

.height100percent {
  height: 100%;
  // animation: 0.3s;
}

.form-container {
  .el-aside {
    position: fixed;
    z-index: 100;
    overflow: hidden;
  }

  .aside-left {
    height: 100%;
    background-color: $body-main-txt;
    box-sizing: border-box;

    .scrollbar-aside {
      height: 100%;
      padding-bottom: 10px;
    }
  }

  .main-content {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    position: relative;

    .scrollbar-content {
      >>> .el-scrollbar__view {
        height: 100%;
      }
    }
  }
}

.right_bar,
.left_bar {
  width: 40px;
  height: 40px;
  font-size: 18px;
  line-height: 40px;
  color: #fff;
  text-align: center;
  -webkit-app-region: no-drag;
}
</style>
