<template>
	<transition name="slide-fade">
		<div class="join-cart-box">
			<div class="cardno" v-if="card_no !== ''">
				<span>{{card_no}}</span>
			</div>
			<div class="goods-box">
				<div class="goods-info display-flex">
					<div class="goods-img">
						<img :src="goodsInfo.default_image">
					</div>
					<div class="goods-desc flex">
						<div class="info">
							款号：{{goodsInfo.goods_no}}
							<br>
							圆牌号：{{goodsInfo.card_no}}
							<br>
							{{goodsInfo.title}}
						</div>
						<div class="close-btn" @click="close()">
							<van-icon size="30px" name="cross"/>
						</div>
						<div class="price">&yen;{{goodsInfo.tag_price}}</div>
					</div>
				</div>
				<div class="color-box">
					<p>颜色：</p>
					<div class="color-list">
						<span
							class="color-item"
							@click="chengeColor(index)"
							v-for="(color,index) in skuList"
							:key="index"
							:class="{active: activeColor == index}"
						>{{index}}</span>
					</div>
				</div>
				<div class="size-box">
					<p>尺码</p>
					<van-cell-group>
						<van-cell class="size-item" title="手数">
							<van-stepper
								v-model="handleNum"
								@change="handleChange(activeColor)"
								integer
								:min="0"
								:step="1"
							/>
						</van-cell>
						<van-cell
							v-for="(size,index) in skuList[activeColor]"
							:key="index"
							class="size-item"
							:title="index"
						>
							<van-stepper v-model="skuList[activeColor][index]" integer :min="0" :step="1"/>
						</van-cell>
					</van-cell-group>
				</div>
			</div>
			<div class="join-order-bar display-flex">
				<div class="flex">
					订量:
					<span class="red">{{totalNum}}件</span>
					<br>订额:
					<span
						class="red"
					>&yen;{{(Math.round((totalNum * goodsInfo.tag_price) * 100)/100).toFixed(2)}}</span>
				</div>
				<div class="flex text-center">
					<div class="ctrl-box" @click="clearCurrentColorList()">
						<img src="~assets/img/common/join_cart/clear_icon.png" width="24">
						<br>清空
					</div>
					<div class="ctrl-box" @click="cancelOrder()">
						<img src="~assets/img/common/join_cart/close_icon.png" width="24">
						<br>取消下单
					</div>
				</div>
				<div class="flex" @click="addOrder">加入订单</div>
			</div>
		</div>
	</transition>
</template>
<script>
export default {
	props: {
		goodsId: {
			default: null
		},
		card_no: {
			default: ''
		}
	},
	created() {
		this.getGoodsInfo();
	},
	data() {
		return {
			value: 5,
			activeColor: null,
			goodsInfo: {},
			skuList: {},
			handleNum: 0
		};
	},
	methods: {
		async getGoodsInfo() {
			//获取商品基本信息
			let res = await this.axios({
				url: "/wapi/goods/info.json",
				params: {
					id: this.goodsId
				}
			});
			this.goodsInfo = res.data;
			//获取sku信息
			this.goodsInfo = res.goods;
			let resGoods = await this.axios({
				url: "/wapi/order/goods.json",
				params: {
					goods_id: this.goodsId
				}
			});
			let colorKeys = Object.keys(resGoods.total);
			this.activeColor = colorKeys[0];
			this.skuList = resGoods.total;
		},
		chengeColor(color) {
			this.activeColor = color;
		},
		handleChange(color) {
			let skuList = this.skuList;
			let handleNum = this.handleNum;
			for (let colorList in skuList) {
				if (color === colorList) {
					for (let size in skuList[colorList]) {
						skuList[colorList][size] = handleNum;
					}
				}
			}
		},
		async clearCurrentColorList(showHint = true) {
			if(showHint){
				await this.$dialog.confirm({
					message: "是否清空订单？",
					confirmButtonText: "是",
					cancelButtonText: "否"
				});
			}
			let skuList = this.skuList;
			for (let colorList in skuList) {
				for (let size in skuList[colorList]) {
					skuList[colorList][size] = 0;
				}
			}
			this.handleNum = 0;
			if(showHint){
				this.$toast("操作成功");
			}
		},
		async cancelOrder() {
			await this.$dialog.confirm({
				message: "确认取消订单",
				confirmButtonText: "是",
				cancelButtonText: "否"
			});
			let res = await this.axios({
				url: "/wapi/order/del.json",
				method: "post",
				params: {
					goods_id: this.goodsId
				}
			});
			if (res.code === 0) {
				this.$toast("取消成功");
				this.clearCurrentColorList(false);
			} else {
				this.$toast(res.message);
			}
		},
		async addOrder() {
			let userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
			if(userInfo.is_purchaser){
				this.$toast("非门店账号无法下单");
				return;
			}
			if (this.totalNum < 1) {
				this.$toast("请至少下一件！");
				return;
			}
			let res = await this.axios({
				url: "/wapi/order/set.json",
				method: "post",
				data: {
					goods_id: this.goodsId,
					color_size: this.skuList
				}
			});
			if (res.code === 0) {
				this.$toast("下单成功");
				this.close();
			} else {
				this.$toast(res.message);
			}
		},
		close() {
			this.$emit("close");
		}
	},
	computed: {
		totalNum() {
			let total = 0;
			for (let colorList in this.skuList) {
				for (let size in this.skuList[colorList]) {
					if (this.skuList[colorList][size] > 0) {
						total += this.skuList[colorList][size];
					}
				}
			}
			return total;
		}
	}
};
</script>

<style lang="less" scoped>
.join-cart-box {
	position: fixed;
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 1000;
}
.goods-box {
	background-color: #fff;
	max-height: 80%;
	position: absolute;
	bottom: 0;
	left: 0;
	width: 100%;
	overflow: auto;
	padding-bottom: 0.6rem;
	.goods-info {
		width: 100%;
		padding: 0.1rem;
		font-size: 0.14rem;
		color: #8f8f94;
		position: relative;
		border-bottom: 1px solid #e7e7e7;
		.goods-img {
			height: 0.6rem;
			width: 0.6rem;
			margin-right: 0.1rem;
			img {
				width: 100%;
			}
		}
		.close-btn {
			position: absolute;
			top: 0.05rem;
			right: 0.05rem;
			color: #333;
		}
		.price {
			position: absolute;
			bottom: 0.1rem;
			right: 0.1rem;
			color: red;
		}
	}
}
.color-box {
	padding: 0.1rem;
	p {
		padding: 0.02rem;
	}
	.color-list {
		padding: 0.1rem 0;
	}
	.color-item {
		padding: 0.05rem 0.1rem;
		text-align: center;
		border-radius: 4px;
		border: 1px solid #e7e7e7;
		font-size: 0.14rem;
		margin-right: 0.1rem;
		&.active {
			background-color: #b4a078;
			border-color: #b4a078;
			color: #fff;
		}
	}
}
.size-box {
	p {
		padding: 0.1rem;
	}
	.size-item {
		line-height: 0.3rem;
	}
}
.join-order-bar {
	width: 100%;
	height: 0.5rem;
	position: fixed;
	bottom: 0;
	left: 0;
	background-color: #f7f7f7;
	box-shadow: 0 0 1px rgba(0, 0, 0, 0.85);
	.red {
		color: red;
	}
	.flex:nth-child(1) {
		padding: 0.05rem 0.15rem;
		line-height: 0.2rem;
		font-size: 0.12rem;
	}
	.flex:nth-child(2) {
		border-left: 1px solid #e2e2e2;
		border-right: 1px solid #e2e2e2;
		text-align: center;
		font-size: 0.12rem;
		padding: 0.01rem 0.15rem;
		display: flex;
		.ctrl-box {
			flex: 1;
		}
	}
	.flex:nth-child(3) {
		background-color: #b4a078;
		line-height: 0.5rem;
		text-align: center;
		color: #fff;
	}
}
.slide-fade-enter-active {
	transition: all 0.3s ease;
}
.slide-fade-leave-active {
	transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to {
	transform: translateX(10px);
	opacity: 0;
}
</style>