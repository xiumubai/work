<template>
	<div class="container">
		<header-fix></header-fix>
		<div class="body-content">
			<div class="list-box">
				<router-link v-for="item in list" :key="item.id" :to="{name: 'PactInfo',params: item}" class="list-item">
					<div class="flex">
						<div class="title">{{item.contract_name}}</div>
						<div class="time">签约日期：{{item.authorized_at | formateDate}}</div>
					</div>
					<div class="right-status red">
						<span>{{statusValue[item.status]}}</span>
					</div>
				</router-link>
			</div>
		</div>
	</div>
</template>
<script>
import headerFix from "@/components/headerFix";
export default {
	data() {
		return {
			list: [],
			statusValue: ['未签','已签','作废']
		};
	},
	created(){
		this.getList();
	},
	methods: {
		async getList() {
			let res = await this.axios({
				url: '/wapi/contract/sign_info.json',
				params: {
					show_detail: 1
				}
			});
			this.list = res.contract;
		}
	},
	components: {
		headerFix
	},
	filters: {
		formateDate(val){
			return helper.formatDate(val,'yyyy-MM-dd');
		}
	}
};
</script>

<style lang="less" scoped>
.container {
	background-color: #fff;
}
.list-box {
	padding-left: 0.15rem;
}
.list-item {
	padding: 0.1rem 0.15rem 0.1rem 0;
	border-bottom: 1px solid #e7e7e7;
	display: flex;
	.flex {
		flex: 1;
	}
	.title {
		font-size: 0.14rem;
	}
	.time {
		font-size: 0.12rem;
		color: #999;
	}
	.right-status {
		font-size: 0.12rem;
		display: flex;
		span {
			margin: auto;
		}
	}
}
</style>