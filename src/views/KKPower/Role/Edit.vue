<!--角色管理-编辑-->
<template>
  <div class="content">
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
      <el-form-item label="角色关键字" prop="roleKey">
        <el-input v-model="ruleForm.roleKey" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="菜单功能权限" prop="menuIds">
        <el-tree
          :data="menus"
          show-checkbox
          default-expand-all
          node-key="id"
          ref="tree"
          highlight-current
          :props="defaultProps"
        >
        </el-tree>
      </el-form-item>
      <el-form-item label="数据权限" prop="dataScope">
        <el-select v-model="ruleForm.dataScope" placeholder="请选择数据权限">
          <el-option
            v-for="(value, key) in config.dataScopeType"
            :key="key"
            :label="value"
            :value="key"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序" prop="roleSort">
        <el-input v-model="ruleForm.roleSort" class="w200"></el-input>
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
import apiMenu from "@/api/kk_power_menu";
import config from "@/utils/config";
export default {
  data() {
    return {
      config,
      menus: [],
      defaultProps: {
        children: "children",
        label: "label",
      },
      ruleForm: {
        roleId: '',
        roleName: "",
        dataScope: "1",
        menuIds: [],
        roleKey: '',
        roleSort: '1'
      },
      rules: {
        roleName: [
          { required: true, message: "请填写角色名", trigger: "blur" },
        ],
        roleKey: [
          { required: true, message: "请填写角色关键字", trigger: "blur" },
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
    // 提交
    submitForm(formName) {
      Promise.all([
        // 半选择加上全选择key
        (this.ruleForm.menuIds = this.$refs.tree
          .getHalfCheckedKeys()
          .concat(this.$refs.tree.getCheckedKeys())),
      ]).then(() => {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            api.edit({
              roleId: this.ruleForm.roleId,
              roleName: this.ruleForm.roleName,
              dataScope: this.ruleForm.dataScope,
              menuIds: this.ruleForm.menuIds,
              roleKey: this.ruleForm.roleKey,
              roleSort: this.ruleForm.roleSort
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
      })
    },
    getAllMenu() {
      apiMenu.getSystemMenuTree().then(response => {
        if (response && response.code === "00000" && response.value) {
          this.menus = response.value;
        }
      })
    }
  },
  mounted() {
    Promise.all([
      (this.ruleForm.roleId = this.urlParams.roleId),
      (this.ruleForm.roleName = this.urlParams.roleName),
      (this.ruleForm.dataScope = this.urlParams.dataScope),
      (this.ruleForm.menuIds = this.urlParams.menuIds),
      (this.ruleForm.roleKey = this.urlParams.roleKey),
      (this.ruleForm.roleSort = this.urlParams.roleSort),
      this.getAllMenu(),
    ]).then(() => {
      console.log(this.urlParams)
      console.log(12121)
      console.log(this.ruleForm.menuIds)
      console.log(this.menus)
      this.$refs.tree.setCheckedNodes(this.ruleForm.menuIds);
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
