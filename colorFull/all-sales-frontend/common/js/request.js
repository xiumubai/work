import BASE_URL from './config.js'
import store from '@/store'

const request = {}
const headers = {}

request.globalRequest = (url, method, data, loading = true) => {
	
	let accessToken = store.state.token
	if (accessToken) {
		headers['Authorization'] = `Bearer ${accessToken}`
	}
	headers['X-Requested-With'] = 'XMLHttpRequest'
	if (loading) {
		uni.showLoading({
			title: '加载中'
		})
	}
	return uni.request({
		url: BASE_URL + url,
		method,
		data: data,
		dataType: 'json',
		header: headers
	}).then(res => {
		const data = res[1]
		if (loading) {
			uni.hideLoading()
		}
		if (data.statusCode && data.statusCode >= 200 && data.statusCode < 300) {
			return data.data
		} else if (data.statusCode === 401) {
			uni.showToast({
				title: '身份信息过期，请重新登录',
				icon: 'none'
			})
			store.dispatch('Logout', accessToken)
		} else {
			throw data.data
		}
	})
}

export default request
