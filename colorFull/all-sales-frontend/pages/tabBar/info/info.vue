<template>
	<view class="info">
		<view class="info-container box-shandow_border">
			<view class="name c333 font_16 mb_10">{{user.name}}</view>
			<view class="depart-name c666 font_15">{{user.department.name}}</view>
		</view>
		<uni-list style="margin-bottom: 30upx;">
			<uni-list-item title="已领取任务" @click="handleNavigate('../../info/accepted/accepted')" thumb="../../../static/tabBar/task-active@2x.png"/>
		</uni-list>
		<uni-list>
			<uni-list-item title="我的积分" :show-arrow="false" :text="point" :show-text="true" thumb="../../../static/tabBar/goods-active@2x.png"/>
			<uni-list-item title="我的收货地址" @click="handleNavigate('../../info/address/address')" thumb="../../../static/tabBar/address@2x.png"/>
			<uni-list-item title="我的兑换记录" @click="handleNavigate('../../info/record/record')" thumb="../../../static/tabBar/record@2x.png"/>
		</uni-list>
	</view>
</template>

<script>
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
export default {
	components: { uniList, uniListItem },
	data() {
		return {
			title: 'Hello',
			user: {},
			point: ''
		};
	},
	onLoad() {
		
	},
	onShow() {
		this.$store.dispatch('GetUser').then(res => {
			this.user = res
			this.point = res.useable_point + '积分'
		})
	},
	methods: {
		handleNavigate: function(path) {
			uni.navigateTo({
				url: path
			})
		}
	}
};
</script>

<style lang="scss">
.info {
	background: #ecedee;
	padding-bottom: 30upx;
	padding-top: 30upx;
	.info-container {
		margin: 0 30upx 30upx 30upx;
		padding: 30upx;
		box-sizing: border-box;
		background: #ffffff;
		border-radius: 8upx;
	}
}
</style>
