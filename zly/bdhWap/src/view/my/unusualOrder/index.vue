<!--
 *异常订单
-->
<template>  
	<div class="container">
    <header-fix centerText="异常订单"></header-fix>
    <div class="body-content">
      <div class="" v-if="list.length > 0">
				<template  v-for="(item, index) in list">
					<table :key="index">
						<tr class="one-tr">
							<td  colspan="4">
								<div class="goods-no">款号：{{item.goods_no}}</div>
								<div class="order-time">{{item.created_at}}</div>
							</td>
						</tr>
						<tr class="two-tr">
							<td width="45%">单号</td>
							<td width="25%">类别</td>
							<td width="15%">颜色</td>
							<td width="15%">订数</td>
						</tr>
						<tr class="three-tr">
							<td>{{item.order_no}}</td>
							<td>{{item.category_name}}</td>
							<td>{{item.color}}</td>
							<td>{{item.number}}</td>
						</tr>
						<tr class="four-tr">
							<td colspan="4">{{item.reason}}</td>
						</tr>
					</table>
				</template>
      </div>
			<empty-box v-else content="暂无异常订单"></empty-box>
    </div>
  </div>
</template>
<script>
import headerFix from "@/components/headerFix";
import emptyBox from "@/components/emptyBox.vue";
export default {
	data() {
		return {
			list: []
		}
	},
	mounted() {
		this.getData();
	},
	components: {
		headerFix,emptyBox
	},
	methods: {
		async getData() {
			let res = await this.axios({
				url: '/wapi/wap/unusual_order/list.json',
				method: 'get',
			});
			this.list = res.data;
		}
	}
};
</script>
<style scoped lang="less">
.body-content{
	height: calc(100% - 0.44rem);
}
table {
	width:100%;
	word-break:break-all;
	margin-top: 10px;
	font-size: 14px;
	border-spacing: 0;
	border-collapse: collapse;
}
.one-tr {
	height: 30px;
	line-height: 30px;
	background: #f7f7f7;
}
.one-tr .goods-no {
	width: 50%;
	float: left;
	padding-left: 10px;
}
.one-tr .order-time {
	width: 50%;
	text-align: right;
	float: left;
	padding-right: 10px;
}
.two-tr {
		height: 30px;
		line-height: 30px;
		text-align: center;
		background: #ffffff;
		border-bottom:1.2px solid #f1f1f1;
		color: #c7c7c7;
}
.three-tr {
	height: 30px;
	line-height: 30px;
	text-align: center;
	background: #ffffff;
	border-bottom:1.2px solid #f1f1f1;
}
.four-tr {
	background: #ffffff;
	color: red;
	height: 30px;
	line-height: 30px;
}
.four-tr td {
	text-align: right;
	padding-right: 10px;
}
</style>
