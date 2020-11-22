<!--
	*订量汇总
-->
<template>
	<div class="container">
    <header-fix centerText="订量汇总"></header-fix>
    <div class="body-content">
      <div class="collect">
        <div class="search">
					<van-search @keyup="searchUsername" @clear="clearKeyword" v-model="goods_no" class="search-ctrl search-input" background="#fff" placeholder="商品款号" />
					<div class="filter" @click="filterDisplay = true">筛选<img height="16" src="~assets/img/common/icon-filter.png"/></div>
				</div>
				<div v-if="count>0">
					<div style="width: 100%;text-align: center;font-size: 14px;line-height: 30px;background: #cdcfd3;">
						必定火品牌测试订货会-商品订量汇总
					</div>
					<van-list
							v-model="loading"
							:finished="finished"
							@load="onLoad"
							:offset="50"
							:immediate-check="false"
						>
						<div style="overflow: scroll;">
							<table id="fixation-head" class="tmp-table" style="z-index: 1000;position: relative;">
								<tr class="table-title" style="background: #f0f0f0;">
									<td>序号</td>
									<td><div style="width: 68px;">图片</div></td>
									<td>大类</td>
									<td>小类</td>
									<td>圆牌号</td>
									<td>款号</td>
									<td>价格</td>
									<td>颜色</td>
									<td v-for="(item, index) in total" :key="'a'+index">{{item.size}}</td>
									<td>小计</td>
									<td>总小计</td>
								</tr>
							</table>
							<table class="tmp-table">
								<tr  style="border-top: 0px solid red;">
									<td colspan="8"  style="border-top: 0px solid red;">合计</td>
									<td v-for="(item, index) in total" :key="'b'+index">{{item.value}}</td>
									<td>{{total_num}}</td>
									<td>{{total_num}}</td>
								</tr>
								<template v-for="(item,$index) in list">
									<tr :key="'c'+$index">
										<td :rowspan="item.sku.length">{{$index+1}}</td>
										<td :rowspan="item.sku.length">
											<template v-if="item.info.goods_pic">
												<img style="width: 66px;height: 66px;margin-left: 2px;margin-top: 2px;" :src="item.info.goods_pic + '?x-oss-process=image/resize,h_66,w_66' + (isMeetingEnd ? '/blur,r_7,s_7':'')" />
											</template>
											<template v-else>
												<img style="width: 66px;height: 66px;margin-left: 2px;margin-top: 2px;" class="mui-media-object" src="http://biding365.oss-cn-hangzhou.aliyuncs.com/public/nopic.jpg?x-oss-process=image/resize,m_pad,h_66,w_66,color_FFFFFF">
											</template>
										</td>
										<td :rowspan="item.sku.length">{{item.info.category[1]}}</td>
										<td :rowspan="item.sku.length">{{item.info.category[2]}}</td>
										<td :rowspan="item.sku.length">{{item.info.card_no}}</td>
										<td :rowspan="item.sku.length">{{item.info.goods_no}}</td>
										<td :rowspan="item.sku.length">{{item.info.price}}</td>
										<td>{{item.sku[0].color}}</td>
										<td v-for="(it, index) in total" :key="'d'+index">{{getNum(item.sku[0].size, it.size)}}</td>
										<td>{{getTotal(item.sku[0].size)}}</td>
										<td :rowspan="item.sku.length">{{item.total}}</td>
									</tr>
									<template v-for="(it, $key) in item.sku">
										<template v-if="$key>0">
											<tr	:key="Math.random() + $key">
												<td>{{it.color}}</td>
												<td v-for="(i, index) in total" :key="'f'+index">
													{{getNum(it.size, i.size)}}
												</td>
												<td>{{getTotal(it.size)}}</td>
											</tr>
										</template>
									</template>
								</template>
							</table>
						</div>
						<div v-if="finished" class="list-loading-finished">没有更多了</div>
					</van-list>
				</div>
				<empty-box v-else content="暂无数据"></empty-box>
      </div>
    </div>
		<collect-filter :is-show="filterDisplay" v-show="filterDisplay" @submit="searchList" @close="filterDisplay = false"></collect-filter>
  </div>
</template>
<script>
import headerFix from "@/components/headerFix";
import collectFilter from './collectFilter.vue';
import emptyBox from "@/components/emptyBox.vue";
export default {
	data() {
		return {
			keyword: '',
			goods_no: '',
			count: -1,
			list: [],
			total: {},
			data: {},
			total_num: 0,
			limit: 20,
			offset: 0,
			timer: null,
			loading: false,
			isloading: false,
			finished: false,
			filterDisplay: false,
		}
	},
	mounted() {
		this.getData()
	},
	components: {
		headerFix,collectFilter,emptyBox,
	},
	computed: {
		isMeetingEnd(){
			return this.$store.getters.getMeetingInfo;
		}
	},
	methods: {
		async getData(isNew = false) {
			this.data.goods_no = this.goods_no;
			this.data.offset = this.offset;
			this.data.limit = this.limit;
			this.data.keyword = this.keyword;

			let res = await this.axios({
				url: '/wapi/statistics/order_summary.json',
				method: 'get',
				params: this.data
			});
			
			this.total = res.total_data;
			this.list = !isNew ? this.list.concat(res.list_data) : res.list_data;
			this.count = this.list.length;
			this.total_num = 0;
			for (var i in res.total_data) {
				this.total_num += res.total_data[i].value
			}
			
			if (res.list_data.length < this.limit) {
				this.finished = true;
			}
			this.isloading = false;
			this.loading = false;
			this.offset += this.limit;
		},
		onLoad() {
			if (!this.isloading) {
				this.getData();
				this.isloading = true;
			}
		},
		searchList(condition) {
			this.filterDisplay = false;
			var _this = this
			_this.category_id = ''
			_this.keyword = ''
			_this.offset = 0;
			if (condition) {
				_this.data.keyword = condition.keyword;
				//分类
				if(condition.categorys.length) {
					var child = condition.categorys[0].sub || [];
					var childSel = child.filter(function(v) {
						return v.isActive;
					})[0];
					if(childSel) {
						var grand = childSel.sub || [];
									
						if(grand.length){
							_this.data.category_id = grand.filter(function(v) {
								return v.isActive;
							}).map(function(v) {
								return v.id
							}).join(',');
						}
						if(!_this.data.category_id){
							_this.data.category_id = childSel.id;
						}
					}else{
						_this.data.category_id = condition.categorys[0].id;
					}
				}
			} else {
				this.data.keyword = '',
				this.data.category_id = ''
			}
			this.getData(true);
		},
		searchUsername() {
			this.offset = 0;
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.getData(true);
			}, 300)
		},
		clearKeyword() {
			this.goods_no = '';
			this.finished = false;
			this.offset = 0;
			this.getData(true);
		},
		getNum: function(obj, size) {
			try {
				return obj[size] ? obj[size] : '-';
			} catch(e) {
				return '-'
			}
		},
		getTotal: function(obj) {
			var num = 0
			for (var i in obj) {
				num += obj[i]
			}
			return num
		},
	}
};
</script>
<style scoped lang="less">
	.body-content{
		height: calc(100% - 0.44rem);
	}
	.collect{
		.search{
			background: white;
			height: 47px;
			display: flex;
			.search-input{
				background: #ffffff;
				flex: 1;
				flex: 2.8rem 0 0;
				.van-cell{
					background: rgb(242, 242, 242);
				}
			}
			.filter{
				flex: 1;
				text-align: right;
				line-height: .47rem;
			}
		}
		.name{
			width: 100%;
			text-align: center;
			font-size: 14px;
			line-height: 30px;
			background: #cdcfd3;
		}
	}
	table {
		background: #FFFFFF;
		word-break:break-all;
		border-spacing: 0;
    border-collapse: collapse;
	}
	table{ table-layout: fixed;}
	.tmp-table {
		font-size: 12px;
		background: #FFFFFF;
		min-width: 100%;
	}
	.tmp-table tr,td,th {
		border: 1px solid #dfe6ec;
		letter-spacing: 0;
	}
	.tmp-table td {
		text-align: center;
		min-width: 50px;
	}
</style>
