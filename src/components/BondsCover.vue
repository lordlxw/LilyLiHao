<template>
  <div>
    <el-form
      ref="coverForm"
      :model="coverForm"
      :rules="coverFormRules"
      label-width="100px"
    >
      <el-form-item label="方向" prop="direction">
        {{
          coverForm.direction === "bond_0"
            ? "买入"
            : coverForm.direction === "bond_1"
            ? "卖出"
            : "不明确"
        }}
      </el-form-item>
      <el-form-item label="券码" prop="tscode">
        {{ coverForm.tscode }}
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="coverForm.price" placeholder="请输入价格"></el-input>
      </el-form-item>
      <el-form-item label="允许浮动" prop="worstPrice">
        <el-input-number
          v-model="coverForm.worstPrice"
          step="0.05"
        ></el-input-number>
        BP
      </el-form-item>
      <el-form-item label="交易量(万)" prop="volume">
        <el-input
          v-model="coverForm.volume"
          placeholder="请输入交易量"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button type="primary" @click="funcVolumeAdd(0)">清零</el-button>
          <el-button type="primary" @click="funcVolumeAdd(1000)">1</el-button>
          <el-button type="primary" @click="funcVolumeAdd(2000)">2</el-button>
          <el-button type="primary" @click="funcVolumeAdd(3000)">3</el-button>
          <el-button type="primary" @click="funcVolumeAdd(5000)">5</el-button>
          <el-button type="primary" @click="funcVolumeAdd(10000)">10</el-button>
        </el-button-group>
      </el-form-item>
      <el-form-item label="交割日期" prop="deliveryTime">
        <delivery-canlendar-update
          ref="deliveryCanlendarUpdate"
          @change="handleDeliveryCanlendarUpdate"
        ></delivery-canlendar-update>
        <!-- <el-button-group>
          <el-button
            icon="el-icon-plus"
            :class="funcDeliverySpeed(0)"
            @click="handleDelivertySpeed(0)"
            >0</el-button
          >
          <el-button
                      icon="el-icon-plus"
                      :class="funcDeliverySpeed('coverForm', 1)"
                      @click="handleDelivertySpeed('coverForm', 1)"
                      >1</el-button
                    >
        </el-button-group> -->
      </el-form-item>
      <el-form-item label="交易员" prop="tradeuserId">
        <el-select v-model="coverForm.tradeuserId" placeholder="请选择交易员">
          <el-option
            v-for="item in tradeUsersOption"
            :key="item.userId"
            :label="item.userName"
            :value="item.userId"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          v-model="coverForm.remark"
          placeholder="请输入内容"
          resize="none"
          rows="2"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-green" @click="submitForm('coverForm')"
          >确认平仓</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '@/api/kk_bonds'
import apiCanlendar from '@/api/kk_canlendar'
import apiAdmin from '@/api/kk_power_admin'
import * as util from '@/utils/util'
import config from '@/utils/config'
import { debounce } from '@/utils/debounce'
import moment from 'moment'
import DeliveryCanlendarUpdate from '@/components/DeliveryCanlendarUpdate.vue'
export default {
  props: ['row'],
  components: {
    DeliveryCanlendarUpdate
  },
  data() {
    // 金额格式验证
    const moneyTest = async (rule, value, callback) => {
      if (!config.regExpSet.money.test(value)) {
        callback(new Error('请输入正确格式（-.----）'))
      } else {
        callback()
      }
    }
    // 允许浮动格式验证
    const floatTest = async (rule, value, callback) => {
      console.log(rule)
      if (!config.regExpSet.floatPrice.test(value)) {
        callback(new Error('大于0的格式-.--'))
      } else {
        callback()
      }
    }
    // 大于0格式验证
    const plusAmountTest = async (rule, value, callback) => {
      if (!config.regExpSet.gtzero.test(value)) {
        callback(new Error('请输入大于0的正整数'))
      } else {
        callback()
      }
    }
    return {
      tradeUsersOption: [],
      coverForm: {
        // 交易类型
        direction: '买入',
        // 价格
        price: '',
        // 允许浮动
        worstPrice: 0.1,
        // 交易量
        volume: '',
        // 债券号
        tscode: '',
        // 交割速度
        deliverySpeed: 0,
        // 交割日期
        deliveryTime: '',
        // 原交割日期
        deliveryTime2: '',
        // 交易员
        tradeuserId: '',
        // 备注
        remark: '',
        // 快速交易
        quickSubmit: false,
        realTradeIdList: [],
        relativeNum: ''
      },
      coverFormRules: {
        direction: [
          { required: true, message: '方向必选', trigger: 'blur' }
        ],
        tscode: [
          { required: true, message: '券码必填', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '价格必填', trigger: 'blur' },
          { validator: moneyTest, trigger: 'blur' }
        ],
        volume: [
          { required: true, message: '交易量必填', trigger: 'blur' },
          { validator: plusAmountTest, trigger: 'blur' }
        ],
        deliveryTime: [
          { required: true, message: '交割日期必选', trigger: 'blur' }
        ],
        tradeuserId: [
          { required: true, message: '交易员必选', trigger: 'change' }
        ],
        worstPrice: [
          { required: true, message: '允许浮动必填', trigger: 'blur' },
          { validator: floatTest, trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
    row: function () {
      this.loadInitData()
    }
  },
  methods: {
    // 交易量加法函数
    funcVolumeAdd(val) {
      if (val === 0) {
        this.coverForm.volume = 0
      } else {
        this.coverForm.volume += val
      }
    },
    // 交割速度方法
    funcDeliverySpeed(val) {
      if (this.coverForm.deliverySpeed === val) {
        return 'btn-active'
      }
      return ''
    },
    // 买单交割日期变化
    handleDeliveryCanlendarUpdate(obj) {
      this.coverForm.deliveryTime = obj.value
    },
    // 点击交割日期
    handleDelivertySpeed(val) {
      this.coverForm.deliverySpeed = val
    },
    // 点击交易方向
    handleDirection(val) {
      this.coverForm.direction = val
    },
    submitForm: debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.bondsCover({
            // 交割速度
            deliverySpeed: this[formName].deliverySpeed,
            // 交割日期
            deliveryTime: util.dateFormat(this[formName].deliveryTime, "YYYY-MM-DD 00:00:00"),
            // 原交割日期
            deliveryTime2: util.dateFormat(this[formName].deliveryTime2, "YYYY-MM-DD 00:00:00"),
            // 买还是卖
            direction: this[formName].direction,
            // 成交价格
            price: util.moneyFormat(this[formName].price, 4),
            // 交易员
            userId: this[formName].tradeuserId,
            // 债券编号
            tscode: this[formName].tscode,
            // 成交量
            volume: this[formName].volume,
            // 备注
            remark: this[formName].remark,
            // 允许浮动
            worstPrice: this[formName].worstPrice,
            //
            realTradeIdList: this[formName].realTradeIdList,
            relativeNum: this[formName].relativeNum
          }).then(res => {
            if (res && res.code === '00000' && res.value) {
              this.$message({
                message: `平仓询价单创建成功`,
                type: 'success'
              })
              this.$emit('change', {
                dialogVisible: false
              })
            }
          })
        }
      })
    }),
    // 获取交易员列表
    getTradeUserList(realTradeIdList) {
      apiAdmin.realTradeUserList({ realTradeIdList }).then(response => {
        if (response && response.code === '00000' && response.value) {
          this.tradeUsersOption = response.value
          this.coverForm.tradeuserId = response.value[0].userId
        }
      })
    },
    // 加载初始值
    loadInitData() {
      console.log(this.row)
      this.coverForm.direction = this.row.direction === 'bond_1' ? 'bond_0' : (this.row.direction === 'bond_0' ? 'bond_1' : '')
      this.coverForm.tscode = this.row.tscode
      this.coverForm.price = this.row.price
      this.coverForm.volume = parseFloat(this.row.restVolume)
      this.coverForm.deliveryTime2 = this.row.deliveryTime
      if (moment(this.row.deliveryTime).format('YYYY-MM-DD') > moment(new Date()).format('YYYY-MM-DD')) {
        this.coverForm.deliveryTime = moment(this.row.deliveryTime).format('YYYY-MM-DD')
        this.$refs.deliveryCanlendarUpdate.deliveryTime = moment(this.row.deliveryTime).format('YYYY-MM-DD')
      } else if (moment(this.row.deliveryTime).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD') && moment(moment(new Date()).format('YYYY-MM-DD HH:mm:ss')).isBefore(moment(new Date()).format('YYYY-MM-DD 15:30:00'))) {
        this.coverForm.deliveryTime = moment(new Date()).format('YYYY-MM-DD')
        this.$refs.deliveryCanlendarUpdate.deliveryTime = moment(new Date()).format('YYYY-MM-DD')
      } else {
        this.getNextDealDay()
      }
      this.coverForm.realTradeIdList = this.row.realTradeIdList
      this.coverForm.relativeNum = this.row.relativeNum
      this.getTradeUserList(this.row.realTradeIdList)
    },
    // 获取下个交易日
    getNextDealDay() {
      apiCanlendar.nextDealDay({}).then(response => {
        if (response && response.code === '00000') {
          this.coverForm.deliveryTime = response.value
          this.$refs.deliveryCanlendarUpdate.deliveryTime = response.value
        }
      })
    },
  },
  mounted() {
    this.loadInitData()
  }
}
</script>

<style lang="scss" scoped>
.btn-active {
  background: #409eff !important;
  color: white;
  border: 1px solid #409eff;
}
</style>
