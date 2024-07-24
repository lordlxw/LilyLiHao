<!--用户管理-->
<template>
  <div class="content">
    <div class="list">
      <div class="do">
        <router-link v-if="setAuth('system:user:add')" to="/power/admin/add">
          <el-button type="default">添加</el-button>
        </router-link>
        <div class="pagination mt10">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
            :page-sizes="[15, 20, 50, 100]" :page-size="pageSize" layout="prev, next" :total="totalCount" background>
          </el-pagination>
        </div>
      </div>
      <div class="table mt10">
        <el-table v-loading="loading" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
          highlight-current-row>
          <el-table-column fixed type="index" label="序号" align="center" width="50"></el-table-column>
          <template v-for="itemHead in tableHead">
            <el-table-column v-if="itemHead.show" :key="itemHead.label" :align="itemHead.align" :prop="itemHead.prop"
              :formatter="itemHead.formatter
                  ? itemHead.formatter
                  : (row, column, cellValue, index) => {
                    return cellValue;
                  }
                " :label="itemHead.label" :width="itemHead.width ? itemHead.width : ''">
            </el-table-column>
          </template>
          <el-table-column fixed="right" align="center" label="操作" width="230">
            <template slot-scope="scope">
              <el-button v-if="setAuth('system:user:edit')" type="text"
                @click="handleEdit(scope.row, '/power/tablehead')">设置表头</el-button>
              <el-popover v-if="setAuth('user:disable')" placement="bottom-end"
                :ref="`popover-disabled-${scope.$index}`">
                <p>
                  确认<span class="color-red">{{
                    scope.row.disabled ? "启用" : "禁用"
                  }}</span>“<span class="color-main">{{ scope.row.userName }}</span>”？
                </p>
                <div style="text-align: right">
                  <el-button type="text" @click="
                    handlePopoverClose(
                      scope,
                      `popover-disabled-${scope.$index}`
                    )
                    ">取消</el-button>
                  <el-button type="text" @click="handleDisabling(scope)">确认</el-button>
                </div>
                <el-button type="text" slot="reference">{{
                  scope.row.status === "1" ? "启用" : "禁用"
                }}</el-button>
              </el-popover>
              <el-button v-if="setAuth('system:user:resetpass')" type="text"
                @click="handleResetPasswordDialog(scope)">重置密码</el-button>
              <el-button v-if="setAuth('system:user:edit')" type="text"
                @click="handleEdit(scope.row, '/power/admin/edit')">修改</el-button>
              <el-popover v-if="setAuth('system:user:remove')" placement="bottom-end"
                :ref="`popover-delete-${scope.$index}`">
                <p>
                  确认要<span class="color-red">删除</span>“<span class="color-main">{{ scope.row.userName }}</span>”？
                </p>
                <div style="text-align: right">
                  <el-button type="text" @click="
                    handlePopoverClose(
                      scope,
                      `popover-delete-${scope.$index}`
                    )
                    ">取消</el-button>
                  <el-button type="text" @click="handleDelete(scope)">确认</el-button>
                </div>
                <el-button type="text" slot="reference">删除</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination mt10">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <el-dialog title="重置密码" :visible.sync="centerDialogResetPasswordVisible" width="30%" center
      :close-on-click-modal="false">
      <el-form :model="resetPassForm" status-icon :rules="resetPassRules" ref="resetPassForm"
        :label-width="`${resetPassFormLabelWidth}px`">
        <el-form-item label="用户名">
          {{ resetPassForm.userName }}
        </el-form-item>
        <el-form-item label="昵称">
          {{ resetPassForm.nickName }}
        </el-form-item>
        <el-form-item label="密码" prop="pass">
          <el-input type="password" v-model="resetPassForm.pass" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input type="password" v-model="resetPassForm.checkPass" autocomplete="off"></el-input>
        </el-form-item>
        <!-- <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')"
            >提交</el-button
          >
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item> -->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogResetPasswordVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm('resetPassForm')">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/kk_power_admin";
import { pageMixin } from "@/utils/pageMixin";
import { commMixin } from "@/utils/commMixin";
import config from "@/utils/config";
import { debounce } from '@/utils/debounce'
export default {
  mixins: [pageMixin, commMixin],
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'));
      } else {
        if (this.resetPassForm.checkPass !== '') {
          this.$refs.resetPassForm.validateField('checkPass');
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.resetPassForm.pass) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      // 公共配置
      config,
      // 表头
      tableHead: [
        { label: "userId", prop: "userId", width: "200", align: "left", show: false },
        { label: "用户名", prop: "userName", width: "150", align: "left", show: true },
        { label: "昵称", prop: "nickName", width: "120", align: "left", show: true },
        { label: "手机号", prop: "phonenumber", width: "120", align: "left", show: true },
        { label: "状态", prop: "status", formatter: this.funcFormat, width: "100", align: "left", show: true },
        { label: "备注", prop: "remark", width: "auto", align: "left", show: true },
        { label: "创建时间", prop: "createTime", width: "150", align: "left", show: true }
      ],
      tableData: [],
      loading: true,
      centerDialogResetPasswordVisible: false,
      resetPassForm: {
        userId: '',
        userName: '',
        nickName: '',
        pass: '',
        checkPass: ''
      },
      resetPassRules: {
        pass: [
          { required: true, message: '密码必填', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { required: true, message: '确认密码必填', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      },
      // 重置密码表单label宽度
      resetPassFormLabelWidth: 100,
      page: 1,
      tableHeight: 0
    };
  },
  created() {
    // this.initFrameH('tableHeight', 200)
  },
  methods: {
    // 禁用与启用
    handleDisabling: debounce(function (scope) {
      api.updateStatus({
        userId: scope.row.userId,
        status: scope.row.status === '1' ? '0' : '1',
      }).then((response) => {
        if (response && response.code === "00000") {
          this.$message({
            message: `${scope.row.status === 0 ? "启用" : "禁用"}成功`,
            type: "success",
          });
          this.handlePopoverClose(scope, `popover-disabled-${scope.$index}`)
          this.loadInitData();
        }
      });
    }),
    // 删除
    handleDelete: debounce(function (scope) {
      api.delete({ userIds: scope.row.userId }).then((response) => {
        if (response && response.code === "00000") {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.handlePopoverClose(scope, `popover-delete-${scope.$index}`)
          this.loadInitData();
        }
      });
    }),
    // 重置密码
    handleResetPasswordDialog(scope) {
      Promise.all([
        this.resetPassForm.userId = scope.row.userId,
        this.resetPassForm.userName = scope.row.userName,
        this.resetPassForm.nickName = scope.row.nickName,
        this.resetPassForm.pass = '',
        this.resetPassForm.checkPass = ''
      ]).then(() => {
        this.centerDialogResetPasswordVisible = true
      })
    },
    // 提交重置密码
    submitForm: debounce(function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.resetPassword({
            userId: this.resetPassForm.userId,
            password: this.resetPassForm.pass
          }).then(response => {
            if (response && response.code === '00000') {
              this.$message({
                message: '密码重置成功',
                type: 'success'
              })
              this.centerDialogResetPasswordVisible = false
              this.loadInitData()
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
    // 初始化数据
    loadInitData() {
      this.loading = true;
      api.get({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then((response) => {
        this.funcList(response);
        this.loading = false;
      });
    },
    // 格式化
    funcFormat(row, column) {
      switch (column.property) {
        case "status":
          return config.funcKeyValue(row.status.toString(), "userStatus")
      }
    },
  },
  mounted() {
    this.initFrameW('resetPassFormLabelWidth', 100)
    this.loadInitData();
    window.onresize = () => {
      this.initFrameW('resetPassFormLabelWidth', 100)
    }
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/style.scss";

.content {
  height: 100%;
  background-color: $body-main-box;

  .list {
    padding: 10px;
    height: calc(100% - 50px);

    .el-table {
      border-radius: 3px;
      overflow: hidden;
    }

    .do {
      height: 50px;
      line-height: 50px;
      background-color: #fff;
      border-radius: 3px;
      padding: 0 10px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    }

    .table {
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    }

    .list-row {
      height: 40px;
      line-height: 40px;
      color: #000;
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

  .filter-condition {
    margin: 20px 15px 10px;
    background-color: #f8f8f8;
    padding: 10px 15px;

    .item {
      display: inline-block;
      padding: 5px 0;
    }

    label {
      font-size: 12px;
      color: #999999;
    }

    .btn-box {
      float: right;
    }

    .clearboth {
      clear: both;
    }
  }

  .list {
    .do {
      .el-button {
        margin-top: 10px;
      }
    }

    .pagination {
      float: right;
    }
  }
}
</style>
