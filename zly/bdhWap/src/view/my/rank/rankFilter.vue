<template>
	<transition name="slide-fade">
		<div class="filter-box" @click="close">
			<div ref="listDom" class="filter-content" @click.stop>
				<div class="div-content-box">
					<!-- 插槽插入自定义组件 -->
					<slot></slot>
					<div class="list-box">
						<div class="key-box">
							<div class="left-title">全国</div>
						</div>
						<div class="value-box">
							<div v-for="(item,index) in sortBy" :key="Math.random() + index" class="item-box">
								<label class="item-btn" :class="item.active ? 'btn_active' : ''" @click="setSortActive(item)">{{item.name}}</label>
							</div>
						</div>
					</div>

					<div class="list-box">
						<div class="key-box">
							<div class="left-title">单款</div>
						</div>
						<div class="value-box">
							<div v-for="(item, index) in typeArr" :key="Math.random() + index" class="item-box">
								<label class="item-btn" :class="item.active ? 'btn_active' : ''" @click="setTypeActive(item)">{{item.name}}</label>
							</div>
						</div>
					</div>

					<div class="list-box">
						<div class="key-box">
							<div class="show-more" @click="showAllValues(categorysShow)">{{categorysShow ? '全部' : '收起'}}
								<van-icon :name="categorysShow ? 'arrow-up' : 'arrow-down'"/>
							</div>
							<div class="left-title">一级分类</div>
						</div>
						<div class="value-box">
							<div v-for="(item, index) in categorys" :key="Math.random() + index" class="item-box">
								<label class="item-btn" :class="item.isActive ? 'btn_active' : ''" @click="setActive(item)">{{item.name}}</label>
							</div>
						</div>
					</div>

					<div class="list-box" v-for="(item, index) in attributes" :key="Math.random() + index">
						<div class="key-box">
							<div class="show-more" @click="showAllValues(item)">{{!item.showAll ? '全部' : '收起'}}
								<van-icon :name="!item.showAll ? 'arrow-up' : 'arrow-down'"/>
							</div>
							<div class="left-title">{{item.name}}</div>
						</div>
						<div class="value-box" :class="{'over-hide': !item.showAll}">
							<div v-for="(attr, index) in item.values" :key="Math.random() + index" class="item-box">
								<label v-if="attr.name !== ''" class="item-btn" :class="attr.isActive ? 'btn_active' : ''" @click="setActive(attr)">{{attr.name}}</label>
							</div>
						</div>
					</div>
					
				</div>
				<div class="footer-box">
						<div class="footer-btn" @click="reset()">重置</div>
						<div class="footer-btn" @click="submit()">确定</div>
					</div>
			</div>
		</div>
	</transition>
</template>
<script>
import filterItem from '@/components/filterController/filterItem.vue';
export default {
	props: ['isShow'],
	created() {
		this.getList();
	},
	data() {
		return {
			categorys: {},
			category2: [],
			category3: [],
			attributes: {},
			sortBy: [
				{
					name: '全国(默认)',
					value: 'country',
					active: true
				},
				{
					name: '个人',
					value: 'personal',
					active: false
				},
				{
					name: '大区',
					value: 'manager',
					active: false
				}
			],
			typeArr: [
				{
					name: '单款(默认)',
					value: 'single_style',
					active: true
				},
				{
					name: '单色',
					value: 'single_color',
					active: false
				},
				{
					name: '大类',
					value: 'category',
					active: false
				}
			],
			categorysShow: {
				showAll: false
			},
		};
	},
	methods: {
		async getList() {
			let res = await this.axios({
				url: "/wapi/search_bar/base.json",
			});
			this.categorys = res.categorys.map(function(v){
				v.isActive = false;
				return v;
			});
			this.attributes = res.attributes.filter(function(v){
				return v.name !== '颜色'
			}).map(function(attr){
				attr.showAll = false;
				for(var i=0;i<attr.values.length;i++){
					attr.values[i] = {
						isActive: false,
						name: attr.values[i]
					}
				}
				return attr;
			});
		},
		setSortActive: function(prop){
			this.sortBy.map(function(v){
				v.active = false;
			})
			prop.active = true;
		},
		setTypeActive: function(prop){
			this.typeArr.map(function(v){
				v.active = false;
			})
			prop.active = true;
		},
		setActive: function(prop){
			prop.isActive = !prop.isActive;
		},
		showAllValues: function(attr){
			attr.showAll = !attr.showAll;
		},
		changeCategory(item, deep) {
			switch (deep) {
			case 1:
				this.category2 = item.sub ? item.sub : [];
				break;
			case 2:
				this.category3 = item.sub ? item.sub : [];
				break;
			default:
				null;
			}
		},
		reset(){
			this.sortBy = this.sortBy.map(function(v,i){
				v.active = false;
				if(i === 0){
					v.active = true;
				}
				return v;
			});
			this.typeArr = this.typeArr.map(function(v,i){
				v.active = false;
				if(i === 0){
					v.active = true;
				}
				return v;
			});
			this.categorys = this.categorys.map(function(v){
				v.isActive = false;
				return v;
			});
			this.attributes = this.attributes.map(function(attr){
				attr.showAll = false;
				for(var i=0;i<attr.values.length;i++){
					attr.values[i].isActive = false;
				}
				return attr;
			});
			this.$emit('submit');
		},
		submit(){
			var sortBy = this.sortBy.filter(function(v){
				return v.active;
			});
			var typeWord = this.typeArr.filter(function(v){
				return v.active;
			});
			var categorys = this.categorys.filter(function(v){
				return v.isActive;
			}) || [];
			var attributes = [];
			for(var i=0;i<this.attributes.length;i++){
				var attr = JSON.parse(JSON.stringify(this.attributes[i]));
				var values = [];
				for(var j=0;j<attr.values.length;j++){
					if(attr.values[j].isActive){
						values.push(attr.values[j].name);
					}
				}
				attr.values = values;
				attributes.push(attr);
			}
			this.$emit('submit',{
				sortBy: sortBy,
				type: typeWord,
				categorys: categorys,
				attributes: attributes
			})
		},
		close(){
			this.$emit('close');
		}
	},
	components: {
		filterItem
	}
};
</script>

<style lang="less" scoped>
.filter-box {
	width: 100%;
	height: 100%;
	position: fixed;
	top: 0;
	left: 0;
	background-color: rgba(0, 0, 0, 0.5);
	z-index: 1000;
}
.filter-content {
	margin-left: 20%;
	width: 80%;
	height: 100%;
	background-color: #fff;
	overflow: auto;
}
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
			display: none;
		}
	}
	.value-box {
		width: 100%;
		&.over-hide {
			height: 0.4rem;
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
			input:checked + .item-btn {
				background-color: #b4a078;
				color: #fff;
			}
			.btn_active{
        background-color: #b4a078;
				color: #fff;
      }
		}
	}
}
.div-content-box{
	height: calc(100% - 0.5rem);
	width: 100%;
	overflow: auto;
}
.footer-box {
	width: 100%;
	display: flex;
	bottom: 0;
	right: 0;
	.footer-btn {
		flex: 1;
		height: 0.5rem;
		text-align: center;
		color: #fff;
		line-height: 0.5rem;
	}
	.footer-btn:nth-child(1) {
		background-color: #333;
	}
	.footer-btn:nth-child(2) {
		background-color: #b4a078;
	}
}
.slide-fade-enter-active {
	transition: all 0.3s ease;
}
.slide-fade-leave-active {
	transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
	transform: translateX(10px);
	opacity: 0;
}
</style>

