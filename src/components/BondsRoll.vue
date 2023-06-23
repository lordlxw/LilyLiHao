<template>
  <div>
    <el-form
      ref="rollForm"
      :model="rollForm"
      :rules="rollFormRules"
      label-width="100px"
    >
      <el-row :gutter="20">
        <el-col
          :span="12"
          :style="
            rollForm.direction === 'bond_0'
              ? 'background-color: #f0fbf2'
              : 'background-color:#fbf1f1'
          "
        >
          <el-divider content-position="left" class="divider-tit"
            >平仓</el-divider
          >
          <el-form-item label="优先" prop="isYouxian">
            <el-checkbox v-model="rollForm.isYouxian" @change="handleOver"
              >是</el-checkbox
            >
          </el-form-item>
          <el-form-item label="方向" prop="direction">
            {{
              rollForm.direction === "bond_0"
                ? "买入"
                : rollForm.direction === "bond_1"
                ? "卖出"
                : "不明确"
            }}
          </el-form-item>
          <el-form-item label="券码" prop="tscode">
            {{ rollForm.tscode }}
          </el-form-item>
          <el-form-item label="价格" prop="price">
            <el-input
              v-model="rollForm.price"
              placeholder="请输入价格"
            ></el-input>
          </el-form-item>
          <el-form-item label="交易量" prop="volume">
            <el-input
              v-model="rollForm.volume"
              placeholder="请输入交易量"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" @click="funcVolumeAdd(0)"
                >清零</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd(1000)"
                >1</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd(2000)"
                >2</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd(3000)"
                >3</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd(5000)"
                >5</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd(10000)"
                >10</el-button
              >
            </el-button-group>
          </el-form-item>
          <el-form-item label="交割日期" prop="deliveryTime">
            <delivery-canlendar-update
              ref="deliveryCanlendarUpdate"
              :dtime="rollForm.dtime"
              @change="handleDeliveryCanlendarUpdate"
            ></delivery-canlendar-update>
          </el-form-item>
          <el-form-item label="交易员" prop="userId">
            <el-select v-model="rollForm.userId" placeholder="请选择交易员">
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
              v-model="rollForm.remark"
              placeholder="请输入内容"
              resize="none"
              rows="2"
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col
          :span="12"
          :style="
            rollForm.direction2 === 'bond_0'
              ? 'background-color: #f0fbf2'
              : 'background-color:#fbf1f1'
          "
        >
          <el-divider content-position="left" class="divider-tit"
            >开仓</el-divider
          >
          <el-form-item label="优先" prop="isYouxian2">
            <el-checkbox v-model="rollForm.isYouxian2" @change="handleOpen"
              >是</el-checkbox
            >
          </el-form-item>
          <el-form-item label="方向" prop="direction2">
            {{
              rollForm.direction2 === "bond_0"
                ? "买入"
                : rollForm.direction2 === "bond_1"
                ? "卖出"
                : "不明确"
            }}
          </el-form-item>
          <el-form-item label="券码" prop="tscode2">
            {{ rollForm.tscode2 }}
          </el-form-item>
          <el-form-item label="价格" prop="price2">
            <el-input
              v-model="rollForm.price2"
              placeholder="请输入价格"
            ></el-input>
          </el-form-item>
          <el-form-item label="交易量" prop="volume2">
            <el-input
              v-model="rollForm.volume2"
              placeholder="请输入交易量"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button-group>
              <el-button type="primary" @click="funcVolumeAdd2(0)"
                >清零</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd2(1000)"
                >1</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd2(2000)"
                >2</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd2(3000)"
                >3</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd2(5000)"
                >5</el-button
              >
              <el-button type="primary" @click="funcVolumeAdd2(10000)"
                >10</el-button
              >
            </el-button-group>
          </el-form-item>
          <el-form-item label="交割日期" prop="deliveryTime2">
            <delivery-canlendar-update
              ref="deliveryCanlendarUpdate2"
              :dtime="rollForm.dtime2"
              @change="handleDeliveryCanlendarUpdate2"
            ></delivery-canlendar-update>
          </el-form-item>
          <el-form-item label="交易员" prop="userId2">
            <el-select v-model="rollForm.userId2" placeholder="请选择交易员">
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
              v-model="rollForm.remark2"
              placeholder="请输入内容"
              resize="none"
              rows="2"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <div class="button-box">
        <span class="txt-red"
          >价差：{{
            (openRow.direction === "bond_1"
              ? rollForm.price - rollForm.price2
              : rollForm.price2 - rollForm.price) | moneyFormat(4)
          }}</span
        ><br />
        <el-button type="primary" @click="submitForm('rollForm')"
          >确认滚单</el-button
        >
      </div>
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
  props: ['overRow', 'openRow'],
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
    // 优先成交
    const validYouXian = async (rule, value, callback) => {
      console.log(this.rollForm.isYouxian || this.rollForm.isYouxian2)
      if (!(this.rollForm.isYouxian || this.rollForm.isYouxian2)) {
        callback(new Error('优先成交必选'))
      } else {
        callback()
      }
    }
    return {
      tradeUsersOption: [],
      rollForm: {
        // 优先级
        isYouxian: false,
        // 交易类型
        direction: '买入',
        // 价格
        price: '',
        // 交易量
        volume: '',
        // 债券号
        tscode: '',
        // 交割速度
        deliverySpeed: 0,
        // 交割日期
        deliveryTime: '',
        // 交易员
        userId: '',
        // 备注
        remark: '',
        // 交易类型
        direction2: '买入',
        // 优先级
        isYouxian2: false,
        // 价格
        price2: '',
        // 交易量
        volume2: '',
        // 债券号
        tscode2: '',
        // 交割速度
        deliverySpeed2: 0,
        // 交割日期
        deliveryTime2: '',
        // 交易员
        userId2: '',
        // 备注
        remark2: '',
        // 相关单号
        relativeNum: '',
        // 母单交割日期
        deliveryTime3: '',
        dtime: '',
        dtime2: ''
      },
      rollFormRules: {
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
        userId: [
          { required: true, message: '交易员必选', trigger: 'change' }
        ],
        direction2: [
          { required: true, message: '方向必选', trigger: 'blur' }
        ],
        tscode2: [
          { required: true, message: '券码必填', trigger: 'blur' }
        ],
        price2: [
          { required: true, message: '价格必填', trigger: 'blur' },
          { validator: moneyTest, trigger: 'blur' }
        ],
        volume2: [
          { required: true, message: '交易量必填', trigger: 'blur' },
          { validator: plusAmountTest, trigger: 'blur' }
        ],
        deliveryTime2: [
          { required: true, message: '交割日期必选', trigger: 'blur' }
        ],
        userId2: [
          { required: true, message: '交易员必选', trigger: 'change' }
        ],
        isYouxian: [{
          validator: validYouXian, message: '优先成交必选', trigger: 'change'
        }],
        isYouxian2: [{
          validator: validYouXian, message: '优先成交必选', trigger: 'change'
        }],
      }
    }
  },
  watch: {
    overRow: function () {
      this.loadInitData()
    }
  },
  methods: {
    // 交易量加法函数
    funcVolumeAdd(val) {
      if (val === 0) {
        this.rollForm.volume = 0
      } else {
        this.rollForm.volume += val
      }
    },
    // 交易量加法函数2
    funcVolumeAdd2(val) {
      if (val === 0) {
        this.rollForm.volume2 = 0
      } else {
        this.rollForm.volume2 += val
      }
    },
    // 交割速度方法
    funcDeliverySpeed(val) {
      if (this.rollForm.deliverySpeed === val) {
        return 'btn-active'
      }
      return ''
    },
    // 交割速度方法
    funcDeliverySpeed2(val) {
      if (this.rollForm.deliverySpeed2 === val) {
        return 'btn-active'
      }
      return ''
    },
    // 交割日期变化
    handleDeliveryCanlendarUpdate(obj) {
      this.rollForm.deliveryTime = obj.value
    },
    // 交割日期变化
    handleDeliveryCanlendarUpdate2(obj) {
      this.rollForm.deliveryTime2 = obj.value
    },
    // 点击交割日期
    handleDelivertySpeed(val) {
      this.rollForm.deliverySpeed = val
    },
    // 点击交割日期
    handleDelivertySpeed2(val) {
      this.rollForm.deliverySpeed2 = val
    },
    // 处理开仓优先级勾选
    handleOpen(val) {
      if (val) {
        this.rollForm.isYouxian = false
      }
    },
    // 处理平仓优先级勾选
    handleOver(val) {
      if (val) {
        this.rollForm.isYouxian2 = false
      }
    },
    submitForm: debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.dealRoll({
            isYouxian: this[formName].isYouxian,
            // 交割速度
            deliverySpeed: this[formName].deliverySpeed,
            // 交割日期
            deliveryTime: util.dateFormat(this[formName].deliveryTime, "YYYY-MM-DD 00:00:00"),
            // 买还是卖
            direction: this[formName].direction,
            // 成交价格
            price: util.moneyFormat(this[formName].price, 4),
            // 交易员
            userId: this[formName].userId,
            // 债券编号
            tscode: this[formName].tscode,
            // 成交量
            volume: this[formName].volume,
            // 备注
            remark: this[formName].remark,
            isYouxian2: this[formName].isYouxian2,
            // 交割速度
            deliverySpeed2: this[formName].deliverySpeed2,
            // 交割日期
            deliveryTime2: util.dateFormat(this[formName].deliveryTime2, "YYYY-MM-DD 00:00:00"),
            // 买还是卖
            direction2: this[formName].direction2,
            // 成交价格
            price2: util.moneyFormat(this[formName].price2, 4),
            // 交易员
            userId2: this[formName].userId2,
            // 债券编号
            tscode2: this[formName].tscode2,
            // 成交量
            volume2: this[formName].volume2,
            // 备注
            remark2: this[formName].remark2,
            // 相关单号
            relativeNum: this[formName].relativeNum,
            deliveryTime3: this[formName].deliveryTime3,
          }).then(res => {
            if (res && res.code === '00000') {
              this.$message({
                message: `创建滚单成功`,
                type: 'success'
              })
              this.$emit('change', {
                dialogVisible: false
              })
            } else {
              this.$message({
                message: `${res.message}`,
                type: 'error'
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
          this.rollForm.userId = response.value[0].userId
          this.rollForm.userId2 = response.value[0].userId
        }
      })
    },
    // 加载初始值
    loadInitData() {
      this.rollForm.relativeNum = this.overRow.relativeNum
      this.rollForm.deliveryTime3 = this.overRow.deliveryTime
      this.rollForm.direction = this.overRow.direction === 'bond_1' ? 'bond_0' : (this.overRow.direction === 'bond_0' ? 'bond_1' : '')
      this.rollForm.tscode = this.overRow.tscode
      this.rollForm.price = this.overRow.price
      this.rollForm.volume = parseFloat(this.overRow.volume)
      if (moment(this.overRow.deliveryTime).format('YYYY-MM-DD') < moment(new Date()).format('YYYY-MM-DD')) {
        this.rollForm.deliveryTime = moment(new Date()).format('YYYY-MM-DD')
        this.$refs.deliveryCanlendarUpdate.deliveryTime = moment(new Date()).format('YYYY-MM-DD')
        this.rollForm.dtime = this.getNextDealDayByDeliveryTime(moment(this.rollForm.deliveryTime).format('YYYY-MM-DD 00:00:00'))
      } else if (moment(this.overRow.deliveryTime).format('YYYY-MM-DD') > moment(new Date()).format('YYYY-MM-DD')) {
        this.rollForm.deliveryTime = moment(this.overRow.deliveryTime).format('YYYY-MM-DD')
        this.rollForm.dtime = this.$refs.deliveryCanlendarUpdate.deliveryTime = moment(this.overRow.deliveryTime).format('YYYY-MM-DD')
        this.getNextDealDayByDeliveryTime(moment(this.rollForm.deliveryTime).format('YYYY-MM-DD 00:00:00'))
      } else if (moment(this.overRow.deliveryTime).format('YYYY-MM-DD') === moment(new Date()).format('YYYY-MM-DD') && moment(moment(new Date()).format('YYYY-MM-DD HH:mm:ss')).isBefore(moment(new Date()).format('YYYY-MM-DD 15:30:00'))) {
        this.rollForm.deliveryTime = moment(new Date()).format('YYYY-MM-DD')
        this.rollForm.dtime = this.$refs.deliveryCanlendarUpdate.deliveryTime = moment(new Date()).format('YYYY-MM-DD')
        this.getNextDealDayByDeliveryTime(moment(this.rollForm.deliveryTime).format('YYYY-MM-DD 00:00:00'))
      } else {
        this.getNextDealDay()
      }
      this.rollForm.direction2 = this.openRow.direction === 'bond_0' ? 'bond_0' : (this.openRow.direction === 'bond_1' ? 'bond_1' : '')
      this.rollForm.tscode2 = this.openRow.tscode
      this.rollForm.price2 = this.openRow.price
      this.rollForm.volume2 = parseFloat(this.openRow.volume)
      this.getTradeUserList(this.overRow.realTradeIdList)
    },
    // 获取下个交易日
    getNextDealDay() {
      apiCanlendar.nextDealDay({}).then(response => {
        if (response && response.code === '00000') {
          this.rollForm.deliveryTime = response.value
          this.$refs.deliveryCanlendarUpdate.deliveryTime = response.value
          this.rollForm.dtime = this.getNextDealDayByDeliveryTime(moment(this.rollForm.deliveryTime).format('YYYY-MM-DD 00:00:00'))
        }
      })
    },
    // 开仓单获取平仓单交割日期的下个工作日
    getNextDealDayByDeliveryTime(deliveryTime) {
      apiCanlendar.nextDealDay({ deliveryTime }).then(response => {
        if (response && response.code === '00000') {
          this.rollForm.deliveryTime2 = response.value
          this.rollForm.dtime2 = this.$refs.deliveryCanlendarUpdate2.deliveryTime = response.value
        }
      })
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
.txt-red {
  color: red;
}
.button-box {
  margin-top: 20px;
  text-align: center;
  line-height: 40px;
}
</style>
