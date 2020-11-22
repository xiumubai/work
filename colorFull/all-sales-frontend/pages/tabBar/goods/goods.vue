<template>
	<view class="goods">
		
		<mescroll-uni :down="downOption" :up="upOption" @up="upCallback">
			<view v-if="notice" class="font_14 c333" style="padding: 30upx 30upx 0 30upx;">备注：{{notice}}</view>
			<view class="goods-container">
				<block v-for="(item, index) in goodsList" :key="index"><uni-goods-card :goodsDetail="item" @exchange="handelExchange"></uni-goods-card></block>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
import uniGoodsCard from '@/components/uni-goods-card/uni-goods-card.vue';
import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue';
export default {
	components: { uniGoodsCard, MescrollUni },
	data() {
		return {
			title: 'Hello',
			notice: '',
			goodsList: [],
			queryParams: {},
			downOption: {
				auto: false,
				use: false
			},
			upOption: {
				empty: {
					tip: '~ 空空如也 ~'
				}
			}
		};
	},
	onLoad() {
		this.$api.exchangeNotices().then(res => {
			this.notice = res.content
		})
	},
	methods: {
		handelExchange: function(id) {
			uni.navigateTo({
				url: '../../goods/exchange/exchange?id=' + id
			});
		},
		upCallback: function(mescroll) {
			this.loadData(
				mescroll.num,
				curPageData => {
					mescroll.endSuccess(curPageData.length);
					this.goodsList = this.goodsList.concat(curPageData);
				},
				() => {
					mescroll.endErr();
				}
			);
		},
		loadData: function(pageNum, successCallback, errorCallback) {
			this.queryParams.page = pageNum;
			this.$api
				.goodsList(this.queryParams)
				.then(res => {
					successCallback && successCallback(res.data);
				})
				.catch(() => {
					errorCallback && errorCallback();
				});
		}
	}
};
</script>

<style lang="scss">
.goods {
	background: #ecedee;
	.goods-container {
		padding: 30upx;
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
}
</style>
