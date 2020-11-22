<template>
	<div class="container">
		<div class="meeting-top">
			<div class="header-box">
				<router-link class="left-box" :to="{name: 'SearchCompany'}">返回</router-link>
				<div class="center-box">{{meetingInfo.name}}</div>
				<div class="right-box"></div>
			</div>
			<div class="company-box">
				<div class="logo">
					<img :src="meetingInfo.logo">
				</div>
				<div class="company-desc">{{meetingInfo.introduce || '该品牌暂无介绍。'}}</div>
			</div>
		</div>
		<div class="body-content">
			<div class="tip">新品发布会</div>
				<div
					class="row"
					v-for="(item,$index) in list"
					:key="$index"
					@click="goLogin(item)"
				>
					<div class="line-box">
						<div class="line-content">
							<div class="img-box" :style="{backgroundImage: 'url('+item.img_url+')'}"></div>
							<div class="right-box" :class="item.mStatus ?'on':'off'">{{item.statusVal}}</div>
							<div class="content-box">
								<p class="meeting-name line-over">{{item.name}}</p>
								<p class="time">{{item.from_time | formateDate}}至{{item.to_time | formateDate}}</p>
							</div>
						</div>
					</div>
				</div>
				<div class="list-loading-finished">没有更多了</div>
		</div>
	</div>
</template>
<script>
import headerFix from "@/components/headerFix";
import footerFix from "@/components/footerFix";
export default {
	data() {
		return {
			loading: false,
			finished: false,
			list: [],
			meetingInfo: {},
			platform_id: this.$route.query.pid
		};
	},
	async created() {
		this.getList();
	},
	methods: {
		goLogin(item){
			localStorage.setItem('selectMeetingInfo',JSON.stringify(item));
			this.$router.push({ name: 'Login', query: item});
		},
		async getList(){
			let res = await this.axios({
				url: '/wapi/login/meeting.json',
				params: {
					id: this.platform_id,
					status: -1
				}
			});
			res.data = res.data.map((m) => {
				this.getMeetingStatus(m);
				return m;
			})
			this.meetingInfo = res.company;
			this.list = res.data;
		},
		getMeetingStatus(meeting){
			let start = new Date(meeting.from_time * 1000);
			let end = new Date(meeting.to_time * 1000);
			let now = new Date();
			if(start < now && now < end){
				meeting.statusVal = '进行中';
				meeting.mStatus = true;
			}else if(start > now){
				meeting.statusVal = '未开始';
				meeting.mStatus = true;
			}else if(end < now){
				meeting.statusVal = '已结束';
				meeting.mStatus = false;
			}
		}
	},
	components: {
		headerFix,
		footerFix
	},
	filters: {
		formateDate(val){
			return helper.formatDate(val,'yyyy-MM-dd');
		}
	}
};
</script>

<style lang="less" scoped>
.meeting-top {
	position: absolute;
	height: 2rem;
	background-image: url("~assets/img/meeting_list/dh_bkd.png");
	background-size: cover;
	background-color: #fff;
	width: 100%;
	z-index: 2;
	.company-box {
		width: 100%;
		padding-top: 0.44rem;
		position: absolute;
		.logo {
			padding: 0.1rem;
			float: left;
			height: 0.95rem;
			width: 0.95rem;
			img {
				height: 0.75rem;
				width: 0.75rem;
			}
		}
		.company-desc {
			overflow: hidden;
			padding: 0.1rem;
			color: #fff;
		}
	}
}
.background-img {
	width: 100%;
	display: block;
}
.visibility {
	visibility: hidden;
}
.header-box {
	height: 0.44rem;
	background-color: transparent;
	display: flex;
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	z-index: 10;
	.left-box {
		width: 0.6rem;
		text-align: center;
		line-height: 0.44rem;
		color: #fff;
	}
	.center-box {
		flex: 1;
		text-align: center;
		line-height: 0.44rem;
		color: #fff;
		font-weight: bold;
	}
	.right-box {
		width: 0.6rem;
		text-align: center;
		line-height: 0.44rem;
	}
}
.body-content {
	background-color: #fff;
	min-height: 100%;
	padding-top: 2rem;
	.tip {
		line-height: 0.2rem;
		padding: 0.1rem;
		width: 100%;
		background-color: #efeff4;
	}
}
.line-box {
	width: 100%;
	padding-left: 0.15rem;
	height: 0.8rem;
	.line-content {
		padding-right: 0.15rem;
		border-bottom: 1px solid #e3e3e3;
		.img-box {
			width: 0.5rem;
			height: 0.5rem;
			border-radius: 0.5rem;
			overflow: hidden;
			float: left;
			margin-top: 0.15rem;
			background-position: center;
			background-size: cover;
		}
		.right-box{
			width: 0.45rem;
			height: 0.16rem;;
			float: right;
			margin-top: 0.15rem;
			background-size: 100%;
			color: #fff;
			font-size: 0.1rem;
			text-align: center;
			margin-right: 0.50rem;
			line-height: 0.16rem;
			background-repeat: no-repeat;
		}
		.on{
			background-image: url('~assets/img/meeting_list/meetingstatus_on.png');
		}
		.off{
			background-image: url('~assets/img/meeting_list/meetingstatus_off.png');
		}
		.content-box{
			overflow: hidden;
			height: 0.8rem;;
			padding: 0.15rem;
			.meeting-name{
				margin-bottom: 0.1rem;
			}
		}
		.time{
			color: #919191;
			font-size: 0.12rem;
		}
	}
}
</style>