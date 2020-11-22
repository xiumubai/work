<template>
	<transition name="slide-fade">
		<div class="filter-box" @click="close">
			<div ref="listDom" class="filter-content" @click.stop>
				<div class="div-content-box">
					<!-- 插槽插入自定义组件 -->
					<slot></slot>
					<filter-item
						:is-show="isShow"
						label="品牌"
						noKey
						:item-info="brands"
						:is-checked.sync="attributes['品牌']"
						multiple
					></filter-item>
					<filter-item
						:is-show="isShow"
						label="一级分类"
						item-key="id"
						item-val="name"
						:item-info="category"
						:is-checked.sync="category_id1"
						@change="(item)=>{this.changeCategory(item,1)}"
					></filter-item>
					<filter-item
						:is-show="isShow"
						label="大类"
						item-key="id"
						item-val="name"
						:item-info="category2"
						:is-checked.sync="category_id2"
						@change="(item)=>{this.changeCategory(item,2)}"
						v-if="category2.length > 0"
					></filter-item>
					<filter-item
						:is-show="isShow"
						label="小类"
						item-key="id"
						item-val="name"
						:item-info="category3"
						:is-checked.sync="category_ids"
						multiple
						v-if="category3.length > 0"
					></filter-item>
					<filter-item
						:is-show="isShow"
						v-for="(item,index) in selectList"
						:key="index"
						:label="index"
						no-key
						:item-info="item"
						:is-checked.sync="attributes[index]"
						multiple
					></filter-item>
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
import filterItem from "@/components/filterController/filterItem.vue";
export default {
	props: {
		isShow: {
			default: false
		},
		selectList: {
			default: () => {
				return [];
			}
		}
	},
	created() {
		this.getList();
	},
	data() {
		return {
			brands: {},
			category: {},
			category2: [],
			category3: [],
			attribute: [],
			attributes: {},
			brand_ids: [],
			category_ids: [],
			category_id1: null,
			category_id2: null
		};
	},
	watch: {
		selectList() {
			this.brands = (this.selectList && this.selectList["品牌"]) || {};
			(this.selectList && this.selectList["品牌"]) && delete this.selectList["品牌"];
		}
	},
	methods: {
		async getList() {
			let res = await this.axios({
				url: "/wapi/search/dh_bar.json",
				method: "post",
				data: {
					meeting_id: "1",
					select: ["分类"]
				}
			});
			this.category = res.category.values;
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
		reset() {
			this.category2 = [];
			this.category3 = [];
			// this.brand_ids = [];
			this.category_ids = [];
			this.category_id1 = null;
			this.category_id2 = null;
			for (let attr in this.attributes) {
				this.attributes[attr] = [];
			}
		},
		submit() {
			let attributes = this.attributes;
			this.$emit("submit", {
				category_ids: this.category_ids,
				category_id1: this.category_id1,
				category_id2: this.category_id2,
				attributes,
				brand_ids: this.brand_ids
			});
		},
		close() {
			this.$emit("close");
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

