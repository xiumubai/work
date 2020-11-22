<template>
	<div class="container">
		<header-fix></header-fix>
		<div class="body-content">
			<div style="text-align: center;margin: 10px 0px;">
				<img style="width: 80px;margin: auto;" src="~assets/img/common/logo.png">
				<div>
					必订火
				</div>
			</div>
			<div
				style="width: 80%;margin-left: 10%;"
			>必订火隶属于杭州蜂鸟科技有限公司旗下。杭州蜂鸟是中国新零售创新模式的倡导者和新锐领军企业之一。 公司定位于互联网+服装的互联网产品开发和运营服务商，赋能传统服装企业，提升服装企业对于数据的管理和运用能力，帮助其达成全产业链条信息化、数据化转型升级的战略目标。
				<br>
				<br>公司旗下研发的产品打通服装整个产业链条，包含设计、生产协同、渠道批发、终端零售、线上商城、客户CRM等一系列应用产品。而目前推向市场的必订火这款产品，是基于云端架构，针对服装企业多种订货场景的专业化互联网应用工具。
				<br>
				<br>未来，我们会陆续推出更多优秀的产品，敬请期待。
			</div>
		</div>
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
};
</script>
<style lang="less" scoped>
.line {
	margin-top: 0.1rem;
}
.container{
	background-color: #fff;
	font-size: 0.12rem;
}
</style>