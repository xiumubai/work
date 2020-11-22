<template>
	<div class="footer-box">
		<template v-if="!isInBdh">
			<div class="footer-item">
				<router-link :to="{name: 'Index'}">
				<span class="footer-icon">
					<img :src="changeNav('Index')">
				</span>
				<span class="footer-tip" :class="{active: activeRoute.name == 'Index'}">全部应用</span>
				</router-link>
			</div>
			<div class="footer-item">
				<router-link :to="{name: 'AboutUs'}">
				<span class="footer-icon">
					<img :src="changeNav('AboutUs')">
				</span>
				<span class="footer-tip" :class="{active: activeRoute.name == 'AboutUs'}">关于我们</span>
				</router-link>
			</div>
		</template>
		<template v-if="isInBdh">
			<template v-if="!isMeetingEnd">
				<div class="footer-item">
					<router-link :to="{name: 'Single'}">
						<span class="footer-icon">
							<img :src="changeNav('Single')">
						</span>
						<span class="footer-tip" :class="{active: activeRoute.name == 'Single'}">单款</span>
					</router-link>
				</div>
				<div class="footer-item">
					<router-link :to="{name: 'Analyze'}">
						<span class="footer-icon">
							<img :src="changeNav('Analyze')">
						</span>
						<span class="footer-tip" :class="{active: activeRoute.name == 'Analyze'}">订单分析</span>
					</router-link>
				</div>
				<div class="footer-item">
					<router-link :to="{name: 'More'}">
						<span class="footer-icon">
							<img :src="changeNav('More')">
						</span>
						<span class="footer-tip" :class="{active: activeRoute.name == 'More'}">更多</span>
					</router-link>
				</div>
				<div class="footer-item">
					<router-link :to="{name: 'MyOrder'}">
						<span class="footer-icon">
							<img :src="changeNav('MyOrder')">
						</span>
						<span class="footer-tip" :class="{active: activeRoute.name == 'MyOrder'}">我的订单</span>
					</router-link>
				</div>
				</template>
				<div class="footer-item">
					<router-link :to="{name: 'My'}">
						<span class="footer-icon">
							<img :src="changeNav('My')">
						</span>
						<span class="footer-tip" :class="{active: activeRoute.name == 'My'}">我的</span>
					</router-link>
				</div>
		</template>
	</div>
</template>
<script>
// 全部应用
import allAppDefault from "@/assets/img/common/footer_bar/bar_icon_app_list.png";
import allAppActive from "@/assets/img/common/footer_bar/bar_icon_app_list_selected.png";
// 关于我们
import mineDefault from "@/assets/img/common/footer_bar/bar_icon_mine.png";
import mineActive from "@/assets/img/common/footer_bar/bar_icon_mine_selected.png";
// 单款
import goodsDefault from "@/assets/img/common/footer_bar/bar_icon_goods.png";
import goodsActive from "@/assets/img/common/footer_bar/bar_icon_goods_selected.png";
// 订单分析
import orderAnalysisDefault from "@/assets/img/common/footer_bar/bar_icon_order_analysis.png";
import orderAnalysisActive from "@/assets/img/common/footer_bar/bar_icon_order_analysis_selected.png";
//更多
import moreDefault from "@/assets/img/common/footer_bar/bar_icon_more.png";
import moreActive from "@/assets/img/common/footer_bar/bar_icon_more_selected.png";
// 我的订单
import myOrderDefault from "@/assets/img/common/footer_bar/bar_icon_myorder.png";
import myOrderActive from "@/assets/img/common/footer_bar/bar_icon_myorder_selected.png";
export default {
	data() {
		return {
			Index: {
				default: allAppDefault,
				active: allAppActive
			},
			My: {
				default: mineDefault,
				active: mineActive
			},
			AboutUs: {
				default: mineDefault,
				active: mineActive
			},
			Single: {
				default: goodsDefault,
				active: goodsActive
			},
			Analyze: {
				default: orderAnalysisDefault,
				active: orderAnalysisActive
			},
			More: {
				default: moreDefault,
				active: moreActive
			},
			MyOrder: {
				default: myOrderDefault,
				active: myOrderActive
			},
			isInBdh: false,
			activeRoute: this.$route
		};
	},
	mounted() {
		this.activeRoute = this.$route;
		if (!this.activeRoute.meta.isNotAuth) {
			this.isInBdh = true;
		}
	},
	computed: {
		isMeetingEnd(){
			return this.$store.getters.getMeetingInfo;
		}
	},
	methods: {
		changeNav(route) {
			if (this.activeRoute.name === route) {
				return this[route].active;
			} else {
				return this[route].default;
			}
		}
	}
};
</script>
<style scoped lang="less">
.footer-box {
	height: 0.5rem;
	box-shadow: 0 -1px 6px #ccc;
	display: flex;
	background-color: #fff;
	border-top: 1px solid #c9c9c9;
	.footer-item {
		flex: 1;
		.footer-icon {
			height: 0.24rem;
			width: 100%;
			text-align: center;
			display: block;
			padding-top: 0.03rem;
			img {
				height: 0.24rem;
			}
		}
		.footer-tip {
			width: 100%;
			text-align: center;
			display: block;
			padding-top: 0.03rem;
			font-size: 0.11rem;
			line-height: 0.21rem;
			&.active {
				color: #b4a078;
			}
		}
	}
}
</style>


