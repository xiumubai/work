<!--
	* 收藏评款
-->
<template>  
	<div class="container">
    <header-fix centerText="收藏评款"></header-fix>
    <div class="body-content">
      <div class="favorite">
				<div class="list" v-if="total > 0">
					<div class="list-item" v-for="(good, index) in favoriteList" :key="index">
						<van-swipe-cell :right-width="120">
							<van-cell-group>
								<router-link :to="{name:'GoodsInfo',query:{id: good.id}}">
									<div class="item-block">
										<div class="item-img">
											<img v-if="good.default_image" class=" mui-pull-left" :src="good.default_image+'?x-oss-process=image/resize,h_100,w_100'">
											<img v-else src="http://biding365.oss-cn-hangzhou.aliyuncs.com/public/nopic.jpg?x-oss-process=image/resize,m_pad,h_200,w_200,color_FFFFFF">
										</div>
										<div class="item-body">
											<p class="goodsno">款号 : {{good.goods_no}}</p>
											<div>
												<p style="float: left;">圆牌号 : {{good.card_no}}</p>
												<p style="float: right;color: red;">￥{{good.price}}</p>
											</div>
											<div style="clear: both;"></div>
											<p>{{good.title}}</p>
											<div>
												<p style="float: left;">已订{{good.total_number}}件，共￥{{good.order_money}}</p>
												<van-button class="btn" @click="addOrderFN(good.id)">加入订单</van-button>
											</div>
										</div>
									</div>
								</router-link>
							</van-cell-group>
							<span slot="right" class="del" @click="deleteFn(good.id)">删除收藏</span>
						</van-swipe-cell>
					</div>
				</div>
				<empty-box v-else content="暂无数据"></empty-box>
      </div>
    </div>
		<joinCart v-if="joinCartDisplay" @close="closeClick" :goodsId="goodsId"/>
  </div>
</template>
<script>
import headerFix from "@/components/headerFix";
import joinCart from "@/components/joinCart";
import emptyBox from "@/components/emptyBox.vue";
export default {
	components: {
		headerFix,joinCart,emptyBox
	},
	data() {
		return {
			total: 0,
			favoriteList: [],
			joinCartDisplay: false,
			goodsId: ''
		}
	},
	mounted() {
		this.getData()
	},
	methods: {
		async getData() {
			let res = await this.axios({
				url: '/wapi/goods/favorite/query.json',
				method: 'post',
				params: {
					favorite_level: ''
				}
			});
			this.total = res.data.length;
			this.favoriteList = res.data;
		},
		async deleteFn(id){
			this.$dialog.confirm({
				title: '删除',
				message: '确认要删除吗？'
			}).then(() => {
				this.axios({
					url: '/wapi/goods/favorite/cancel.json',
					method: 'post',
					params: {
						goods_ids: [id]
					}
				})
				this.$toast('删除成功')
				this.getData();
			}).catch(() => {
				// on cancel
			});
		},
		addOrderFN(goodid) {
			this.joinCartDisplay = true;
			this.goodsId = goodid;
		},
		closeClick() {
			this.joinCartDisplay = false
			this.getData();
		}
	},
};
</script>
<style scoped lang="less">
.body-content{
	height: calc(100% - 0.44rem);
}
.favorite{
	.list{
		padding: 0 0.1rem;
		.list-item{
			margin: 0.1rem 0;
			.item-block{
				display: flex;
				.item-img{
					flex: 1rem 0 0;
					height: 1rem;
					padding-right: 2px;
					img{
						width: 1rem;
						height: 1rem;
					}
				}
				.item-body{
					padding-right: .02rem;
					flex: 1;
					.goodsno{
						font-size: 0.15rem;
						color: #333333
					}
					P{
						color: #999;
						font-size: .14rem;
					}
					.btn{
						float: right;
						background-color: #B4A078;
						color: #fff;
						height: .32rem;
						line-height: .32rem;
					}
				}
			}
			.van-swipe-cell__right{
				display: flex;
				justify-content: center;
				align-items: center;
				span{
					display: inline-block;
					width: 1.2rem;
					height: 100%;
					line-height: 1rem;
					text-align: center;
					color: #ffffff;
					background: #F75434;
				}
			}
			
		}
	}
	.empty{
		.message{
			text-align: center;
			margin-top: 50%;
			img{
				height: 0.4rem;
			}
			.fz14{
				color: #9B9B9B;
				margin-top:0.10rem;
			}
		}
	}
}
</style>
