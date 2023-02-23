<!-- 询价单 -->
<template>
  <div class="content">
    <div class="filter-condition"></div>
    <div class="list">
      <div class="do">
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
        >
          <el-table-column type="selection" width="40"> </el-table-column>
          <el-table-column
            fixed
            type="index"
            :index="typeIndex"
            label="序号"
            align="center"
            width="100"
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
          <el-table-column fixed="right" align="center" label="操作" width="80">
            <template slot-scope="scope">
              <el-button
                @click="handleDetailClick(scope.row)"
                type="text"
                size="small"
                >详情</el-button
              >
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
import api from "@/api/kk_trade";
import { pageMixin } from '@/utils/pageMixin'
import { animationMixin } from '@/utils/animationMixin'
export default {
  mixins: [animationMixin, pageMixin],
  data() {
    return {
      loading: false,
      // 表头
      tableHead: [
        { label: '研究员', prop: 'createBy', width: 'auto', align: 'left', show: true },
        { label: '询价时间', prop: 'createTime', width: '140', align: 'right', show: true },
        { label: '交割速度', prop: 'deliverySpeed', width: '120', align: 'left', show: true },
        { label: '交割时间', prop: 'deliveryTime', width: '120', align: 'left', show: true },
        { label: '交易方向', prop: 'direction', width: '120', align: 'left', show: true },
        { label: '是否远期', prop: 'forward', width: '120', align: 'left', show: true },
        { label: '相关单号', prop: 'parentId', width: '140', align: 'left', show: true },
        { label: '询价', prop: 'price', width: '120', align: 'left', show: true },
        { label: '备注', prop: 'remark', width: '120', align: 'left', show: true },
        { label: '状态', prop: 'status', width: '120', align: 'left', show: true },
        { label: '已成交', prop: 'tradeNum', width: '120', align: 'left', show: true },
        { label: '债券代码', prop: 'tscode', width: '120', align: 'left', show: true },
        { label: '修改人', prop: 'updateBy', width: '120', align: 'left', show: true },
        { label: '修改时间', prop: 'updateTime', width: '120', align: 'left', show: true },
        { label: '交易员', prop: 'userId', width: '120', align: 'left', show: true },
        { label: '交易员', prop: 'userTradeId', width: '120', align: 'left', show: true },
        { label: '询面额', prop: 'volume', width: '120', align: 'left', show: true }
      ],
      tableData: []
    }
  },
  methods: {
    // 搜索事件
    handleSearch() {
      Promise.all([
        this.page = 1
      ]).then(() => {
        this.loadInitData()
      })
    },
    // 清除事件
    handleClearCondition() {
      Promise.all([

      ]).then(() => {
        this.handleSearch()
      })
    },
    // 导出
    handleExport() {
    },
    // 点击详情
    handleDetailClick(row) {

    },
    // 初始化数据
    loadInitData() {
      this.loading = true;
      api.inquiryQuery({}).then((response) => {
        if (response && response.code === '00000' && response.value) {
          this.tableData = response.value;
        } else {
          this.tableData = [];
        }
        this.loading = false;
      });
    },
  },
  mounted() {
    this.loadInitData()
  }
}
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
  }
  .copy-tooltip {
    visibility: hidden;
  }
  .copy:hover {
    .copy-tooltip {
      visibility: visible;
    }
  }
  .pagination {
    float: right;
  }
  .my-el-row .el-col {
    padding: 5px 0;
  }
  .my-el-row .el-col:nth-child(odd) {
    text-align: right;
    font-size: 14px;
    color: #999999;
  }
  .my-el-row .el-col:nth-child(even) {
    font-size: 14px;
    word-break: break-all;
  }
}
</style>
