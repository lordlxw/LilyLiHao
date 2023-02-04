<template>
  <el-select v-model="value" filterable remote reserve-keyword placeholder="债券码关键字" :remote-method="loadInitData"
    :loading="loading" @change="onChangeOption">
    <el-option v-for="item in options" :key="item.value" :label="`【${item.value}】` + item.label" :value="item.value">
    </el-option>
  </el-select>
</template>

<script>
import api from '@/api/kk_bond_pool'
export default {
  data() {
    return {
      options: [],
      value: '',
      loading: false,
    }
  },
  methods: {
    // 改变项
    onChangeOption(value) {
      Promise.all([
        this.value = value
      ]).then(() => {
        this.$emit('change', { value: value })
      })
    },
    // 处理数据
    funHandleData(json) {
      const temArr = []
      for (let key in json) {
        const obj = {}
        obj.value = key
        obj.label = json[key]
        temArr.push(obj)
      }
      return temArr
    },
    // 初始化数据
    loadInitData(query) {
      const self = this
      if (query !== '') {
        this.loading = true;
        setTimeout(() => {
          this.loading = false;
          api.getByCodeLike({
            tscode: query
          }).then(res => {
            Promise.all([
              self.options = []
            ]).then(() => {
              if (res.value) {
                if (Object.keys(res.value).length > 0) {
                  self.options = self.funHandleData(res.value)
                }
              }
            })
          })
        }, 200);
      } else {
        this.options = []
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/assets/css/style.scss";
</style>
