import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/api/index.js'
import BASE_URL from '../common/js/config.js'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		token: '',
		token_expired_at: '',
		user: {},
		auth_id: '',
		option: {},
		is_auth: false
	},
	mutations: {
		SET_TOKEN(state, token) {
			state.token = token
			uni.setStorageSync('Access-Token', token)
		},
		SET_TOKEN_EXPIRED_IN(state, expiresIn) {
			const expiredAt = expiresIn ? new Date().getTime() + expiresIn * 1000 - 60 * 50 * 1000 : null
			state.token_expired_at = expiredAt
			uni.setStorageSync('Access_token_expired_in', expiredAt)
		},
		SET_USER(state, user) {
			state.user = user
			uni.setStorageSync('user', user)
		},
		SET_AUTH_ID(state, auth_id) {
			state.auth_id = auth_id
			uni.setStorageSync('auth_id', auth_id)
		},
		SET_OPTION(state, option) {
			state.option = option
			uni.setStorageSync('option', option)
		},
		SET_IS_AUTH(state, is_auth) {
			state.is_auth = is_auth
		}
	},
	getters: {
		token: state => state.token,
		token_expired_at: state => state.token_expired_at,
		option: statr => state.option
	},
	actions: {
		// 登录
		Login({
			commit
		}, userInfo) {
			return new Promise((resolve, reject) => {
				api.login(userInfo).then(response => {
					const result = response
					commit('SET_TOKEN', result.token)
					commit('SET_TOKEN_EXPIRED_IN', result.expires_in)
					resolve()
				}).catch(error => {
					reject(error)
				})
			})
		},
		// 退出
		Logout({commit}, token) {
			return new Promise((resolve, reject) => {
				uni.request({
					url: BASE_URL + 'logout',
					method: 'POST',
					headers: {
						'Authorization': 'Bearer ' + token,
						'X-Requested-With': 'XMLHttpRequest',
						'accept': 'application/json'
					},
					success: function(res) {
						const auth_id = uni.getStorageSync('auth_id')
						uni.removeStorageSync('Access-Token')
						uni.reLaunch({
							url: '/pages/login/login?auth_id='+ auth_id
						})
						resolve()
					},
					fail: function(err) {
						reject(error)
					}
				})
			})
		},
		GetUser({commit}) {
			return new Promise((resolve, reject) => {
				api.getUser().then(response => {
						const result = response
						commit('SET_USER', result)
						resolve(response)
					}).catch(error => {
						reject(error)
					})
			})
		},
		RefreshToken({commint}, result) {
			commit('SET_TOKEN', result.token)
			commit('SET_TOKEN_EXPIRED_IN', result.expires_in)
		},
		
	}
})

export default store
