<!--
	*指标达成
-->
<template>  
	<div class="container">
    <header-fix centerText="指标达成"></header-fix>
    <div class="body-content">
      <div>
        <div style="background: white;height: 47px;">
					<div class="search">
						<van-search @keyup="searchUsername" @clear="clearKeyword" v-model="keyword" class="search-ctrl search-input"  background="#fff" placeholder="请输入客户账号或名称" />
						<div v-show="showType === 'list'" class="filter" style="display: inline-block;" @click="showPopup = true">
							<a style="color: #B4A078;">
								<span id="order-by-text" style="font-size: 12px;">{{sort.text}}</span>
								<span id="dot-button" class="dot-bottom mui-pull-right"></span>
							</a>
						</div>
					</div>
				</div>
				<div style="width: 150px;line-height: 25px;margin: 5px auto;">
					<div id="tab-list" @click="selectShow('list')" :class="showType === 'list' ? 'tab-active' : 'tab'">列表</div>
					<div id="tab-chart" @click="selectShow('chart')" :class="showType === 'chart' ? 'tab-active' : 'tab'">图形</div>
				</div>
				<div v-show="showType === 'list'">
					<div v-if="count>0" style="overflow: scroll;width: 100%;">
						<van-list
								v-model="loading"
								:finished="finished"
								@load="onLoad"
								:offset="50"
								:immediate-check="false"
							>
							<table id="fixation-head" class="tmp-table" style="z-index: 999;position: relative;margin-top: 5px;">
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
							<table class="tmp-table">
								<tr style="border-top: 0px solid red;">
									<td style="text-align: left;background: #eff1f6;border-top: 0px solid red;" colspan="10">&nbsp;&nbsp;&nbsp;汇总</td>
								</tr>
								<tr v-for="(item, $index) in total" :key="$index+buildKey()">
									<td><div style="max-width: 80px;">{{item.season}}</div></td>
									<td>{{item.order.qty}}</td>
									<td>{{item.target.qty}}</td>
									<td>{{item.diff.qty}}</td>
									<td>{{item.percent.qty}}</td>
									<td>{{item.order.amt}}</td>
									<td>{{item.target.amt}}</td>
									<td>{{item.diff.amt}}</td>
									<td>{{item.percent.amt}}</td>
								</tr>
								<template v-for="(item,index) in list">
									<tr :key="index">
										<td style="text-align: left;background: #eff1f6;" colspan="10"> 
											{{index+1}}、客户账号：{{item.username}} 客户名称：{{item.true_name}}
										</td>
									</tr>
									
									<tr v-for="(it, $key) in item.season" :key="$key+buildKey()">
										<td><div style="max-width: 80px;">{{it.season}}</div></td>
										<td>{{it.order.qty}}</td>
										<td>{{it.target.qty}}</td>
										<td>{{it.diff.qty}}</td>
										<td>{{it.percent.qty}}</td>
										<td>{{it.order.amt}}</td>
										<td>{{it.target.amt}}</td>
										<td>{{it.diff.amt}}</td>
										<td>{{it.percent.amt}}</td> 
									</tr>
								</template>
							</table>
							<div v-if="finished" class="list-loading-finished">没有更多了</div>
						</van-list>
					</div>
					<empty-box v-else content="暂无数据"></empty-box>	
				</div>
				<div  v-show="showType !== 'list'">
					<div id="num-barChart" style="height: 200px;margin-top: 40px;"></div>
					<div id="money-barChart" style="height: 200px;"></div>
				</div>
      </div>
    </div>
		<van-popup v-model="showPopup" position="bottom">
			<van-picker
				show-toolbar
				:columns="columns"
				@cancel="onCancelSort"
				@confirm="changeSort"
			/>
		</van-popup>
  </div>
</template>
<script>
import headerFix from "@/components/headerFix";
import emptyBox from "@/components/emptyBox.vue";
import echarts from "echarts";
// Vue.prototype.$echarts = echarts;
export default {
	data() {
		return {
			count: -1,
			total: 0,
			list: [],
			sort: {},
			keyword: '',
			showType: 'list',
			timer: null,
			showPopup: false,
			numBarChart: null,
			moneyBarChart: null,
			loading: false,
			isloading: false,
			finished: false,
			orderOps: {
				title: '订量指标',
				dataName: ['指标量', '订量'],
				color: ['#4a90e2','#6ce7fe'],
				data: [],
				percent: ''
			},
			amountOps: {
				title: '金额指标',
				dataName: ['指标金额', '金额'],
				color: ['#4a90e2','#6ce7fe'],
				data: [],
				percent: ''
			},
			columns: [
				{ text: '按订量', value: 'order_qty' },
				{ text: '按金额', value: 'order_amt'},
				{ text: '按订量完成率', value: 'percent_qty'},
				{ text: '按金额完成率', value: 'percent_amt'}
			]
		}
	},
	mounted() {
		this.sort = this.columns[0];
		this.getData();
		// this.numBarChart = echarts.init(document.getElementById('num-barChart'));
	},
	components: {
		headerFix,emptyBox
	},
	methods: {
		async getData(isNew = false) {
			let data = {
				offset: 0,
				limit: 20,
				order: this.sort.value,
				keyword: this.keyword,
			}
			let res = await this.axios({
				url: '/wapi/statistics/targe_reach.json',
				method: 'get',
				params: data
			});
			this.count = res.total;
			this.total = res.total_data;
			this.list = !isNew ? this.list.concat(res.data) : res.data;

			var totalData = res.total_data
			for (var i in totalData) {
				if (totalData[i].season === '合计') {
					this.orderOps.data = [totalData[i].target.qty,totalData[i].order.qty];
					this.orderOps.percent = '完成率：'+totalData[i].percent.qty;
					this.amountOps.data = [totalData[i].target.amt,totalData[i].order.amt];
					this.amountOps.percent = '完成率：'+totalData[i].percent.amt;
				}
			}
			if (this.showType === 'chart') {
				if (this.count > 0 ) {
					this.$nextTick(function () {
						this.numBarChart = echarts.init(document.getElementById('num-barChart'));
						this.numBarChart.setOption(this.getOption(this.orderOps))
						this.moneyBarChart = echarts.init(document.getElementById('money-barChart'));
						this.moneyBarChart.setOption(this.getOption(this.amountOps))
					})
				} else {
					this.numBarChart.clear()
					this.moneyBarChart.clear()
				}
			}
		},
		onLoad() {
			if (!this.isloading) {
				this.getData();
				this.isloading = true;
			}
		},
		buildKey() {
			return Math.random();
		},
		searchUsername() {
			clearTimeout(this.timer);
			this.offset = 0;
			this.timer = setTimeout(() => {
				this.getData(true);
			}, 300)
		},
		clearKeyword() {
			this.keyword = '';
			this.getData();
		},
		getOption: function (ops) {
			let options = {
				title: {
					text: ops.title,
					left: 'center',
					top: '-5',
					subtext: ops.percent,
					subtextStyle: {
						color: '#D4282D'
					}
				},
				grid: {
					left: '25%'
				},
				xAxis: {
					type: 'category',
					data: ops.dataName
				},
				yAxis: {
					type: 'value',
					splitNumber: 4
					//max : ops.max*1.25
				},
				series: [{
					data: ops.data,
					type: 'bar',
					barWidth: '45',
					itemStyle: {
						normal: {
							color: function (params){
								var colorList = ops.color;
								return colorList[params.dataIndex];
							}
						}
					},
					label: {
						normal: {
							show: true,
							position: 'top',
							color: '#D4282D',
							formatter: function (params) {
								return helper.toThousands(params['value']);
							} 
						}
					}
				}]
			}
			return options
		},
		changeSort(item){
			this.sort = item;
			this.showPopup = false;
			this.offset = 0;
			this.getData(true);
		},
		onCancelSort(){
			this.showPopup = false;
		},
		selectShow(type) {
			this.showType = type;
			if (this.showType === 'chart') {
				if(this.count > 0) {
					this.$nextTick(function () {
						this.numBarChart = echarts.init(document.getElementById('num-barChart'));
						this.numBarChart.setOption(this.getOption(this.orderOps))
						this.moneyBarChart = echarts.init(document.getElementById('money-barChart'));
						this.moneyBarChart.setOption(this.getOption(this.amountOps))
					})
				}else {
					this.numBarChart.clear()
					this.moneyBarChart.clear()
				}
			} else {
				this.numBarChart.clear()
				this.moneyBarChart.clear()
			}
		}
	}
};
</script>
<style scoped lang="less">
.body-content{
	height: calc(100% - 0.44rem);
}
.search{
	background: white;
	height: 47px;
	display: flex;
	justify-content: space-between;
	.search-input{
		flex: 2;
	}
	.filter{
		flex: 1;
		text-align: right;
		line-height: .47rem;
	}
}
.van-search{
	.van-cell{
		background: #efefef!important;
	}
}
/* 向上的箭头 */
.dot-top {
	font-size: 0;
	line-height: 0;
	border-width: 6px;
	border-color: #B4A078;
	border-top-width: 0;
	border-style: dashed;
	border-bottom-style: solid;
	border-left-color: transparent;
	border-right-color: transparent;
	position: relative;
	left: 5px;
}
/* 向下的箭头 */
.dot-bottom {
	font-size: 0;
	line-height: 0;
	border-width: 6px;
	border-color: #B4A078;
	border-bottom-width: 0;
	border-style: dashed;
	border-top-style: solid;
	border-left-color: transparent;
	border-right-color: transparent;
	position: relative;
	left: 1px;
}  
#order-by {
	font-size: 14px;
	color: #B4A078;
	float: right;
	text-align: right;
	width: 90px;
	margin-top: 8px;
	margin-right: 6px;
}
.mui-popover{
	position: absolute;
	z-index: 999999;
	width: 100%;
	margin-left: 5px;
	border-radius:0px;
	display: none;
	-webkit-transition: opacity .3s;
					transition: opacity .3s;
	-webkit-transition-property: opacity;
					transition-property: opacity;
	-webkit-transform: none;
					transform: none;

	opacity: 0;
	background-color: #f7f7f7;
	-webkit-box-shadow: 0 0 15px rgba(0, 0, 0, .1);
					box-shadow: 0 0 15px rgba(0, 0, 0, .1);
}
.order-by-active {
	color: #B4A078;
}

table{
	table-layout: fixed;
	word-break:break-all;
	border-spacing: 0;
	border-collapse: collapse;
}
.tmp-table {
		font-size: 12px;
		background: #FFFFFF;
		min-width: 100%;
}
.tmp-table tr,td,th {
		border: 1px solid #dfe6ec;
}
.tmp-table td {
		text-align: center;
		min-width: 50px;
}
.tab {
		width: 75px;
		float: left;
		background: white;
		text-align: center;
}
.tab-active {
		width: 75px;
		float: left;
		background: #B1A078;
		text-align: center;
		color: white;
}
</style>
