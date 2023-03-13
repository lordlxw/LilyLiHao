<!--用户管理-编辑-->
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
      <el-form-item label="昵称" prop="nickName">
        <el-input v-model="ruleForm.nickName" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phonenumber">
        <el-input v-model="ruleForm.phonenumber" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <role-select ref="roleSelect" @change="handleSelectRole"></role-select>
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
import { mapGetters } from "vuex";
import api from "@/api/kk_power_admin";
import RoleSelect from '@/components/RoleSelect.vue'
import config from "@/utils/config.js";
export default {
  components: {
    RoleSelect
  },
  data() {
    return {
      config,
      ruleForm: {
        userId: "",
        userName: "",
        nickName: "",
        phonenumber: "",
        remark: "",
        roleIds: []
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
        ]
      },
    };
  },
  computed: {
    ...mapGetters({
      urlParams: "getUrlParams",
    }),
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
          api.edit({
            userId: this.ruleForm.userId,
            userName: this.ruleForm.userName,
            nickName: this.ruleForm.nickName,
            phonenumber: this.ruleForm.phonenumber,
            password: this.ruleForm.password,
            roleIds: this.ruleForm.roleIds,
            remark: this.ruleForm.remark
          }).then((response) => {
            if (response && response.code === "00000") {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.$router.go(-1);
            }
          });
        }
      });
    },
    detail() {
      api.detail({ userId: this.ruleForm.userId }).then(response => {
        if (response && response.code === 200 && response.data) {
          // 需要编辑的字段
          this.ruleForm.userName = response.data.userName
          this.ruleForm.roleIds = response.roleIds
          this.ruleForm.password = response.data.password
          this.ruleForm.nickName = response.data.nickName
          this.ruleForm.phonenumber = response.data.phonenumber
          this.ruleForm.remark = response.data.remark
          // 其他详情字段
          this.$refs.roleSelect.value = response.roleIds
        }
      })
    }
  },
  mounted() {
    this.ruleForm.userId = this.urlParams.userId
    this.detail()
  },
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
