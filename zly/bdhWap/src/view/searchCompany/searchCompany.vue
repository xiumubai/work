<template>
	<div class="container">
		<header-fix>
			<router-link slot="left" :to="{name: 'Index'}"><van-icon name="arrow-left"/></router-link>
		</header-fix>
		<div class="body-content">
			<div class="search-box">
				<form action class="search fa fa-search">
					<input type="search" placeholder="请输入品牌公司名称" v-model="keyword" @input="searchList()">
				</form>
			</div>
			<div class="list-box">
				<template v-if="historyList.length > 0 && !!!keyword">
					<div class="list-tip">最近登录</div>
					<div class="result-list list_load" v-if="!!!keyword && historyList.length > 0">
						<div
							class="row"
							v-for="(item,$index) in historyList"
							:key="$index"
							@click="goMeetingList(item)"
						>
							<div>
								<img :src="item.logo">
							</div>
							<span class="ellipsis" v-text="item.company_name"></span>
						</div>
					</div>
				</template>
				<div class="list-tip" v-if="!!!keyword">更多</div>
				<div class="list-tip" v-if="!!keyword">搜索到{{list.length}}条结果</div>
				<div class="result-list list_load" :class="{'list_seach': !!keyword,'list_load': !!!keyword}">
					<van-list
						v-model="loading"
						:finished="finished"
						@load="onLoad"
						:offset="50"
						:immediate-check="false"
					>
						<div class="row" v-for="(item,$index) in list" :key="$index" @click="goMeetingList(item)">
							<div>
								<img :src="item.logo || '../../img/platform_logo.png'">
							</div>
							<span class="ellipsis" v-text="item.company_name"></span>
						</div>
						<div class="list-loading-finished" v-show="finished">没有更多了</div>
					</van-list>
				</div>
			</div>
		</div>
		<a class="try-btn" @touchstart="gotoTry()">
			<span class="mui-tab-label" style="color:#FFFFFF">立即试用</span>
		</a>
	</div>
</template>
<script>
import headerFix from "@/components/headerFix";
import footerFix from "@/components/footerFix";
export default {
	data() {
		return {
			historyList: [],
			list: [],
			keyword: "",
			offset: 0,
			limit: 20,
			loading: false,
			isloading: false,
			finished: false,
			searchTimeLock: null,
			testInfo: null,
			testMeeting: null
		};
	},
	created() {
		this.getList();
		this.getHistory();
		this.getTest();
	},
	methods: {
		searchList() {
			if (this.searchTimeLock) {
				clearTimeout(this.searchTimeLock);
				this.searchTimeLock = null;
			}
			this.searchTimeLock = setTimeout(() => {
				this.offset = 0;
				this.list = [];
				this.getList();
			}, 300);
		},
		async getList(keyword, offset, limit) {
			let res = await this.axios({
				url: "/api/platform/client/search.json",
				params: {
					keyword: keyword || this.keyword,
					sort: "company_name",
					offset: offset || this.offset,
					limit: limit || this.limit
				}
			});
			this.list = this.list.concat(res.data);
			if (res.data.length < this.limit) {
				this.finished = true;
			}
			this.isloading = false;
			this.loading = false;
			this.offset += this.limit;
		},
		// 获取登录订货会详情
		async getMeetingInfo(){
			let res = await this.axios({
				url: '/wapi/login/meeting.json',
				data: {
					id: this.testInfo.id,
					status: -1,
					meeting_id: 1
				}
			});
			if(res.data.length){
				this.testMeeting = res.data.shift();
			}
		},
		// 获取试用账号
		async getTest() {
			let res = await this.axios({
				url: "/api/platform/client/search.json",
				params: {
					keyword: "品牌商试用体验版",
					// keyword: "3.4版本测试用",
					sort: "company_name"
				}
			});
			if(res.data.length){
				this.testInfo = res.data.shift();
				this.historyList.unshift(this.testInfo);
				this.getMeetingInfo();
			}
		},
		onLoad() {
			if (!this.isloading) {
				this.getList();
				this.isloading = true;
			}
		},
		getHistory() {
			try {
				let historyList = localStorage.getItem("historyLogin");
				this.historyList = JSON.parse(historyList) || [];
			} catch (error) {
				this.historyList = [];
			}
		},
		goMeetingList(item) {
			localStorage.setItem("selectCompany", JSON.stringify(item));
			this.$router.push({ name: "MeetingList", query: { pid: item.id } });
		},
		async gotoTry() {
			if(!this.testInfo){
				this.$toast('抱歉测试账号暂时不能用，稍后再试');
				return;
			}
			localStorage.setItem("selectCompany", JSON.stringify(this.testInfo));
			this.$fullScreenloading("正在登录...");
			let res = await this.axios({
				url: "/wapi/login.json",
				method: "post",
				params: {
					meeting_id: "1",
					username: "采购门店s01",
					password: "bdh157890"
					// username: "zs001",
					// password: "123456"
				}
			});
			this.$toast.clear();
			this.$toast(res.message);
			if (res.code === 0) {
				//写登录用户
				localStorage.setItem('userInfo',JSON.stringify(res.user));
				//写登录公司
				let selectCompany = JSON.parse(localStorage.getItem('selectCompany') || '{}');
				localStorage.setItem('loginCompany',JSON.stringify(selectCompany));
				//写登录订货会
				localStorage.setItem('loginMeetingInfo',JSON.stringify(this.testMeeting));
				this.$router.push({ name: "Single" });
			}
		}
	},
	components: {
		headerFix,
		footerFix
	}
};
</script>

<style lang="less" scoped>
.container {
	background-color: #fff;
}
.search-box {
	padding: 0.15rem 0.15rem;
	background-color: #fff;
}
.search {
	background-color: #f3f3f3;
	border-radius: 0.5rem;
	overflow: hidden;
	padding-left: 0.14rem;
	line-height: 0.3rem;
	height: 0.34rem;
	font-size: 0.15rem;
	color: #9b9b9b;
	width: 100%;
	display: flex;
	input {
		border: none;
		outline: none;
		flex: 1;
		padding: 0.08rem;
		background-color: #f3f3f3;
		line-height: 0.2rem;
	}
}
.fa-search:before {
	font-size: 0.16rem;
	color: #9b9b9b;
	font-weight: lighter;
	line-height: 0.34rem;
}

.list_load .row {
	display: block;
	padding: 0.1rem 0.16rem;
	border-bottom: 1px solid #f2f2f2;
}

.list_load .row div {
	width: 0.5rem;
	height: 0.5rem;
	float: left;
}

.list_load .row div img {
	max-width: 0.5rem;
	max-height: 0.5rem;
}

.list_load .row span {
	display: block;
	padding-left: 0.16rem;
	height: 0.5rem;
	line-height: 0.5rem;
	font-size: 0.15rem;
	color: #333333;
}

.list-tip {
	padding: 0.05rem 0.15rem;
	color: #333;
	background-color: #efefef;
	font-size: 0.14rem;
}

.list-box {
	box-sizing: border-box;
	padding-bottom: 0.2rem;
	height: calc(100% - 0.64rem);
	overflow-y: auto;
}

.list_load .row span {
	height: 0.4rem;
	line-height: 0.4rem;
	overflow: hidden;
}

.loading {
	width: 100%;
	padding: 0.04rem;
	text-align: center;
	color: #999;
	font-size: 0.12rem;
}
.try-btn {
	height: 0.5rem;
	width: 100%;
	padding: 0.15rem;
	background-color: #b4a078;
	color: #fff;
	display: block;
	text-align: center;
}
</style>
