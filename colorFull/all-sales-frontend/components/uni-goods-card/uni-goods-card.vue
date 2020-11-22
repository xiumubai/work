<template>
	<view class="goods-card box-shandow_border" @tap="handleExchange(goodsDetail.id)">
		<view class="logo img-background"><image :src="goodsDetail.cover" mode="aspectFill"></image></view>
		<view class="ellipsis-l1 title c333 font_14 mb_10">{{ goodsDetail.name }}</view>
		<view class="point font_12 mb_10">{{ goodsDetail.need_point }}积分</view>
		<view class="footer">
			<view class="status c999 font_12" v-if="goodsDetail.status === 3">库存{{ goodsDetail.stock_quantity }}</view>
			<view class="status c999 font_12" v-else>已兑完</view>
			<button v-if="goodsDetail.status === 4" class="btn-common btn-exchange-active btn-exchange">兑换</button>
			<button v-else class="btn-common btn-exchange-active">兑换</button>
		</view>
	</view>
</template>

<script>
export default {
	name: 'UniGoodsCard',
	props: {
		goodsDetail: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	methods: {
		handleExchange: function(id) {
			this.$emit('exchange', id);
		}
	}
};
</script>

<style lang="scss">
.goods-card {
	width: 330upx;
	background: #ffffff;
	box-sizing: border-box;
	margin-bottom: 30upx;
	padding: 30upx;
	border-radius: 8upx;
	.logo {
		height: 200upx;
		margin-bottom: 20upx;
	}
	.point {
		color: #f39802;
	}
	.footer {
		display: flex;
		align-items: center;
		.status {
			flex: 1;
		}
		.btn-exchange-active {
			height: 44upx;
			width: 102upx;
			line-height: 44upx;
			font-size: 24upx;
			border-radius: 22upx;
		}
		.btn-exchange {
			background: #999999;
		}
	}
}
</style>
