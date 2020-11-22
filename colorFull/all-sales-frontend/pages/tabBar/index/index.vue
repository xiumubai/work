<template>
	<view class="home">
		<view v-if="topTaskList.length > 0" class="banner-block img-background" @tap="handleNavigate(topTaskList[0].id)"><image :src="topTaskList[0].cover" mode="aspectFill"></image></view>
		<view class="tab-block">
			<uni-segmented-control :current="current" :values="items" @clickItem="onClickItem" style-type="button" active-color="#006A60"></uni-segmented-control>
		</view>
		<view class="rank-block">
			<uni-rank-personal v-show="current === 0" :rankList="rankListPersonal" :selfRank="selfRank"></uni-rank-personal>
			<uni-rank-department v-show="current === 1" :rankList="rankListDepartment" :ownRank="ownRank"></uni-rank-department>
		</view>
	</view>
</template>

<script>
import uniSegmentedControl from '@/components/uni-segmented-control/uni-segmented-control.vue';
import uniRankPersonal from '@/components/uni-rank-personal/uni-rank-personal.vue';
import uniRankDepartment from '@/components/uni-rank-department/uni-rank-department.vue';
export default {
	components: { uniSegmentedControl, uniRankPersonal, uniRankDepartment },
	data() {
		return {
			title: 'Hello',
			items: ['个人排行', '部门排行'],
			current: 0,
			selfRank: {},
			ownRank: {},
			rankListPersonal: [],
			rankListDepartment: [],
			topTaskList: []
		};
	},
	onLoad(option) {
		this.loadData()
	},
	methods: {
		onClickItem: function(index) {
			if (this.current !== index) {
				this.current = index;
			}
		},
		handleNavigate: function(id) {
			uni.navigateTo({
				url: '/pages/task/recive/recive?id=' + id
			})
		},
		loadData: function() {
			this.$api.staffRank().then(res => {
				this.rankListPersonal = res.data
				this.selfRank = res.self
			})
			this.$api.departmentRank().then(res => {
				this.rankListDepartment = res.data
				this.ownRank = res.own
			})
			this.$api.topTask().then(res =>{
				this.topTaskList = res.data
			})
		}
	}
};
</script>

<style lang="scss">
.home {
	background: #ECEDEE;
	padding-bottom: 30upx;
	.banner-block {
		width: 100%;
		height: 320upx;
		background: #ffffff;
	}
	.tab-block{
		padding-top: 30upx;
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
			.point {
				font-size: 24upx;
				color: #f39802;
				position: absolute;
				bottom: 6upx;
			}
		}
		.right {
			flex: 0 0 80px;
			.logo {
				width: 160upx;
				height: 160upx;
				margin-bottom: 20upx;
			}
		}
	}
}
</style>
