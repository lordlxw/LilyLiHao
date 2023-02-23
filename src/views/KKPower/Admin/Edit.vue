<!--管理员管理-添加-->
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
        {{ ruleForm.userName }}
      </el-form-item>
      <el-form-item label="管理员类型" prop="userType">
        <el-select v-model="ruleForm.userType" placeholder="---请选择---">
          <el-option
            v-for="(value, key) in config.manageUserType"
            :key="key"
            :label="value"
            :value="key"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属角色" prop="roleId">
        <select-role ref="selectRole" @change="handleSelectRole"></select-role>
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
import config from "@/utils/config.js";
export default {
  data() {
    return {
      config,
      ruleForm: {
        userName: "",
        userType: "",
        roleId: "",
      },
      rules: {
        userName: [
          { required: true, message: "请填写登录用户名", trigger: "blur" },
        ],
        userType: [
          { required: true, message: "请选择用户类型", trigger: "change" },
        ],
        roleId: [
          { required: true, message: "请选择所属角色", trigger: "change" },
        ],
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
      this.ruleForm.roleId = obj.value;
    },
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api
            .edit({
              id: this.ruleForm.id,
              userType: this.ruleForm.userType,
              roleId: this.ruleForm.roleId,
            })
            .then((response) => {
              if (response && response.code === "200") {
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
      api.detail({ id: this.ruleForm.id }).then((response) => {
        if (response && response.code === "200") {
          this.ruleForm.userName = response.data.userName;
          this.ruleForm.userType = response.data.userType.toString();
          this.ruleForm.roleId = response.data.roleId;
          this.$refs.selectRole.value = this.ruleForm.roleId;
        }
      });
    },
  },
  mounted() {
    Promise.all([(this.ruleForm.id = this.urlParams.id)]).then(() => {
      this.detail();
    });
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
