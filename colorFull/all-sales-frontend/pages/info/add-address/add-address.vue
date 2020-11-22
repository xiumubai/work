<template>
	<view class="add-address">
		<view class="add-address-container">
			<view class="input-container">
				<view class="input-item">
					<view class="text font_14 c333">收货人</view>
					<view class="input-text"><input type="text" v-model="queryParams.consignee" placeholder="请填写收货人姓名" /></view>
				</view>
				<view class="input-item">
					<view class="text font_14 c333">手机号码</view>
					<view class="input-text"><input type="text" v-model="queryParams.mobile" placeholder="请填写收货人手机号" /></view>
				</view>
				<view class="input-item">
					<view class="text font_14 c333">所在地区</view>
					<view class="input-text"><input placeholder="请选择" disabled v-model="areaList" @click="showMulLinkageThreePicker" /></view>
				</view>
				<view class="input-item no-border">
					<view class="text font_14 c333">详细地址</view>
					<view class="input-text"><input type="text" v-model="queryParams.detail" placeholder="街道、楼牌号等" /></view>
				</view>
			</view>
			<view class="button-conttainer">
				<button class="btn-common save" @tap="handleSaveAddress">保存</button>
				<button class="btn-common cancle" @tap="handleNavigateback">取消</button>
			</view>
		</view>
		<mpvue-city-picker :themeColor="themeColor" ref="mpvueCityPicker" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm"></mpvue-city-picker>
	</view>
</template>

<script>
import mpvueCityPicker from '../../../components/mpvue-citypicker/mpvueCityPicker.vue';
export default {
	components: { mpvueCityPicker },
	data() {
		return {
			cityPickerValueDefault: [0, 0, 1],
			themeColor: '#007AFF',
			pickerValueArray: [],
			areaList: '',
			queryParams: {},
			id: ''
		};
	},
	onLoad(options) {
		if (options.id) {
			this.id = options.id;
			this.loadAddress();
		}
	},
	methods: {
		handleNavigateback: function() {
			uni.navigateBack({
				delta: 1
			});
		},
		// 三级联动选择
		showMulLinkageThreePicker: function() {
			this.$refs.mpvueCityPicker.show();
		},
		onConfirm: function(e) {
			console.log(e);
			const areaArray = e.label.split('-');
			this.areaList = e.label;
			this.queryParams.province = areaArray[0];
			this.queryParams.city = areaArray[1];
			this.queryParams.area = areaArray[2];
		},
		handleSaveAddress: function() {
			if (this.id) {
				this.$api.saveAddress(this.id, this.queryParams)
					.then(res => {
						uni.navigateBack({
							delta: 1
						})
					}).catch(err => {
						uni.showToast({
							title: err.message
						});
					});
			} else {
				this.$api.addAddress(this.queryParams)
					.then(res => {
						uni.navigateBack({
							delta: 1
						});
					})
					.catch(err => {
						uni.showToast({
							title: err.message
						});
					});
			}
		},
		loadAddress: function() {
			this.$api.editAddress(this.id).then(res => {
				this.areaList = res.province + '-' + res.city + '-' + res.area;

				this.queryParams.consignee = res.consignee;
				this.queryParams.mobile = res.mobile;
				this.queryParams.detail = res.detail;

				this.queryParams.province = res.province;
				this.queryParams.city = res.city;
				this.queryParams.area = res.area;
			});
		}
	}
};
</script>

<style lang="scss">
.add-address {
	background: #ecedee;
	padding-bottom: 30upx;
	.add-address-container {
		padding: 30upx;
		.input-container {
			background: #ffffff;
			border-radius: 8upx;
			padding: 0 30upx;
			margin-bottom: 15px;
			.input-item {
				display: flex;
				border-bottom: 2upx solid #ecedee;
				padding: 15px 0;
				.text {
					width: 25%;
				}
				.input-text {
					width: 75%;
					input {
						font-size: 28upx;
						color: #333333;
					}
				}
			}
			.no-border {
				border-bottom: 0;
			}
		}
		.button-conttainer {
			display: flex;
			justify-content: center;
			button {
				width: 200upx;
				margin: 0;
			}
			.cancle {
				background: #dad9e2;
				margin-left: 40upx;
			}
			.cancle:after {
				border-color: #dad9e2;
				border: 0;
			}
		}
	}
}
</style>
