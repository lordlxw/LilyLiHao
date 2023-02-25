<!--用户管理-添加-->
<template>
  <div class="content">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="200px"
      class="my-ruleForm"
    >
      <el-form-item label="用户名" prop="userName">
        <el-input v-model="ruleForm.userName" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input
          type="password"
          v-model="ruleForm.password"
          autocomplete="off"
          class="w200"
        ></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword">
        <el-input
          type="password"
          v-model="ruleForm.checkPassword"
          autocomplete="off"
          class="w200"
        ></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="ruleForm.nickName" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phonenumber">
        <el-input v-model="ruleForm.phonenumber" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <role-select @change="handleSelectRole"></role-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          type="textarea"
          :row="2"
          resize="none"
          v-model="ruleForm.remark"
          class="w500"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')"
          >保 存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from "@/api/kk_power_admin";
import RoleSelect from '@/components/RoleSelect.vue'
import config from "@/utils/config.js";
export default {
  components: {
    RoleSelect
  },
  data() {
    var validatePassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.ruleForm.checkPassword !== '') {
          this.$refs.ruleForm.validateField('checkPassword');
        }
        callback();
      }
    };
    var validatePassword2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      config,
      ruleForm: {
        userName: "",
        nickName: "",
        phonenumber: "",
        remark: "",
        roleIds: [],
        password: "",
        checkPassword: ''
      },
      rules: {
        userName: [
          { required: true, message: "请填写登录用户名", trigger: "blur" },
        ],
        nickName: [
          { required: true, message: "请填写昵称", trigger: "blur" },
        ],
        phonenumber: [
          { required: true, message: "请填写手机号", trigger: "blur" },
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        checkPassword: [
          { validator: validatePassword2, trigger: 'blur' }
        ],
      },
    };
  },
  methods: {
    // 角色选择
    handleSelectRole(obj) {
      this.ruleForm.roleIds = obj.value;
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.add({
            userName: this.ruleForm.userName,
            nickName: this.ruleForm.nickName,
            phonenumber: this.ruleForm.phonenumber,
            password: this.ruleForm.password,
            roleIds: this.ruleForm.roleIds,
            remark: this.ruleForm.remark
          }).then((response) => {
            if (response && response.code === "00000") {
              this.$message({
                message: "添加成功",
                type: "success",
              });
              this.$router.go(-1);
            }
          });
        }
      });
    },
  },
  mounted() { },
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/style.scss";
.content {
  .navigator {
    position: relative;
    background-color: #f8f8f8;
    padding: 0 15px;
    .el-breadcrumb {
      height: 50px;
      line-height: 50px;
    }
    .el-button {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }
  .my-ruleForm {
    margin: 30px 15px 30px;
  }
}
</style>
<style lang="scss">
body {
  background-color: #f8f8f8;
}
</style>
