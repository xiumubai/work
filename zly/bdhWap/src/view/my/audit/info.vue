<template>
	<div class="container">
		<header-fix :centerText="$route.query.title"></header-fix>
		<div class="body-content">
			<table class="total-tab">
				<tr style="color: red;vertical-align: bottom;">
					<td style="width: 25%;">
						<div>{{total.goods_ids}}</div>
					</td>
					<td style="width: 25%;">
						<div>{{total.colors}}</div>
					</td>
					<td style="width: 50%;">
						<div>{{total.total_numer}}件/¥{{total.total_money}}</div>
					</td>
				</tr>
				<tr style="height: 50px;">
					<td>款数</td>
					<td>款色</td>
					<td>共计</td>
				</tr>
			</table>

			<div
				v-for="(item, $key) in list"
				:key="$key"
				style="background: white;padding: 15px;margin-top: 10px;"
			>
				<table class="info-tab">
					<tr style="font-size: 14px;color: #333333;height: 20px;vertical-align: top;">
						<td style="width: 30%;" rowspan="3">
							<template v-if="item.default_image">
								<img
									style="width: 66px;height: 66px;margin-left: 2px;margin-top: 2px;"
									:src="item.default_image+'?x-oss-process=image/resize,h_70,w_70'"
								>
							</template>
							<template v-else>
								<!-- <img style="width: 66px;height: 66px;margin-left: 2px;margin-top: 2px;" class="mui-media-object" src="../../img/no-good.png"> -->
							</template>
						</td>
						<td style="width: 50%;">
							<div>{{item.category_name}}</div>
						</td>
						<td style="width: 20%;">
							<div>¥ {{item.price}}</div>
						</td>
					</tr>
					<tr style="font-size: 12px;color: #9B9B9B;line-height: 30px;">
						<td>圆牌号：002</td>
						<td>x{{item.total_number}}</td>
					</tr>
					<tr style="font-size: 12px;color: #9B9B9B;height: 20px;vertical-align: bottom">
						<td>款号：{{item.goods_no}}</td>
						<td>¥ {{item.order_money}}</td>
					</tr>
				</table>
				<table class="bd-table">
					<thead>
						<th></th>
						<th v-for="size in size_show" :key="'size'+size">{{size}}</th>
						<th>小计</th>
					</thead>
					<tbody>
						<tr v-for="(ite, color) in item.color" class="c333" :key="'color' + color">
							<td>{{color}}</td>
							<td v-for="size in size_show" :key="'size1' + size">{{getNum(ite.amount, size)}}</td>
							<td>{{getTotal(ite.amount)}}</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div style="height: 50px;"></div>
			<nav @click="audit()" class="audit-btn">{{typeValue}}</nav>
		</div>
	</div>
</template>
<script>
import headerFix from "@/components/headerFix";
export default {
	data() {
		return {
			total: {},
			list: [],
			size_show: [],
			count: 0,
			type: -1,
			member_id: 0,
			typeValue: ""
		};
	},
	created() {
		this.member_id = this.$route.query.member_id;
		this.type = this.$route.query.type;
		this.typeValue = this.type === 1 ? "审 核" : "取消审核";
		this.getList();
	},
	methods: {
		async getList() {
			let res = await this.axios({
				url: "/wapi/order_analysis/audit_page.json",
				params: {
					member_id: this.member_id,
					type: this.type
				}
			});
			this.total = res.total;
			this.list = res.list;
			this.size_show = res.size_show;
		},
		getTotal: function(obj) {
			var num = 0;
			for (var i in obj) {
				num += obj[i];
			}
			return num;
		},
		getNum: function(obj, size) {
			try {
				return obj[size] ? obj[size] : "-";
			} catch (e) {
				return "-";
			}
		},
		async audit() {
			let ask = "确定取消审核吗？";
			let title = "取消审核";
			if (this.type === 1) {
				ask = "确定审核吗？";
				title = "审核";
			}

			await this.$dialog.confirm({
				title: title,
				message: ask
			});
			let res = await this.axios({
				url: "/wapi/order_analysis/checkOrders.json",
				params: {
					member_id: this.member_id,
					type: this.type
				}
			});
			this.type = this.type === 1 ? 0 : 1;
			this.typeValue = this.type === 1 ? "审 核" : "取消审核";
			this.$toast(res.message);
		}
	},
	components: {
		headerFix
	}
};
</script>

<style lang="less" scoped>
table {
	background: #ffffff;
	word-break: break-all;
	border: 0;
	margin: 0;
	border-collapse: collapse;
	border-spacing: 0;
}
table td {
	padding: 0;
}
.total-tab {
	width: 100%;
	text-align: center;
	font-size: 14px;
}
.total-tab tr {
	height: 35px;
}
.bd-table {
	border: 1px solid #f7f7f7;
	margin-bottom: 14px;
	margin-top: 10px;
	font-size: 0.14rem;
	min-width: 100%;
	text-align: center;
	thead {
		background: #f1f1f1;
	}
}

.bd-table thead th {
	line-height: 27px;
	border: none;
}

.bd-table td {
	line-height: 40px;
	border: none;
}
.c333 {
	color: #333;
}
.info-tab {
	margin-top: 10px;
}
.audit-btn {
	line-height: 50px;
	background: #b1a078;
	color: white;
	font-size: 16px;
	text-align: center;
	position: fixed;
	bottom: 0;
	left: 0;
	width: 100%;
}
</style>