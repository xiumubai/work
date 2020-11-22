<template>
	<div class="bind-box">
		<div class="content-box"></div>
		<div class="bind-btn register" @click="registered()">免费注册</div>
		<router-link class="bind-btn" :to="{name: 'Index'}">立即绑定</router-link>
	</div>
</template>
<script>
//绑定第三方应用
export default {
	mounted() {
		if (navigator.userAgent.indexOf("DingTalk") < 0) {
			this.$dialog.alert({
				message: "请在钉钉打开当前页面"
			});
		}
		this.setDingSdk();
	},
	created(){
		localStorage.removeItem('dingdingUserInfo');
		localStorage.removeItem('userInfo');
	},
	data() {
		return {
			dingdingUserInfo: {
				id: null,
				corpId: this.$route.query.corpid
			}
		};
	},
	methods: {
		//添加钉钉jssdk
		async setDingSdk() {
			this.$toast.loading('请稍后...');
			let res = await this.axios({
				url: "/api/ding/auth.json",
				method: "get",
				params: {
					url: location.href,
					corp_id: this.$route.query.corpid
				}
			});
			if(res.code !== 0){
				this.$toast(res.message);
				return;
			}
			res = res.data;
			dd.config({
				agentId: res.agentId, // 必填，微应用ID
				corpId: res.corpId, //必填，企业ID
				timeStamp: res.timeStamp, // 必填，生成签名的时间戳
				nonceStr: res.nonceStr, // 必填，生成签名的随机串
				signature: res.signature, // 必填，签名
				jsApiList: [
					"device.notification.alert",
					"device.notification.confirm",
					"runtime.permission.requestAuthCode",
					"biz.user.get"
				] // 必填，需要使用的jsapi列表
			});
			this.getCode();
		},
		getCode(){
			let _this = this;
			dd.ready(function() {
				dd.runtime.permission.requestAuthCode({
					corpId: res.corpId,
					onSuccess: function(result) {
						_this.checkBind(result);
					},
					onFail: function(err) {
						this.$toast.clear('clearAll');
						_this.dialog(JSON.stringify(err));
					}
				});
			});
			dd.error(function(error) {
				this.$toast.clear('clearAll');
				console.log(error);
			});
			let result = {};
			result.code = '22b90298f1a1320c800bdc43d59fae30';
			this.checkBind(result)
		},
		//检查是否绑定
		async checkBind(result) {
			let res = await this.axios({
				url: "/api/ding/user.json",
				method: "get",
				params: {
					code: result.code,
					corp_id: this.$route.query.corpid
				}
			});
			this.dingdingUserInfo.id = res.user_id;
			this.dingdingUserInfo.token = res.token;
			localStorage.setItem('dingdingUserInfo',JSON.stringify(this.dingdingUserInfo));
			this.$toast.clear('clearAll');
			// 1.没有绑定的手动去登录页绑定 或者 自动注册
			if (res.code === 0 && res.status === 0) {
				return;
			}
			if(res.code !== 0 || res.status === null || !res.token){
				this.$toast(res.message);
				return;
			}
			/**
			 * 2.已经绑定自动登录
			 */
			this.loginAuto(res);
		},
		async loginAuto(res){
			this.$fullScreenloading('正在登录...');
			let params = {
				meeting_id: res.meeting.id, 
				token: res.token
			};
			let url = '/wapi/login.json';
			if(res.status === 1){
				url = '/wapi/admin/login.json';
			}
			let resLogin = await this.axios({
				url,
				method: 'post',
				params
			});
			if(resLogin.code === 0){
				this.$toast.clear();
				let platform = res.platform;
				let meeting = res.meeting;
				let loginCompany = {
					company_name: platform.company_name,
					domain: platform.domain,
					id: platform.id,
					logo: platform.logo,
					name: platform.name,
					verified_time: platform.verified_time
				};
				let LoginMeetingInfo = {
					from_time: meeting.from_time,
					id: meeting.id,
					img_url: meeting.img_url,
					ip_limit: meeting.ip_limit,
					mStatus: true,
					name: meeting.name,
					status: meeting.status,
					statusVal: meeting.statusVal,
					to_time: meeting.to_time
				}
				//写登录用户
				localStorage.setItem('userInfo',JSON.stringify(resLogin.user));
				//写登录公司
				localStorage.setItem('selectCompany',JSON.stringify(loginCompany));
				localStorage.setItem('loginCompany',JSON.stringify(loginCompany));
				//写登录订货会
				localStorage.setItem('loginMeetingInfo',JSON.stringify(LoginMeetingInfo));
				localStorage.setItem('loginMeetingInfo',JSON.stringify(LoginMeetingInfo));
				//删除钉钉信息
				localStorage.removeItem('dingdingUserInfo');
				this.$toast('登录成功');
				this.$router.push({ name: 'Single' });
			}else{
				this.$toast(resLogin.message);
			}
		},
		//免费注册
		async registered(){
			this.$fullScreenloading('正在注册...');
			let res = await this.axios({
				url: '/api/platform/client/registauto.json',
				method: 'post',
				params: {
					user_id: this.dingdingUserInfo.id,
					corp_id: this.dingdingUserInfo.corpId
				}
			});
			if(res.code === 0){
				this.loginAuto(res);
			}else{
				this.$toast(res.message);
			}
		},
		//获取公司详情
		async getCompanyInfo(cId){
			let res = await this.axios({
				url: "/api/platform/client/search.json",
				params: {
					ids: cId
				}
			});
			return res.data && res.data.shift();
		},
		//获取订货会详情
		async getMeetingInfo(cId,mId){
			let res = await this.axios({
				url: '/wapi/login/meeting.json',
				data: {
					id: cId,
					status: -1,
					meeting_id: mId
				}
			});
			return res.data && res.data.shift();
		},
		dialog(str) {
			dd.device.notification.alert({
				message: String(str),
				title: "提示", //可传空
				buttonName: "	确定",
				onSuccess: function() {
					//onSuccess将在点击button之后回调
					/*回调*/
				},
				onFail: function(err) {
					console.log(err);
				}
			});
		},
		loadingBox(type = 1) {
			if (type) {
				dd.device.notification.showPreloader({
					text: "加载中..", //loading显示的字符，空表示不显示文字
					showIcon: true //是否显示icon，默认true。Android无此参数。
				});
			} else {
				dd.device.notification.hidePreloader({});
			}
		}
	}
};
</script>
<style lang="less" scoped>
.bind-box,
.content-box {
	height: 100%;
	width: 100%;
	background-image: url("~assets/img/common/bind_bg.png");
	background-size: cover;
	background-position: center;
}
img {
	width: 100%;
	display: block;
}

.bind-btn,
.register {
	height: 0.4rem;
	width: 80%;
	line-height: 0.4rem;
	text-align: center;
	position: fixed;
	left: 0;
	right: 0;
	margin: 0.2rem auto;
	display: block;
	background-color: #feca77;
	bottom: 0.1rem;
	color: #fff;
	border-radius: 0.9rem;
	font-size: 0.16rem;
}
.register {
	bottom: 0.6rem;
}
</style>

