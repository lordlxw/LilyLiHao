<!--用户管理-编辑-->
<template>
  <div class="content_dialog">
    <div class="list">
      <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="100px" class="my-ruleForm">
        <el-form-item label="产品名" prop="qtName">
          <el-input v-model="ruleForm.qtName" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="密钥" prop="qtToken">
          <el-input v-model="ruleForm.qtToken" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="IP" prop="qtIp">
          <el-input v-model="ruleForm.qtIp" class="w200"></el-input>
        </el-form-item>
        <el-form-item label="端口" prop="qtPort">
          <el-input v-model="ruleForm.qtPort" class="w200"></el-input>
        </el-form-item>

        <el-form-item label="状态" prop="qtStatus">
          <div class="w200">
            <el-tooltip :content="'启用通道'" placement="top">
              <el-switch v-model="ruleForm.qtStatus" :active-value="0" :inactive-value="1">
              </el-switch>
            </el-tooltip>
          </div>
        </el-form-item>
        <el-form-item label=" ">
          <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
import { mapGetters } from "vuex";
import api from "@/api/kk_power_admin";
import RoleSelect from '@/components/RoleSelect.vue'
import config from "@/utils/config.js";
import { debounce } from '@/utils/debounce'
export default {
  components: {
    RoleSelect
  },
  props: {
    row: {},
  },
  data() {
    return {
      config,
      ruleForm: {
        qtName: "",
        qtToken: "",
        qtIp: "",
        qtPort: "",
        qtStatus: 1,
        id: "",
      },
      rules: {
        qtName: [
          { required: true, message: "请填写通道名", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    row() {
      if (this.row) {
        this.ruleForm = this.row;
      } else {
        this.ruleForm = {
          qtName: "",
          qtToken: "",
          qtIp: "",
          qtPort: "",
          qtStatus: 1,
          id: "",
        }
      }
    },
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
    submitForm: debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            qtName: this.ruleForm.qtName,
            qtToken: this.ruleForm.qtToken,
            qtIp: this.ruleForm.qtIp,
            qtPort: this.ruleForm.qtPort,
            qtStatus: this.ruleForm.qtStatus,
          }
          if (this.row && this.row.id) {
            params.id = this.row.id
          }
          api.saveOrUpdateChannel(params).then((response) => {
            if (response && response.code === "00000") {
              this.$message({
                message: "通道修改成功",
                type: "success",
              });
              this.$emit("refreshData")
            }
          });
        }
      });
    }),
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
          this.ruleForm.tscode = response.tscode
          // 其他详情字段
          this.$refs.roleSelect.value = response.roleIds
        }
      })
    }
  },
  mounted() {

  },
  created() {
    if (this.row) {
      this.ruleForm = this.row;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/style.scss";

.content_dialog {
  height: 100%;

  .list {

    .my-ruleForm {
      background-color: #fff;
      border-radius: 3px;
    }
  }

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

}
</style>
