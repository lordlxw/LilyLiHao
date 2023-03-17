<template>
  <div>
    <el-form
      ref="bondsForm"
      :model="bondsForm"
      :rules="bondsFormRules"
      label-width="100px"
    >
      <el-form-item label="券码">
        {{ bondsForm.tscode }}
      </el-form-item>
      <el-form-item label="价格" prop="price">
        <el-input v-model="bondsForm.price" placeholder="请输入价格"></el-input>
      </el-form-item>
      <el-form-item label="交易量" prop="volume">
        <el-input
          v-model="bondsForm.volume"
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
        <el-button-group>
          <el-button
            icon="el-icon-plus"
            :class="funcDeliverySpeed(0)"
            @click="handleDelivertySpeed(0)"
            >0</el-button
          >
          <!-- <el-button
                      icon="el-icon-plus"
                      :class="funcDeliverySpeed('bondsForm', 1)"
                      @click="handleDelivertySpeed('bondsForm', 1)"
                      >1</el-button
                    > -->
        </el-button-group>
      </el-form-item>
      <el-form-item label="交易对手" prop="counterParty">
        <el-input
          v-model="bondsForm.counterParty"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="contactPerson">
        <el-input
          v-model="bondsForm.contactPerson"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="联系方式" prop="contactType">
        <el-input v-model="bondsForm.contactType" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="备注">
        <el-input
          type="textarea"
          v-model="bondsForm.remark"
          placeholder="请输入内容"
          resize="none"
          rows="2"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="btn-green" @click="submitForm('bondsForm')"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '@/api/kk_bonds'
import * as util from '@/utils/util'
import config from '@/utils/config'
import DeliveryCanlendar from '@/components/DeliveryCanlendar.vue'
export default {
  props: ['row'],
  components: {
    DeliveryCanlendar
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
      bondsForm: {
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
      bondsFormRules: {
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
        this.bondsForm.volume = 0
      } else {
        this.bondsForm.volume += val
      }
    },
    // 交割速度方法
    funcDeliverySpeed(val) {
      if (this.bondsForm.deliverySpeed === val) {
        return 'btn-active'
      }
      return ''
    },
    // 买单交割日期变化
    handleBuyDeliveryCanlendar(obj) {
      this.bondsForm.deliveryTime = obj.value
    },
    // 点击交易速度
    handleDelivertySpeed(val) {
      this.bondsForm.deliverySpeed = val
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.dealBondsEdit({
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
                message: '修改成功',
                type: 'success'
              })
              this.$emit('change', {
                dialogVisible: false
              })
            }
          })
        }
      })
    },
    loadInitData() {
      this.bondsForm.price = this.row.price
      this.bondsForm.volume = this.row.volume
      this.bondsForm.tscode = this.row.tscode
      // this.bondsForm.deliverySpeed = this.row.deliverySpeed
      this.bondsForm.deliveryTime = this.row.deliveryTime
      this.bondsForm.remark = this.row.remark
      this.bondsForm.counterParty = this.row.counterParty
      this.bondsForm.contactPerson = this.row.contactPerson
      this.bondsForm.contactType = this.row.contactType
      this.bondsForm.realTradeId = this.row.realTradeId
    }
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
