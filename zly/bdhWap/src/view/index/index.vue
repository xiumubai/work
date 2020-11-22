<template>
	<div class="container">
		<header-fix><div slot="left"></div></header-fix>
		<div class="body-content">
			<div class="app-list">
				<router-link :to="{name: 'SearchCompany'}" class="app-box display-flex">
					<div class="img-box">
						<img src="~assets/img/common/logo.png">
					</div>
					<div class="content-box flex">
						<div class="title">必订火</div>
						<div class="desc">适用于订货会/巡展/现场/远程订货、补货支持Pad/APP下单</div>
					</div>
				</router-link>
				<!-- <div class="app-box display-flex">
					<div class="img-box">
						<img src="~assets/img/common/ns-logo.png">
					</div>
					<div class="content-box flex">
						<div class="title">内审管家</div>
						<div class="desc">适用于服装行业的审样会</div>
					</div>
				</div> -->
			</div>
		</div>
		<footer-fix></footer-fix>
	</div>
</template>

<script>
import headerFix from "@/components/headerFix";
import footerFix from "@/components/footerFix";
export default {
	name: "index",
	components: {
		headerFix,
		footerFix
	}
};
</script>

<style scoped lang="less">
.body-content {
	width: 100%;
	.app-list {
		padding-top: 0.2rem;
	}
	.app-box {
		background-color: #fff;
		margin-bottom: 0.2rem;
		width: 100%;
		padding: 0.1rem;
		border-bottom: 1px solid #c9c9c9;
		border-top: 1px solid #c9c9c9;
		.img-box {
			width: 0.8rem;
			height: 0.8rem;
			padding: 0.1rem;
			img {
				width: 0.6rem;
				height: 0.6rem;
			}
		}
		.content-box {
			padding: 0 0 0 0.1rem;
			.title {
				font-size: 0.2rem;
				font-weight: bold;
				line-height: 0.21rem;
				padding: 0.02rem 0 0.12rem;
			}
			.desc {
				font-size: 0.14rem;
			}
		}
	}
}
</style>
