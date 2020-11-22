<template>
	<view class="exchange">
		<view class="goods-container">
			<uni-list v-if="goodsDetail.type === 1" style="margin-bottom: 30upx;">
				<uni-list-item v-if="addressDetail" :title="title" @click="handleNavigate('../../info/address/address')" :note="note" />
				<uni-list-item v-else title="选择收货地址" @click="handleNavigate('../../info/address/address')" />
			</uni-list>
			<view class="goods-card box-shandow_border">
				<view class="logo img-background"><image :src="goodsDetail.cover" mode="aspectFill"></image></view>
				<view class="info">
					<view class="title font_14 c333 mb_10">{{ goodsDetail.name }}</view>
					<view class="point font_12">{{ goodsDetail.need_point }}积分</view>
					<view class="stock font_12 c999">库存：{{ goodsDetail.stock_quantity }}</view>
				</view>
			</view>
			<button v-if="goodsDetail.status === 3 && goodsDetail.need_point <= useable_point" class="exchange-button btn-common" @tap="handleExchange">确认兑换</button>
			<button v-if="goodsDetail.need_point > useable_point" class="exchange-button btn-common" @tap="handleExchangeNotice">积分不足</button>
		</view>
	</view>
</template>

<script>
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
export default {
	components: { uniList, uniListItem },
	data() {
		return {
			queryParams: {},
			goodsDetail: {},
			addressDetail: {},
			title: '',
			note: '',
			useable_point: 0
		};
	},
	onLoad(options) {
		this.queryParams.goods_id = options.id;
		this.loadData();
	},
	onShow() {
		this.addressDetail = uni.getStorageSync('address');
		if (this.addressDetail) {
			this.title = this.addressDetail.consignee + ' ' + this.addressDetail.mobile;
			this.note = '收货地址:' + this.addressDetail.province + this.addressDetail.city + this.addressDetail.area + this.addressDetail.detail;
			this.queryParams.shipping_address_id = this.addressDetail.id;
		}
	},
	methods: {
		handleNavigate: function(path) {
			uni.navigateTo({
				url: path
			});
		},
		handleExchangeStock: function() {
			uni.showToast({
				title: '库存不足',
				icon: 'none'
			});
		},
		handleExchangeNotice: function() {
			uni.showToast({
				title: '积分不足，快去赚积分吧',
				icon: 'none'
			});
		},
		handleExchange: function() {
			this.$api.exchanges(this.queryParams)
				.then(res => {
					uni.removeStorageSync('address');
					uni.showToast({
						title: '兑换成功',
						icon: 'none'
					});
					uni.navigateTo({
						url: '/pages/info/record/record'
					})
				})
				.catch(err => {
					console.log('兑换失败')
					uni.showToast({
						title: err.message,
						icon: 'none'
					});
				});
		},
		loadData: function() {
			this.$api.goodsDetail(this.queryParams.goods_id).then(res => {
				this.goodsDetail = res.data;
			});
			this.$store.dispatch('GetUser').then((res) => {
				this.useable_point = res.useable_point
				console.log(this.useable_point)
			})
		}
	}
};
</script>

<style lang="scss">
.exchange {
	background: #ecedee;
	padding-bottom: 30upx;
	.goods-container {
		padding: 30upx;
		.goods-card {
			padding: 30upx;
			background: #ffffff;
			display: flex;
			border-radius: 8upx;
			.logo {
				flex: 0 0 270upx;
				height: 200upx;
				margin-right: 30upx;
			}
			.info {
				position: relative;
				flex: 1;
				.point {
					color: #f39802;
				}
				.stock {
					position: absolute;
					bottom: 0;
				}
			}
		}
		.exchange-button {
			width: 200upx;
			margin-top: 100upx;
		}
	}
}
</style>
