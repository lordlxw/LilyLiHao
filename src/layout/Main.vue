<template>
  <el-container class="form-container height100percent">
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
          <topbar></topbar>
          <el-scrollbar class="scrollbar-content height100percent">
            <main-content>
              <slot></slot>
            </main-content>
          </el-scrollbar>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import MainContent from './Content'
import { mapState, mapMutations } from 'vuex'
export default {
  name: 'Layout',
  components: {
    Topbar,
    Sidebar,
    MainContent
  },
  computed: {
    ...mapState({
      asideLeftWidth: state => state.asideLeftWidth,
      isCollapse: state => state.isCollapse,
    })
  },
  methods: {
    ...mapMutations(["SET_IS_COLLAPSE"]),
    // 计算宽度
    initFrameW(val) {
      const width = 1920
      const clientWith = document.body.clientWidth
      return Math.floor(clientWith / width * val)
    }
  },
  mounted() {
    if (this.isCollapse) {
      this["SET_IS_COLLAPSE"]({ isCollapse: this.isCollapse, val: this.initFrameW(0) })
    } else {
      this["SET_IS_COLLAPSE"]({ isCollapse: this.isCollapse, val: this.initFrameW(200) })
    }
    window.onresize = () => {
      if (this.asideLeftWidth !== '0px') {
        this["SET_IS_COLLAPSE"]({ isCollapse: this.isCollapse, val: this.initFrameW(200) })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/style.scss";
.height100percent {
  height: 100%;
  animation: 0.3s;
}
.form-container {
  .el-aside {
    position: fixed;
    z-index: 100;
    overflow: hidden;
  }
  .aside-left {
    height: 100%;
    background-color: $main-black;
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
      height: calc(100% - 40px);
    }
  }
}
</style>
