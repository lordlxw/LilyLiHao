<!--角色管理-->
<template>
  <div class="content">
    <div class="list">
      <div class="do">
        <router-link v-if="setAuth('system:role:add')" to="/power/role/add">
          <el-button type="default">添加</el-button>
        </router-link>
      </div>
      <div class="table mt10">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          :height="tableHeight"
          style="width: 100%"
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
                  : (row, column, cellValue, index) => {
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
              <!-- <el-button
                type="text"
                @click="handleEdit(scope.row, '/power/role/rolemenu')"
                >授权</el-button
              > -->
              <el-button
                v-if="setAuth('system:role:edit')"
                type="text"
                @click="handleEdit(scope.row, '/power/role/edit')"
                >修改</el-button
              >
              <el-popover
                v-if="setAuth('system:role:remove')"
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
                      handlePopoverClose(
                        scope,
                        `popover-delete-${scope.$index}`
                      )
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
    </div>
  </div>
</template>

<script>
import api from "@/api/kk_power_role";
import { pageMixin } from "@/utils/pageMixin";
import { authMixin } from "@/utils/authMixin";
import { commMixin } from '@/utils/commMixin'
import { debounce } from '@/utils/debounce'
export default {
  mixins: [pageMixin, authMixin, commMixin],
  data() {
    return {
      // 角色名
      roleName: "",
      // 表头
      tableHead: [
        { label: "roleId", prop: "roleId", width: "200", align: "left", show: false },
        { label: "角色名", prop: "roleName", width: "auto", align: "left", show: true },
        { label: "角色关键字", prop: "roleKey", width: "120", align: "left", show: true },
        { label: "数据权限", prop: "dataScope", width: "120", align: "left", show: true }
      ],
      tableData: [],
      loading: true,
      tableHeight: 0
    };
  },
  created() {
    this.initFrameH('tableHeight', 120)
  },
  methods: {
    // 删除
    handleDelete: debounce(function (scope) {
      api.delete({ roleIds: scope.row.roleId }).then((response) => {
        if (response && response.code === "00000") {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.handlePopoverClose(
            scope,
            `popover-delete-${scope.$index}`
          )
          this.loadInitData();
        }
      });
    }),
    // 初始化数据
    loadInitData() {
      this.loading = true;
      api.get().then((response) => {
        if (response && response.code === 200 && response.rows) {
          this.tableData = response.rows;
        } else {
          this.tableData = [];
        }
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
  height: 100%;
  background-color: $body-main-box;

  .list {
    padding: 10px;
    height: calc(100% - 50px);

    .el-table {
      border-radius: 3px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    }

    .do {
      height: 50px;
      line-height: 50px;
      background-color: #fff;
      border-radius: 3px;
      padding: 0 10px;
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
