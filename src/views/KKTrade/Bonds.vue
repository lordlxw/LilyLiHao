<!-- 持仓单 -->
<template>
  <div class="content">
    <div class="list">
      <el-tabs ref="eltabs" type="card" @tab-click="handleTabsClick" class="mt20">
        <!-- 未平仓 -->
        <el-tab-pane :label="tablist[0]" v-if="setAuth('nobonds:view')">
          <com-no-bonds v-if="currentTab === tablist[0]" :height="nobondsH"></com-no-bonds>
        </el-tab-pane>
        <!-- 已平仓 -->
        <el-tab-pane :label="tablist[1]" v-if="setAuth('bonds:view')">
          <com-bonds v-if="currentTab === tablist[1]" :height="bondsH"></com-bonds>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/utils/debounce'
import ComBonds from '../components/ComBonds.vue'
import ComNoBonds from '../components/ComNoBonds.vue'
import { pageMixin } from '@/utils/pageMixin'
import { commMixin } from '@/utils/commMixin'
export default {
  mixins: [pageMixin, commMixin],
  components: {
    ComBonds,
    ComNoBonds
  },
  data() {
    return {
      // tabs
      tablist: ['未平仓', '已平仓'],
      currentTab: '',
      bondsH: '0',
      nobondsH: '0'
    }
  },
  created() {
    this.initFrameH('bondsH', 200)
    this.initFrameH('nobondsH', 200)
  },
  methods: {
    handleTabsClick: debounce(function (tab, event) {
      if (tab.label === this.tablist[0]) {
        this.currentTab = this.tablist[0]
      }
      if (tab.label === this.tablist[1]) {
        this.currentTab = this.tablist[1]
      }
    })
  },
  mounted() {
    if (this.$refs.eltabs.panes.length > 0) {
      switch (this.$refs.eltabs.panes[0].label) {
        case this.tablist[0]:
          this.currentTab = this.tablist[0]
          break
        case this.tablist[1]:
          this.currentTab = this.tablist[1]
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/assets/css/style.scss";

.content {
  .navigator {
    position: relative;
    background-color: #f8f8f8;
    padding: 0 15px;

    .el-breadcrumb {
      height: 50px;
      line-height: 50px;
    }

    .el-button {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }

  .filter-condition {
    margin: 20px 15px 10px;
    background-color: #f8f8f8;
    padding: 10px 15px;

    .item {
      display: inline-block;
      padding: 5px 0;
    }

    label {
      font-size: 12px;
      color: #999999;
    }

    .btn-box {
      float: right;
    }

    .clearboth {
      clear: both;
    }
  }

  .list {
    padding: 0 15px;

    .mt20 >>>.el-tabs__item {
      font-size: 12px !important;
    }

    .do {
      height: 40px;
      line-height: 40px;

      .el-button {
        margin-top: 10px;
      }
    }
  }

  .copy-tooltip {
    visibility: hidden;
  }

  .copy:hover {
    .copy-tooltip {
      visibility: visible;
    }
  }

  .pagination {
    float: right;
  }

  .my-el-row .el-col {
    padding: 5px 0;
  }

  .my-el-row .el-col:nth-child(odd) {
    text-align: right;
    font-size: 14px;
    color: #999999;
  }

  .my-el-row .el-col:nth-child(even) {
    font-size: 14px;
    word-break: break-all;
  }

  .table-height {
    height: 800px !important;
  }
}
</style>
<style>
thead .el-table-column--selection .cell {
  display: none !important;
}

.myCell .el-checkbox__input {
  display: none !important;
}
</style>
