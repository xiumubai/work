<template>
	<view class="address">
		<view class="address-container">
			<template v-if="addressList.length > 0">
				<block v-for="(item, index) in addressList" :key="index">
					<view class="address-item" v-on:click.stop="handleChooseAddress(item)">
						<view class="name font_16 c333 mb_10">{{ item.consignee }} {{ item.mobile }}</view>
						<view class="address-info">
							<view class="text font_14 c999 ellipsis-l1">收货地址：{{ item.province }}{{ item.city }}{{ item.area }}{{ item.detail }}</view>
							<view class="action">
								<view class="edit font_14" v-on:click.stop="handleEditAddress(item.id)">编辑</view>
								<view class="delete font_14" v-on:click.stop="handleDeleteAddress(item.id)">删除</view>
							</view>
						</view>
					</view>
				</block>
			</template>
			<template v-else>
				<uni-empty :isShowEmpty="true"></uni-empty>
			</template>
		</view>
		<button class="add-button btn-common" @click="handleNavigate">新增地址</button>
	</view>
</template>

<script>
import uniEmpty from '@/components/uni-empty/uni-empty.vue';
export default {
	components: { uniEmpty },
	data() {
		return {
			addressList: []
		};
	},
	onShow() {
		this.loadData();
	},
	methods: {
		handleNavigate: function() {
			uni.navigateTo({
				url: '../add-address/add-address'
			});
		},
		handleEditAddress: function(id) {
			uni.navigateTo({
				url: '../add-address/add-address?id=' + id
			});
		},
		handleChooseAddress: function(item) {
			uni.setStorageSync('address', item);
			uni.navigateBack({
				delta: 1
			});
		},
		handleDeleteAddress: function(id) {
			const that = this;
			uni.showModal({
				title: '确认删除吗？',
				success: function(res) {
					if (res.confirm) {
						that.$api.delAddress(id).then(res => {
							uni.showToast({
								title: '删除成功'
							});
							that.loadData();
						});
					}
				}
			});
		},
		loadData: function() {
			this.$api.addressList().then(res => {
				this.addressList = res.data;
			});
		}
	}
};
</script>

<style lang="scss">
.address {
	background: #ecedee;
	padding-bottom: 30upx;
	.add-button {
		width: 200upx;
	}
	.address-container {
		padding: 30upx 30upx 100upx 30upx;
		.address-item {
			background: #ffffff;
			border-radius: 8upx;
			padding: 30upx;
			margin-bottom: 30upx;
			.address-info {
				display: flex;
				.text {
					flex: 1;
				}
				.action {
					display: flex;
					.edit {
						color: #0091ff;
						margin-right: 20upx;
					}
					.delete {
						color: #e02020;
					}
				}
			}
		}
	}
}
</style>
