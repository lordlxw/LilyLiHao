<!--角色管理-->
<template>
  <div class="content">
    <navigator></navigator>
    <div class="filter-condition">
      <div class="item mr30">
        <label>角色名</label>
        <el-input
          v-model="roleName"
          placeholder="请输入角色名"
          clearable
          style="width: 200px"
        ></el-input>
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
        <router-link to="/power/role/add" v-if="authValid('role:insert')">
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
            width="140"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="authValid('rolemenu:edit')"
                @click="handleEdit(scope.row, '/power/role/rolemenu')"
                >授权</el-button
              >
              <el-button
                type="text"
                v-if="authValid('role:update')"
                @click="handleEdit(scope.row, '/power/role/edit')"
                >编辑</el-button
              >
              <el-popover
                v-if="authValid('role:delete')"
                placement="bottom-end"
                :ref="`popover-delete-${scope.$index}`"
              >
                <p>
                  确认要<span class="color-red">删除</span>“<span
                    class="color-main"
                    >{{ scope.row.roleName }}</span
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
                <el-button type="text" slot="reference" class="ml10"
                  >删除</el-button
                >
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
  </div>
</template>

<script>
import api from "@/api/kk_power_role";
import { pageMixin } from "@/utils/pageMixin";
import { authMixin } from "@/utils/authMixin";
export default {
  mixins: [pageMixin, authMixin],
  data() {
    return {
      // 角色名
      roleName: "",
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
          label: "角色名",
          prop: "roleName",
          width: "auto",
          align: "left",
          show: true,
        },
        {
          label: "创建人",
          prop: "createdUserName",
          width: "120",
          align: "left",
          show: true,
        },
        {
          label: "创建时间",
          prop: "createdAt",
          formatter: this.funcFormatTime,
          width: "140",
          align: "center",
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
          label: "修改人",
          prop: "updatedUserName",
          width: "120",
          align: "left",
          show: true,
        },
        {
          label: "修改时间",
          prop: "updatedAt",
          formatter: this.funcFormatTime,
          width: "140",
          align: "left",
          show: true,
        },
        {
          label: "修改人id",
          prop: "updatedAdminId",
          width: "120",
          align: "left",
          show: false,
        },
      ],
      tableData: [],
      loading: true,
    };
  },
  methods: {
    // 搜索事件
    handleSearch() {
      Promise.all([(this.page = 1)]).then(() => {
        this.loadInitData();
      });
    },
    // 清除事件
    handleClearCondition() {
      Promise.all([(this.roleName = "")]).then(() => {
        this.handleSearch();
      });
    },
    // 导出
    handleExport() {},
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
    // 初始化数据
    loadInitData() {
      this.loading = true;
      api
        .get({
          roleName: this.roleName,
          page: this.page,
          pageSize: this.pageSize,
        })
        .then((response) => {
          this.funcList(response);
          this.loading = false;
        });
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
