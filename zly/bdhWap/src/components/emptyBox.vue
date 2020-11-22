<template>
	<div class="empty-box" :style="{width: width}">
		<img style="height: 40px;" src="~assets/img/common/empty_status/no_data.png"/>
		<div class="empty-title">{{content}}</div>
	</div>
</template>

<script>
export default {
	name: "empeyBox",
	props: {
		content: {
			default: '暂无数据'
		},
		width: {
			default: '100%'
		}
	}
}
</script>

<style scoped lang="less">
	.empty-box {
		width: 100%;
		min-height: 100px;
		text-align: center;
		padding: 30px;
		.empty-title {
			color: #9B9B9B;
			margin-top: 10px;
		}
	}
</style>
