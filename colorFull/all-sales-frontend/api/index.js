import request from '@/common/js/request.js'

const api = {}

// 获取微信授权码

api.wxauth = params => request.globalRequest('wxauth', 'POST', params, false)

// 获取地区编码列表
api.getRegionCodes = params => request.globalRequest('util/region-codes', 'GET', params, false)

// 注册获取验证码
api.getCaptcha = params => request.globalRequest('login-mobile-code', 'POST', params, false)

// 登录-获取oken
api.login = params => request.globalRequest('login', 'POST', params, false)

// 退出登录
api.logout = params => request.globalRequest('logout', 'POST', params, false)

// 获取已认证用户信息 
api.getUser = params => request.globalRequest('auth/user', 'GET', params, false)

// 置顶任务列表
api.topTask = params => request.globalRequest('top-tasks', 'GET', params, false)

// 任务列表
api.taskLists = params => request.globalRequest('tasks', 'GET', params, false)

// 任务详情
api.taskRecive = (id, params) => request.globalRequest('tasks/' + id, 'GET', params)

// 领取任务
api.accepts = params => request.globalRequest('accepts', 'POST', params)

// 已领取的任务
api.accepted = params => request.globalRequest('accepts', 'GET', params, false)

// 商品列表
api.goodsList = params => request.globalRequest('point-goods', 'GET', params, false)

// 商品详情
api.goodsDetail = (id, params) => request.globalRequest('point-goods/' + id, 'GET', params)

// 商品兑换说明
api.exchangeNotices = params => request.globalRequest('exchange-notices', 'GET', params, false)

// 兑换商品
api.exchanges = (params) => request.globalRequest('exchanges', 'POST', params)

//兑换记录
api.exchangesLogs = (params) => request.globalRequest('exchanges', 'GET', params, false)

// 收获地址列表
api.addressList = params => request.globalRequest('shipping-addresses', 'GET', params)

// 新增收货地址
api.addAddress = params => request.globalRequest('shipping-addresses', 'POST', params)

// 删除收货地址
api.delAddress = (id, params) => request.globalRequest('shipping-addresses/' + id, 'DELETE', params)

// 获取修改地址
api.editAddress = (id, params) => request.globalRequest('shipping-addresses/' + id + '/edit', 'GET', params)

// 保存修改
api.saveAddress = (id, params) => request.globalRequest('shipping-addresses/' + id, 'PUT', params)

// 个人排行
api.staffRank = params => request.globalRequest('staff-rank', 'GET', params)

// 部门排行
api.departmentRank = params => request.globalRequest('department-rank', 'GET', params)

export default api
