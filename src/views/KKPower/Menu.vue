<!--菜单管理-->
<template>
  <div class="content">
    <div class="list mt20 mb20">
      <div class="do">
        <el-button
          v-if="setAuth('system:menu:add')"
          @click="handleEdit({ id: 0, name: '顶级菜单' }, '/power/menu/add')"
          >添加顶级菜单</el-button
        >
      </div>
      <div class="table mt10">
        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          max-height="600"
          border
          row-key="menuId"
          @selection-change="handleSelectionChange"
          default-expand-all
          :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        >
          <el-table-column
            fixed="left"
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
          <el-table-column label="图标" width="90" align="center">
            <template slot-scope="scope">
              <i :class="scope.row.icon"></i>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <el-button
                v-if="setAuth('system:menu:add')"
                type="text"
                :disabled="scope.row.type === 2"
                @click="handleEdit(scope.row, '/power/menu/add')"
                >添加子菜单</el-button
              >
              <el-button
                v-if="setAuth('system:menu:edit')"
                type="text"
                @click="handleEdit(scope.row, '/power/menu/edit')"
                >修改</el-button
              >
              <el-popover
                v-if="setAuth('system:menu:remove')"
                placement="bottom-end"
                :ref="`popover-delete-${scope.$index}`"
              >
                <p>
                  确认<span class="color-red">删除</span>“<span
                    class="color-main"
                    >{{ scope.row.menuName }}</span
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
import config from "@/utils/config";
import api from "@/api/kk_power_menu";
import { pageMixin } from "@/utils/pageMixin";
import { authMixin } from "@/utils/authMixin";
export default {
  mixins: [pageMixin, authMixin],
  data() {
    /* 条件筛选 */
    /* 弹窗 */
    /* 表单及验证 */
    /* 表格 */
    /* 分页参数 */
    /* 已选择 */
    return {
      config,
      // 表头
      tableHead: [
        { label: "menuId", prop: "menuId", width: "200", align: "left", show: false },
        { label: "父级id", prop: "parentId", width: "200", align: "left", show: false },
        { label: "名称", prop: "menuName", width: "auto", align: "left", show: true },
        { label: "图标class", prop: "icon", width: "120", align: "left", show: false },
        { label: "链接地址", prop: "component", width: "200", align: "left", show: true },
        { label: "功能码", prop: "perms", width: "150", align: "left", show: true },
        { label: "类型", prop: "menuType", formatter: this.funcFormat, width: "80", align: "center", show: true },
        { label: "排序", prop: "orderNum", width: "80", align: "right", show: true }
      ],
      tableData: [],
      loading: true,
    };
  },
  methods: {
    // 初始化数据
    loadInitData() {
      this.loading = true;
      api.get().then((response) => {
        if (response && response.code === "00000" && response.value) {
          this.tableData = response.value;
        } else {
          this.tableData = [];
        }
        this.loading = false;
      });
    },
    // 删除
    handleDelete(scope) {
      api.delete({ menuId: scope.row.menuId }).then((response) => {
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
    },
    funcFormat(row, column) {
      switch (column.property) {
        case "menuType":
          return config.funcKeyValue(row.menuType, "menuFunType");
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
  .list {
    padding: 0 15px;
    .do {
      .el-button {
        margin-top: 10px;
      }
    }
  }
}
</style>
