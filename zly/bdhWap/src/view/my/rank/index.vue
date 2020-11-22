<!--
	*订货排行
-->
<template>
	<div class="container">
    <header-fix centerText="订货排行">
			<div slot="right" class="filter" @click="filterDisplay = true">筛选<img height="16" src="~assets/img/common/icon-filter.png"/></div>
		</header-fix>
    <div class="body-content">
      <div class="rank">
        <div id="wrap">
					<div class="mui-content" v-cloak>
						<div class="search">
							<div class="text">排序</div>
							<div class="filter" style="display: inline-block;" @click="showPopup = true">
								<a style="color: #B4A078;">
									<span id="order-by-text" style="font-size: 12px;">{{sort.text}}</span>
									<span id="dot-button" class="dot-bottom mui-pull-right"></span>
								</a>
							</div>
						</div>
						<div v-show="no_data" id="myorder" class="mui-content mui-scroll-wrapper">
							<van-list
								v-model="loading"
								:finished="finished"
								@load="onLoad"
								:offset="50"
								:immediate-check="false"
							>
								<div class="mui-scroll">
									<ul class="rank-list mui-clearfix">
										<li v-for="(product,$index) in list" :key="$index" class="mui-clearfix">
											<div v-if="product.goods_id" class="content-item">
												<div class="item-box">
													<span class="item-index">{{$index + 1}}</span>
													<div class="item-pic">
														<img :src="product.goods_pic+'?x-oss-process=image/resize,h_70,w_70'" />
													</div>
													<div class="item-rt">
														<h3 class="fz14 c333">{{product.goods_no}} - {{product.category_name}} <span v-if="singleColor">- {{product.color[0]}}</span></h3>
														<div class="item-detail">
															<div class="item-d-lg">
																<span>排名</span>
															</div>
															<div class="item-d-sm">
																<strong>{{product.sort_p}}</strong>
																<span class="fz14">个人</span>
															</div>
															<div class="item-d-sm">
																<strong>{{product.sort_m}}</strong>
																<span class="fz14">大区</span>
															</div>
															<div class="item-d-sm">
																<strong>{{product.sort}}</strong>
																<span class="fz14">全国</span>
															</div>
														</div>
													</div>
												</div>
												<span class="mui-pull-right c9b9b9b fz14">
													订量 {{product.quantity}} &nbsp; 金额 {{product.amount}}
												</span>
											</div>
											<div v-else class="total">
												大类：{{product.cate2_name}} 总订量：{{product.quantity}} 总金额：{{product.amount}} 个人: {{product.sort_p}} 大区: {{product.sort_m}} 全国: {{product.sort}}
											</div>
										</li>
									</ul>
								</div>
								<div class="list-loading-finished">加载中...</div>
							</van-list>
						</div>
						<empty-box v-show="!no_data" content="暂无数据"></empty-box>
					</div>
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
		<rank-filter :is-show="filterDisplay" v-show="filterDisplay" @submit="searchList" @close="filterDisplay = false"></rank-filter>
  </div>
</template>
<script>
import headerFix from "@/components/headerFix";
import emptyBox from "@/components/emptyBox.vue";
import rankFilter from './rankFilter.vue';
export default {
	data() {
		return {
			data: {},
			list: [],
			sort: {},
			index: 0,
			offset: 0,
			limit: 20,
			singleColor: false,
			showPopup: false,
			filterDisplay: false,
			loading: false,
			isloading: false,
			finished: false,
			columns: [
				{ text: '订量多到少', value: 'quantity_desc' },
				{ text: '订量少到多', value: 'quantity_asc'},
				{ text: '金额大到小', value: 'amount_desc'},
				{ text: '金额小到大', value: 'amount_asc'}
			],
			sortValue: '',
		}
	},
	mounted() {
		this.sort = this.columns[0];
		this.sortValue = this.sort.value;
		this.getData();
	},
	components: {
		headerFix,emptyBox,rankFilter
	},
	methods: {
		async getData(isNew = false) {
			this.data.offset = this.offset;
			this.data.limit = this.limit;
			let res = await this.axios({
				url: '/wapi/statistics/rank.json',
				method: 'post',
				data: this.data
			});
			this.list = !isNew ? this.list.concat(res.data) : res.data;
			if (res.data.length < this.limit) {
				this.finished = true;
			}
			this.isloading = false;
			this.loading = false;
			this.offset += this.limit;
		},
		searchList(condition) {
			this.filterDisplay = false;
			if (condition) {
				this.offset = 0;
				this.data.type = condition.type[0].value;
				if(this.data.type === "single_color"){
					this.singleColor = true;
				}else{
					this.singleColor = false;
				}
				this.data.sort_by = condition.sortBy[0].value;
				this.data.category_id = condition.categorys.map(function(v){
					return v.id
				}).join(',');
				this.data.attributes = [];
				for(var i=0;i<condition.attributes.length;i++){
					if(condition.attributes[i].values.length){
						this.data.attributes.push({
							id: condition.attributes[i].id,
							values: condition.attributes[i].values
						})
					}
				}
			} else {
				this.data.type = '';
				this.data.sort_by = '';
				this.data.attributes = [];
				this.data.category_id = '';
			}
			this.getData(true);
		},
		onLoad() {
			if (!this.isloading) {
				this.getData();
				this.isloading = true;
			}
		},
		changeSort(item){
			this.offset = 0;
			this.sort = item;
			this.data.sort = item.value;
			this.showPopup = false;
			this.getData(true);
		},
		onCancelSort(){
			this.showPopup = false;
		}
	},
	computed: {
		no_data: function(){
			return this.list.length > 0;
		}
	}
};
</script>
<style scoped lang="less">
.body-content{height: calc(100% - 0.44rem);}
#wrap{background: #EDEEEF;height: 100vh;position: relative;}
#myorder{top:40px;}
.title {padding: 20px 15px 10px;color: #6d6d72;font-size: 15px;background-color: #fff;}
.sort-cont{padding: 0 16px;line-height: 32px;background: #fff;}
.rank-list .content-item{margin-bottom: 9px;background: #fff;height: 130px;padding: 12px;}
.total{line-height: 16px;padding: 6px 15px;background-color: #F7F7F7;font-size: 11px;color: #333;}
.item-box{display: flex;align-items: center;margin-bottom: 16px;}
.item-index{width: 18px;color: #292929; font-size: 12px}
.item-pic{width: 62px;height: 62px;margin-right: 15px;border-radius: 4px;overflow: hidden;background-color: #ddd;}
.item-pic img{width: 100%;height: 100%;border-radius: 4px;}
.item-rt{flex: 1;display: flex;flex-direction: column;justify-content: space-between;height: 70px;}
.item-detail{display: flex;justify-content: space-between;}
.item-d-lg,.item-d-sm{display: flex;flex-direction: column;justify-content: space-between;}
.item-d-lg strong{font-size: 18px;color: #D0021B}
.item-d-sm strong{font-size: 18px;color: #333}
.item-d-lg span,.item-d-sm span{font-size: 15px;color: #9B9B9B}
.no-data-box{height: 75vh;}
.no-data{width: 70px;padding-top: 30vh;margin: 0 auto;text-align: center;font-size: 14px;color: #9B9B9B}
.no-data img{width: 46px;margin-bottom: 14px;}
.list-item.active span{color: #B4A078;}
.list-item .mui-icon{display: none;float: right;font-size: 32px;}
.list-item.active .mui-icon{display: inline-block;}
.fz14{font-size: 14px;}
.c9b9b9b{color: #b9b9b9;}
.mui-pull-right{float: right;}
.search{padding:0 .1rem; background: white;height: 47px; line-height: 47px; display: flex;justify-content: space-between;
	.text{background: #ffffff;flex: 1; text-align: left; font-size: 14px;}
	.filter{flex: 1;text-align: right;line-height: .47rem;
	}
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
	top: 22px;
}
</style>
