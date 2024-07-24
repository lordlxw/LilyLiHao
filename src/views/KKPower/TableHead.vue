<template>
  <div class="list pd10">
    <el-tabs type="border-card">
      <el-tab-pane
        v-for="item in cardList"
        :key="item.columnId"
        :label="item.columnValue"
        ><ColumnSet :templateId="item.columnId"></ColumnSet
      ></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import api from '@/api/kk_power_admin'
import ColumnSet from '@/components/ColumnSet.vue'
export default {
  components: {
    ColumnSet
  },
  data() {
    return {
      cardList: []
    }
  },
  methods: {
    // 初始化表头设置模版
    initTemplate() {
      api.getTemplate().then(response => {
        if (response && response.code === '00000') {
          this.cardList = response.value
        } else {
          this.cardList = []
        }
      })
    }
  },
  mounted() {
    this.initTemplate()
  }
}
</script>

<style>
</style>
