<template>
	<view class="rank-container">
		<view class="rank-header rank-common">
			<view class="rank-item">
				<view class="rank-number">排名</view>
				<view class="rank-name">部门</view>
				<view class="rank-num">部门人数</view>
				<view class="rank-effect">人均影响力</view>
			</view>
		</view>
		<view class="rank-body rank-common">
			<view class="rank-item first-item" v-if="ownRank">
				<view class="rank-number">
					<template v-if="ownRank.rank > 0">
						{{ownRank.rank}}
					</template>
					<template v-else>
						未上榜
					</template>
				</view>
				<view class="rank-name">{{ownRank.name}}</view>
				<view class="rank-num">{{ownRank.staffs_count}}</view>
				<view class="rank-effect">{{ownRank.value}}</view>
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
				<view class="rank-num">{{ item.staffs_count }}</view>
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
		ownRank: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	data() {
		return {};
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
			.rank-num {
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
				width: 40%;
			}
			.rank-num {
				width: 20%;
				text-align: center;
			}
			.rank-effect {
				width: 20%;
				text-align: center;
			}
		}
	}
}
</style>
