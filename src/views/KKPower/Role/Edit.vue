<!--角色管理-添加-->
<template>
  <div class="content">
    <navigator></navigator>
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="200px"
      class="my-ruleForm"
    >
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model="ruleForm.roleName" class="w200"></el-input>
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
import api from "@/api/kk_power_role";
export default {
  data() {
    return {
      ruleForm: {
        roleName: "",
      },
      rules: {
        roleName: [
          { required: true, message: "请填写角色名", trigger: "blur" },
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
    // 提交
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api
            .edit({
              id: this.ruleForm.id,
              roleName: this.ruleForm.roleName,
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
  },
  mounted() {
    Promise.all([
      (this.ruleForm.id = this.urlParams.id),
      (this.ruleForm.roleName = this.urlParams.roleName),
    ]).then(() => {});
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
