<template>
	<div class="container">
		<header-fix>
			<div slot="left"></div>
			<div slot="right">
				<div class="flex" @click="filterDisplay = true">
					筛选
					<img height="16" src="~assets/img/common/icon-filter.png">
				</div>
			</div>
		</header-fix>
		<div class="body-content">
			<!-- head-total -->
			<div class="total-box">
				<van-row>
					<van-col span="8">
						<div class="red">{{total.dl}}</div>
						<div>订量</div>
					</van-col>
					<van-col span="8">
						<div class="red">{{total.je}}</div>
						<div>金额</div>
					</van-col>
					<van-col span="8">
						<div class="red">{{total.discount}}</div>
						<div>折后金额</div>
					</van-col>
				</van-row>
				<div v-if="totalShowMore">
					<van-row>
						<van-col span="6">
							<div class="red">{{total.ks}}</div>
							<div>款数</div>
						</van-col>
						<van-col span="6">
							<div class="red">{{total.dksd}}</div>
							<div>单款深度</div>
						</van-col>
						<van-col span="6">
							<div class="red">{{total.color_num}}</div>
							<div>款色</div>
						</van-col>
						<van-col span="6">
							<div class="red">{{total.dssd}}</div>
							<div>单色深度</div>
						</van-col>
					</van-row>
					<van-row>
						<van-col class="finish-total" span="24">
							<div class="left">完成率(订量/金额):</div>
							<div class="overflow-hidden">
								<template v-for="(item,key) in total.target_arr">
									<span :key="key" class="line">
										{{key}}
										<span class="red">{{item.target.qty_rate}}</span>/
										<span class="red">{{item.target.amt_rate}}</span>
									</span>
								</template>
							</div>
						</van-col>
					</van-row>
				</div>
				<div class="show-more" @click="totalShowMore = !totalShowMore">
					<span v-if="!totalShowMore">查看更多
						<van-icon name="arrow-down"/>
					</span>
					<span v-else>收起
						<van-icon name="arrow-up"/>
					</span>
				</div>
			</div>
			<div class="sort-box">
				<span>订单排序</span>
				<span @click="showPopup = true" class="right">{{sort.text}}
					<van-icon name="arrow-down"/>
				</span>
			</div>
			<!-- order-list -->
			<div class="order-list">
				<van-checkbox-group v-model="orderIds" @change="selectOrder()">
					<div class="order-item" v-for="(order,$key) in orderList" :key="$key">
						<div class="total-line">
							{{$key}}
							款数：
							<span class="red">{{order.total.g_num}}</span>
							款色：
							<span class="red">{{order.total.c_num}}</span>
							下单门店数：
							<span class="red">{{order.total.s_num}}</span>
							下单件数：
							<span class="red">{{order.total.num}}</span>
						</div>
						<div class="goods" v-for="(list,$key2) in order.list" :key="$key2">
							<div class="goods-info">
								<!-- <span class="van-radio__input">
									<input
										type="checkbox"
										class="van-radio__control"
										@change="selectOrder()"
										v-model="orderIds"
										name="order-ids"
										:value="list.id"
									>
									<i class="van-icon"></i>
								</span> -->
								<van-checkbox :name="list.id" class="checkbox-box" checked-color="#b4a078"></van-checkbox>
								<div class="goods-img">
									<img-box :src="list.img"/>
								</div>
								<div class="goods-desc">
									<div class="goods-desc-line">
										<div class="line-left">款号：{{list.goods_no}}</div>
										<div class="line-right">&yen;{{list.price}}</div>
									</div>
									<div class="goods-desc-line">
										<div class="line-left">圆牌号：{{list.card_no}}</div>
										<div class="line-right">{{list.total_num}}件</div>
									</div>
									<div class="goods-desc-line">
										<div class="line-left">{{list.gcname}}</div>
										<div class="line-right">&yen;{{list.total_num * list.price}}</div>
									</div>
								</div>
							</div>
							<!-- sku-table -->
							<div class="sku-table">
								<table border="0" cellspacing="0">
									<thead>
										<th>&nbsp;</th>
										<th v-for="size in sizeArr[list.size_type]" :key="size">{{size}}</th>
										<th>小计</th>
									</thead>
									<tbody>
										<tr v-for="color in list.colorList" :key="color.toString()">
											<td>{{color[0]}}</td>
											<td
												v-for="(size,index) in sizeArr[list.size_type]"
												:key="index"
											>{{getNum(color[1],sizeArr[list.size_type][index])}}</td>
											<td>{{color[1].total}}</td>
										</tr>
									</tbody>
								</table>
							</div>
							<div class="ctrl-box">
								<span class="red">{{statusArr[order.list[0].status]}}</span>
								<span class="change-btn" @click="changeOrder(order.list[0].goods_id)">修改</span>
							</div>
						</div>
					</div>
				</van-checkbox-group>
				<empty-box v-if="Object.keys(orderList).length < 1" content="暂无相关搭配"></empty-box>
			</div>
			<div class="fixed-ctrl">
				<!-- <label for="select-all">全选</label>
				<span class="van-radio__input">
					<input
						type="checkbox"
						id="select-all"
						v-model="selectAll"
						@change="selectAllDo"
						class="van-radio__control"
					>
					<i class="van-icon"></i>
				</span> -->
				<van-checkbox class="checkbox-box-all" v-model="selectAll" @change="selectAllDo" checked-color="#b4a078">全选</van-checkbox>
				<span class="ctrl-btns" @click="showDialog('showChangeOrder')">批量修改订单</span>
				<span class="ctrl-btns right" @click="showDialog('showCopyOrder')">复制订单</span>
			</div>
		</div>
		<footer-fix></footer-fix>
		<!-- 排序 -->
		<van-popup v-model="showPopup" position="bottom">
			<van-picker show-toolbar :columns="columns" @cancel="onCancelSort" @confirm="changeSort"/>
		</van-popup>
		<!-- 过滤 -->
		<filter-controller
			:is-show="filterDisplay"
			v-show="filterDisplay"
			@submit="searchList"
			@close="filterDisplay = false"
		>
			<van-search v-model="keyword" class="search-ctrl" background="#fff" placeholder="请输入款号"/>
		</filter-controller>
		<!-- 修改订单 -->
		<join-cart v-if="joinCartDisplay" @close="closeCart()" :goodsId="activeGoodsId"></join-cart>
		<!-- 修改订单弹框 -->
		<van-dialog v-model="showChangeOrder" :show-confirm-button="false" close-on-click-overlay>
			<div class="chenge-order">
				<div class="line"><van-stepper min="0" v-model="increment" />件</div>
				<div class="line"><van-stepper min="1" v-model="multiple" />倍</div>
			</div>
			<div class="chenge-order-btn" @click="changeBatchOrder()">批量修改订单</div>
		</van-dialog>
		<!-- 复制订单 -->
		<van-dialog
			v-model="showCopyOrder"
			title="请输入需要复制下单的店铺信息"
			show-cancel-button
			closeOnClickOverlay
			:beforeClose="copyOrder"
		>
			<van-field v-model="username" placeholder="请输入门店账号"/>
			<van-field v-model="password" type="password" placeholder="请输入密码"/>
		</van-dialog>
	</div>
</template>
<script>
import headerFix from "@/components/headerFix";
import footerFix from "@/components/footerFix";
import imgBox from "@/components/imgBox.vue";
import filterController from "@/components/filterController/filterController.vue";
import joinCart from "@/components/joinCart.vue";
import emptyBox from "@/components/emptyBox.vue";
export default {
	name: 'MyOrder',
	data() {
		return {
			totalShowMore: false,
			filterList: null,
			filterDisplay: false,
			selectList: [],
			orderList: [],
			total: {},
			sizeArr: [],
			activeGoodsId: null,
			statusArr: ["待审核", "已审核", "已作废", "已删"],
			joinCartDisplay: false,
			showPopup: false,
			sort: {},
			keyword: "",
			attributes: [],
			category_ids: [],
			brand_ids: [],
			pageNum: 1,
			orderIds: [],
			orderArr: [],
			orderIndex: 0,
			columns: [
				// '按款号', '按波段', '按品类', '按季节', '按款式类型'
				{ text: "按款号", value: "1" },
				{ text: "按波段", value: "2" },
				{ text: "按品类", value: "3" },
				{ text: "按季节", value: "4" },
				{ text: "按款式类型", value: "5" }
			],
			//批量修改订单
			increment: 0,
			multiple: 1,
			selectAll: false,
			showChangeOrder: false,
			showCopyOrder: false,
			//复制订单
			username: '',
			password: ''
		};
	},
	created() {
		this.sort = this.columns[0];
		this.getOrderList();
	},
	methods: {
		searchList(list) {
			this.category_ids = list.category_ids;
			this.brand_ids = list.brand_ids;
			this.attributes = list.attributes;
			this.filterDisplay = false;
			this.getSearchList();
		},
		async getOrderList() {
			let res = await this.axios({
				url: "/wapi/order_analysis/index.json"
			});
			res.show_list = this.buildData(res.show_list);
			this.total = res.sum_total;
			this.orderList = res.show_list;
			this.sizeArr = res.size_show;
			this.orderArr = res.order_arr;
		},
		async getSearchList() {
			let res = await this.axios({
				url: "/wapi/order_analysis/getlists.json",
				method: "post",
				data: {
					pageNum: this.pageNum,
					category_id: this.category_ids.join(','),
					category_ids: this.category_ids,
					brand_id: this.brand_ids,
					attributes: this.attributes,
					goods_no: this.keyword,
					stype: this.sort.value
				}
			});
			res.data.show_list = this.buildData(res.data.show_list);
			this.orderList = res.data.show_list;
			this.sizeArr = res.data.size_show;
			this.orderArr = res.data.order_arr;
		},
		selectAllDo() {
			if (this.selectAll) {
				this.orderIds = this.orderArr;
			} else {
				this.orderIds = [];
			}
		},
		selectOrder() {
			if (this.orderIds.length === this.orderArr.length) {
				this.selectAll = true;
			}
		},
		showDialog(item){
			if(this.orderIds.length < 1){
				this.$toast('请选择订单');
				return;
			}
			if(item === 'showChangeOrder'){
				this.showChangeOrder = true;
			}
			if(item === 'showCopyOrder'){
				this.showCopyOrder = true;
			}
		},
		closeCart(){
			this.joinCartDisplay = false;
			this.getOrderList();
		},
		//批量修改订单
		async changeBatchOrder() {
			if(this.orderIds.length < 1){
				this.$toast('请选择订单');
				return;
			}
			let res = await this.axios({
				url: "/wapi/order/set_batch.json",
				method: "post",
				data: {
					increment: this.increment,
					multiple: this.multiple,
					order_ids: this.orderIds
				}
			});
			if(res.code === 0){
				this.showChangeOrder = false;
				this.getOrderList();
			}
			this.$toast(res.message);
		},
		// 复制订单
		async copyOrder(action, done) {
			if(action === 'cancel'){
				done();
				return;
			}
			if(this.username.length < 2){
				this.$toast('请输入门店账号');
				done(false)
				return;
			}
			if(this.password.length < 2){
				this.$toast('请输入密码');
				done(false)
				return;
			}
			let res = await this.axios({
				url: "/wapi/order_analysis/copyorders.json",
				method: 'post',
				data: {
					username: this.username,
					userpass: this.password,
					order_ids: this.orderIds.join(',')
				}
			});
			if(res.code !== 0){
				done(false);
			}else{
				done();
			}
			this.$toast(res.message);
		},
		changeOrder(goodsId) {
			this.activeGoodsId = goodsId;
			this.joinCartDisplay = true;
		},
		changeSort(item) {
			this.sort = item;
			this.showPopup = false;
			this.getSearchList();
		},
		onCancelSort() {
			this.showPopup = false;
		},
		buildData(show_list) {
			for (var key in show_list) {
				for (var i = 0; i < show_list[key].list.length; i++) {
					var l = show_list[key].list[i];
					l.colorList = this.getEntries(l.color_show);
					l.index = ++this.orderIndex;
					l.isChecked = false;
				}
			}
			return show_list;
		},
		getEntries(obj) {
			var entries = [];
			for (var key in obj) {
				entries.push([key, obj[key]]);
			}
			return entries;
		},
		getNum: function(obj, size) {
			try {
				return obj["amount"][size]["count"];
			} catch (e) {
				return "-";
			}
		}
	},
	watch: {
		increment(val){
			if(val > 0){
				this.multiple = 1;
			}
		},
		multiple (val){
			if(val > 1){
				this.increment = 0;
			}
		}
	},
	components: {
		headerFix,
		footerFix,
		imgBox,
		filterController,
		joinCart,
		emptyBox
	}
};
</script>

<style lang="less" scoped>
.container {
	.total-box {
		background-color: #fff;
		.van-row {
			padding: 0.1rem 0;
			text-align: center;
			font-size: 0.14rem;
			.red {
				font-size: 0.12rem;
			}
		}
		.van-row:nth-child(1) {
			border-bottom: 1px solid #e7e7e7;
		}
		.finish-total {
			text-align: left;
			padding-left: 0.15rem;
			.overflow-hidden {
				padding-left: 0.1rem;
				font-size: 0.14rem;
				overflow: hidden;
				.line {
					display: inline-block;
					padding-right: 0.1rem;
				}
			}
		}
		.show-more {
			width: 100%;
			padding: 0.1rem;
			text-align: center;
			color: #999;
			font-size: 0.14rem;
		}
	}
}
.sort-box {
	text-align: center;
	padding: 0.1rem;
	width: 100%;
	font-size: 0.14rem;
	background-color: #fff;
	.right {
		color: #b4a078;
	}
}
.order-list {
	width: 100%;
	min-height: 100%;
	background-color: #fff;
	padding-bottom: 0.6rem;
	.order-item {
		width: 100%;
		padding-bottom: 0.1rem;
		.total-line {
			text-align: center;
			padding: 0.1rem;
			background-color: #e7e7e7;
			font-size: 0.12rem;
		}
		.goods-info {
			padding: 0.15rem;
			.checkbox-box {
				padding-right: 0.1rem;
				margin-top: 0.2rem;
				float: left;
			}
			.goods-img {
				height: 0.66rem;
				width: 0.66rem;
				float: left;
				padding-right: 0.1rem;
			}
			.goods-desc {
				overflow: hidden;
				height: 0.6rem;
				color: #999;
				font-size: 0.14rem;
				.goods-desc-line {
					width: 100%;
					height: 0.22rem;
					font-size: 0.14rem;
					.line-left {
						float: left;
					}
					.line-right {
						overflow: hidden;
						text-align: right;
					}
					&:nth-child(2) {
						line-height: 0.2rem;
					}
					&:nth-child(2) {
						vertical-align: bottom;
					}
				}
				.goods-desc-line:nth-child(1) {
					color: #333;
				}
			}
		}
		.sku-table {
			width: 100%;
			font-size: 0.14rem;
			padding: 0 0.15rem;
			table {
				table-layout: fixed;
				width: 100%;
				text-align: center;
				border: 1px solid #efefef;
				thead {
					background-color: #efefef;
				}
				td,
				th {
					padding: 0.04rem;
					white-space: nowrap;
				}
			}
		}
		.ctrl-box {
			width: 100%;
			text-align: right;
			font-size: 0.14rem;
			padding: 0.1rem 0.15rem;
			.change-btn {
				padding: 0.04rem 0.15rem;
				border: 1px solid #b4a078;
				color: #b4a078;
				border-radius: 4px;
				margin-left: 0.15rem;
				display: inline-block;
			}
		}
	}
}
// .van-radio__input {
// 	.van-radio__control {
// 		z-index: 2;
// 	}
// 	.van-radio__control + i::before {
// 		color: #999;
// 		content: "\F02C";
// 	}
// 	.van-radio__control:checked + i::before {
// 		content: "\F02B";
// 		color: #b4a078;
// 	}
// }
.checkbox-box-all{
	float: left;
	line-height: 0.27rem;
}
.fixed-ctrl {
	width: 100%;
	background-color: #fff;
	border-top: 1px solid #c9c9c9;
	padding: 0.05rem 0.15rem;
	font-size: 0.14rem;
	position: fixed;
	bottom: 0.48rem;
	left: 0;
	z-index: 2;
	.ctrl-btns {
		padding: 0.04rem 0.15rem;
		color: #fff;
		background-color: #b4a078;
		border-radius: 4px;
		margin-left: 0.15rem;
		display: inline-block;
		&.right {
			float: right;
		}
	}
}
.chenge-order{
	padding: 0.1rem;
	.line{
		padding-bottom: 0.1rem;
		text-align: center;
		line-height: 30px;
		.van-stepper{
			display: inline-block;
			vertical-align: top;
			margin-right: 0.2rem;
		}
	}
}
.chenge-order-btn{
	padding: 0.04rem 0.1rem;
	background-color: #b4a078;
	color: #fff;
	font-size: 0.14rem;
	width: 1.2rem;
	margin: 0 auto 0.15rem;
	text-align: center;
	border-radius: 4px;
}
</style>