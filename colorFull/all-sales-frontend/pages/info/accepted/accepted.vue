<template>
	<view class="accepted">
		<mescroll-uni :down="downOption" :up="upOption" @up="upCallback">
			<block v-for="(item, index) in taskList" :key="index"><uni-task-card class="card-container" :taskDetail="item" @handleNavigate="handleViewTask"></uni-task-card></block>
		</mescroll-uni>
	</view>
</template>

<script>
import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue';
import UniTaskCard from '@/components/uni-task-card/uni-task-card.vue';
export default {
	components: { UniTaskCard, MescrollUni },
	data() {
		return {
			taskList: [],
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
	onLoad () {},
	methods: {
		upCallback: function(mescroll) {
			this.loadData(
				mescroll.num,
				curPageData => {
					mescroll.endSuccess(curPageData.length);
					this.taskList = this.taskList.concat(curPageData);
				},
				() => {
					mescroll.endErr();
				}
			);
		},
		loadData: function(pageNum, successCallback, errorCallback) {
			this.queryParams.page = pageNum;
			this.$api
				.accepted(this.queryParams)
				.then(res => {
					successCallback && successCallback(res.data);
				})
				.catch(() => {
					errorCallback && errorCallback();
				});
		},
		handleViewTask: function(id) {
			uni.navigateTo({
				url: '../../task/recive/recive?id=' + id
			});
		}
	}
};
</script>

<style lang="scss">
.accepted {
	background: #ecedee;
	padding-bottom: 1upx;
	.card-container{
		margin: 30upx;
	}
}
</style>
