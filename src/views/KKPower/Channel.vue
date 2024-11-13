<!--用户管理-->
<template>
  <div class="content">
    <div class="list" v-if="pageName == 0">
      <div class="do">
        <el-row>
          <el-col :span="12">
            <el-tag type="success">通道管理</el-tag>
          </el-col>
          <el-col :span="12" class="text-right">
            <el-button v-if="setAuth('system:channel:add')" type="primary" @click="channelEdit()">添加</el-button>
          </el-col>
        </el-row>
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
              <el-button v-if="setAuth('system:channel:edit')" @click="findReceivers(scope.row)"
                type="text">中介管理</el-button>
              <el-button v-if="setAuth('system:channel:edit')" @click="channelEdit(scope.row)"
                type="text">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination mt10">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, prev, pager, next"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
    <div class="list" v-if="pageName == 1">
      <div class="do">
        <el-row>
          <el-col :span="12">
            <el-tag type="success" class="mr10" @click="pageName = 0"><i class="el-icon-back"></i></el-tag>
            <el-tag type="success" class="mr20">{{ pageItem.qtName }}</el-tag>
          </el-col>
          <el-col :span="12" class="text-right">
            <el-button class="" v-if="setAuth('system:channel:add')" type="primary"
              @click="receiverEdit()">添加</el-button>
          </el-col>
        </el-row>
      </div>
      <div class="table mt10">
        <el-table v-loading="loading" ref="multipleTable" :data="tableReceiverData" tooltip-effect="dark"
          style="width: 100%" highlight-current-row>
          <el-table-column fixed type="index" label="序号" align="center" width="50"></el-table-column>
          <template v-for="itemHead in tableReceiverHead">
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
              <el-button v-if="setAuth('system:channel:edit')" type="text"
                @click="receiverEdit(scope.row)">修改</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <div class="pagination mt10">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, prev, pager, next"
          :total="totalCount">
        </el-pagination>
      </div> -->
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
    <el-dialog :title="channelEditDialog.title" width="500px;" :visible.sync="channelEditDialog.visible" append-to-body
      class="channelEditDialog " :destroy-on-close="true" :close-on-click-modal="false">
      <channel-edit :row="channelEditDialog.currentRow" @refreshData="loadInitData()"></channel-edit>
    </el-dialog>
    <el-dialog :title="receiverEditDialog.title" width="500px;" :visible.sync="receiverEditDialog.visible"
      append-to-body class="receiverEditDialog " :destroy-on-close="true" :close-on-click-modal="false">
      <receiver-edit :row="receiverEditDialog.currentRow" :channels="tableData"
        @refreshData="findReceivers(pageItem)"></receiver-edit>
    </el-dialog>
  </div>
</template>

<script>
import api from "@/api/kk_power_admin";
import { pageMixin } from "@/utils/pageMixin";
import { commMixin } from "@/utils/commMixin";
import config from "@/utils/config";
import { debounce } from '@/utils/debounce'
import ChannelEdit from './Channel/Edit.vue'
import ReceiverEdit from './Channel/EditReceiver.vue'
// import * as util from '@/utils/util'
export default {
  mixins: [pageMixin, commMixin],
  components: {
    ChannelEdit, ReceiverEdit
  },
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
      channelEditDialog: {
        visible: false,
        currentRow: null,
        title: '新增通道'
      },
      receiverEditDialog: {
        visible: false,
        currentRow: null,
        title: '新增中介'
      },
      // 公共配置
      config,
      // 表头
      tableHead: [
        { label: "产品名", prop: "qtName", width: "120", align: "left", show: true },
        { label: "Code", prop: "qtCode", width: "200", align: "left", show: false },
        { label: "密钥", prop: "qtToken", width: "150", align: "left", show: true },
        { label: "Ip", prop: "qtIp", width: "120", align: "left", show: true },
        { label: "通道密钥", prop: "qtAction", width: "120", align: "left", show: true },
        { label: "端口", prop: "qtPort", width: "100", align: "left", show: true },
        { label: "状态", prop: "qtStatus", formatter: this.funcFormat, width: "150", align: "left", show: true },
        { label: "创建时间", prop: "createTime", width: "200", align: "left", show: false },
        { label: "修改时间", prop: "updateTime", width: "200", align: "left", show: true }
      ],
      tableReceiverHead: [
        { label: "中介", prop: "company", width: "120", align: "left", show: true },
        { label: "名字", prop: "target", width: "120", align: "left", show: true },
        { label: "chatId", prop: "chatId", width: "200", align: "left", show: false },
        { label: "状态", prop: "status", width: "150", formatter: this.funcReceiverFormat, align: "left", show: true },
        { label: "券号", prop: "tscode", width: "120", align: "left", show: true },
        { label: "开始时间", prop: "forbidStart", formatter: this.funcReceiverFormat, width: "150", align: "left", show: true },
        { label: "结束时间", prop: "forbidEnd", formatter: this.funcReceiverFormat, width: "150", align: "left", show: true },
        { label: "通道", prop: "channelId", formatter: this.funcReceiverFormat, width: "200", align: "left", show: true }
      ],
      tableData: [],
      tableReceiverData: [],
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
      tableHeight: 0,
      pageName: 0,
      pageItem: null
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
        status: scope.row.status === '4' ? '0' : '4',
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
    channelEdit(row) {
      this.channelEditDialog.title = row ? '修改通道' : '新增通道'
      this.channelEditDialog.currentRow = row;
      this.channelEditDialog.visible = true;
    },
    receiverEdit(row) {
      this.receiverEditDialog.title = row ? '修改中介' : '新增中介'
      this.receiverEditDialog.currentRow = row;
      this.receiverEditDialog.visible = true;
    },
    findReceivers(row) {
      this.loading = true;

      api.findReceiverByChannel(row.id).then((response) => {
        // this.funcPage(response, 'tableReceiverData');

        this.tableReceiverData = response.value
        this.loading = false;
        this.pageItem = row || this.pageItem
        this.pageName = 1
        this.receiverEditDialog.visible = false;
      });
    },
    // 初始化数据
    loadInitData() {
      this.loading = true;
      api.findPageChannel({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      }).then((response) => {
        this.funcPage(response);
        this.loading = false;
        this.channelEditDialog.visible = false;
      });
    },
    // 格式化
    funcFormat(row, column) {
      switch (column.property) {
        case "qtStatus":
          return config.funcKeyValue(row.qtStatus.toString(), "channelStatus")
      }
    },
    funcReceiverFormat(row, column) {
      switch (column.property) {
        case "channelId":
          return this.tableData.find(n => n.id === row.channelId).qtName
        case "forbidStart":
          return row.forbidStart || '--'
        case "forbidEnd":
          return row.forbidEnd || '--'
        case "status":
          return config.funcKeyValue(row.status.toString(), "channelStatus")
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
