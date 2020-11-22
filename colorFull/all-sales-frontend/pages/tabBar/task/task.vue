<template>
	<view class="task">
		<view class="tab-block">
			<uni-segmented-control :current="current" :values="tabItems" @clickItem="onClickItem" style-type="button" active-color="#006A60"></uni-segmented-control>
		</view>
		<view class="task-container">
			<!--进行中 -->
			<mescroll-item :i="0" :index="current" @handleNavigateTo="handleNavigate"></mescroll-item>
			
			<!-- 已结束 -->
			<mescroll-item :i="1" :index="current" @handleNavigateTo="handleNavigate"></mescroll-item>
			
		</view>
	</view>
</template>

<script>
import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
import MescrollItem from '@/components/mescroll-task-item/mescroll-task-item.vue';

export default {
	components: { uniSegmentedControl, MescrollItem },
	data() {
		return {
			current: 0,
			tabItems: ['进行中', '已结束']		
		};
	},
	onLoad(option) {
	},
	methods: {
		onClickItem: function(index) {
			if (this.current !== index) {
				this.current = index;
			}
		},
		handleNavigate: function(id) {
			uni.navigateTo({
				url: '../../task/recive/recive?id=' + id
			});
		}
	}
};
</script>

<style lang="scss">
.task {
	background: #ecedee;
	padding-bottom: 1upx;
	.tab-block {
		padding: 50upx 0;
	}
	.task-container {
		margin: 0 30upx 30upx 30upx;
		overflow: hidden;
	}
}
</style>
