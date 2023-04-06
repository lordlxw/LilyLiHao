<template>
  <div>
    <el-form
      ref="enquiryForm"
      :model="enquiryForm"
      :rules="enquiryFormRules"
      label-width="100px"
    >
      <el-form-item label="方向" prop="direction">
        <el-button-group v-if="!this.enquiryForm.lockDirection">
          <el-button @click="handleDirection('买')" :class="funcDirection('买')"
            >买</el-button
          >
          <el-button @click="handleDirection('卖')" :class="funcDirection('卖')"
            >卖</el-button
          >
        </el-button-group>
        <template v-else>
          <div>
            {{ enquiryForm.direction }}
          </div>
        </template>
      </el-form-item>
      <el-form-item label="券码" prop="tscode">
        <el-input
          v-model="enquiryForm.tscode"
          placeholder="请输入券码"
        ></el-input>
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input
          v-model="enquiryForm.price"
          step="0.001"
          placeholder="请输入价格"
        ></el-input>
      </el-form-item>
      <el-form-item label="允许浮动" prop="worstPrice">
        <el-input-number
          v-model="enquiryForm.worstPrice"
          step="0.0005"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="交易量" prop="volume">
        <el-input
          v-model="enquiryForm.volume"
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
      <el-form-item label="交易速度" prop="deliveryTime">
        <delivery-canlendar
          ref="buyDeliveryCanlendar"
          @change="handleBuyDeliveryCanlendar"
        ></delivery-canlendar>
        <!-- <el-button-group>
          <el-button
            icon="el-icon-plus"
            :class="funcDeliverySpeed(0)"
            @click="handleDelivertySpeed(0)"
            >0</el-button
          >
          <el-button
            icon="el-icon-plus"
            :class="funcDeliverySpeed('enquiryForm', 1)"
            @click="handleDelivertySpeed('enquiryForm', 1)"
            >1</el-button
          >
        </el-button-group> -->
      </el-form-item>
      <el-form-item label="交易员" prop="tradeuserId">
        <el-select v-model="enquiryForm.tradeuserId" placeholder="请选择交易员">
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
          v-model="enquiryForm.remark"
          placeholder="请输入内容"
          resize="none"
          rows="2"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-green" @click="submitForm('enquiryForm')"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '@/api/kk_trade'
import apiAdmin from '@/api/kk_power_admin'
import * as util from '@/utils/util'
import config from '@/utils/config'
import DeliveryCanlendar from '@/components/DeliveryCanlendar.vue'
export default {
  props: ['row'],
  components: {
    DeliveryCanlendar
  },
  watch: {
    row() {
      if (this.row) {
        this.initEnquiryForm(this.row)
      }
    }
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
      enquiryForm: {
        // 锁住方向
        lockDirection: '',
        // 交易类型
        direction: '买',
        // 价格
        price: '',
        // 交易量
        volume: '',
        // 债券号
        tscode: '',
        // 交割速度
        deliverySpeed: 0,
        // 交割时间
        deliveryTime: '',
        // 交易员
        tradeuserId: '',
        // 备注
        remark: '',
        // 快速交易
        quickSubmit: false,
        // 允许浮动
        worstPrice: 0.001
      },
      enquiryFormRules: {
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
          { required: true, message: '交割时间必选', trigger: 'blur' }
        ],
        tradeuserId: [
          { required: true, message: '交易员必选', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 交易量加法函数
    funcVolumeAdd(val) {
      if (val === 0) {
        this.enquiryForm.volume = 0
      } else {
        this.enquiryForm.volume += val
      }
    },
    // 方向
    funcDirection(val) {
      if (this.enquiryForm.direction === val) {
        return 'btn-active'
      }
      return ''
    },
    // 交割速度方法
    funcDeliverySpeed(val) {
      if (this.enquiryForm.deliverySpeed === val) {
        return 'btn-active'
      }
      return ''
    },
    // 买单交割日期变化
    handleBuyDeliveryCanlendar(obj) {
      this.enquiryForm.deliveryTime = obj.value
    },
    // 点击交易速度
    handleDelivertySpeed(val) {
      this.enquiryForm.deliverySpeed = val
    },
    // 点击交易方向
    handleDirection(val) {
      this.enquiryForm.direction = val
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.inquirySheetAdd({
            // 交割速度
            deliverySpeed: this[formName].deliverySpeed,
            // 交割日期
            deliveryTime: util.dateFormat(this[formName].deliveryTime, "YYYY-MM-DD"),
            // 买还是卖
            direction: this[formName].direction === '买' ? 'bond_0' : 'bond_1',
            // 成交价格
            price: util.moneyFormat(this[formName].price, 4),
            // 交易员
            tradeuserId: this[formName].tradeuserId,
            // 债券编号
            tscode: this[formName].tscode,
            // 成交量
            volume: this[formName].volume,
            // 备注
            remark: this[formName].remark,
            // 允许浮动
            worstPrice: this[formName].worstPrice
          }).then(res => {
            if (res && res.code === '00000' && res.value) {
              const h = this.$createElement;
              this.$notify({
                title: '提醒',
                message: h('i', { style: 'color: teal' }, '询价单发送成功')
              });
              this.$emit('change', {
                dialogVisible: false
              })
            }
          })
        }
      })
    },
    // 初始化数据
    initEnquiryForm(obj) {
      this.enquiryForm.direction = obj.direction === 'bond_0' ? '买' : (obj.direction === 'bond_1' ? '卖' : '')
      this.enquiryForm.price = obj.price
      this.enquiryForm.volume = parseFloat(obj.volume)
      this.enquiryForm.tscode = obj.tscode
      this.enquiryForm.deliverySpeed = obj.deliverySpeed
      this.enquiryForm.deliveryTime = obj.deliveryTime
      this.enquiryForm.tradeuserId = obj.userId
      this.enquiryForm.remark = obj.remark
      this.enquiryForm.lockDirection = obj.lockDirection
      this.enquiryForm.worstPrice = obj.worstPrice
    },
    // 获取交易员列表
    getTradeUserList() {
      apiAdmin.tradeUserList().then(response => {
        if (response && response.code === '00000' && response.value) {
          this.tradeUsersOption = response.value
        }
      })
    },
  },
  mounted() {
    this.getTradeUserList()
    this.initEnquiryForm(this.row)
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
