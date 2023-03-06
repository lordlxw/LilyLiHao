export default {
  // key
  keys: {
    'tokenKey': 'token',
    'roleIdKey': 'roleId',
    'menusKey': 'menus',
    'loginNameKey': 'loginName',
    'navigatorKey': 'navigator',
    'navigatorIdKey': 'navigatorId',
    'routersKey': 'routers',
    'urlParams': 'urlParams',
    'currentTscode': 'currentTscode',
    'defaultSet': 'defaultSet',
    'userInfo': 'userInfo'
  },
  // 菜单功能类型
  menuFunType: {
    'M': '菜单',
    'C': '叶节点',
    'F': '功能',
  },
  // 数据权限
  dataScopeType: {
    '1': '查看所有',
    '2': '查看自己',
    '3': '查看委派'
  },
  // 询价单状态 '7': '撤单待确认','9': '成交待确认'
  inquiryStatus: {
    '0': '待接收',
    '1': '已接收',
    '2': '已拒收',
    '3': '已成交',
    '4': '部分成交',
    '5': '已撤单',
    '6': '部分撤单',
    '7': '待确认',
    '8': '已拒撤',
    '9': '待确认'
  },
  // 交易方向
  directionMeta: {
    'bond_0': '买入',
    'bond_1': '卖出'
  },
  // 用户状态
  userStatus: {
    '0': '正常',
    '1': '已禁用'
  },
  // 处理键值对信息转换
  funcKeyValue(key, type) {
    return this[`${type}`][`${key}`]
  },
  // 正则
  regExpSet: {
    // 11位手机号
    mobile: /^1[0-9]{10}$/,
    // 钱
    money: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,4})?$/,
    // 日期时间
    dtime: /^(\d+)-(\d{ 1,2 })-(\d{ 1,2 }) (\d{ 1,2 }):(\d{ 1,2 }):(\d{ 1,2 })$/,
    // 时分
    hourminute: /^(20|21|22|23|[0-1]\d):[0-5]\d$/,
    // 非零正整数
    gtzero: /^\+?[1-9][0-9]*$/,
    // 非负整数
    gtorzero: /^\+?[0-9][0-9]*$/,
    // 版本号
    version: /^([1-9]\d|[1-9])(.([1-9]\d|\d)){2}$/
  }
}
