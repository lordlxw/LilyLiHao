import copy from 'clipboard-copy'
import moment from 'moment'
import { mapGetters } from 'vuex'
export const pageMixin = {
  data() {
    return {
      /* 分页参数 */
      pageNum: 1,
      pageSize: 10,
      totalCount: 0,
    }
  },
  created() {
  },
  computed: {
    ...mapGetters({
      menus_ids: 'getMenus',
      roleId: 'getRoleId',
      userInfo: 'getUserInfo'
    })
  },
  methods: {
    setAuth(permis) {
      return this.userInfo && ((this.userInfo.permissions && this.userInfo.permissions[0] === "*:*:*") || this.userInfo.permissions.indexOf(permis) !== -1)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    handleSizeChange(val) {
      Promise.all([
        this.pageSize = val
      ]).then(() => {
        this.loadInitData()
      })
    },
    handleCurrentChange(val) {
      Promise.all([
        this.pageNum = val
      ]).then(() => {
        this.loadInitData()
      })
    },
    // 分页列表
    funcList(response) {
      if (response && response.code === 200 && response.rows) {
        if (response.rows) {
          this.tableData = response.rows
        } else {
          this.tableData = []
        }
        if (response.total) {
          this.totalCount = response.total
        } else {
          this.totalCount = 0
        }
      } else {
        this.totalCount = 0
        this.tableData = []
      }
    },
    handleEdit(row, url) {
      this.$store.commit('SET_URLPARAMS', row)
      this.$router.push(url)
    },
    // 时间格式化
    funcFormatTime(row, column) {
      switch (column.property) {
        // 交割时间
        case 'deliveryTime':
          if (row.deliveryTime) {
            return moment(row.deliveryTime).format('YYYY-MM-DD')
          }
          break
        case 'login_time':
          if (row.login_time) {
            return moment.unix(row.login_time).format('YYYY-MM-DD HH:mm:ss')
          }
          break
        case 'start_sell_date':
          if (row.start_sell_date) {
            return moment.unix(row.start_sell_date).format('YYYY-MM-DD HH:mm:ss')
          }
          break
        case 'pay_time':
          if (row.pay_time) {
            return moment.unix(row.pay_time).format('YYYY-MM-DD HH:mm:ss');
          }
          break
        case 'change_time':
          if (row.change_time) {
            return moment.unix(row.change_time).format('YYYY-MM-DD HH:mm:ss');
          }
          break
        case 'start_time':
          if (row.start_time) {
            return moment.unix(row.start_time).format('YYYY-MM-DD HH:mm:ss');
          }
          break
        case 'end_time':
          if (row.end_time) {
            return moment.unix(row.end_time).format('YYYY-MM-DD HH:mm:ss');
          }
          break
        case 'update_time':
          if (row.update_time) {
            return moment.unix(row.update_time).format('YYYY-MM-DD HH:mm:ss');
          }
          break
        case 'receive_time':
          if (row.receive_time) {
            return moment.unix(row.receive_time).format('YYYY-MM-DD HH:mm:ss');
          }
          break
      }
    },
    typeIndex(index) {
      return (this.pageNum - 1) * this.pageSize + index + 1
    },
    funcZtranStatusFormatter(row) {
      switch (row.ztran_status) {
        case 'W':
          return '处理中'
        case 'Y':
          return '已处理'
        case 'N':
          return '失败'
      }
    },
    // 复制内容
    copyContent(content, flag) {
      try {
        copy(content);
        if (flag) {
          this.$message({
            message: '复制成功',
            type: 'success'
          })
        }
      } catch (error) {
        this.$message({
          message: '复制失败',
          type: 'warning'
        })
      }
    },
    handleNavigator(val1, val2, val3) {
      const params = {
        val1,
        val2,
        val3
      }
      this.$store.commit('SET_NAVIGATOR', params)
    },
    convertEmptyToNull(data) {
      let result = {}
      if (typeof data === 'object') {
        Object.entries(data).forEach(([key, val]) => {
          if (val !== "") {
            result[key] = val
          }
        })
      }
      return result
    },
    // 关闭popover弹框
    handlePopoverClose(scope, ref) {
      if (!scope._self.$refs[ref].doClose()) {
        document.body.click()
      }
    }
  }
}
