<!--管理员管理-->
<template>
  <div class="content">
    <navigator></navigator>
    <div class="filter-condition">
      <div class="item mr30">
        <label>用户名</label>
        <el-input
          v-model="userName"
          placeholder="请输入关键字"
          clearable
          style="width: 200px"
        ></el-input>
      </div>
      <div class="item mr30">
        <label>角色</label>
        <select-role ref="selectRole" @change="handleSelectRole"></select-role>
      </div>
      <div class="item mr30">
        <label>禁用状态</label>
        <el-select v-model="disabled" placeholder="---请选择---">
          <el-option key="全部" label="全部" value=""> </el-option>
          <el-option
            v-for="(value, key) in config.disabledStatus"
            :key="key"
            :label="value"
            :value="key"
          >
          </el-option>
        </el-select>
      </div>
      <div class="item btn-box">
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="default" @click="handleClearCondition">重置</el-button>
        <!-- <el-button type="primary" @click="handleExport">导出</el-button> -->
      </div>
      <div class="clearboth"></div>
    </div>
    <div class="list">
      <div class="do">
        <router-link to="/power/admin/add" v-if="authValid('admin:add')">
          <el-button type="default">添加</el-button>
        </router-link>
        <div class="pagination mt10">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="pageSize"
            layout="prev, next"
            :total="totalCount"
            background
          >
          </el-pagination>
        </div>
      </div>
      <div class="table mt10">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          border
          highlight-current-row
        >
          <el-table-column
            fixed
            type="index"
            label="序号"
            align="center"
            width="50"
          ></el-table-column>
          <template v-for="itemHead in tableHead">
            <el-table-column
              v-if="itemHead.show"
              :key="itemHead.label"
              :align="itemHead.align"
              :prop="itemHead.prop"
              :formatter="
                itemHead.formatter
                  ? itemHead.formatter
                  : function (row, column, cellValue, index) {
                      return cellValue;
                    }
              "
              :label="itemHead.label"
              :width="itemHead.width ? itemHead.width : ''"
            >
            </el-table-column>
          </template>
          <el-table-column
            fixed="right"
            align="center"
            label="操作"
            width="170"
          >
            <template slot-scope="scope">
              <el-button
                v-if="authValid('admin:view')"
                @click="handleDetailClick(scope.row)"
                type="text"
                >详情</el-button
              >
              <el-popover
                placement="bottom-end"
                :ref="`popover-disabled-${scope.$index}`"
                v-if="authValid('admin:disabling')"
              >
                <p>
                  确认<span class="color-red">{{
                    scope.row.disabled ? "启用" : "禁用"
                  }}</span
                  >“<span class="color-main">{{ scope.row.userName }}</span
                  >”？
                </p>
                <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      scope._self.$refs[
                        `popover-disabled-${scope.$index}`
                      ].doClose()
                    "
                    >取消</el-button
                  >
                  <el-button type="text" @click="handleDisabling(scope)"
                    >确认</el-button
                  >
                </div>
                <el-button type="text" slot="reference">{{
                  scope.row.disabled ? "启用" : "禁用"
                }}</el-button>
              </el-popover>
              <el-popover
                placement="bottom-end"
                :ref="`popover-unlock-${scope.$index}`"
                v-if="scope.row.errorCount > 5 && authValid('admin:unlock')"
              >
                <p>
                  账号被锁，确认<span class="color-red">解锁</span>“<span
                    class="color-main"
                    >{{ scope.row.userName }}</span
                  >”？
                </p>
                <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      scope._self.$refs[
                        `popover-unlock-${scope.$index}`
                      ].doClose()
                    "
                    >取消</el-button
                  >
                  <el-button type="text" @click="handleUnlock(scope)"
                    >确认</el-button
                  >
                </div>
                <el-button type="text" slot="reference">解锁</el-button>
              </el-popover>
              <el-button
                type="text"
                v-if="authValid('admin:add')"
                @click="handleEdit(scope.row, '/power/admin/edit')"
                >编辑</el-button
              >
              <el-popover
                v-if="authValid('admin:delete')"
                placement="bottom-end"
                :ref="`popover-delete-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">删除</span>“<span
                    class="color-main"
                    >{{ scope.row.userName }}</span
                  >”？
                </p>
                <div style="text-align: right">
                  <el-button
                    type="text"
                    @click="
                      scope._self.$refs[
                        `popover-delete-${scope.$index}`
                      ].doClose()
                    "
                    >取消</el-button
                  >
                  <el-button type="text" @click="handleDelete(scope)"
                    >确认</el-button
                  >
                </div>
                <el-button type="text" slot="reference">删除</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination mt10">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="page"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
        >
        </el-pagination>
      </div>
    </div>
    <el-drawer
      title="详情"
      :visible.sync="drawer"
      :direction="direction"
      @closed="closedDrawer"
      :size="drawerSize + '%'"
    >
      <detail ref="detail" :id="id"></detail>
      <el-slider v-model="drawerSize" class="w100 slider" :min="40"></el-slider>
    </el-drawer>
  </div>
</template>

<script>
import api from "@/api/kk_power_admin";
import Navigator from "@/components/Navigator.vue";
import SelectRole from "@/components/SelectRole.vue";
import Detail from "./Admin/Detail.vue";
import { pageMixin } from "@/utils/pageMixin";
import { authMixin } from "@/utils/authMixin";
import config from "@/utils/config";
export default {
  mixins: [pageMixin, authMixin],
  components: {
    Navigator,
    SelectRole,
    Detail,
  },
  data() {
    return {
      // 详情
      id: "",
      drawer: false,
      drawerSize: 40,
      direction: "rtl",
      // 公共配置
      config,
      // 用户名
      userName: "",
      // 角色
      selectRoleId: "",
      // 禁用状态
      disabled: "",
      // 表头
      tableHead: [
        {
          label: "id",
          prop: "id",
          width: "200",
          align: "left",
          show: false,
        },
        {
          label: "用户名",
          prop: "userName",
          width: "auto",
          align: "left",
          show: true,
        },
        {
          label: "登录次数",
          prop: "loginCount",
          width: "80",
          align: "right",
          show: false,
        },
        {
          label: "锁定状态",
          prop: "errorCount",
          formatter: this.funcFormat,
          width: "80",
          align: "right",
          show: true,
        },
        {
          label: "管理员类型",
          prop: "userType",
          formatter: this.funcFormat,
          width: "100",
          align: "center",
          show: true,
        },
        {
          label: "禁用状态",
          prop: "disabled",
          formatter: this.funcFormat,
          width: "80",
          align: "center",
          show: true,
        },
        {
          label: "角色id",
          prop: "roleId",
          width: "100",
          align: "left",
          show: false,
        },
        {
          label: "角色",
          prop: "roleName",
          width: "100",
          align: "left",
          show: true,
        },
        {
          label: "创建人id",
          prop: "createdAdminId",
          width: "120",
          align: "left",
          show: false,
        },
        {
          label: "创建人",
          prop: "createdUserName",
          width: "120",
          align: "left",
          show: false,
        },
        {
          label: "创建时间",
          prop: "createdAt",
          formatter: this.funcFormatTime,
          width: "140",
          align: "center",
          show: false,
        },
        {
          label: "修改人id",
          prop: "updatedAdminId",
          width: "120",
          align: "left",
          show: false,
        },
        {
          label: "修改人",
          prop: "updatedUserName",
          width: "120",
          align: "left",
          show: false,
        },
        {
          label: "修改时间",
          prop: "updatedAt",
          formatter: this.funcFormatTime,
          width: "140",
          align: "left",
          show: false,
        },
        {
          label: "权限层级",
          prop: "powerLayer",
          width: "140",
          align: "left",
          show: false,
        },
      ],
      tableData: [],
      loading: true,
    };
  },
  methods: {
    // 关闭抽屉
    closedDrawer() {
      this.$refs.multipleTable.setCurrentRow();
      this.id = "";
    },
    // 角色选择
    handleSelectRole(obj) {
      this.selectRoleId = obj.value;
    },
    // 搜索事件
    handleSearch() {
      Promise.all([(this.page = 1)]).then(() => {
        this.loadInitData();
      });
    },
    // 清除事件
    handleClearCondition() {
      Promise.all([
        (this.userName = ""),
        (this.selectRoleId = ""),
        (this.$refs.selectRole.value = ""),
        (this.disabled = ""),
      ]).then(() => {
        this.handleSearch();
      });
    },
    // 导出
    handleExport() { },
    // 禁用与启用
    handleDisabling(scope) {
      api
        .disabling({
          id: scope.row.id,
          disabled: scope.row.disabled ? false : true,
        })
        .then((response) => {
          if (response && response.code === "200") {
            this.$message({
              message: `${scope.row.disabled ? "启用" : "禁用"}成功`,
              type: "success",
            });
            scope._self.$refs[`popover-disabled-${scope.$index}`].doClose();
            this.loadInitData();
          }
        });
    },
    handleUnlock(scope) {
      api.unLock({ id: scope.row.id }).then((response) => {
        if (response && response.code === "200") {
          this.$message({
            message: "解锁成功",
            type: "success",
          });
          scope._self.$refs[`popover-unlock-${scope.$index}`].doClose();
          this.loadInitData();
        }
      });
    },
    // 删除
    handleDelete(scope) {
      api.delete({ id: scope.row.id }).then((response) => {
        if (response && response.code === "200") {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          scope._self.$refs[`popover-delete-${scope.$index}`].doClose();
          this.loadInitData();
        }
      });
    },
    // 点击详情
    handleDetailClick(row) {
      Promise.all([(this.id = row.id), (this.drawer = true)]).then(() => {
        this.$refs.multipleTable.setCurrentRow(row);
        this.$refs.detail.detail();
      });
    },
    // 初始化数据
    loadInitData() {
      this.loading = true;
      api
        .get({
          userName: this.userName,
          disabled: this.disabled,
          roleId: this.selectRoleId,
          page: this.page,
          pageSize: this.pageSize,
        })
        .then((response) => {
          this.funcList(response);
          this.loading = false;
        });
    },
    funcFormat(row, column) {
      switch (column.property) {
        case "userType":
          return config.funcKeyValue(row.userType, "manageUserType");
        case "disabled":
          return config.funcKeyValue(row.disabled.toString(), "disabledStatus");
        case "errorCount":
          return row.errorCount > 5 ? "锁定" : "正常";
      }
    },
  },
  mounted() {
    this.loadInitData();
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
    padding: 0 15px;
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

<style lang="scss">
body {
  background-color: #f8f8f8;
}
</style>
