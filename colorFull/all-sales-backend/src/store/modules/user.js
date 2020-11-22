/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-23 15:37:05
 * @LastEditors: Please set LastEditors
 */
import Vue from 'vue'
import axios from 'axios'
import store from '@/store'
import {
  login,
  getInfo
} from '@/api/login'
import {
  ACCESS_TOKEN,
  ACCESS_TOKEN_EXPIRED_AT
} from '@/store/mutation-types'

const user = {
  state: {
    token: '',
    token_expired_at: '',
    name: '',
    permissions: [],
    info: {}
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
      Vue.ls.set(ACCESS_TOKEN, token)
    },
    SET_TOKEN_EXPIRED_AT: (state, expiredAt) => {
      state.token_expired_at = expiredAt
      Vue.ls.set(ACCESS_TOKEN_EXPIRED_AT, expiredAt)
    },
    SET_TOKEN_EXPIRED_IN: (state, expiresIn) => {
      const expiredAt = expiresIn ? new Date().getTime() + expiresIn * 1000 - 60 * 50 * 1000 : null
      state.token_expired_at = expiredAt
      Vue.ls.set(ACCESS_TOKEN_EXPIRED_AT, expiredAt)
    },
    SET_NAME: (state, { name }) => {
      state.name = name
    },
    SET_PERMISSIONS: (state, permissions) => {
      state.permissions = permissions
    },
    SET_USER: (state, info) => {
      state.info = info
    }
  },

  actions: {
    // 登录
    Login ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        login(userInfo).then(response => {
          const result = response
          commit('SET_TOKEN', result.token)
          commit('SET_TOKEN_EXPIRED_IN', result.expires_in)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo ({ commit }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const result = response
          if (result.permissions.length > 0) {
            commit('SET_USER', result)
            commit('SET_PERMISSIONS', result.permissions)
          }
          commit('SET_NAME', { name: result.name })
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    Logout ({ commit }) {
      return new Promise((resolve) => {
        const token = store.getters.token
        axios({
          url: `${process.env.VUE_APP_API_BASE_URL}/logout`,
          method: 'post',
          headers: {
            Authorization: 'Bearer ' + token
          }
        }).then(() => {
          resolve()
        }).catch(() => {
          resolve()
        }).finally(() => {
          commit('SET_TOKEN', '')
          Vue.ls.remove(ACCESS_TOKEN)
          Vue.ls.remove(ACCESS_TOKEN_EXPIRED_AT)
        })
      })
    }

  }
}

export default user
