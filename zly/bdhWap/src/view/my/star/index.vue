<!--
 *明星店铺
-->
<template>
	<div class="container">
		<header-fix centerText="明星店铺">
			<div slot="right" class="right-bar">
				<div class="filter" style="display: inline-block;" @click="showPopup = true">
					<a style="color: #B4A078;">
						<span id="order-by-text" style="font-size: 12px;">{{sort.text}}</span>
						<span id="dot-button" class="dot-bottom mui-pull-right"></span>
					</a>
				</div>
			</div>
		</header-fix>
		<div class="body-content" v-show="!empty">
			<!-- header -->
			<div style="width: 100%; height: 47px; line-height: 47px; text-align: center;">{{areaName}}</div>
			<div class="title-box">
				<div class="line">
					<div class="flex" @click="changeShowTitleTab(0)" :class="{active: !showTitleTab}">常用报表</div>
					<div class="flex" @click="changeShowTitleTab(1)" :class="{active: showTitleTab}">自定义报表</div>
				</div>
				<div class="used" v-if="!showTitleTab">
					<span class="used-item" :class="{active: activeCombo == 1}" @click="changeGroups(1)">季节-大类</span>
					<span class="used-item" :class="{active: activeCombo == 2}" @click="changeGroups(2)">季节-波段</span>
					<span class="used-item" :class="{active: activeCombo == 3}" @click="changeGroups(3)">季节-品牌</span>
				</div>
				<div class="custom" v-if="showTitleTab">
					<div class="display-flex">
						<span class="custom-item">
							<input
								id="custom-season"
								type="checkbox"
								@change="changeGroups()"
								v-model="groups"
								value="season"
							>
							<label for="custom-season">季节</label>
						</span>
						<span class="custom-item">
							<input
								id="custom-gbname"
								type="checkbox"
								@change="changeGroups()"
								v-model="groups"
								value="gbname"
							>
							<label for="custom-gbname">品牌</label>
						</span>
						<span class="custom-item">
							<input
								id="custom-updown"
								type="checkbox"
								@change="changeGroups()"
								v-model="groups"
								value="updown"
							>
							<label for="custom-updown">上下装</label>
						</span>
						<span class="custom-item">
							<input
								id="custom-band"
								type="checkbox"
								@change="changeGroups()"
								v-model="groups"
								value="band"
							>
							<label for="custom-band">波段</label>
						</span>
						<span class="custom-item">
							<input
								id="custom-color"
								type="checkbox"
								@change="changeGroups()"
								v-model="groups"
								value="color"
							>
							<label for="custom-color">颜色</label>
						</span>
						<span class="custom-item">
							<input
								id="custom-size"
								type="checkbox"
								@change="changeGroups()"
								v-model="groups"
								value="size"
							>
							<label for="custom-size">尺码</label>
						</span>
						<span class="custom-item">
							<input id="custom-sex" type="checkbox" @change="changeGroups()" v-model="groups" value="sex">
							<label for="custom-sex">性别</label>
						</span>
					</div>
					<div class="display-flex">
						<span class="custom-item">
							<input
								id="custom-pricezone"
								type="checkbox"
								@change="changeGroups()"
								v-model="groups"
								value="pricezone"
							>
							<label for="custom-pricezone">价格带</label>
						</span>
						<span class="custom-item">
							<input
								id="custom-goodsstyle"
								type="checkbox"
								@change="changeGroups()"
								v-model="groups"
								value="goodsstyle"
							>
							<label for="custom-goodsstyle">款式类型</label>
						</span>
						<span class="custom-item">
							<input
								id="custom-category1"
								type="checkbox"
								@change="changeGroups()"
								v-model="groups"
								value="category1"
							>
							<label for="custom-category1">一级分类</label>
						</span>
						<span class="custom-item">
							<input
								id="custom-category2"
								type="checkbox"
								@change="changeGroups()"
								v-model="groups"
								value="category2"
							>
							<label for="custom-category2">大类</label>
						</span>
						<span class="custom-item">
							<input
								id="custom-category3"
								type="checkbox"
								@change="changeGroups()"
								v-model="groups"
								value="category3"
							>
							<label for="custom-category3">小类</label>
						</span>
					</div>
				</div>
			</div>

			<!-- table -->
			<div class="table-box">
				<table
					id="fixation-head"
					class="tmp-table"
					cellspacing="0"
				>
					<tr style="height: 30px;background: #eff1f6;">
						<template v-for="item in groups">
							<td rowspan="2" :key="item + buildKey()">
								<div>{{group_list[item]}}</div>
							</td>
						</template>
						<template v-if="has_size == 0">
							<td colspan="3">
								<div>款数</div>
							</td>
							<td colspan="3">
								<div>款色数</div>
							</td>
						</template>
						<td colspan="2">
							<div>订货量</div>
						</td>
						<template v-if="has_size == 0">
							<td colspan="2">
								<div>订货金额</div>
							</td>
						</template>
					</tr>
					<tr style="height: 30px;background: #eff1f6;">
						<template v-if="has_size == 0">
							<td>
								<div>开发</div>
							</td>
							<td>
								<div>已订</div>
							</td>
							<td>
								<div>单款深度</div>
							</td>
							<td>
								<div>开发</div>
							</td>
							<td>
								<div>已订</div>
							</td>
							<td>
								<div>款色深度</div>
							</td>
						</template>
						<td>
							<div>件数</div>
						</td>
						<td>
							<div>占比</div>
						</td>
						<template v-if="has_size == 0">
							<td>
								<div>金额</div>
							</td>
							<td>
								<div>占比</div>
							</td>
						</template>
					</tr>
				</table>
				<table class="tmp-table" cellspacing="0">
					<template v-if="groups.length > 1">
						<tr v-if="getLength(total)">
							<td colspan="2">
								<div>汇总</div>
							</td>
							<td :key="'total' + key" v-for="(item, key) in total">
								<div>{{item}}</div>
							</td>
						</tr>
						<template v-for="(item, key) in list">
							<template v-for="(ite,k,index) in item">
								<tr :key="key + k + buildKey()">
									<template v-if="index === 0">
										<td v-bind:rowspan="getLength(item)">
											<div>{{key}}</div>
										</td>
									</template>
									<td>
										<div>{{k}}</div>
									</td>
									<template v-for="(it, $k) in ite">
										<td :key="$k">
											<div>{{it}}</div>
										</td>
									</template>
								</tr>
							</template>
						</template>
					</template>
					<template v-else>
						<tr v-if="getLength(total)">
							<td>
								<div>汇总</div>
							</td>
							<td :key="'total' + key + buildKey()" v-for="(item, key) in total">
								<div>{{item}}</div>
							</td>
						</tr>
						<template v-for="(item, $key) in list">
							<tr :key="$key + buildKey()">
								<td>
									<div>{{$key}}</div>
								</td>
								<template v-for="(ite) in item">
									<template v-for="(it, $ke) in ite">
										<td :key="$ke + buildKey()">
											<div>{{it}}</div>
										</td>
									</template>
								</template>
							</tr>
						</template>
					</template>
				</table>
				<template v-if="!getLength(total)">
					<div style="font-size: 12px;margin-top: 10px; text-align: center;">暂无数据</div>
				</template>
			</div>
			<!-- 图表 -->
			<div class="line echart-title">
				<div class="flex" :class="{active: eChartType == 'columnar'}" @click="changeEchartType('columnar')">柱状图</div>
				<div class="flex" :class="{active: eChartType == 'pie'}" @click="changeEchartType('pie')">饼状图</div>
			</div>
			<div class="chart-list">
				<div id="e-chart" style="width:100%;height: 400px;">
					<empty-box v-show="chartNoData" content="暂无数据"></empty-box>
				</div>
			</div>
		</div>
		<empty-box v-show="empty" content="暂无数据"></empty-box>
		<div class="copy" v-show="!empty" @click="copyStore">一键复制到我的店铺</div>
		<filter-controller
			:is-show="filterDisplay"
			:selectList="selectList"
			v-show="filterDisplay"
			@submit="searchList"
			@close="filterDisplay = false"
		></filter-controller>
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
import filterController from "@/components/filterController/filterControllerAnalyze.vue";
import echarts from "echarts";
let eChart = null;
export default {
	data() {
		return {
			filterDisplay: false,
			category_id1: [],
			category_id2: [],
			category_ids: [],
			attributes: [],
			brand_ids: [],
			list: [],
			total: {},
			saveGroups: "season",
			groups: ["season", "category2"],
			showTitleTab: 0,
			activeCombo: 1,
			group_list: {
				season: "季节",
				gbname: "品牌",
				goodsstyle: "款式类型",
				updown: "上下装",
				band: "波段",
				category1: "一级分类",
				category2: "大类",
				category3: "小类",
				color: "颜色",
				pricezone: "价格带",
				size: "尺码",
				sex: "性别"
			},
			has_size: 0,
			key_values: {
				波段: "band",
				尺码: "size",
				颜色: "color",
				季节: "season",
				款式类型: "goodsstyle",
				性别: "sex",
				上下装: "updown",
				价格带: "pricezone"
			},
			value_keys: {
				band: "波段",
				size: "尺码",
				color: "颜色",
				season: "季节",
				goodsstyle: "款式类型",
				sex: "性别",
				updown: "上下装",
				pricezone: "价格带",
				gbname: "品牌",
				category1: "一级分类",
				category2: "大类",
				category3: "小类"
			},
			barXData: [],
			barYData: [],
			echartsName: [],
			chartType: "category",
			ids: 0,
			eChartType: 'columnar',
			selectList: [],
			columns: [
				{ text: '省明星店铺', value: 1},
				{ text: '区明星店铺', value: 2},
			],
			sort: {},
			showPopup: false,
			memberId: 0,
			areaName: '',
			empty: false,
			type: 1,
			chartNoData: false
		};
	},
	created() {
		this.sort = this.columns[0];
		this.getStore();
	},
	mounted() {
		// this.bulidEcharts();
	},
	methods: {
		changeSort(item){
			this.sort = item;
			this.type = item.value;
			this.showPopup = false;
			this.getStore();
		},
		onCancelSort(){
			this.showPopup = false;
		},
		searchList(list) {
			this.category_ids = list.category_ids;
			this.category_id1 = list.category_id1;
			this.category_id2 = list.category_id2;
			this.brand_id = list.brand_ids;
			this.attributes = list.attributes;
			this.filterDisplay = false;
			this.getList(true);
		},
		async getStore() {
			let res = await this.axios({
				url: "/wapi/order_analysis/star.json",
			})
			let data = res.data;
			if(data) {
				if((this.type === 1 && data.province_id) || (this.type === 2 && data.region_id)) {
					//省明星店铺
					if(data.province_id) {
						this.memberId = data.province_id;
						this.areaName = data.province_name;
					}
					//区明星店铺
					if(data.region_id) {
						this.memberId = data.region_id;
						this.areaName = data.region_name;
					}
					await this.getList();
					this.empty = false;
				} else {
					this.empty = true;
				}
			}else {
				// 无数据
				this.empty = true;
			}
		},
		async getList() {
			let res = await this.axios({
				url: "/wapi/order_analysis/analysis.json",
				params: {
					groups: this.groups.join(","),
					gbname: this.attributes['品牌'] && this.attributes['品牌'].join(','),
					color: this.attributes['颜色'] && this.attributes['颜色'].join(','),
					size: this.attributes['尺码'] && this.attributes['尺码'].join(','),
					season: this.attributes['季节'] && this.attributes['季节'].join(','),
					band: this.attributes['波段'] && this.attributes['波段'].join(','),
					goodsstyle: this.attributes['款式类型'] && this.attributes['款式类型'].join(','),
					sex: this.attributes['性别'] && this.attributes['性别'].join(','),
					updown: this.attributes['上下装'] && this.attributes['上下装'].join(','),
					category1: this.category_id1,
					category2: this.category_id2,
					category3: this.category_ids.join(','),
					member_id: this.memberId
				}
			});
			this.list = res.data.rtn;
			this.has_size = 0;
			this.total = res.data.total;
			this.selectList = res.data.newarr;
			if (!res.data.rtn) {
				this.total = {};
			}
			for (let i in this.groups) {
				if (this.groups[i] === "size") {
					this.has_size = 1;
				}
			}
			this.chartTitle = "";
			if (this.groups.length === 1) {
				this.chartTitle = this.value_keys[this.groups[0]];
				var tmp = {};
				for (var i in res.data.rtn) {
					tmp[i] = { a: res.data.rtn[i] };
				}
				this.list = tmp;
			} else {
				this.chartTitle =
					this.value_keys[this.groups[0]] +
					"-" +
					this.value_keys[this.groups[1]];
			}
			this.buildEchartsOption(res);
		},
		buildEchartsOption(res) {
			//获取图表数据
			this.barXData = [];
			this.barYData = [];
			this.pieData = [];
			this.echartsName = [];
			let dataIndex = this.has_size === 0 ? 6 : 0;
			if (this.groups.length === 1) {
				for (let i in res.data.rtn) {
					if (res.data.rtn[i][dataIndex] > 0) {
						this.barXData.unshift(i);
						this.barYData.unshift(res.data.rtn[i][dataIndex]);
						this.pieData.unshift({
							value: res.data.rtn[i][dataIndex],
							name: i
						});
						this.echartsName.unshift(i);
					}
				}
			} else {
				for (let i in res.data.rtn) {
					for (let ii in res.data.rtn[i]) {
						if (res.data.rtn[i][ii][dataIndex] > 0 && ii !== "合计") {
							this.barXData.unshift(i + "-" + ii);
							this.barYData.unshift(res.data.rtn[i][ii][dataIndex]);
							this.pieData.unshift({
								value: res.data.rtn[i][ii][dataIndex],
								name: i + "-" + ii
							});
							this.echartsName.unshift(i + "-" + ii);
						}
					}
				}
			}
			if(this.echartsName.length > 0) {
				// this.setEchartsOption();
				this.chartNoData = false;
				this.bulidEcharts();
			} else {
				this.chartNoData = true;
			}
		},
		changeShowTitleTab(tabIndex) {
			this.showTitleTab = tabIndex;
			this.groups = tabIndex ? ["season"] : ["season", "category1"];
			this.activeCombo = 1;
			this.getList();
		},
		changeGroups(isCombo = false) {
			if (isCombo) {
				this.activeCombo = isCombo;
				switch (isCombo) {
				case 1:
					this.groups = ["season", "category1"];
					break;
				case 2:
					this.groups = ["season", "band"];
					break;
				case 3:
					this.groups = ["season", "gbname"];
					break;
				default:
					null;
				}
			}
			let groups = this.groups;
			if (groups.length > 2) {
				groups.shift();
			} else if (groups.length === 1) {
				this.saveGroups = groups[0];
			} else if (groups.length < 1) {
				groups.push(this.saveGroups);
			}
			this.getList();
		},
		getLength: function(obj) {
			return Object.keys(obj).length;
		},
		buildKey() {
			return Math.random();
		},
		//bulidEcharts
		changeEchartType(type){
			this.eChartType = type;
			if(this.echartsName.length > 0) {
				// this.setEchartsOption();
				this.chartNoData = false;
				this.bulidEcharts();
			} else {
				this.chartNoData = true;
			}
		},
		bulidEcharts() {
			this.$nextTick(() => {
				eChart = echarts.init(document.getElementById("e-chart"));
				this.setEchartsOption();
			});
			// this.list = res.data;
		},
		setEchartsOption() {
			let options = null;
			if (this.eChartType === "pie") {
				options = {
					title: {
						text: this.chartTitle,
						top: "20",
						x: "center",
						textStyle: {
							fontSize: 14,
							align: "center"
						}
					},
					tooltip: {
						trigger: "item",
						formatter: "{b} </br>占比：{d} % (件数：{c})",
						hideDelay: 1000
					},
					series: [
						{
							name: "订货数量占比",
							type: "pie",
							radius: "55%",
							center: ["50%", "60%"],
							data: this.pieData,
							label: {
								normal: {
									show: true,
									formatter: "{b} : {d}%"
								}
							},
							itemStyle: {
								emphasis: {
									shadowBlur: 10,
									shadowOffsetX: 0,
									shadowColor: "rgba(0, 0, 0, 0.5)"
								}
							}
						}
					]
				};
			} else {
				options = {
					title: {
						text: this.chartTitle,
						top: "20",
						x: "center",
						textStyle: {
							fontSize: 14,
							align: "center"
						}
					},
					tooltip: {
						trigger: "axis",
						formatter: "{b}</br> 件数: {c}件",
						axisPointer: {
							type: "shadow"
						}
					},
					grid: {
						left: "3%",
						right: "4%",
						top: "80",
						containLabel: true
					},
					xAxis: {
						name: "订货数量",
						nameGap: "60",
						nameLocation: "center",
						type: "value",
						axisLine: {
							show: false
						},
						axisTick: {
							show: false
						},
						axisLabel: {
							rotate: 60
						},
						boundaryGap: [0, 0.01]
					},
					yAxis: {
						type: "category",
						data: this.barXData
					},
					series: [
						{
							name: "订货数量",
							type: "bar",
							data: this.barYData,
							barWidth: 8,
							itemStyle: {
								emphasis: {
									barBorderRadius: 1
								},
								normal: {
									barBorderRadius: 1
								}
							}
						}
					]
				};
			}
			eChart.clear();
			eChart.setOption(options);
		},
		async copyStore() {
			let data = {};
			data.member_id = this.memberId;
			data.need_pass = -1;
			let res = await this.axios({
				url: '/wapi/order_analysis/copyorders.json',
				params: data
			})
			this.$toast(res.message);
		}
	},
	components: {
		headerFix,
		filterController,
		emptyBox
	}
};
</script>
<style lang="less" scoped>
.line {
	display: flex;
	border: 1px solid #efefef;
	.flex {
		flex: 1;
		line-height: 0.25rem;
		height: 0.25rem;
		text-align: center;
		&.active {
			background-color: #b1a078;
			color: #fff;
		}
	}
}
.title-box {
	width: 100%;
	font-size: 0.12rem;
	background-color: #fff;
	.used {
		display: flex;
		padding: 0.03rem 0 0 0.03rem;
		.used-item {
			flex: 1;
			text-align: center;
			line-height: 0.25rem;
			height: 0.25rem;
			margin: 0 0.03rem 0.03rem 0;
			border: 1px solid #efefef;
			&.active {
				background-color: #b1a078;
				color: #fff;
			}
		}
	}
	.custom {
		width: 100%;
		padding: 0.1rem;
		.custom-item {
			flex: 1;
			text-align: center;
			padding: 0.02rem;
			input {
				display: none;
			}
			label {
				padding: 0.03rem 0;
				width: 100%;
				display: inline-block;
			}
			input:checked + label {
				background-color: #b1a078;
				color: #fff;
				border-radius: 0.04rem;
			}
		}
	}
}
.table-box {
	overflow: scroll;
	background-color: #fff;
}
table {
	table-layout: fixed;
	word-break: break-all;
	border-spacing: 0;
	border-collapse: collapse;
}
.tmp-table {
	margin-top: 10px;
	font-size: 12px;
	background: #ffffff;
	min-width: 100%;
}
.tmp-table tr,
td,
th {
	border: 1px solid #dfe6ec;
	text-align: center;
}
.tmp-table td {
	min-width: 50px;
}
.echart-title{
	padding-top: 0.1rem;
}
#fixation-head{
	z-index: 2;
	position: relative;
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
	left: 0.40rem;
	top: -0.46rem;
}
.filter{
	position: relative;
	right: 0.2rem;
}
.copy{
	height: 0.5rem;
	line-height: 0.5rem;
	background: #b1a078;
	color: #ffffff;
	text-align: center;
	position: fixed;
	width: 100%;
	bottom: 0;
}
</style>
