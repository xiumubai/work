<template>
	<div class="container">
		<header-fix :show-right="false">
			<router-link slot="left" :to="{name: 'SearchCompany'}">返回</router-link>
			<div slot="center"><van-search v-model="keyword" @search="search()" class="search-ctrl" background="#fff" placeholder="请输入圆牌号/款号"/></div>
		</header-fix>
		<div class="display-flex filter-sort-box">
			<div class="flex sort" @click="showPopup = true">{{sort.text}}<van-icon name="arrow-down"/></div>
			<div class="flex" @click="filterDisplay = true">筛选<img height="16" src="~assets/img/common/icon-filter.png"/></div>
		</div>
		<div class="body-content">
			<van-list
				v-model="loading"
				:finished="finished"
				@load="onLoad"
				:offset="50"
				:immediate-check="false"
			>
				<div class="list-box">
					<router-link :to="{name:'GoodsInfo',query:{id: goods.id}}" class="list-item" v-for="goods in list" :key="goods.goods_no">
						<img-box :goods="goods"></img-box>
						<p class="sku">{{goods.goods_no}}</p>
						<p class="price">&yen;{{goods.meeting_price}}</p>
						<p class="tip">已订{{goods.total_number}}件，共￥{{goods.order_money}}</p>
					</router-link>
				</div>
				<div v-if="finished" class="list-loading-finished">没有更多了</div>
			</van-list>
		</div>
		<van-popup v-model="showPopup" position="bottom">
			<van-picker
				show-toolbar
				:columns="columns"
				@cancel="onCancelSort"
				@confirm="changeSort"
			/>
		</van-popup>
		<footer-fix></footer-fix>
		<filter-controller :is-show="filterDisplay" v-show="filterDisplay" @submit="searchList" @close="filterDisplay = false"></filter-controller>
	</div>
</template>
<script>
import headerFix from "@/components/headerFix";
import footerFix from "@/components/footerFix";
import defaultImage from "@/assets/img/common/logo.png";
import imgBox from '@/components/imgBox.vue';
import filterController from '@/components/filterController/filterController.vue';

export default {
	name: 'Single',
	data() {
		return {
			list: [],
			defaultImage,
			offset: 0,
			limit: 20,
			loading: false,
			isloading: false,
			finished: false,
			filterList: null,
			filterDisplay: false,
			showPopup: false,
			keyword: '',
			sort: {},
			searchLock: null,
			category_ids: [],
			attributes: [],
			brand_ids: [],
			columns: [
				{ text: '波段从小到大', value: 'boduan-0' },
				{ text: '波段从大到小', value: 'boduan-1'},
				{ text: '圆牌号从小到大', value: 'card_no-0'},
				{ text: '圆牌号从大到小', value: 'card_no-1'},
				{ text: '订量从小到大', value: 'total_number-0'},
				{ text: '订量从大到小', value: 'total_number-1'},
				{ text: '订额从小到大', value: 'order_money-0'},
				{ text: '订额从大到小', value: 'order_money-1'},
			]
		};
	},
	created() {
		this.sort = this.columns[0];
		this.getList();
	},
	methods: {
		async getList(isNew = false) {
			let sort = {};
			let sortArr = this.sort.value.split('-');
			sort[sortArr[0]] = sortArr[1];
			this.offset = !isNew ? this.offset : 0;
			let res = await this.axios({
				url: "/wapi/goods/list.json",
				method: "post",
				data: {
					category_id: this.category_ids.join(','),
					category_ids: this.category_ids,
					brand_id: this.brand_ids,
					attributes: this.attributes,
					offset: this.offset,
					limit: this.limit,
					keyword: this.keyword,
					sort
				}
			});
			this.list = !isNew ? this.list.concat(res.data) : res.data;
			if (res.data.length < this.limit) {
				this.finished = true;
			}
			this.isloading = false;
			this.loading = false;
			this.offset += this.limit;
		},
		onLoad() {
			if (!this.isloading) {
				this.getList();
				this.isloading = true;
			}
		},
		searchList(list){
			this.category_ids = list.category_ids;
			this.brand_ids = list.brand_ids;
			this.attributes = list.attributes;
			this.filterDisplay = false;
			this.getList(true);
		},
		changeSort(item){
			this.sort = item;
			this.showPopup = false;
			this.getList(true);
		},
		onCancelSort(){
			this.showPopup = false;
		},
		search(){
			if(this.showPopup){
				clearTimeout(this.showPopup);
			}
			this.searchLock = setTimeout(() => {
				this.offset = 0;
				this.getList(true);
			}, 300);
		}
	},
	components: {
		headerFix,
		footerFix,
		imgBox,
		filterController
	}
};
</script>

<style lang="less" scoped>
.container {
	.list-box {
		width: 100%;
		padding: 0.05rem;
		overflow: hidden;
		.list-item {
			margin: 0.1rem 0.05rem 0 0.05rem;
			width: calc(50% - 0.1rem);
			background-color: #fff;
			float: left;
			padding-bottom: 0.1rem;
			position: relative;
			img {
				width: 100%;
			}
			.sku {
				width: 100%;
				text-align: center;
				font-size: 0.14rem;
			}
			.price {
				width: 100%;
				text-align: center;
				color: red;
				font-size: 0.12rem;
				padding: 0.02rem 0;
			}
			.tip {
				width: 100%;
				text-align: center;
				color: #999;
				font-size: 0.12rem;
			}
		}
	}
	.filter-sort-box{
		padding: 0.08rem;
		width: 100%;
		text-align: center;
		background-color: #fff;
		.sort{
			color: #b4a078;
		}
	}
	.body-content{
		height: calc(100% - 1.31rem);
	}
}
.search-ctrl{
	padding: 6px 15px;
}
</style>

