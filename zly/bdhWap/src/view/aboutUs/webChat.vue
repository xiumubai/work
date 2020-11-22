<template>
	<div class="container">
		<header-fix></header-fix>
		<div class="body-content">
			<iframe class="iframe-box" src="http://uchat.im-cc.com/webchat_new/static/html/index.html?ht=Xvtp9l"></iframe>
		</div>
	</div>
</template>
<script>
import headerFix from "@/components/headerFix";
export default {
	data() {
		return {
		
		}
	},
	methods: {
		
	},
	components: {
		headerFix
	}
};
</script>

<style lang="less" scoped>
.container{
	.body-content{
		height: calc(100% - 0.44rem);
		overflow: hidden;
	}
}
.iframe-box{
	height: 100%;
	width: 100%;
	border: 0;
	outline: none;
}
</style>