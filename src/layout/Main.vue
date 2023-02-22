<template>
  <el-container class="form-container height100percent">
    <el-container class="height100percent">
      <el-aside width="auto" class="height100percent">
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
import { mapState } from 'vuex'
import Velocity from 'velocity-animate'
export default {
  name: 'Layout',
  components: {
    Topbar,
    Sidebar,
    MainContent
  },
  watch: {
    asideLeftWidth(newVal, oldVal) {
      Velocity(this.$refs['animateAsideLeft'], {
        width: newVal
      })
      Velocity(this.$refs['animateContent'], {
        'padding-left': newVal
      })
    }
  },
  computed: {
    ...mapState({
      asideLeftWidth: state => state.asideLeftWidth
    })
  },
  mounted() {
    Velocity(this.$refs.animateAsideLeft, {
      width: this.asideLeftWidth
    })
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/style.scss";
.height100percent {
  height: 100%;
}
.form-container {
  .el-aside {
    position: fixed;
    z-index: 100;
    overflow: hidden;
  }
  .aside-left {
    height: 100%;
    background-color: #202020;
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
