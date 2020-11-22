<template>
	<view class="record">
		<mescroll-uni :down="downOption" :up="upOption" @up="upCallback">
			<view class="record-container">
				<block v-for="(item, index) in logList" :key="index">
					<view class="record-item">
						<view class="top mb_10">
							<view class="left img-background"><image :src="item.goods_info.cover" mode="aspectFill"></image></view>
							<view class="right">
								<view class="title font_14 c333 mb_10">{{ item.goods_info.name }}</view>
								<view class="point font_14">{{ item.goods_info.need_point }}积分</view>
								<view class="time font_12 c999">兑换时间:{{ item.exchanged_at }}</view>
							</view>
						</view>
						<view class="bottom">
							<view class="virtual" v-if="item.goods_info.type === 2">
								<view class="code font_12 c999 mb_10">兑换码：{{ item.goods_code.code }}</view>
								<button class="task-view btn-common" @tap="copy(item.goods_code.code)">复制兑换码</button>
							</view>
							<view class="virtual" v-if="item.goods_info.type === 1">
								<view class="code font_12 c999 mb_10">收货人：{{ item.shipping_address.consignee }}</view>
								<view class="code font_12 c999 mb_10">收货地址：{{ item.shipping_address.province }}{{ item.shipping_address.city }}{{ item.shipping_address.area }}{{ item.shipping_address.detail }}</view>
							</view>
						</view>
					</view>
				</block>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
import MescrollUni from '@/components/mescroll-uni/mescroll-uni.vue';
export default {
	components: { MescrollUni },
	data() {
		return {
			queryParams: {},
			logList: [],
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
	onLoad(option) {

	},
	methods: {
		copy: function(code) {
			uni.setClipboardData({
				data: code,
				success: function() {
					uni.showToast({
						title: '复制成功',
						icon: 'none'
					})
				}
			});
		},
		upCallback: function(mescroll) {
			this.loadData(
				mescroll.num,
				curPageData => {
					mescroll.endSuccess(curPageData.length);
					this.logList = this.logList.concat(curPageData);
				},
				() => {
					mescroll.endErr();
				}
			);
		},
		loadData: function(pageNum, successCallback, errorCallback) {
			this.queryParams.page = pageNum;
			this.$api
				.exchangesLogs(this.queryParams)
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
.record {
	background: #ecedee;
	.record-container {
		padding: 0 30upx;
		.record-item {
			margin-top: 30upx;
			background: #ffffff;
			border-radius: 8upx;
			padding: 30upx;
			.top {
				display: flex;
				.left {
					flex: 0 0 270upx;
					height: 200upx;
					margin-right: 30upx;
					border-radius: 8upx;
				}
				.right {
					flex: 1;
					position: relative;
					.point {
						color: #f39802;
					}
					.time {
						position: absolute;
						bottom: 0;
					}
				}
			}
			.bottom {
				.virtual {
				}
				.real {
				}
			}
		}
	}
}
</style>
