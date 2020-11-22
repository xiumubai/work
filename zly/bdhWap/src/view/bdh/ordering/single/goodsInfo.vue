<template>
	<div class="container">
		<header-fix></header-fix>
		<div class="body-content">
			<div class="img-box">
				<span class="num-tip">{{goodsInfo.card_no}}</span>
				<van-swipe :autoplay="3000">
					<van-swipe-item v-for="(image, index) in goodsInfo.images" :key="index">
						<img :src="image+'?x-oss-process=image/resize,h_400,w_400'">
					</van-swipe-item>
				</van-swipe>
			</div>
			<!-- 商品信息 -->
			<div class="goods-info">
				<div class="line-box">
					<div class="left-box left">款号：{{goodsInfo.goods_no}}</div>
					<div class="right-box overflow-hidden">&yen;{{goodsInfo.tag_price}}</div>
				</div>
				<div class="line-box title-name">{{goodsInfo.title}}</div>
				<div class="line-box">
					<div class="title-name">属性：</div>
					<div class="property-box">
						<template v-for="a in attributes">
							<span class="property-item" v-for="value in a.values" :key="value">{{value}}</span>
						</template>
					</div>
				</div>
			</div>
			<!-- 订货数量 -->
			<div class="ordering-quantity">
				<div class="ordering-title">订货数量</div>
				<div class="sku-num">
					<table>
						<thead>
							<th>尺码</th>
							<th v-for="size in sizeTitles" :key="size + buildKey()">{{size}}</th>
							<th>小计</th>
						</thead>
						<tbody>
							<tr v-for="(sizeSku,color) in skuList" :key="color + buildKey()">
								<td>{{color}}</td>
								<td v-for="size in sizeSku" :key="size + buildKey()">{{size}}</td>
								<td>{{colorTotal(sizeSku)}}</td>
							</tr>
							<tr class="total">
								<td class="font-blod">合计</td>
								<td v-for="size in sizeTitles" :key="size + buildKey()">{{total[size]}}</td>
								<td class="font-blod">{{colorTotal(total)}}</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<!-- 搭配 -->
			<van-tabs v-model="activeTab" color="#B4A078" swipeable>
				<van-tab title="单款搭配">
					<div class="about-list">
						<div class="goods-list" v-if="singleMatch.length > 0">
							<router-link
								:to="{name:'GoodsInfo',query:{id: item.id}}"
								class="goods-item"
								v-for="(item) in singleMatch"
								:key="item.id + buildKey()"
							>
								<img-box :goods="item"></img-box>
							</router-link>
						</div>
						<empty-box v-else content="暂无相关搭配"></empty-box>
					</div>
				</van-tab>
				<!-- <van-tab title="相关搭配">
					<div class="about-list">
						<div class="goods-list" v-if="aboutMatch.length > 0">
							<div class="goods-item" v-for="item in aboutMatch" :key="item.id">
								<img-box :goods="item"></img-box>
							</div>
						</div>
						<empty-box v-else content="暂无相关搭配"></empty-box>
					</div>
				</van-tab>-->
			</van-tabs>
		</div>
		<div class="join-order-bar display-flex">
			<div class="flex">订量:
				<span class="red">{{colorTotal(total)}}件</span>
				<br>订额:
				<span class="red">&yen;{{(Math.round((colorTotal(total) * goodsInfo.tag_price) * 100)/100).toFixed(2)}}</span>
			</div>
			<div class="flex text-center" @click="changeFavorite()">
				<img
					v-if="goodsInfo.favorite_level > 0"
					src="~assets/img/common/favorite/favorite_on.png"
					width="20"
				>
				<img
					v-if="goodsInfo.favorite_level <= 0"
					src="~assets/img/common/favorite/favorite_off.png"
					width="20"
				>
				<br>收藏
			</div>
			<div @click="joinCartDisplay = true" class="flex">加入订单</div>
		</div>
		<join-cart v-if="joinCartDisplay" @close="closeDialog()" :goodsId="goodsId"></join-cart>
	</div>
</template>
<script>
import headerFix from "@/components/headerFix";
import footerFix from "@/components/footerFix";
import emptyBox from "@/components/emptyBox.vue";
import imgBox from "@/components/imgBox.vue";
import joinCart from '@/components/joinCart.vue';

export default {
	data() {
		return {
			activeTab: 0,
			goodsInfo: {},
			attributes: [],
			sizeTitles: [],
			total: 0,
			skuList: [],
			singleMatch: [],
			aboutMatch: [],
			goodsId: this.$route.query.id,
			joinCartDisplay: false
		};
	},
	created() {
		this.init();
	},
	watch: {
		$route() {
			this.goodsId = this.$route.query.id;
			this.init();
		}
	},
	methods: {
		init() {
			this.getList();
			this.getMatch();
		},
		async getList() {
			//获取商品基本信息
			let res = await this.axios({
				url: "/wapi/goods/info.json",
				params: {
					id: this.goodsId
				}
			});
			var arr = [];
			if (res.goods.attributes) {
				for (var key in res.goods.attributes) {
					if (
						res.goods.attributes[key].name !== "颜色" &&
						res.goods.attributes[key].name !== "尺码"
					) {
						arr.push(res.goods.attributes[key]);
					}
				}
				this.attributes = arr;
			}
			//获取sku信息
			this.goodsInfo = res.goods;
			let resGoods = await this.axios({
				url: "/wapi/order/goods.json",
				params: {
					goods_id: this.goodsId
				}
			});
			this.skuList = resGoods.total;
			let sizeMap = {};
			for (let color in resGoods.total) {
				let order = resGoods.total[color];
				for (let size in order) {
					sizeMap[size] = sizeMap[size] || 0;
					sizeMap[size] += order[size];
				}
			}
			this.sizeTitles = Object.keys(sizeMap);
			this.total = sizeMap;
		},
		closeDialog(){
			this.joinCartDisplay = false;
			this.init();
		},
		//颜色合计
		colorTotal(coloList) {
			coloList = Object.values(coloList);
			return coloList.length < 1
				? 0
				: coloList.reduce((total, sizeNum) => total + sizeNum);
		},
		buildKey() {
			return Math.random();
		},
		//收藏
		async changeFavorite() {
			this.$toast.clear();
			let url = "/wapi/goods/favorite/cancel.json";
			let goodsId = this.$route.query.id;
			let data = {
				goods_ids: [goodsId]
			};
			if (this.goodsInfo.favorite_level < 1) {
				url = "/wapi/goods/favorite/add.json?favorite_goods["+goodsId+"]=5";
				data = {};
			}
			let res = await this.axios({
				url: url,
				method: "post",
				params: data
			});
			if(res.code !== 0){
				this.$toast(res.message);
				return;
			}
			if(this.goodsInfo.favorite_level < 1 && res.code === 0){
				this.$toast('收藏成功');
			}
			this.goodsInfo.favorite_level = this.goodsInfo.favorite_level > 0 ? 0 : 5;
		},
		//获取搭配
		getMatch() {
			let id = this.goodsId;
			//单款搭配
			this.axios({
				url: "/wapi/collocation/goods.json",
				params: {
					goods_id: id
				}
			}).then(res => {
				this.singleMatch = res.goods;
			});
			//相关搭配
			this.axios({
				url: "/wapi/collocation/list.json",
				params: {
					goods_id: id
				}
			}).then(res => {
				this.aboutMatch = res.data;
			});
		}
	},
	components: {
		headerFix,
		footerFix,
		emptyBox,
		imgBox,
		joinCart,
	}
};
</script>

<style lang="less" scoped>
.container {
	background-color: #fff;
	.img-box {
		width: 100%;
		min-height: 2rem;
		position: relative;
		img {
			width: 100%;
		}
	}
	.goods-info {
		width: 3.55rem;
		margin: auto;
		border-radius: 2px;
		background-color: #fff;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
		font-size: 0.14rem;
		padding: 0.15rem;
		line-height: 0.2rem;
		.line-box {
			.right-box {
				color: red;
				text-align: right;
			}
		}
		.title-name {
			color: #9b9b9b;
		}
		.property-item {
			background-color: #efeff4;
			padding: 0.01rem 0.1rem;
			font-size: 0.12rem;
			display: inline-block;
			margin: 0.04rem 0.04rem 0 0;
		}
	}
	.ordering-title {
		height: 0.3rem;
		line-height: 0.3rem;
		width: 50%;
		margin: 0.2rem auto 0.1rem;
		text-align: center;
		background-color: #efeff4;
	}
	.sku-num {
		width: 100%;
		font-size: 0.14rem;
		table {
			width: 100%;
			text-align: center;
			table-layout: fixed;
		}
		.total {
			border-top: 1px solid #efefef;
		}
	}
	.ordering-quantity {
		border-bottom: 0.2rem solid #efeff4;
		padding-bottom: 0.1rem;
	}
	.about-list {
		min-height: 2rem;
		padding: 0.05rem;
	}
	.goods-list {
		width: 100%;
		padding: 0 0 0.2rem;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
	}
	.goods-item {
		width: 50%;
		padding: 0.1rem 0.05rem 0;
	}
}
.join-order-bar {
	width: 100%;
	height: 0.5rem;
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: #f7f7f7;
	box-shadow: 0 0 1px rgba(0, 0, 0, 0.85);
	.red {
		color: red;
	}
	.flex:nth-child(1) {
		padding: 0.05rem 0.15rem;
		line-height: 0.2rem;
		font-size: 0.12rem;
	}
	.flex:nth-child(2) {
		border-left: 1px solid #e2e2e2;
		border-right: 1px solid #e2e2e2;
		text-align: center;
		font-size: 0.12rem;
		padding: 0.05rem 0.15rem;
	}
	.flex:nth-child(3) {
		background-color: #b4a078;
		line-height: 0.5rem;
		text-align: center;
		color: #fff;
	}
}
</style>
<style>
.van-tab--active {
	color: #b4a078;
}
</style>
