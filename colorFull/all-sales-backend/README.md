<!--
 * @Description: In User Settings Edit
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-21 11:10:17
 * @LastEditors: Please set LastEditors
 -->

### 全员营销后台

### Env and dependencies

- node
- yarn
- webpack
- eslint
- @vue/cli ~3
- [ant-design-vue](https://github.com/vueComponent/ant-design-vue) - Ant Design Of Vue
- [vue-cropper](https://github.com/xyxiao001/vue-cropper) - Picture edit
- [@antv/g2](https://antv.alipay.com/zh-cn/index.html) - AntV G2
- [Viser-vue](https://viserjs.github.io/docs.html#/viser/guide/installation) - Antv/G2 of Vue

### Project setup

- Clone repo

```bash
git clone https://114.55.170.46:4480/node/all-sales-backend.git
cd all-sales-backend
```

- Install dependencies

```
yarn install
```

- Compiles and hot-reloads for development

```
yarn run serve
```

- Compiles and minifies for production

```
yarn run build
```

### 项目目录结构

```
- 用户登陆 /login
- 数据总览 /overview
  - 流量分析 /overview/traffic
  - 任务数据 /overview/task
  - 全员数据 /overview/full
  - 积分数据 /overview/integration
- 权限管理 /permissions
  - 管理员列表 /permissions/list
- 组织架构 /organization
  - 部门管理 /organization/department
  - 成员管理 /organization/members
- 任务管理 /task
  - 任务列表 /task/list
- 积分商城 /goods
  - 商品列表 /goods/goods-list
  - 兑换记录 /goods/goods-record
- 服务号管理
  - 菜单栏管理
  - 消息管理
  - 模板消息管理
- 积分管理 /integration
  - 超级管理员积分审批 /integration/approval
  - 部门管理员积分申请 /integration/apply
```

test
