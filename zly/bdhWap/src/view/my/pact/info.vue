<template>
	<div class="container">
		<header-fix></header-fix>
		<div class="body-content">
			<div class="content-box">
				<div class="line">
					<div class="line-left">合同编号：{{info.contract_no}}</div>
					<div class="line-right red">{{statusValue[info.status]}}</div>
				</div>
				<div class="line">
					<div class="line-left" v-if="info.status == 1">签约日期：{{info.signed_at | formateDate}}</div>
					<div class="line-right">保证金：{{info.contract_no ? '已交' : '未交'}}</div>
				</div>
				<div class="line">
					<div class="line-left" v-if="info.status == 1">手机号：{{info.mobile}}</div>
				</div>
				<div class="line">
					<div class="line-left" v-if="info.status == 1">身份证号：{{info.identification}}</div>
				</div>
				<div class="line">
					<div class="line-left">{{info.member_name}}</div>
					<div class="line-right">共计：{{info.number}}件/ &yen; {{info.amount}}</div>
				</div>
				<div class="line" v-for="(member,index) in info.members" :key="member.id" v-show="index < showAll">
					<div class="line-left">
						{{member.true_name}}
						<span v-for="(season, $k) in member.detail.season" :key="$k">{{$k}}：{{season.qty}}件/￥{{season.amt}}</span>
					</div>
				</div>
				<div class="show-more" v-if="info.members.length > 2">
					<span @click="showAll=info.members.length" v-if="showAll==2">查看更多<van-icon name="arrow-down" /></span>
					<span @click="showAll=2" v-if="showAll!=2">收起<van-icon name="arrow-up" /></span>
				</div>
			</div>
			<div class="img-box"><img :src="info.sign_url"></div>
		</div>
	</div>
</template>
<script>
import headerFix from "@/components/headerFix";
export default {
	data() {
		return {
			info: {},
			statusValue: ['未签','已签','作废'],
			showAll: 2
		};
	},
	created() {
		this.info = this.$route.params || {};
		if(!this.info.id){
			this.$router.go(-1);
		}
	},
	components: {
		headerFix
	},
	filters: {
		formateDate(val){
			return helper.formatDate(val,'yyyy-MM-dd hh:mm:ss');
		}
	}
};
</script>

<style lang="less" scoped>
.content-box {
	background-color: #fff;
	margin-top: 0.15rem;
	padding: 0.1rem 0.15rem;
}
.line {
	display: flex;
	font-size: 0.12rem;
	color: #999;
	.line-left {
		text-align: left;
		flex: 1;
	}
	.line-right {
		text-align: right;
	}
}
.line:first-child{
	color: #333;
	font-size: 0.14rem;
}
.show-more{
	width: 100%;
	text-align: center;
	font-size: 0.13rem;
	padding: 0.1rem;
	color: #999;
}
.img-box{
	width: 100%;
	img{
		width: 100%;
	}
}
</style>