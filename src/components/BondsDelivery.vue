<template>
  <div>
    <div class="text-right pb10">
      <!-- <div class="errorMsg">{{ errorMsg }}</div> -->
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
    <el-table header-cell-class-name="list-row" :data="deliveryFinishData" tooltip-effect="dark" :height="550"
      style="width: 100%" :key="Math.random()" :row-class-name="tableRowFinishClassName">
      <template v-for="itemHead in deliveryFinishDataHead">
        <el-table-column v-if="itemHead.show" :key="itemHead.label" :align="itemHead.align" :prop="itemHead.prop"
          :formatter="itemHead.formatter
            ? itemHead.formatter
            : (row, column, cellValue, index) => {
              return cellValue;
            }
            " :label="itemHead.label" :width="itemHead.width ? returnFrameW(itemHead.width) : ''">
        </el-table-column>
      </template>
      <el-table-column label="选择" :width="returnFrameW(250)">
        <template slot-scope="scope">
          <el-checkbox-group v-model="scope.row.mySelected" @input="handleDoCheck" v-if="
            scope.row.jiaogeStatus !== 1 &&
            deliveryDayValid(scope.row.deliveryTime)
          ">
            <el-checkbox v-for="item in doListOption" :label="item.value" :key="item.value">{{ item.label
              }}</el-checkbox>
          </el-checkbox-group>
        </template>
      </el-table-column>
      <el-table-column label="违约方" :width="returnFrameW(150)">
        <template slot-scope="scope">
          <el-select v-model="scope.row.weiyuePerson" v-if="scope.row.mySelected.length > 0" placeholder="请选择">
            <el-option v-for="(value, key) in config.breakTypeOptions" :key="key" :label="value"
              :value="key"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="违约量" :width="returnFrameW(150)">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.weiyueAmount" v-if="scope.row.mySelected.length > 0"
            width="90"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="做市商" :width="returnFrameW(150)">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.marketMakerName" v-if="scope.row.mySelected.length > 0"
            width="90"></el-input>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import config from '@/utils/config'
import moment from 'moment'
import * as util from '@/utils/util'
import api from "@/api/kk_bonds"
import { commMixin } from '@/utils/commMixin'
import { debounce } from '@/utils/debounce'
const doList = [
  {
    label: '技术违约',
    value: 0
  },
  {
    label: '恶意违约',
    value: 1
  }
]
let currentFinishCode = ''
let tableFinishClassName = ''
export default {
  props: ['deliveryFinishData'],
  mixins: [commMixin],
  data() {
    return {
      config,
      doListOption: doList,
      errorMsg: '',
      deliveryFinishDataHead: [
        { label: '券码', prop: 'tscode', formatter: this.funcFormat, width: '90', align: 'left', show: true },
        { label: '方向', prop: 'direction', formatter: this.funcFormat, width: '80', align: 'left', show: true },
        { label: '成交价', prop: 'price', formatter: this.funcFormat, width: '100', align: 'left', show: true },
        { label: '持仓量', prop: 'volume', width: '100', align: 'left', show: true },
        { label: '交割日期', prop: 'deliveryTime', formatter: this.funcFormat, width: '120', align: 'left', show: true },
        { label: '交割状态', prop: 'jiaogeStatus', formatter: this.funcFormat, width: '100', align: 'left', show: true },
        { label: '研究员', prop: 'yanjiuyuanName', formatter: this.funcFormat, width: '100', align: 'left', show: true },
        { label: '交易单号', prop: 'tradeNum', formatter: this.funcFormat, width: '180', align: 'left', show: true },
        { label: '中介', prop: 'target', formatter: this.funcFormat, width: '180', align: 'left', show: true }
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
    // 交割日验证
    deliveryDayValid(deliveryTime) {
      return moment(moment(new Date()).format('YYYY-MM-DD')).isSame(moment(deliveryTime).format('YYYY-MM-DD'))
    },
    // 提交事件
    handleSubmit: debounce(function () {
      const finishCodeList = [...new Set(this.deliveryFinishData.map(item => item.finishCode))]
      const wyList = []
      const len = this.deliveryFinishData.length
      let flag = false
      for (let i = 0; i < len; i++) {
        if (this.deliveryFinishData[i].mySelected.length > 0) {
          wyList.push({
            marketMakerName: this.deliveryFinishData[i].marketMakerName,
            realTradeId: this.deliveryFinishData[i].realTradeId,
            weiyueAmount: this.deliveryFinishData[i].weiyueAmount ? parseInt(this.deliveryFinishData[i].weiyueAmount) : '',
            weiyuePerson: this.deliveryFinishData[i].weiyuePerson,
            weiyueType: this.deliveryFinishData[i].mySelected[0]
          })
          if (!this.deliveryFinishData[i].weiyuePerson) {
            this.errorMsg = '违约方必须选全'
            flag = true
            break;
          }
          if (parseInt(this.deliveryFinishData[i].weiyueAmount) > this.deliveryFinishData[i].volume) {
            this.errorMsg = '违约量不能超过持仓量'
            flag = true
            break;
          }
          if (isNaN(this.deliveryFinishData[i].weiyueAmount) || Number(this.deliveryFinishData[i].weiyueAmount) <= 0) {
            this.errorMsg = '违约量必须大于0'
            flag = true
            break;
          }
        }
      }
      if (!flag) {
        api.dealDelivery({
          finishCodeList,
          wyList
        }).then(response => {
          if (response && response.code === '00000') {
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
      }
    }),
    // 已平仓行样式
    tableRowFinishClassName({ row, rowIndex }) {
      if (rowIndex === 0) {
        tableFinishClassName = 'odd-row'
        currentFinishCode = row.finishCode
      } else {
        if (currentFinishCode !== row.finishCode) {
          currentFinishCode = row.finishCode
          if (tableFinishClassName === 'even-row') {
            tableFinishClassName = 'odd-row'
          } else {
            tableFinishClassName = 'even-row'
          }
        }
      }
      return tableFinishClassName + ' list-row'
    },
    // 盒子样式
    cellStyle(row, column, rowIndex, columnIndex) {
      if (row.column.label === '方向') {
        switch (row.row.direction) {
          case 'bond_1': // 卖出
            return 'color:#e88585';
          case 'bond_0': // 买入
            return 'color:#00da3c';
        }
      }
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
        case "jiaogeStatus":
          return config.bondStatus[row.jiaogeStatus]
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

.el-table {
  border-radius: 3px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);

  >>>.list-row {
    height: 40px;
    line-height: 40px;
    color: #000;
  }

  >>>.el-checkbox {
    color: #000;

    .el-checkbox__label {
      font-size: 12px;
    }
  }

  >>>.el-input--small .el-input__inner {
    height: 30px;
    line-height: 30px;
    font-size: 12px;
  }
}
</style>
