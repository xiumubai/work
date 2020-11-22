/*
 * @Description: In User Settings Edit
 * @Author: Jian-li Guo
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-23 19:32:56
 * @LastEditors: Please set LastEditors
 */
// import Vue from 'vue'
import router from './router'
import store from './store'

import NProgress from 'nprogress' // progress bar
import '@/components/NProgress/nprogress.less' // progress bar custom style
import {
  setDocumentTitle,
  domTitle
} from '@/utils/domUtil'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['login'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  to.meta && (typeof to.meta.title !== 'undefined' && setDocumentTitle(`${to.meta.title} - ${domTitle}`))
  const authorized = store.getters.authorized
  if (authorized) {
    // has token
    if (store.getters.permissions.length === 0) {
      store
        .dispatch('GetInfo')
        .then(res => {
          const permissions = res.permissions
          store.dispatch('GenerateRoutes', { permissions }).then(() => {
            // 动态添加可访问路由表
            router.addRoutes(store.getters.addRouters)

            const redirect = decodeURIComponent(from.query.redirect || to.path)
            const defaultRoute = findDefaultRoute(store.getters.addRouters)
            if (to.path === '/user/login' || to.path === '/') {
              next({ path: defaultRoute.path })
              NProgress.done()
            } else if (to.path === redirect) {
              // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              next({ ...to, replace: true })
            } else {
              // 跳转到目的路由
              next({ path: redirect })
              NProgress.done()
            }
          })
        })
    } else if (to.path === '/user/login' || to.path === '/') {
      const defaultRoute = findDefaultRoute(store.getters.addRouters)
      next({ path: defaultRoute.path })
      NProgress.done()
    } else {
      next()
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

/**
 *  查找默认路由
 * @param { Array < RouteConfig > } routes
 */
function findDefaultRoute (routes) {
  const first = routes[0]
  if (first.meta && first.meta.redirect && first.children) {
    return findDefaultRoute(first.children)
  } else {
    return first
  }
}
