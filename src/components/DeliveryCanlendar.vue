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
      default: '160px'
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
              return (time.getTime() + 3600 * 1000 * 15 * 1 + 3600 * 100 * 5) < Date.now() || time.getTime() > (date.getTime() + 3600 * 1000 * 24 * 30) || response.value.indexOf(util.dateFormat(time, 'YYYY-MM-DD')) !== -1;
            }
          }
        }
      })
    },
    // 获取下个交易日
    getNextDealDay() {
      api.nextDealDay({}).then(response => {
        if (response && response.code === '00000') {
          this.deliveryTime = response.value
          this.$emit('change', {
            value: response.value
          })
          // self.buyForm.deliveryTime = response.value
          // self.saleForm.deliveryTime = response.value
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
    this.getNextDealDay()
  }
}
</script>

<style>
</style>
