<template>
<div class="container">
		<header-fix><div slot="left"></div></header-fix>
		<div class="body-content">
			<van-cell class="line" icon="info-o" title="关于我们" is-link to="OurInfo" />
			<van-cell class="line" icon="phone-o" title="联系客服" value="400-600-4699" is-link url="tel:400-600-4699" />
			<van-cell class="line" icon="chat-o" title="在线咨询" is-link to="WebChat" />
			<!-- <van-cell class="line" icon="chat-o" title="在线咨询" is-link url="http://uchat.im-cc.com/webchat_new/static/html/index.html?ht=Xvtp9l" /> -->
		</div>
		<footer-fix></footer-fix>
</div>
</template>
<script>
import headerFix from "@/components/headerFix";
import footerFix from "@/components/footerFix";
export default {
	components: {
		headerFix,
		footerFix
	}
}
</script>
<style lang="less" scoped>
.line{
	margin-top: 0.1rem;
}
</style>

