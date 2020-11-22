/*
 * @Description: In User Settings Edit
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-29 14:19:21
 * @LastEditors: Please set LastEditors
 */
// eslint-disable-next-line
import { UserLayout, BasicLayout, RouteView, BlankLayout, PageView } from '@/layouts'
import { dateBase, psermission, organization, task, goods, serve, integration } from '@/core/icons'

export const asyncRouterMap = [

  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    meta: { title: '首页', redirect: true },
    children: [
      // overview
      {
        path: '/overview',
        name: 'overview',
        redirect: '/overview/dashboard',
        component: RouteView,
        meta: { title: '数据中心', keepAlive: true, icon: dateBase, redirect: true },
        children: [
          {
            path: '/overview/dashboard',
            name: 'Dashboard',
            component: () => import('@/views/overview/Dashboard'),
            meta: { title: '数据总览', keepAlive: true, permission: [ 'overview-statistic', 'overview-trend' ] }
          },
          {
            path: '/overview/task-list',
            name: 'TaskList',
            component: () => import('@/views/task/TaskList'),
            meta: { title: '任务列表', keepAlive: true, permission: [ 'overview-task-list', 'overview-task-export' ] }
          },
          {
            path: '/overview/task-list/:id',
            name: 'TaskDetail',
            hidden: true,
            component: () => import('@/views/task/TaskDetail'),
            meta: { title: '任务详情', keepAlive: false, permission: [ 'overview-task-detail' ] }
          },
          {
            path: '/overview/rank',
            name: 'Rank',
            component: () => import('@/views/overview/Rank'),
            meta: { title: '任务排行', keepAlive: true, permission: [ 'overview-staff-rank', 'overview-department-rank' ] }
          }
        ]
      },

      // permissions
      {
        path: '/permissions',
        name: 'permissions',
        redirect: '/permissions/list',
        component: PageView,
        meta: { title: '权限管理', keepAlive: true, icon: psermission },
        children: [
          {
            path: '/permissions/list',
            name: 'List',
            component: () => import('@/views/permissions/List'),
            meta: { title: '管理员列表', keepAlive: false, permission: [ 'detail-admin', 'create-admin', 'update-admin', 'delete-admin', 'list-admin' ] }
          }
        ]
      },

      // organization
      {
        path: '/organization',
        name: 'organization',
        component: PageView,
        meta: { title: '组织架构', keepAlive: true, icon: organization, redirect: true },
        children: [
          {
            path: '/organization/department',
            name: 'Department',
            component: () => import('@/views/organization/Department'),
            meta: { title: '部门管理', keepAlive: false, permission: [ 'detail-department', 'create-department', 'update-department', 'delete-department', 'list-department' ] }
          },
          {
            path: '/organization/members',
            name: 'Members',
            component: () => import('@/views/organization/Members'),
            meta: { title: '成员管理', keepAlive: false, permission: [ 'detail-staff', 'create-staff', 'update-staff', 'delete-staff', 'export-staff', 'import-staff' ] }
          }
        ]
      },

      // task
      {
        path: '/task',
        name: 'task',
        redirect: '/task/task-manage-list',
        component: PageView,
        meta: { title: '任务管理', keepAlive: true, icon: task, redirect: true },
        children: [
          {
            path: '/task/task-manage-list',
            name: 'TaskManageList',
            component: () => import('@/views/task/TaskManageList'),
            meta: { title: '任务列表', keepAlive: false, permission: [ 'list-task', 'update-task', 'delete-task', 'detail-task' ] }
          },
          {
            path: '/task/create-task',
            name: 'CreateTask',
            component: () => import('@/views/task/CreateTask'),
            meta: { title: '创建任务', keepAlive: false, permission: [ 'create-task' ] }
          }
        ]
      },

      // goods
      {
        path: '/goods',
        name: 'Goods',
        redirect: '/goods/goods-list',
        component: PageView,
        meta: { title: '积分商城', keepAlive: true, icon: goods, redirect: true },
        children: [
          {
            path: '/goods/goods-list',
            name: 'GoodsList',
            component: () => import('@/views/goods/GoodsList'),
            meta: { title: '商品列表', keepAlive: false, permission: [ 'list-goods', 'detail-goods', 'create-goods', 'update-goods', 'delete-goods', 'update-exchange-notice' ] }
          },
          {
            path: '/goods/goods-record',
            name: 'GoodsRecord',
            component: () => import('@/views/goods/GoodsRecord'),
            meta: { title: '兑换记录', keepAlive: false, permission: [ 'goods-exchange-confirm', 'list-goods-exchange', 'detail-goods-exchange' ] }
          },
          {
            path: '/goods/goods-add',
            name: 'GoodsAdd',
            hidden: true,
            component: () => import('@/views/goods/GoodsAdd'),
            meta: { title: '添加商品', keepAlive: false, permission: [ 'create-goods', 'export-goods-code' ] }
          },
          {
            path: '/goods/goods-list/:id',
            name: 'GoodsDetail',
            hidden: true,
            component: () => import('@/views/goods/GoodsDetail'),
            meta: { title: '商品管理', keepAlive: false, permission: [ 'update-goods', 'delete-goods', 'export-goods-code' ] }
          }

        ]
      },

      // service
      {
        path: '/service',
        name: 'Service',
        redirect: '/service/menu',
        component: PageView,
        meta: { title: '服务号维护', keepAlive: true, icon: serve, redirect: true },
        children: [
          {
            path: '/service/menu-list',
            name: 'Menu',
            component: () => import('@/views/service/Menu'),
            meta: { title: '菜单维护', keepAlive: false, permission: ['wechat-menu-get'] }
          },
          {
            path: '/service/message',
            name: 'Message',
            component: () => import('@/views/service/Message'),
            meta: { title: '消息维护', keepAlive: false, permission: ['wechat-reply-get'] }
          },
          {
            path: '/service/template-message',
            name: 'TemplateMessageList',
            component: () => import('@/views/service/TemplateMessageList'),
            meta: { title: '模板消息维护', keepAlive: false, permission: ['wechat-template-message-index'] }
          }
        ]
      },

      // integration
      {
        path: '/integration',
        name: 'integration',
        redirect: '/integration/approval-menu',
        component: RouteView,
        meta: { title: '积分管理', keepAlive: true, icon: integration, redirect: true },
        children: [
          {
            path: '/integration/approval-menu',
            name: 'Approval',
            component: () => import('@/views/integration/Approval'),
            meta: { title: '积分审批', keepAlive: true, permission: [ 'list-point-account-log', 'detail-point-account-log', 'detail-point-apply-approve', 'point-account-points-add', 'point-account-points-sub', 'point-apply-approve-pass', 'point-apply-approve-refuse', 'update-point-account', 'detail-point-account', 'list-point-apply-approve', 'detail-point-apply-approve' ] }
          },
          {
            path: '/integration/apply-menu',
            name: 'Apply',
            component: () => import('@/views/integration/Apply'),
            meta: { title: '积分账户', keepAlive: true, permission: ['list-mine-point-log', 'detail-mine-point-log', 'detail-point-apply', 'create-point-apply', 'update-point-apply', 'delete-point-apply', 'list-point-apply'] }
          },
          {
            path: '/integration/approval-menu/:id',
            name: 'ApplyDetail',
            hidden: true,
            component: () => import('@/views/integration/ApplyDetail'),
            meta: { title: '积分详情', keepAlive: true, permission: ['detail-point-account-log'] }
          }
        ]
      }
    ]
  },
  {
    path: '*', redirect: '/404', hidden: true
  }
]

/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: '/user/login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login')
      }
    ]
  },

  {
    path: '/404',
    component: () => import(/* webpackChunkName: "fail" */ '@/views/exception/404')
  }
]
