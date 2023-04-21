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
    '9': '待确认',
    '19': '待确认', // 难成待确认
  },
  // 交易单
  bondStatus: {
    '0': '未交割',
    '1': '已交割',
    '2': '口头违约',
    '3': '技术违约',
    '4': '恶意违约',
    '5': '违约垫付', // 包含做市商垫付的技术违约
    '6': '待确认', // 口头违约待确认
    '7': '违约续作'
  },
  // 平仓状态
  bondsCommonStatus: {
    '10': '待确认', // 交易单待确认
    '11': '待平仓', // 交易单待平仓
    '12': '已平仓', // 交易单已平仓
    '13': '已作废', // 作废
    '16': '修改中', // 已平修改中
    '17': '修改中', // 未平修改中
  },
  // 角色名称未平仓展开收起配置
  externalRoleName: ['交易员', '交割员'],
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
  // 违约类型
  breakTypeOptions: {
    '1': '对手方违约',
    '2': '做市商违约',
    '3': '我方违约'
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
    // money: /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,4})?$/,
    money: /^([0](\.\d{1,4}))$|^([1-9][0-9]*(\.\d{1,4})?)$/,
    // 浮动价
    floatPrice: /^([0](\.\d{1,2}))$|^([1-9][0-9]*(\.\d{1,2})?)$/,
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
  },
  // 询价单头
  enquiryHead: {
    // 询价排列显示： 债券代码 交易方向 询价 询面额 交割日期 其他排后
    createBy: { label: '研究员id', prop: 'createBy', width: 'auto', align: 'left', show: false },
    userId: { label: '交易员id', prop: 'userId', width: '120', align: 'left', show: false },
    userTradeId: { label: '交易id', prop: 'userTradeId', width: '120', align: 'left', show: false },
    createTime: { label: '询价时间', prop: 'createTime', width: '170', align: 'left', show: true },
    price: { label: '询价', prop: 'price', width: '90', align: 'right', show: true },
    worstPrice: { label: '允许最差价格', prop: 'worstPrice', width: '110', align: 'right', show: true },
    realPrice: { label: '成交价', prop: 'realPrice', width: '120', align: 'right', show: true },
    volume: { label: '询量', prop: 'volume', width: '100', align: 'right', show: true },
    restVolume: { label: '剩余询量', prop: 'restVolume', width: '100', align: 'left', show: true },
    realVolume: { label: '成交额', prop: 'realVolume', width: '100', align: 'right', show: true },
    deliveryTime: { label: '询价交割', prop: 'deliveryTime', width: '120', align: 'left', show: true },
    realDeliveryTime: { label: '成交交割', prop: 'realDeliveryTime', width: '120', align: 'left', show: true },
    tscode: { label: '券码', prop: 'tscode', width: '130', align: 'left', show: true },
    direction: { label: '方向', prop: 'direction', width: '80', align: 'left', show: true },
    status: { label: '状态', prop: 'status', width: '90', align: 'left', show: true },
    remark: { label: '备注', prop: 'remark', width: '500', align: 'left', show: true },
    tradeNum: { label: '单据号', prop: 'tradeNum', width: '160', align: 'left', show: true },
    deliverySpeed: { label: '交割速度', prop: 'deliverySpeed', width: '90', align: 'left', show: false },
    createuser: { label: '研究员', prop: 'createuser', width: '160', align: 'left', show: true },
    forward: { label: '是否远期', prop: 'forward', width: '120', align: 'left', show: false },
    parentId: { label: '相关单号', prop: 'parentId', width: '140', align: 'left', show: false },
    updateBy: { label: '修改人', prop: 'updateBy', width: '120', align: 'left', show: true },
    updateTime: { label: '修改时间', prop: 'updateTime', width: '170', align: 'left', show: true },
    tradeTime: { label: '成交时间', prop: 'tradeTime', width: '190', align: 'left', show: true },
    tradeuser: { label: '交易员', prop: 'tradeuser', width: '120', align: 'left', show: true }
    // 询价成交重要排序：成交价格  成交面额 成交交割日期  交易对手 联系方式
  },
  // 未平仓，已平表头
  bondsHead: {
    createBy: { label: '研究员id', prop: 'createBy', width: 'auto', align: 'left', show: false },
    tscode: { label: '券码', prop: 'tscode', formatter: this.funcFormat, width: '130', align: 'left', show: true },
    direction: { label: '方向', prop: 'direction', formatter: this.funcFormat, width: '60', align: 'left', show: true },
    price: { label: '成交价', prop: 'price', formatter: this.funcFormat, width: '120', align: 'right', show: true },
    volume: { label: '持仓量', prop: 'volume', width: '100', align: 'right', show: true },
    restVolume: { label: '待平量', prop: 'restVolume', width: '100', align: 'right', show: true },
    deliverySpeed: { label: '交割速度', prop: 'deliverySpeed', width: '90', align: 'left', show: false },
    deliveryTime: { label: '交割日期', prop: 'deliveryTime', formatter: this.funcFormat, width: '120', align: 'left', show: true },
    floatProfit: { label: '浮动盈亏', prop: 'floatProfit', width: '100', align: 'right', show: true },
    profit: { label: '已平盈亏', prop: 'profit', width: '100', align: 'right', show: true },
    realTradeId: { label: '交易员id', prop: 'realTradeId', width: '120', align: 'left', show: false },
    remark: { label: '备注', prop: 'remark', width: '500', align: 'left', show: true },
    tradeNum: { label: '单据号', prop: 'tradeNum', width: '160', align: 'left', show: true },
    tradeuser: { label: '交易员', prop: 'tradeuser', width: '120', align: 'left', show: true },
    // userTradeId: { label: '交易id', prop: 'userTradeId', width: '120', align: 'left', show: false },
    // xunjiayuanId: { label: '交易员id', prop: 'xunjiayuanId', width: '120', align: 'left', show: false },
    // xunjiayuanName: { label: '研究员', prop: 'xunjiayuanName', width: '120', align: 'left', show: true },
    createTime: { label: '成交时间', prop: 'createTime', width: '170', align: 'left', show: true },
    counterParty: { label: '交易对手', prop: 'counterParty', width: '90', align: 'left', show: true },
    contactPerson: { label: '联系人', prop: 'contactPerson', width: '120', align: 'left', show: true },
    contactType: { label: '联系方式', prop: 'contactType', width: '110', align: 'left', show: true },
    jiaogeStatus: { label: '交割状态', prop: 'jiaogeStatus', width: '100', align: 'left', show: true },
    status: { label: '平仓状态', prop: 'status', width: '100', align: 'left', show: true }
  }
}
