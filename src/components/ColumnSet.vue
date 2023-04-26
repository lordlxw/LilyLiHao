<template>
  <div>
    <el-transfer
      :titles="['原始字段', '展示字段']"
      v-model="value"
      :data="data"
      target-order="push"
    ></el-transfer>
    <el-button type="primary" @click="handleSaveColumn" class="mt20"
      >保存设置</el-button
    >
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from '@/api/kk_power_admin'
import { debounce } from '@/utils/debounce'
export default {
  props: ['templateId'],
  data() {
    return {
      data: [],
      value: [],
      userId: ''
    }
  },
  computed: {
    ...mapGetters({
      urlParams: "getUrlParams"
    })
  },
  methods: {
    // 获取模版id下的column
    dispatchColumn() {
      api.getColumn({
        templateId: this.templateId,
      }).then(response => {
        if (response && response.code === '00000') {
          response.value.forEach(element => {
            this.data.push({
              key: element.columnKey,
              label: element.columnValue
            });
          });
        }
      })
    },
    // 保存模版id下设置的column
    handleSaveColumn: debounce(function () {
      api.saveColumn({
        fieldValue: this.value.join(),
        headContent: JSON.stringify(this.value),
        templateId: this.templateId,
        userId: this.userId
      }).then(response => {
        if (response && response.code === '00000') {
          this.$message({
            message: '设置成功',
            type: 'success'
          })
        }
      })
    }),
    // 获取用户模版id下设置的column
    dispatchUserColumn() {
      api.getUserColumn({
        templateId: this.templateId,
        userId: this.userId,
      }).then(response => {
        if (response && response.code === '00000') {
          this.value = JSON.parse(response.value.headContent)
        }
      })
    }
  },
  mounted() {
    Promise.all([(this.userId = this.urlParams.userId)]).then(() => {
      this.dispatchUserColumn()
      this.dispatchColumn()
    });
  }
}
</script>

<style>
</style>
