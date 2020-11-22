<template>
	<div class="list-box">
		<div class="key-box">
			<div class="show-more" @click="showMore = !showMore" v-if="needShowMore">{{!showMore ? '全部' : '收起'}}
				<van-icon :name="showMore ? 'arrow-up' : 'arrow-down'"/>
			</div>
			<div class="left-title">{{label}}</div>
		</div>
		<div class="value-box" :class="{'over-hide': needShowMore && !showMore}" ref="valDom">
			<div v-for="item in itemInfo" :key="noKey ? item : item[itemKey]" class="item-box">
				<input
					:type="multiple ? 'checkbox':'radio'"
					v-model="isCheckedList"
					@change="change(item)"
					:name="checkName"
					:value="noKey ? item : item[itemKey]"
					:id="checkName + (noKey ? item : item[itemKey])"
				>
				<label :for="checkName + (noKey ? item : item[itemKey])" class="item-btn">{{noKey ? item : item[itemVal]}}</label>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	/**
	 * {
	 * 	name: '品牌',
	 * 	values: [
	 * 		{
	 * 			key: 1,
	 * 			value: '海贝'
	 * 		}
	 * 	]
	 * }
	 */
	props: {
		itemInfo: {
			default: ()=>{return {};}
		},
		label: {
			default: '选项'
		},
		multiple: {
			default: false,
			type: Boolean
		},
		itemKey: {
			default: 'key'
		},
		itemVal: {
			default: 'value'
		},
		noKey: {
			default: false,
			type: Boolean
		},
		isChecked: {
			default: ()=>{return []}
		},
		isShow: {
			default: false
		}
	},
	created(){
		this.checkName = 'check-' + Math.random();
	},
	mounted(){
		this.setShowMore();
	},
	watch: {
		itemInfo (){
			this.setShowMore();
		},
		isShow(){
			this.setShowMore();
		},
		isChecked (val) {
			if(!val || val.length < 1){
				this.isCheckedList = [];
			}
		}
	},
	data () {
		return {
			needShowMore: false,
			showMore: false,
			checkName: null,
			isCheckedList: []
		}
	},
	methods: {
		change(item){
			this.$emit('update:isChecked',this.isCheckedList);
			this.$emit('change',item)
		},
		setShowMore(){
			this.$nextTick(()=>{
				if(this.$refs.valDom.offsetHeight > 44){
					this.needShowMore = true;
				}else{
					this.needShowMore = false;
				}
			});
		}
	}
}
</script>
<style lang="less" scoped>
.list-box {
	padding: 0.1rem 0.15rem;
	border-bottom: 1px solid #e7e7e7;
	.key-box {
		width: 100%;
		padding: 0.05rem 0;
		font-size: 0.14rem;
		color: #9b9b9b;
		.left-title {
			overflow: hidden;
		}
		.show-more {
			float: right;
		}
	}
	.value-box {
		width: 100%;
		&.over-hide {
			height: 0.44rem;
			overflow-y: hidden;
		}
		.item-btn {
			font-size: 0.14rem;
			padding: 0.04rem 0.1rem;
			margin: 0.1rem 0.1rem 0 0;
			background-color: #f2f2f2;
			display: inline-block;
			border-radius: 2px;
		}
		.item-box {
			display: inline-block;
			font-size: 0;
			input {
				display: none;
			}
			input:checked + .item-btn{
				background-color: #b4a078;
				color: #fff;
			}
		}
	}
}
</style>
