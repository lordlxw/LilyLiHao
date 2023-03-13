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
      const self = this
      apiMenu.getSystemMenuTree().then(response => {
        if (response && response.code === "00000" && response.value) {
          self.menus = response.value;
          // 获取当前角色树状权限
          apiMenu.getRoleMenuTree({ roleId: self.ruleForm.roleId }).then(response => {
            if (response && response.code === 200) {
              const selectedMenuIds = self.funcHandleLeafMenuIds(response.checkedKeys, response.menus)
              Promise.all([selectedMenuIds]).then(() => {
                self.$refs.tree.setCheckedKeys(selectedMenuIds);
              })
            }
          })
        }
      })
    },
    // 获取叶节点数组id
    funcHandleLeafMenuIds(checkedKeys, menus) {
      let selectedMenuIds = []
      if (menus && menus.length > 0) {
        for (let i = 0; i < menus.length; i++) {
          if (menus[i].children && menus[i].children.length > 0) {
            selectedMenuIds = selectedMenuIds.concat(this.funcHandleLeafMenuIds(checkedKeys, menus[i].children))
          } else {
            if (checkedKeys.indexOf(menus[i].id) !== -1) {
              selectedMenuIds.push(menus[i].id)
            }
          }
        }
        return selectedMenuIds
      }
      return []
    },
    detail() {
      api.detail({ roleId: this.ruleForm.roleId }).then(response => {
        if (response && response.code === "00000" && response.value) {
          // 需要编辑的字段
          this.ruleForm.roleId = response.value.roleId
          this.ruleForm.roleName = response.value.roleName
          this.ruleForm.dataScope = response.value.dataScope
          this.ruleForm.roleKey = response.value.roleKey
          this.ruleForm.menuIds = response.value.menuIds
          this.ruleForm.roleSort = response.value.roleSort
          // 其他详情字段
          this.getAllMenu()
        }
      })
    }
  },
  mounted() {
    this.ruleForm.roleId = this.urlParams.roleId
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
