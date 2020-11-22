<template>
	<div class="container">
		<header-fix :centerText="company.company_name"></header-fix>
		<div class="body-content">
			<div class="img-box">
				<img :src="meetingInfo.img_url">
			</div>
			<table class="dhh-content">
				<tr>
					<td>
						<div class="dhh-lable">订货会名称：</div>
					</td>
					<td class="dhh-info">{{meetingInfo.name}}</td>
				</tr>
				<tr>
					<td>
						<div class="dhh-lable">订货会时间：</div>
					</td>
					<td
						class="dhh-info"
					>{{meetingInfo.from_time | formateDate}} 至 {{meetingInfo.to_time | formateDate}}</td>
				</tr>
				<tr>
					<td>
						<div class="dhh-lable">订货会要求：</div>
					</td>
					<td class="dhh-info">禁止截屏、拍照，违规自动退出该订货会</td>
				</tr>
			</table>
			<div class="login-btn" @click="loginMeeting">进入订货会</div>
		</div>
		<van-dialog v-model="showDialog" show-cancel-button title="登录订货会" @confirm="confirm">
			<div class="dialog-content">
				<van-field v-model="username" placeholder="请输入门店账号"/>
			<van-field type="password" v-model="password" placeholder="请输入密码"/>
			<van-radio-group v-model="loginType" class="login-type">
				<van-radio name="2">个人</van-radio>
				<van-radio name="1">品牌公司</van-radio>
			</van-radio-group>
			</div>
		</van-dialog>
	</div>
</template>
<script>
import headerFix from "@/components/headerFix";
import footerFix from "@/components/footerFix";
export default {
	data() {
		return {
			meetingInfo: this.$route.query,
			showDialog: false,
			showPopup: false,
			username: "",
			password: "",
			loginType: "2",
			company: JSON.parse(localStorage.getItem("selectCompany") || "{}")
		};
	},
	methods: {
		async confirm() {
			if (!this.meetingInfo.id) {
				this.$toast("订货会有误，请退出重试");
				return;
			}
			if (!this.username) {
				this.$toast("请输入门店账号");
				return;
			}
			if (!this.password) {
				this.$toast("请输入密码");
				return;
			}
			let params = {
				meeting_id: this.meetingInfo.id,
				username: this.username,
				password: this.password
			};
			//获取是有钉钉账号
			let dingdingUserInfo = JSON.parse(
				localStorage.getItem("dingdingUserInfo") || "{}"
			);
			if (dingdingUserInfo.id) {
				params.token = dingdingUserInfo.token;
			}
			let url = "/wapi/login.json";
			if (this.loginType === "1") {
				url = "/wapi/admin/login.json";
			}
			this.$fullScreenloading("正在登录...");
			let res = await this.axios({
				url,
				method: "post",
				params
			});
			this.$toast.clear();
			this.$toast(res.message);
			if (res.code === 0) {
				//写登录用户
				localStorage.setItem("userInfo", JSON.stringify(res.user));
				//写登录公司
				let selectCompany = JSON.parse(
					localStorage.getItem("selectCompany") || "{}"
				);
				localStorage.setItem("loginCompany", JSON.stringify(selectCompany));
				//写登录订货会
				let selectMeetingInfo = localStorage.getItem("selectMeetingInfo");
				localStorage.setItem(
					"loginMeetingInfo",
					selectMeetingInfo
				);
				let historyList = localStorage.getItem("historyLogin");
				historyList = JSON.parse(historyList) || [];
				let hasHistory = false;
				historyList.map(val => {
					if (val.id === selectCompany.id) {
						hasHistory = true;
					}
				});
				this.$store.commit('updateMeeting',JSON.parse(selectMeetingInfo || '{}'));
				!hasHistory && historyList.push(selectCompany);
				localStorage.setItem("historyLogin", JSON.stringify(historyList));
				//删除钉钉信息
				localStorage.removeItem("dingdingUserInfo");
				if(this.$store.getters.getMeetingInfo){
					this.$router.push({ name: "My" });
				}else{
					this.$router.push({ name: "Single" });
				}
			}
		},
		loginMeeting() {
			let selectCompany = JSON.parse(localStorage.getItem("selectCompany") || "{}");
			let loginCompany = JSON.parse(localStorage.getItem("loginCompany") || "{}");
			let loginMeetingInfo = JSON.parse(localStorage.getItem("loginMeetingInfo") || "{}");
			let selectMeetingInfo = JSON.parse(localStorage.getItem("selectMeetingInfo") || "{}");
			if (selectCompany.id === loginCompany.id && loginMeetingInfo.id === selectMeetingInfo.id) {
				let userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
				if (userInfo.id) {
					this.$router.push({ name: "Single" });
					return;
				}
			}
			this.showDialog = true;
		}
	},
	components: {
		headerFix,
		footerFix
	},
	filters: {
		formateDate(val) {
			return helper.formatDate(val, "yyyy-MM-dd");
		}
	}
};
</script>

<style lang="less" scoped>
.img-box {
	width: 100%;
	img {
		width: 100%;
	}
}
.dhh-content {
	td {
		vertical-align: top;
		padding: 0.1rem 0.1rem 0 0.1rem;
	}
	td:last-child {
		vertical-align: top;
		padding: 0.1rem 0 0 0;
	}
	.dhh-lable {
		white-space: nowrap;
	}
}
.dialog-content{
	padding: 5px 10px;
}
.login-btn {
	position: absolute;
	bottom: 0;
	left: 0;
	background-color: #b1a078;
	height: 0.5rem;
	line-height: 0.5rem;
	text-align: center;
	color: #fff;
	width: 100%;
}
.login-type {
	display: flex;
	padding: 0.1rem 0.3rem;
	.van-radio {
		flex: 1;
	}
}
</style>