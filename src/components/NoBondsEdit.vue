<template>
  <div>
    <el-form
      ref="noBondsForm"
      :model="noBondsForm"
      :rules="noBondsFormRules"
      label-width="100px"
    >
      <el-form-item label="方向" prop="direction">
        {{
          noBondsForm.direction === "bond_0"
            ? "买入"
            : noBondsForm.direction === "bond_1"
            ? "卖出"
            : "不明确"
        }}
      </el-form-item>
      <el-form-item label="券码">
        {{ noBondsForm.tscode }}
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input
          v-model="noBondsForm.price"
          placeholder="请输入价格"
        ></el-input>
      </el-form-item>
      <el-form-item label="交易量" prop="volume">
        <el-input
          v-model="noBondsForm.volume"
          placeholder="请输入交易量"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button
            type="primary"
            @click="funcVolumeAdd(0)"
            style="background: white; color: #333333"
            >清零</el-button
          >
          <el-button type="primary" @click="funcVolumeAdd(5000)">5</el-button>
          <el-button type="primary" @click="funcVolumeAdd(3000)">3</el-button>
          <el-button type="primary" @click="funcVolumeAdd(10000)">10</el-button>
          <el-button type="primary" @click="funcVolumeAdd(2000)">2</el-button>
          <el-button type="primary" @click="funcVolumeAdd(1000)">1</el-button>
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
            :class="funcDeliverySpeed('noBondsForm', 1)"
            @click="handleDelivertySpeed('noBondsForm', 1)"
            >1</el-button
          >
        </el-button-group> -->
      </el-form-item>
      <el-form-item label="交易对手" prop="counterParty">
        <el-input
          v-model="noBondsForm.counterParty"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <!-- <el-form-item label="联系人" prop="contactPerson">
        <el-input
          v-model="noBondsForm.contactPerson"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="contactType">
        <el-input
          v-model="noBondsForm.contactType"
          autocomplete="off"
        ></el-input>
      </el-form-item> -->
      <el-form-item label="备注">
        <el-input
          type="textarea"
          v-model="noBondsForm.remark"
          placeholder="请输入内容"
          resize="none"
          rows="2"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-green" @click="submitForm('noBondsForm')"
          >申请修改</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '@/api/kk_bonds'
import apiCanlendar from '@/api/kk_canlendar'
import * as util from '@/utils/util'
import moment from 'moment'
import config from '@/utils/config'
import { debounce } from '@/utils/debounce'
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
      noBondsForm: {
        direction: '',
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
        // 备注
        remark: '',
        // 交易对手
        counterParty: '',
        // 联系人
        contactPerson: '',
        // 联系方式
        contactType: '',
        // 交易单ID
        realTradeId: ''
      },
      noBondsFormRules: {
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
        this.noBondsForm.volume = 0
      } else {
        this.noBondsForm.volume += val
      }
    },
    // 交割速度方法
    funcDeliverySpeed(val) {
      if (this.noBondsForm.deliverySpeed === val) {
        return 'btn-active'
      }
      return ''
    },
    // 买单交割日期变化
    handleDeliveryCanlendarUpdate(obj) {
      this.noBondsForm.deliveryTime = obj.value
    },
    // 点击交易速度
    handleDelivertySpeed(val) {
      this.noBondsForm.deliverySpeed = val
    },
    submitForm: debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.dealNoBondsEdit({
            // 交割速度
            deliverySpeed: this[formName].deliverySpeed,
            // 交割日期
            deliveryTime: util.dateFormat(this[formName].deliveryTime, "YYYY-MM-DD 00:00:00"),
            // 成交价格
            price: util.moneyFormat(this[formName].price, 4),
            // 成交量
            volume: this[formName].volume,
            // 备注
            remark: this[formName].remark,
            // 联系人
            contactPerson: this[formName].contactPerson,
            // 联系方式
            contactType: this[formName].contactType,
            // 交易对手
            counterParty: this[formName].counterParty,
            // 交易id
            realTradeId: this[formName].realTradeId
          }).then(res => {
            if (res && res.code === '00000') {
              this.$message({
                message: '已发送修改 请等待研究员确认',
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
    loadInitData() {
      this.noBondsForm.price = this.row.price
      this.noBondsForm.volume = parseFloat(this.row.volume)
      this.noBondsForm.tscode = this.row.tscode
      if (moment(this.row.deliveryTime).format('YYYY-MM-DD') > moment(new Date()).format('YYYY-MM-DD')) {
        this.noBondsForm.deliveryTime = moment(this.row.deliveryTime).format('YYYY-MM-DD')
        this.$refs.deliveryCanlendarUpdate.deliveryTime = moment(this.row.deliveryTime).format('YYYY-MM-DD')
      } else if (moment(this.row.deliveryTime).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD') && moment(moment(new Date()).format('YYYY-MM-DD HH:mm:ss')).isBefore(moment(new Date()).format('YYYY-MM-DD 16:30:00'))) {
        this.noBondsForm.deliveryTime = moment(new Date()).format('YYYY-MM-DD')
        this.$refs.deliveryCanlendarUpdate.deliveryTime = moment(new Date()).format('YYYY-MM-DD')
      } else {
        this.getNextDealDay()
      }
      this.noBondsForm.remark = this.row.remark
      this.noBondsForm.counterParty = this.row.counterParty
      this.noBondsForm.contactPerson = this.row.contactPerson
      this.noBondsForm.contactType = this.row.contactType
      this.noBondsForm.realTradeId = this.row.realTradeId
      this.noBondsForm.direction = this.row.direction
    },
    // 获取下个交易日
    getNextDealDay() {
      apiCanlendar.nextDealDay({}).then(response => {
        if (response && response.code === '00000') {
          this.noBondsForm.deliveryTime = response.value
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
