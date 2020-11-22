<template>
	<!-- 空布局 -->
	<view v-if="isShowEmpty" class="mescroll-empty">
		<image class="empty-icon" src="http://www.mescroll.com/img/mescroll-empty.png?v=1" mode="widthFix" />
		<view class="empty-tip">空空如也</view>
	</view>
</template>

<script>
	export default{
		name: 'uniEmpty',
		props: {
			isShowEmpty: {
				type: [Boolean, String],
				default () {
					return false
				}
			}
		},
	}
</script>

<style>
	/* 无任何数据的空布局 */
	.mescroll-empty {
		box-sizing: border-box;
		width: 100%;
		padding: 40upx;
		text-align: center;
	}
	
	.mescroll-empty.empty-fixed {
		z-index: 99;
		position: fixed; /*transform会使fixed失效,最终会降级为absolute */
		top: 20%;
		left: 0;
	}
	
	.mescroll-empty .empty-icon {
		width: 45%;
		height: 154px;
	}
	
	.mescroll-empty .empty-tip {
		margin-top: 20upx;
		font-size: 24upx;
		color: gray;
	}
	
	.mescroll-empty .empty-btn {
		display: inline-block;
		margin-top: 40upx;
		min-width: 200upx;
		padding: 18upx;
		font-size: 28upx;
		border: 1upx solid #E04B28;
		border-radius: 60upx;
		color: #E04B28;
	}
	
	.mescroll-empty .empty-btn:active {
		opacity: .75;
	}
</style>
