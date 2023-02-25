<!--用户管理-->
<template>
  <div class="content">
    <!-- <div class="filter-condition">
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
        <el-button type="primary" @click="handleExport">导出</el-button>
      </div>
      <div class="clearboth"></div>
    </div> -->
    <div class="list">
      <div class="do">
        <router-link to="/power/admin/add">
          <el-button type="default">添加</el-button>
        </router-link>
        <div class="pagination mt10">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNum"
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
              <el-popover
                placement="bottom-end"
                :ref="`popover-disabled-${scope.$index}`"
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
                  scope.row.status === "1" ? "启用" : "禁用"
                }}</el-button>
              </el-popover>
              <el-button
                type="text"
                @click="handleEdit(scope.row, '/power/admin/edit')"
                >编辑</el-button
              >
              <el-popover
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
import { pageMixin } from "@/utils/pageMixin";
import { authMixin } from "@/utils/authMixin";
import config from "@/utils/config";
export default {
  mixins: [pageMixin, authMixin],
  data() {
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
        { label: "创建时间", prop: "createTime", width: "140", align: "left", show: true }
      ],
      tableData: [],
      loading: true,
    };
  },
  methods: {
    // 禁用与启用
    handleDisabling(scope) {
      api.updateStatus({
        userId: scope.row.userId,
        status: scope.row.status === '1' ? '0' : '1',
      }).then((response) => {
        if (response && response.code === "00000") {
          this.$message({
            message: `${scope.row.status === 0 ? "启用" : "禁用"}成功`,
            type: "success",
          });
          scope._self.$refs[`popover-disabled-${scope.$index}`].doClose();
          this.loadInitData();
        }
      });
    },
    // 删除
    handleDelete(scope) {
      api.delete({ userIds: scope.row.userId }).then((response) => {
        if (response && response.code === "00000") {
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
