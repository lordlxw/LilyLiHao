<!--用户管理-编辑-->
<template>
  <div class="content_dialog">
    <div class="list">
      <el-form :model="ruleForm" :inline="true" :rules="rules" ref="ruleForm" label-width="100px" class="my-ruleForm">
        <el-form-item label="名称" prop="company">
          <el-input v-model="ruleForm.company" class="w250"></el-input>
        </el-form-item>
        <!-- <el-form-item label="研究员" prop="chatId">
          <el-input v-model="ruleForm.chatId" class="w200"></el-input>
        </el-form-item> -->
        <el-form-item label="中介名字" prop="chatId">
          <el-input v-model="ruleForm.chatId" class="w250"></el-input>
        </el-form-item>
        <el-form-item label="券号" prop="tscode">
          <el-input v-model="ruleForm.tscode" class="w250"></el-input>
        </el-form-item>

        <el-form-item label="中介" prop="brokerid">
          <el-select v-model="ruleForm.brokerid" placeholder="请选择" class="w250">
            <el-option v-for="item in brokers" :key="item.id" :label="item.broker" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="通道" prop="channelId">
          <el-select v-model="ruleForm.channelId" placeholder="请选择" class="w250">
            <el-option v-for="item in channels" :key="item.id" :label="item.qtName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="禁用时间段" prop="forbid">
          <el-date-picker v-model="ruleForm.forbid" class="w250" type="daterange" range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
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
import api_login from "@/api/kk_login";
import RoleSelect from '@/components/RoleSelect.vue'
import config from "@/utils/config.js";
import * as util from '@/utils/util'
import { debounce } from '@/utils/debounce'
export default {
  components: {
    RoleSelect
  },
  props: {
    row: {},
    channels: []
  },
  data() {
    return {
      config,
      ruleForm: {
        company: "",
        chatId: "",
        tscode: "",
        channelId: "",
        brokerid: "",
        forbid: [],
        id: "",
      },
      rules: {
        qtName: [
          { required: true, message: "请填写通道名", trigger: "blur" },
        ],
      },
      brokers: []
    };
  },
  watch: {
    row() {
      if (this.row) {
        this.ruleForm = this.row;
        if (this.row.forbidStart && this.row.forbidEnd) {
          this.ruleForm.forbid = [this.row.forbidStart, this.row.forbidEnd]
        }
      } else {
        this.ruleForm = {
          company: "",
          chatId: "",
          tscode: "",
          channelId: "",
          brokerid: "",
          forbid: [],
          id: "",
        }
      }
    },
  },
  computed: {
    ...mapGetters({
      urlParams: "getUrlParams",
      userInfo: 'getUserInfo'
    }),
  },
  methods: {
    // 角色选择
    handleSelectRole(obj) {
      this.ruleForm.roleIds = obj.value;
    },
    async brokerList() {
      const { value } = await api_login.brokerList();
      this.brokers = value
    },
    // 提交
    submitForm: debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const forbid = this.ruleForm.forbid || []
          let params = {
            company: this.ruleForm.company,
            chatId: this.ruleForm.chatId,
            tscode: this.ruleForm.tscode,
            channelId: this.ruleForm.channelId,
            target: this.ruleForm.chatId,
            forbidStart: forbid.length > 0 ? util.dateFormat(forbid[0], "YYYY-MM-DD") : '',
            forbidEnd: forbid.length > 1 ? util.dateFormat(forbid[1], "YYYY-MM-DD") : '',
            brokerid: this.ruleForm.brokerid
          }
          if (this.row && this.row.id) {
            params.id = this.row.id
          }
          console.log(params)
          api.saveOrUpdateReceiver(params).then((response) => {
            if (response && response.code === "00000") {
              this.$message({
                message: "中介修改成功",
                type: "success",
              });
              this.$emit("refreshData")
            }
          });
        }
      });
    }),
  },
  mounted() {
    this.brokerList()
  },
  created() {
    if (this.row) {
      this.ruleForm = this.row;
      if (this.row.forbidStart && this.row.forbidEnd) {
        this.ruleForm.forbid = [this.row.forbidStart, this.row.forbidEnd]
      }
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
