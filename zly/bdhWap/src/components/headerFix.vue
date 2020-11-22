<!--
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-01-28 17:48:18
 * @LastEditTime: 2019-01-28 17:48:18
 * @LastEditors: your name
 -->
<template>
	<div class="header-box">
		<div class="left-box" v-if="showLeft">
			<div class="box-content">
				<slot name="left">
					<van-icon name="arrow-left" @click="$router.back()"/>
				</slot>
			</div>
			</div>
		<div class="center-box" v-if="showCenter">
			<div class="box-content">
				<slot name="center">
					{{pageTitleTmp}}
				</slot>
			</div>
		</div>
		<div class="right-box" v-if="showRight">
			<div class="box-content">
				<slot name="right">
					{{rightTitleTmp}}
				</slot>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		centerText: {
			default: null,
			type: [Number, String]
		},
		rightText: {
			default: ''
		},
		showLeft: {
			default: true
		},
		showCenter: {
			default: true
		},
		showRight: {
			default: true
		}
	},
	data(){
		return {
			pageTitleTmp: '',
			rightTitleTmp: ''
		}
	},
	created(){
		this.pageTitleTmp = !this.centerText ? this.$route.meta.pageTitle : this.centerText;
		this.rightTitleTmp = this.rightText;
	}
};
</script>
<style scoped lang="less">
.header-box {
	height: 0.44rem;
	box-shadow: 0 1px 6px #ccc;
	background-color: #fff;
	display: flex;
	border-bottom: 1px solid #c9c9c9;
	.left-box{
		width: 0.6rem;
		text-align: center;
		line-height: 0.44rem;
		.box-content{
			width: 100%;
			height: 100%;
		}
	}
	.center-box{
		flex: 1;
		text-align: center;
		line-height: 0.44rem;
	}
	.right-box{
		width: 0.6rem;
		text-align: center;
		line-height: 0.44rem;
	}
}
</style>


