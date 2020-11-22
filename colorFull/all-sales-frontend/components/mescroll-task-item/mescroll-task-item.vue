<template>
	<view v-show="i === index">
		<mescroll-uni top="150" :down="downOption" :up="upOption" @up="upCallback" @init="mescrollInit">
			<block v-for="(item, index) in taskList" :key="index"><uni-task-card class="task-card-container" :taskDetail="item" @handleNavigate="handleNavigate"></uni-task-card></block>
		</mescroll-uni>
	</view>
</template>

<script>
import uniTaskCard from '@/components/uni-task-card/uni-task-card.vue';
import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue';
export default {
	components: { uniTaskCard, MescrollUni },
	data() {
		return {
			mescroll: null, //mescroll实例对象
			downOption: {
				auto: false,
				use: false
			},
			upOption: {
				noMoreSize: 4,
				empty: {
					tip: '~ 空空如也 ~', // 提示
				}
			},
			taskList: [],
			queryParams: {
				status: 2
			}
		};
	},
	props: {
		i: Number, // 每个tab页的专属下标
		index: {
			// 当前tab的下标
			type: Number,
			default() {
				return 0;
			}
		}
	},
	watch: {
		// 监听下标的变化
		index(val) {
			if (this.i === val && !this.isInit) {
				this.isInit = true; // 标记为true
				this.mescroll.triggerUpScroll();
			}
		}
	},
	onShow() {
		// 第一个tab,自动加载数据
		if (this.i === 0) {
			this.isInit = true; // 标记为true
			this.mescroll.triggerUpScroll();
		}
	},
	methods: {
		handleNavigate: function(id) {
			this.$emit('handleNavigateTo', id)
		},
		mescrollInit: function(mescroll) {
			this.mescroll = mescroll;
		},
		upCallback: function(mescroll) {
			this.loadData(
				mescroll.num,
				curPageData => {
					mescroll.endSuccess(curPageData.length);
					// if (mescroll.num == 1) this.taskList = [];
					this.taskList = this.taskList.concat(curPageData);
				},
				() => {
					mescroll.endErr();
				}
			);
		},
		loadData: function(pageNum, successCallback, errorCallback) {
			this.queryParams.page = pageNum;
			this.queryParams.status = this.i === 0 ? 2 : 3
			this.$api
				.taskLists(this.queryParams)
				.then(res => {
					successCallback && successCallback(res.data);
				})
				.catch(() => {
					errorCallback && errorCallback();
				});
		}
	}
};
</script>

<style lang="scss">
	.task-card-container{
		margin: 30upx;
		margin-top: 0;
	}
</style>
