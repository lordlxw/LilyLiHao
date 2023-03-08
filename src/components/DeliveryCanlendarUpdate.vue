<template>
  <el-date-picker
    :value="deliveryTime"
    type="date"
    placeholder="选择日期"
    :style="{ width: `${w}` }"
    :clearable="false"
    :picker-options="pickerOptions"
    @input="handleChange"
    :editable="false"
  >
  </el-date-picker>
</template>

<script>
import api from '@/api/kk_canlendar'
import * as util from '@/utils/util'
export default {
  props: {
    w: {
      type: String,
      default: '150px'
    }
  },
  data() {
    return {
      deliveryTime: '',
      pickerOptions: {}
    }
  },
  methods: {
    // 一月内节假日
    getHolidayOfMonth() {
      const self = this
      api.holidayOfMonth().then(response => {
        if (response && response.code === '00000') {
          // 设置可选日期
          self.pickerOptions = {
            disabledDate(time) {
              const date = new Date()
              return time.getTime() < Date.now() || time.getTime() > (date.getTime() + 3600 * 1000 * 24 * 30) || response.value.indexOf(util.dateFormat(time, 'yyyy-MM-dd')) !== -1;
            }
          }
        }
      })
    },
    // 改变日期
    handleChange(val) {
      this.deliveryTime = val
      this.$emit('change', {
        value: val
      })
    }
  },
  mounted() {
    this.getHolidayOfMonth()
  }
}
</script>

<style>
</style>
