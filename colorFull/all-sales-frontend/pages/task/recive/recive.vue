<template>
	<view class="recive">
		<view class="banner img-background"><image :src="taskDetail.cover" mode="aspectFill"></image></view>
		<view class="task-container">
			<view class="title ellipsis-l2 c333 font_14 mb_10">{{taskDetail.name}}</view>
			<view class="des ellipsis-l1 c666 font_12 mb_10">{{taskDetail.description}}</view>
			<view class="task-info">
				<view class="item">任务奖励：{{taskDetail.reward_point}}积分</view>
				<view class="item">我已得到：{{taskDetail.gained_point}}积分</view>
				<view v-if="taskDetail.status !== 3" class="item">总奖励：{{taskDetail.total_point}}积分</view>
				<view v-if="taskDetail.status !== 3" class="item">剩余奖励：{{taskDetail.rest_point}}积分</view>
				<view class="item" style="display: flex; align-items: center; width: 100%;">
					<text>结束时间：
						<span v-if="taskDetail.status">{{taskDetail.status_text}}</span>
						<span v-else>{{taskDetail.end_time}}</span>
					</text>
				</view>
			</view>
			<button v-if="!is_accepted && taskDetail.status === 2" class="task-recive-button btn-common" @tap="handleReciveTask">领取任务</button>
		</view>
		<template v-if="share_content">
			<view class="notice c333 font_14">我的传播链接（点开后分享到朋友圈/会话即可)</view>
			<view class="task-block" @click="handleShare(share_content.url)">
				<view class="left">
					<view class="title ellipsis-l2 c333 font_14 mb_10">{{share_content.title}}</view>
					<view class="des ellipsis-l1 c666 font_12">{{share_content.brief}}</view>
				</view>
				<view class="right">
					<view class="logo"><image :src="share_content.cover" mode="aspectFill"></image></view>
				</view>
			</view>
		</template>
	</view>
</template>

<script>
export default {
	data() {
		return {
			queryParams: {},
			taskDetail: {},
			is_accepted: false,
			share_content: null,
			date: null,
		};
	},
	onLoad(options) {
		this.queryParams.task_id = options.id
		this.$api.taskRecive(options.id).then(res => {
			this.taskDetail = res
			this.is_accepted = res.is_accepted
			this.share_content = res.share_content
		})
	},
	methods: {
		handleReciveTask: function () {
			this.$api.accepts(this.queryParams).then(res => {
				uni.showToast({
					title: '任务领取成功，快去分享吧',
					icon:'none'
				})
				this.is_accepted = true
				this.share_content = res.share_content
			})
		},
		handleShare: function(url) {
			window.location.href = url
		},
		
	}
};
</script>

<style lang="scss">
.recive {
	background: #ecedee;
	padding-bottom: 30upx;
	.banner {
		height: 320upx;
	}
	.task-container {
		background: #ffffff;
		padding: 30upx;
		.task-recive-button {
			width: 200upx;
		}
		.task-info {
			overflow: hidden;
			.item {
				font-size: 24upx;
				color: #f39802;
				float: left;
				width: 50%;
				margin-bottom: 20upx;
			}
		}
	}
	.notice {
		padding: 30upx 30upx 0 30upx;
	}
	.task-block {
		display: flex;
		margin: 30upx;
		background: #ffffff;
		padding: 30upx;
		border-radius: 8upx;
		.left {
			flex: 1;
			position: relative;
			margin-right: 68upx;
		}
		.right {
			flex: 0 0 80px;
			.logo {
				width: 160upx;
				height: 160upx;
			}
		}
	}
}
</style>
