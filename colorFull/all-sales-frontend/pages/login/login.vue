<template>
	<view class="login">
		<view class="logo"><image src="/static/icon/colorfull-logog.png" mode="aspectFit"></image></view>
		<view class="login-input">
			<view class="phone login-common">
				<picker class="phone-area" @change="bindPickerChange" :value="index" :range="pickerList">
					{{ pickerList[index] }}
					<image src="../../static/icon/down.png" mode=""></image>
				</picker>
				<input class="phone-input" v-model="queryParams.mobile" type="number" placeholder="请输入电话号码" @blur="handelInputMobile" />
			</view>
			<view class="captcha login-common">
				<view class="captcha-text">验证码</view>
				<input class="captcha-input" v-model="queryParams.code" type="number" maxlength="6" placeholder="请输入验证码" @blur="handleInputCaptcha" />
				<button class="captcha-button common-button" :class="{active: state.smsSendBtn}"  @tap="bindSendCaptcah">{{ (!state.smsSendBtn && '获取验证码') || state.time + ' s' }}</button>
			</view>
		</view>
		<button class="common-button login-button" @click="handleLogin">登录</button>
	</view>
</template>

<script>
import store from '@/store';
export default {
	data() {
		return {
			title: 'Hello',
			pickerList: [],
			areaCodeList: [],
			index: 0,
			state: {
				time: 60,
				loginBtn: false,
				smsSendBtn: false,
				isMobileRight: false
			},
			queryParams: {},
		};
	},
	onLoad(option) {
		this.queryParams.auth_id = option.auth_id
		// 加载区号
		this.loadRegionCodes()
	},
	methods: {
		bindPickerChange: function(e) {
			this.index = e.target.value;
			this.queryParams.region_code = this.areaCodeList[index].code;
			this.queryParams.region_number = this.areaCodeList[index].number;
		},
		handleInputCaptcha: function(e) {
			if (e.target.value && e.target.value.length === 6 ) {
				this.queryParams.code = e.target.value;
				if (this.queryParams.mobile && this.queryParams.code) {
					this.state.loginBtn = true;
				} else {
					this.state.loginBtn = false;
				}
			} else {
				if (e.target.value) {
					uni.showToast({
						title: '验证码输入不正确',
						icon: 'none'
					});
				}
			}
		},
		handelInputMobile: function(e) {
			this.queryParams.mobile = e.target.value;
			const reg = /^1[345789]\d{9}$/;
			if (reg.test(this.queryParams.mobile)) {
				this.state.isMobileRight = true;
			} else {
				if (e.target.value) {
					this.state.isMobileRight = false;
					uni.showToast({
						title: '手机号输入不正确',
						icon: 'none'
					});
				}
 			}
		},
		bindSendCaptcah: function() {
			const { state } = this;
			if(!this.queryParams.mobile) {
				uni.showToast({
					title: '请输入手机号码',
					icon: 'none'
				})
			}
			if (!state.smsSendBtn && state.isMobileRight) {
				state.smsSendBtn = true;
				uni.showLoading({
					title: '验证码发送中'
				});
				this.$api
					.getCaptcha(this.queryParams)
					.then(res => {
						const interval = window.setInterval(() => {
							if (state.time-- <= 0) {
								state.time = 60;
								state.smsSendBtn = false;
								window.clearInterval(interval);
								uni.hideLoading();
							}
						}, 1000);
						
						uni.showToast({
							title: '验证码发送成功',
							icon: 'none'
						});
					})
					.catch((err) => {
						state.smsSendBtn = false;
						uni.hideLoading();
						console.log(err)
						uni.showToast({
							title: '发送失败',
							icon: 'none'
						})
					});
			}
		},
		handleLogin: function() {
			if (this.queryParams.mobile && this.queryParams.code) {
				store
					.dispatch('Login', this.queryParams)
					.then(res => {
						uni.showToast({
							title: '欢迎回来',
							icon: 'none'
						});
						uni.reLaunch({
							url: '../tabBar/index/index'
						});
					})
					.catch(() => {
						uni.showToast({
							title: '登录失败',
							icon: 'none'
						});
					});
			} else {
				if (!this.queryParams.mobile) {
					uni.showToast({
						title: '请输入手机号码',
						icon: 'none'
					})
				} else {
					uni.showToast({
						title: '请输入验证码',
						icon: 'none'
					})
				}
			}
		},
		loadRegionCodes: function() {
			this.$api.getRegionCodes().then(res => {
				res.data.map(v => {
					this.areaCodeList = res.data;
					this.pickerList.push(v.name + v.number);
					// 初始化区号
					this.queryParams.region_code = this.areaCodeList[0].code;
					this.queryParams.region_number = this.areaCodeList[0].number;
				});
			});
		}
	}
};
</script>

<style lang="scss">
.login {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 0 56upx;
	.logo {
		width: 384upx;
		height: 146upx;
		margin-bottom: 112upx;
		margin-top: 200upx;
		background: #ecedee;
	}

	.login-button {
		width: 100%;
		background: #dad9e2;
	}
	.common-button {
		height: 88upx;
		line-height: 88upx;
		color: #ffffff;
		border-radius: 8upx;
		font-size: 30upx;
		background: #006a60;
	}
	.login-input {
		width: 100%;
		margin-bottom: 84upx;
		.login-common {
			height: 88upx;
			line-height: 88upx;
			display: flex;
		}
		input {
			background: #ffffff;
			height: 88upx;
			flex: 1;
			font-size: 30upx;
			// line-height: 88upx;
		}

		.phone {
			margin-bottom: 28upx;
			background: #ffffff;
			.phone-area {
				display: flex;
				padding: 0 38upx 0 20upx;
				align-items: center;
				image {
					width: 20upx;
					height: 20upx;
					margin-left: 16upx;
				}
			}
		}
		.captcha {
			.captcha-text {
				background: #ffffff;
				padding: 0 38upx 0 20upx;
			}
			.captcha-button {
				margin-left: 24upx;
				width: 200upx;
				padding: 0;
			}
			.active{
				background: #DAD9E2;
				border-color: #DAD9E2;
			}
		}
	}
}
</style>
