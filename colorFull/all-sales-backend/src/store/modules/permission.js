/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-11 15:31:57
 * @LastEditors: Please set LastEditors
 */
import { asyncRouterMap, constantRouterMap } from '@/config/router.config'
/**
 * 过滤账户是否拥有某一个权限，并将菜单从加载列表移除
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission (permissions, route) {
  if (route.meta && route.meta.permission) {
    let flag = false
    for (let i = 0, len = permissions.length; i < len; i++) {
      flag = route.meta.permission.includes(permissions[i].name)
      if (flag) {
        return true
      }
    }
    return false
  }
  return true
}

/**
 * 单账户多角色时，使用该方法可过滤角色不存在的菜单
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

function filterAsyncRouter (routerMap, permissions) {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(permissions, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, permissions)
        if (!route.children.length) {
          return false
        }
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = routers.concat(constantRouterMap)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const { permissions } = data
        const accessedRouters = filterAsyncRouter(asyncRouterMap, permissions)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}

export default permission
