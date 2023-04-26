<!--菜单管理-修改-->
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
      <el-form-item label="类型" prop="menuType">
        <el-radio v-model="ruleForm.menuType" label="M">菜单</el-radio>
        <el-radio v-model="ruleForm.menuType" label="C">叶节点</el-radio>
        <el-radio v-model="ruleForm.menuType" label="F">功能</el-radio>
      </el-form-item>
      <el-form-item label="名称" prop="menuName">
        <el-input v-model="ruleForm.menuName" class="w200"></el-input>
      </el-form-item>
      <el-form-item
        label="链接地址"
        prop="component"
        v-if="['M', 'C'].indexOf(ruleForm.menuType) !== -1"
      >
        <el-input v-model="ruleForm.component" class="w300"></el-input>
      </el-form-item>
      <el-form-item label="图标class" prop="icon">
        <el-input
          v-model="ruleForm.icon"
          class="w300"
          :suffix-icon="ruleForm.icon"
        ></el-input>
      </el-form-item>
      <el-form-item label="功能码" prop="perms">
        <el-input v-model="ruleForm.perms" class="w200"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="orderNum">
        <el-input v-model="ruleForm.orderNum" class="w100"></el-input>
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
import api from "@/api/kk_power_menu";
import config from "@/utils/config.js";
import { debounce } from '@/utils/debounce'
export default {
  data() {
    // 非零正整数
    var validategtzero = (rule, value, callback) => {
      if (!config.regExpSet.gtzero.test(value)) {
        callback(new Error("请输入大于0的正整数"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        menuId: "",
        menuType: "1",
        menuName: "",
        parentName: "",
        parentId: "0",
        icon: "",
        component: "",
        perms: "",
        orderNum: "1",
      },
      rules: {
        menuType: [{ required: true, message: "请选择类型", trigger: "blur" }],
        menuName: [{ required: true, message: "请填写名称", trigger: "blur" }],
        orderNum: [
          { required: true, message: "请输入排序号", trigger: "blur" },
          { validator: validategtzero, trigger: "blur" },
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
    submitForm: debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api
            .edit({
              menuId: this.ruleForm.menuId,
              menuType: this.ruleForm.menuType,
              menuName: this.ruleForm.menuName,
              icon: this.ruleForm.icon,
              component: this.ruleForm.component,
              perms: this.ruleForm.perms,
              orderNum: this.ruleForm.orderNum,
            })
            .then((response) => {
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
    }),
  },
  mounted() {
    Promise.all([
      (this.ruleForm.menuId = this.urlParams.menuId),
      (this.ruleForm.parentId = this.urlParams.parentId),
      (this.ruleForm.parentName = this.urlParams.parentName),
      (this.ruleForm.menuType = this.urlParams.menuType),
      (this.ruleForm.menuName = this.urlParams.menuName),
      (this.ruleForm.icon = this.urlParams.icon),
      (this.ruleForm.component = this.urlParams.component),
      (this.ruleForm.perms = this.urlParams.perms),
      (this.ruleForm.orderNum = this.urlParams.orderNum),
    ]).then(() => { });
  }
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
