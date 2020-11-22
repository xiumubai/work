<template>
	<view class="rank-container">
		<view class="rank-header rank-common">
			<view class="rank-item">
				<view class="rank-number">排名</view>
				<view class="rank-name">姓名</view>
				<view class="rank-effect">影响力</view>
			</view>
		</view>
		<view class="rank-body rank-common">
			<view class="rank-item first-item">
				<view class="rank-number">
					<template v-if="selfRank.rank > 0">
						{{selfRank.rank}}
					</template>
					<template v-else>
						未上榜
					</template>
				</view>
				<view class="rank-name">{{selfRank.name}}</view>
				<view class="rank-effect">{{selfRank.value}}</view>
			</view>
			<view class="rank-item" v-for="(item, index) in rankList" :key="index">
				<view class="rank-number">
					<template v-if="item.rank > 0">
						{{item.rank}}
					</template>
					<template v-else>
						未上榜
					</template>
				</view>
				<view class="rank-name">{{ item.name }}</view>
				<view class="rank-effect">{{ item.value }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'UniRankPersonal',
	props: {
		rankList: {
			type: Array,
			default() {
				return [];
			}
		},
		selfRank: {
			type: Object,
			default() {
				return {};
			}
		}
	}
};
</script>

<style lang="scss">
.rank-container {
	.rank-header {
		padding: 30upx 0 20upx 0;
		view {
			font-size: 24upx;
			color: #666666;
		}
	}
	.rank-body {
		.rank-item {
			background: #ffffff;
			padding: 20upx 0;
			border-bottom: 1px solid #f1f1f1;
			.rank-number {
				font-size: 28upx;
				color: #666666;
			}
			.rank-name {
				font-size: 28upx;
				color: #666666;
			}
			.rank-effect {
				font-size: 40upx;
				color: #006a60;
			}
		}
		.rank-item.first-item {
			padding: 44upx 0;
			margin-bottom: 20upx;
		}
	}
	.rank-common {
		.rank-item {
			display: flex;
			align-items: center;
			.rank-number {
				width: 20%;
				text-align: center;
			}
			.rank-name {
				width: 65%;
			}
			.rank-effect {
				width: 20%;
				text-align: center;
			}
		}
	}
}
</style>
