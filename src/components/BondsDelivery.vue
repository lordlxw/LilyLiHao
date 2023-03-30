<template>
  <div>
    <el-table
      v-loading="loading"
      :data="deliveryFinishData"
      tooltip-effect="dark"
      style="width: 100%"
      border
      :key="Math.random()"
      header-row-style="height:30px;line-height:30px;"
      header-cell-style="background:#f8f8f8;"
    >
      <template v-for="itemHead in deliveryFinishDataHead">
        <el-table-column
          v-if="itemHead.show"
          :key="itemHead.label"
          :align="itemHead.align"
          :prop="itemHead.prop"
          :formatter="
            itemHead.formatter
              ? itemHead.formatter
              : (row, column, cellValue, index) => {
                  return cellValue;
                }
          "
          :label="itemHead.label"
          :width="itemHead.width ? itemHead.width : ''"
        >
        </el-table-column>
      </template>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-checkbox-group
            v-model="scope.row.mySelected"
            @input="handleDoCheck"
            :disabled="scope.row.mySelectedDisabled"
          >
            <el-checkbox
              v-for="item in doListOption"
              :label="item.value"
              :key="item.value"
              >{{ item.label }}</el-checkbox
            >
          </el-checkbox-group>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: center">
      <div class="errorMsg">{{ errorMsg }}</div>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </div>
</template>

<script>
import config from '@/utils/config'
import moment from 'moment'
import * as util from '@/utils/util'
import api from "@/api/kk_bonds"
const doList = [
  {
    label: '交割',
    value: 1
  },
  {
    label: '技术违约',
    value: 2
  },
  {
    label: '恶意违约',
    value: 3
  },
  {
    label: '不动',
    value: 4
  },
]
export default {
  props: ['deliveryFinishData'],
  data() {
    return {
      config,
      doListOption: doList,
      errorMsg: '',
      deliveryFinishDataHead: [
        { label: '券码', prop: 'tscode', formatter: this.funcFormat, width: '100', align: 'left', show: true },
        { label: '方向', prop: 'direction', formatter: this.funcFormat, width: '80', align: 'left', show: true },
        { label: '成交价', prop: 'price', formatter: this.funcFormat, width: '100', align: 'right', show: true },
        { label: '持仓量', prop: 'volume', width: '100', align: 'right', show: true },
        { label: '交割日期', prop: 'deliveryTime', formatter: this.funcFormat, width: '100', align: 'left', show: true }
      ]
    }
  },
  methods: {
    handleDoCheck(val) {
      this.errorMsg = ''
      if (val.length > 1) {
        val.shift()
      }
    },
    // 提交事件
    handleSubmit() {
      // 是否全未选择
      let isAllNoSelect = true
      // 是否未选全
      let isHalfSelect = false
      let eyiweiyueIdlist = []
      let jiaogeIdlist = []
      let jishuweiyueIdlist = []
      for (let i = 0; i < this.deliveryFinishData.length; i++) {
        if (this.deliveryFinishData[i].mySelected.length > 0) {
          switch (this.deliveryFinishData[i].mySelected[0]) {
            case 1:
              jiaogeIdlist.push(this.deliveryFinishData[i].realTradeId)
              break
            case 2:
              jishuweiyueIdlist.push(this.deliveryFinishData[i].realTradeId)
              break
            case 3:
              eyiweiyueIdlist.push(this.deliveryFinishData[i].realTradeId)
              break
          }
          isAllNoSelect = false;
        } else {
          isHalfSelect = true
        }
      }
      if (isAllNoSelect) {
        // 组织数据
        for (let i = 0; i < this.deliveryFinishData.length; i++) {
          jiaogeIdlist.push(this.deliveryFinishData[i].realTradeId)
        }
        // 全未选，直接提交
        this.dispacthSubmit(eyiweiyueIdlist, jiaogeIdlist, jishuweiyueIdlist)
      } else {
        if (isHalfSelect) {
          // 做出提示：未选完整
          this.errorMsg = '需要选择完整'
        } else {
          // 提交
          this.dispacthSubmit(eyiweiyueIdlist, jiaogeIdlist, jishuweiyueIdlist)
        }
      }
    },
    // 提交动作
    dispacthSubmit(eyiweiyueIdlist, jiaogeIdlist, jishuweiyueIdlist) {
      api.dealDelivery({
        eyiweiyueIdlist: eyiweiyueIdlist,
        jiaogeIdlist: jiaogeIdlist,
        jishuweiyueIdlist: jishuweiyueIdlist
      }).then(response => {
        if (response && response.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.$emit('change', {
            dialogVisible: false
          })
        } else {
          this.$message({
            message: response.message,
            type: 'error'
          })
        }
      })
    },
    // 数据格式化
    funcFormat(row, column) {
      switch (column.property) {
        case "direction":
          return config.funcKeyValue(row.direction, "directionMeta")
        case "deliveryTime":
          return moment(row.deliveryTime).format('YYYY-MM-DD')
        case "price":
          return util.moneyFormat(row.price, 4)
        case "tscode":
          return row.tscode.replace(/.IB/, '')
      }
      return row[column.property]
    }
  }
}
</script>

<style lang="scss" scoped>
.errorMsg {
  text-align: center;
  height: 40px;
  line-height: 40px;
  color: red;
}
</style>
