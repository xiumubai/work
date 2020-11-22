<template>
	<div class="container">
		<header-fix></header-fix>
		<div class="body-content">
			<van-list
				v-model="loading"
				:finished="finished"
				@load="onLoad"
				:offset="50"
				:immediate-check="false"
			>
				<div class="mui-content fz14">
					<div id="total-div">
						<table class="table-head" v-if="statistics.review">
							<tr style="height: 10px;"></tr>
							<tr>
								<td class="first-row">
									已审核订量：
									<span>{{statistics.review.qty}}</span>
								</td>
								<td class="second-row">
									未审核订量：
									<span>{{statistics.review._qty}}</span>
								</td>
							</tr>
							<tr>
								<td class="first-row">
									已审核金额：
									<span>{{statistics.review.amt}}</span>
								</td>
								<td class="second-row">
									未审核金额：
									<span>{{statistics.review._amt}}</span>
								</td>
							</tr>
							<tr>
								<td class="first-row">
									已审核客户：
									<span>{{statistics.review.mem}}</span>
								</td>
								<td class="first-row">
									部分审核客户：
									<span>{{statistics.review.mem_}}</span>
								</td>
							</tr>
							<tr>
								<td class="second-row">
									未审核客户：
									<span>{{statistics.review._mem}}</span>
								</td>
							</tr>
						</table>

						<table v-if="statistics.reached" v-show="totalShow" class="more-tab">
							<tr>
								<td style="width: 60px;padding-left: 10px;">订量</td>
								<td>
									已达标客户数
									<span>{{statistics.reached.qty}}</span>
								</td>
								<td style="padding-left: 10px;">
									未达标客户数
									<span>{{statistics.reached._qty}}</span>
								</td>
							</tr>
							<tr>
								<td style="width: 60px;padding-left: 10px;">金额</td>
								<td>
									已达标客户数
									<span>{{statistics.reached.amt}}</span>
								</td>
								<td style="padding-left: 10px;">
									未达标客户数
									<span>{{statistics.reached._amt}}</span>
								</td>
							</tr>
						</table>
						<p class="look-more" @click="toggelTotal" style="background: #FFFFFF;">
							<template v-if="totalShow">收起
								<van-icon name="arrow-up"/>
							</template>
							<template v-else>展开
								<van-icon name="arrow-down"/>
							</template>
						</p>
					</div>
					<div v-if="count>=0" style="overflow: scroll;width: 100%;" class="table-box">
						<table id="fixation-head" class="tmp-table" style="z-index: 2;position: relative;">
							<tr style="background: #cdcfd3;">
								<td rowspan="2">季节</td>
								<td colspan="4">订量/件</td>
								<td colspan="4">金额/元</td>
							</tr>
							<tr style="background: #cdcfd3;">
								<td>已订</td>
								<td>指标</td>
								<td>差异</td>
								<td>完成率</td>
								<td>已订</td>
								<td>指标</td>
								<td>差异</td>
								<td>完成率</td>
							</tr>
						</table>
						<table class="tmp-table" id="table-content">
							<template v-if="count>0">
								<tr style="border-top: 0px solid red;">
									<td
										style="text-align: left;background: #eff1f6;border-top: 0px solid red;"
										colspan="10"
									>&nbsp;&nbsp;&nbsp;汇总</td>
								</tr>
								<tr v-for="(item,index) in total_data" :key="'tr1' + index">
									<td>{{item.season}}</td>
									<td>{{item.order.qty}}</td>
									<td>{{item.target.qty}}</td>
									<td>{{item.target.qty-item.order.qty}}</td>
									<td>{{item.percent.qty}}</td>
									<td>{{item.order.amt}}</td>
									<td>{{item.target.amt}}</td>
									<td>{{item.target.amt-item.order.amt}}</td>
									<td>{{item.percent.amt}}</td>
								</tr>
								<template v-for="(item,$key) in list_data">
									<tr :key="'tr2' + $key">
										<td
											style="text-align: left;background: #eff1f6;"
											colspan="10"
										>{{$key+1}}、客户账号：{{item.username}} 客户名称：{{item.true_name}}</td>
									</tr>
									<tr v-for="(it,itIndex) in item.season" :key="'tr3' + $key + itIndex">
										<td>{{it.season}}</td>
										<td>{{it.order.qty}}</td>
										<td>{{it.target.qty}}</td>
										<td>{{it.target.qty-it.order.qty}}</td>
										<td>{{it.percent.qty}}</td>
										<td>{{it.order.amt}}</td>
										<td>{{it.target.amt}}</td>
										<td>{{it.target.amt-it.order.amt}}</td>
										<td>{{it.percent.amt}}</td>
									</tr>
									<tr :key="'tr4' + $key">
										<td colspan="2" style="color: #d4282d;">
											<template v-if="item.reviewed == 1">未审核</template>
											<template v-else-if="item.reviewed == 2">部分审核</template>
											<template v-else>已审核</template>
										</td>
										<td colspan="7" style="height: 40px;">
											<div v-if="item.reviewed == 3">
												<router-link
													class="button-audit button-cancel-audit"
													:to="{name: 'AuditInfo',query:{title: item.username+'-'+item.true_name,member_id: item.member_id,type: 0}}"
												>取消审核</router-link>
											</div>
											<div v-else-if="item.reviewed == 2">
												<router-link
													class="button-audit"
													:to="{name: 'AuditInfo',query:{title: item.username+'-'+item.true_name,member_id: item.member_id,type: 1}}"
												>继续审核</router-link>
												<router-link
													class="button-audit button-cancel-audit"
													:to="{name: 'AuditInfo',query:{title: item.username+'-'+item.true_name,member_id: item.member_id,type: 0}}"
												>取消审核</router-link>
											</div>
											<div v-else>
												<router-link
													class="button-audit"
													:to="{name: 'AuditInfo',query:{title: item.username+'-'+item.true_name,member_id: item.member_id,type: 1}}"
												>审核</router-link>
											</div>
										</td>
									</tr>
								</template>
							</template>
						</table>
					</div>
					<div v-if="count == 0" style="text-align: center;margin-top: 56px;">
						<!-- <img style="height: 40px;" src="../../img/no_data.png"> -->
						<div class="fz14" style="color: #9B9B9B;margin-top:10px;">暂无订单审核</div>
					</div>
				</div>
				<div class="list-loading-finished" v-show="finished">没有更多了</div>
			</van-list>
		</div>
	</div>
</template>
<script>
import headerFix from "@/components/headerFix";
import tableFixTitle from "@/components/tableFixTitle";
export default {
	mixins: [tableFixTitle],
	data() {
		return {
			offset: 0,
			limit: 20,
			count: -1,
			statistics: {},
			total_data: [],
			list_data: [],
			totalShow: false,
			loading: false,
			isloading: false,
			finished: false,
		};
	},
	created() {
		this.getList();
	},
	methods: {
		async getList() {
			let res = await this.axios({
				url: "/wapi/order_analysis/review_list.json",
				params: {
					offset: this.offset,
					limit: this.limit
				}
			});
			this.count = res.total;
			this.statistics = res.statistics;
			this.total_data = res.total_data;

			//遍历列表数据
			if (res.list_data) {
				// this.list_data = res.list_data;
				this.list_data = this.list_data.concat(res.list_data);
			}
			if (res.list_data.length < this.limit) {
				this.finished = true;
			}
			this.isloading = false;
			this.loading = false;
			if(!this.offset){
				this.fixTableHerder();
			}
			this.offset += this.limit;
		},
		toggelTotal: function() {
			this.totalShow = !this.totalShow;
		},
		onLoad() {
			if (!this.isloading) {
				this.getList();
				this.isloading = true;
			}
		}
	},
	components: {
		headerFix
	}
};
</script>

<style lang="less" scoped>
table {
	background: #ffffff;
	word-break: break-all;
	border: 0;
	margin: 0;
	border-collapse: collapse;
	border-spacing: 0;
}
table td {
	padding: 0;
}
.body-content {
	height: calc(100% - 0.44rem);
}
.table-head {
	width: 100%;
	word-break: break-all;
	font-family: PingFangSC-Light;
	color: #333333;
	font-size: 0.14rem;
}

.table-head tr {
	line-height: 30px;
}

.table-head td {
	width: 50%;
	vertical-align: super;
	margin-top: 100px;
	border: 0px solid red;
}

.table-head span {
	color: red;
}

.table-head .first-row {
	padding-left: 10px;
}

.table-head .second-row {
	padding-left: 10px;
}

.button-audit {
	width: 80px;
	height: 28px;
	line-height: 28px;
	background: #b1a078;
	text-align: center;
	color: #ffffff;
	border-radius: 2px;
	display: inline-block;
	float: left;
	margin-left: 25px;
}

.button-cancel-audit {
	width: 80px;
	height: 28px;
	line-height: 28px;
	border: 1px solid #b1a078;
	background: #ffffff;
	text-align: center;
	color: #b1a078;
	border-radius: 2px;
	display: inline-block;
}

.tmp-table {
	font-size: 12px;
	background: #ffffff;
	min-width: 100%;
	table-layout: fixed;
}

.tmp-table tr,
td,
th {
	border: 1px solid #dfe6ec;
}

.tmp-table td {
	text-align: center;
	min-width: 50px;
}

.look-more {
	padding-bottom: 0.06rem;
	margin-bottom: 0.08rem;
	background: #fff;
	text-align: center;
	color: #999;
	font-size: 0.14rem;
}

.more-tab {
	width: 100%;
	word-break: break-all;
	font-family: PingFangSC-Light;
	color: #333333;
	font-size: 0.14rem;
}

.more-tab tr {
	line-height: 30px;
}

.more-tab td {
	vertical-align: super;
	border: 0px solid red;
}

.more-tab span {
	color: red;
}
</style>