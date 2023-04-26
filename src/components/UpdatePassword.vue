<template>
  <div>
    <el-form
      :model="ruleForm"
      status-icon
      :rules="rules"
      ref="ruleForm"
      :label-width="`${ruleFormLabelWidth}px`"
    >
      <el-form-item label="原密码" prop="oldPassword">
        <el-input
          type="password"
          v-model="ruleForm.oldPassword"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="pass">
        <el-input
          type="password"
          v-model="ruleForm.pass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input
          type="password"
          v-model="ruleForm.checkPass"
          autocomplete="off"
        ></el-input>
      </el-form-item>
      <el-form-item class="mt30">
        <el-button @click="handleCancel()">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >确 定</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from "@/api/kk_power_admin"
import { commMixin } from "@/utils/commMixin"
import { debounce } from '@/utils/debounce'
export default {
  mixins: [commMixin],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      ruleFormLabelWidth: 100,
      ruleForm: {
        oldPassword: '',
        pass: '',
        checkPass: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '原密码必填', trigger: 'blur' },
        ],
        pass: [
          { required: true, message: '新密码必填', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '确认密码必填', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
    }
  },
  methods: {
    // 提交表单
    submitForm: debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.updatePassword({
            newPassword: this[formName].pass,
            oldPassword: this[formName].oldPassword
          }).then(response => {
            if (response && response.code === '00000') {
              this.$message({
                message: '密码修改成功',
                type: 'success'
              })
              this.$emit('change', { dialogVisible: false })
            } else {
              this.$message({
                message: `${response.message}`,
                type: 'error'
              })
            }
          })
        } else {
          return false;
        }
      });
    }),
    handleCancel() {
      this.$emit('change', { dialogVisible: false })
    }
  },
  mounted() {
    this.initFrameW('ruleFormLabelWidth', 100)
    window.onresize = () => {
      this.initFrameW('ruleFormLabelWidth', 100)
    }
  }
}
</script>

<style>
</style>
