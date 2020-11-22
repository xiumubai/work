/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-29 17:35:16
 * @LastEditors: Please set LastEditors
 */
import axios from 'axios'
import store from '@/store'
import notification from 'ant-design-vue/es/notification'
import { VueAxios } from './axios'

const BASE_URL = process.env.VUE_APP_API_BASE_URL
const service = axios.create({
  baseURL: BASE_URL
})

// 是否有请求正在刷新token
window.isRefreshing = false
// 被挂起的请求数组
let refreshSubscribers = []

// push所有请求到数组中
function subscribeTokenRefresh (cb) {
  refreshSubscribers.push(cb)
}

// 刷新请求（refreshSubscribers数组中的请求得到新的token之后会自执行，用新的token去请求数据）
function onRrefreshed (token) {
  refreshSubscribers.map(cb => cb(token))
}

const err = (error) => {
  if (error.response) {
    const data = error.response.data
    if (error.response.status === 403) {
      notification.error({
        message: '错误',
        description: data.message
      })
    }
  }
  return Promise.reject(error)
}

service.interceptors.request.use((config) => {
  const token = store.getters.token
  const expiredAt = store.getters.tokenExpiredAt
  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }
  if (config.timeout) {
    config.timeout = 0
  } else {
    config.timeout = 6000
  }
  config.headers['X-Requested-With'] = 'XMLHttpRequest'
  if (token && expiredAt && new Date().getTime() > expiredAt) {
    if (!window.isRefreshing) {
      window.isRefreshing = true
      axios({
        url: `${BASE_URL}/refresh-token`,
        method: 'post',
        headers: {
          Authorization: 'Bearer ' + token
        }
      }).then(res => {
        window.isRefreshing = false
        // 执行数组里的函数,重新发起被挂起的请求
        onRrefreshed(res.data.token)
        // 执行onRefreshed函数后清空数组中保存的请求
        refreshSubscribers = []
        store.commit('SET_TOKEN', res.data.token)
        store.commit('SET_TOKEN_EXPIRED_IN', res.data.expires_in)
      }).catch(err => {
        if (err.response.status === 401) {
          logoutFn()
        }
      })
    }
    // 把请求(token)=>{....}都push到一个数组中
    const retry = new Promise((resolve, reject) => {
      // (token) => {...}这个函数就是回调函数
      subscribeTokenRefresh((token) => {
        config.headers.Authorization = 'Bearer ' + token
        // 将请求挂起
        resolve(config)
      })
    })
    return retry
  }

  return config
}, err)

service.interceptors.response.use((response) => {
  return response.data
}, err)

function logoutFn () {
  if (store.getters.token) {
    notification.error({
      message: '错误',
      description: '用户身份信息已过期，请重新登录'
    })
    refreshSubscribers = []
    store.dispatch('Logout').then(() => {
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    })
  }
}

const installer = {
  vm: {},
  install (Vue) {
    Vue.use(VueAxios, service)
  }
}

export {
  installer as VueAxios,
  service as axios
}
