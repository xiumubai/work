<template>
	<view class="task-card" @tap="handleViewTask(taskDetail.id)">
		<view class="banner img-background"><image :src="taskDetail.cover" mode="aspectFill"></image></view>
		<view class="title ellipsis-l2 c333 font_14 mb_10">{{ taskDetail.name }}</view>
		<view class="des ellipsis-l1 c666 font_12 mb_10">{{ taskDetail.description }}</view>
		<view class="task-footer">
			<view class="point font_12" v-if="taskDetail.status === 3">任务已结束</view>
			<view class="point font_12" v-else>任务奖励：{{ taskDetail.reward_point }}积分</view>
			<button class="task-view btn-common">查看任务</button>
		</view>
	</view>
</template>

<script>
export default {
	name: 'UniTaskCard',
	props: {
		taskDetail: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	methods: {
		handleViewTask: function(id) {
			this.$emit('handleNavigate', id)
		}
	}
};
</script>

<style lang="scss">
.task-card {
	background: #ffffff;
	padding: 30upx;
	border-radius: 8upx;
	margin-bottom: 30upx;
	.banner {
		width: 100%;
		height: 268upx;
		margin-bottom: 30upx;
	}
	.task-footer {
		display: flex;
		align-items: center;
		.point {
			color: #f39802;
			flex: 1;
		}
	}
}
</style>
