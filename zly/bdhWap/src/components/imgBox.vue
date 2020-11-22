<template>
	<div class="common-img-box">
		<div class="img-placeholder"></div>
		<template v-if="goods">
			<span v-if="goods.card_no && showTip" class="num-tip">{{goods.card_no}}</span>
			<img
				:src="goods.default_image ? goods.default_image + '?x-oss-process=image/resize,m_pad,h_200,w_200,color_FFFFFF' : defaultImage"
			>
		</template>
		<template v-else>
			<img
				:src="src ? src + '?x-oss-process=image/resize,m_pad,h_200,w_200,color_FFFFFF' : defaultImage"
			>
		</template>
	</div>
</template>
<script>
import defaultImage from "@/assets/img/common/empty_status/no_goods.png";
export default {
	props: {
		goods: {
			default: null
		},
		showTip: {
			default: true
		},
		src: {
			default: null
		}
	},
	data() {
		return {
			defaultImage
		};
	}
};
</script>

<style lang="less" scoped>
.common-img-box{
	width: 100%;
	position: relative;
}
img{
	height: 100%;
	width: 100%;
	position: absolute;
	top: 0;
	left: 0;
}
.img-placeholder{
	width: 100%;
	height: 0;
	padding-top: 100%;
}
</style>