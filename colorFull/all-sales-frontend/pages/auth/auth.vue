<template>
	<view></view>
</template>

<script>
export default {
	data() {
		return {
			authParmas: {}
		};
	},
	onLoad(option) {
		this.authParmas.code = option.code;
		this.authParmas.appid = option.appid;
		this.loadwxauth()
	},
	methods: {
		// 获取auth_id
		loadwxauth: function() {
			this.$api.wxauth(this.authParmas).then(res => {
				if (!res.is_binding) {
					// 未绑定手机号，跳转登录页面去绑定手机号
					this.$store.commit('SET_AUTH_ID', res.auth_id);
					uni.reLaunch({
						url: '/pages/login/login?auth_id='+ res.auth_id
					})
				} else {
					// 已绑定手机号，重新获取token，跳转到目标页面
					this.$store.commit('SET_AUTH_ID', res.auth_id);
					const option = uni.getStorageSync('option')
					this.$store.commit('SET_TOKEN', res.token);
					this.$store.commit('SET_TOKEN_EXPIRED_IN', res.expires_in);
					if (option.query.id) {
						uni.redirectTo({
							url: '/' + option.path + '?id=' + option.query.id
						});
					} else {
						uni.reLaunch({
							url: '/' + option.path
						});
					}
				}
			});
		}
	}
};
</script>

<style></style>
