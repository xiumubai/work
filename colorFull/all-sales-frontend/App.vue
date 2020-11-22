<script>
	import BASE_URL from 'common/js/config.js'
	export default {
		onLaunch: function(option) {
			console.log('App Launch')
			if (this.$store.state.token) {
				// 已登录
				this.$store.dispatch('GetUser')
			} else {
				// 未登录,保存目标路径和query,跳转到授权页面
				this.$store.commit('SET_OPTION', option)
				const is_auth = option.query.is_auth
				const appid = option.query.appid
				if (!is_auth) {
					const host = window.location.host
					const redirect_uri = encodeURIComponent(window.location.href + '&is_auth=true')
					const href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+ appid +'&redirect_uri='+ redirect_uri +'&response_type=code&scope=snsapi_base&state=123&connect_redirect=1#wechat_redirect'
					window.location.href = href
				} else {
					const code = option.query.code
					const appid = option.query.appid
					uni.reLaunch({
						url: '/pages/auth/auth?code=' + code + '&appid=' + appid
					})
				}
			}
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import url("./common/css/common.css");
</style>
