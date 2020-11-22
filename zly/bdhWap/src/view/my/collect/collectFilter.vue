<template>
	<transition name="slide-fade">
		<div class="filter-box" @click="close">
			<div ref="listDom" class="filter-content" @click.stop>
        <div class="div-content-box">
          <div class="list-box">
            <div class="key-box">
              <div class="left-title">一级分类</div>
            </div>
            <div class="value-box">
              <div v-for="(item, index) in categorys" :key="Math.random() + index" class="item-box">
                <label class="item-btn" :class="item.isActive ? 'btn_active' : ''" @click="selectCategory(item, 0)">{{item.name}}</label>
              </div>
            </div>
          </div>

          <div class="list-box" v-show="categoryChild.length">
            <div class="key-box">
              <div class="show-more" @click="showAllValues(categorysChildShow)">{{categorysChildShow.showAll ? '全部' : '收起'}}
                <van-icon :name="categorysChildShow.showAll ? 'arrow-up' : 'arrow-down'"/>
              </div>
              <div class="left-title">大类</div>
            </div>
            <div class="value-box" :class="{'over-hide': categorysChildShow.showAll}">
              <div v-for="(item, index) in categoryChild" :key="Math.random() + index" class="item-box">
                <label class="item-btn" :class="item.isActive ? 'btn_active' : ''" @click="selectCategory(item, 1)">{{item.name}}</label>
              </div>
            </div>
          </div>

          <div class="list-box" v-show="categoryGrandChild.length">
            <div class="key-box">
              <div class="show-more" @click="showAllValues(categorysGrandChildShow)">{{categorysGrandChildShow.showAll ? '全部' : '收起'}}
                <van-icon :name="categorysGrandChildShow.showAll ? 'arrow-up' : 'arrow-down'"/>
              </div>
              <div class="left-title">小类</div>
            </div>
            <div class="value-box" :class="{'over-hide': categorysGrandChildShow.showAll}">
              <div v-for="(item, index) in categoryGrandChild" :key="Math.random() + index" class="item-box">
                <label class="item-btn" :class="item.isActive ? 'btn_active' : ''" @click="selectCategory(item, 2)">{{item.name}}</label>
              </div>
            </div>
          </div>

          <van-search v-model="keyword" class="search-ctrl" background="#fff" placeholder="门店账号/名称"/>
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
			categorysShow: {
				showAll: false
			},
			categorys: [],
			categoryChild: [],
			categorysChildShow: {
				showAll: false
			},
			categoryGrandChild: [],
			categorysGrandChildShow: {
				showAll: false
			},
			keyword: ''
		};
	},
	methods: {
		async getList() {
			let res = await this.axios({
				url: "/wapi/search/dh_bar.json",
				method: 'post',
				params: {
					meeting_id: '1',
					select: ['分类']
				}
			});
			this.categorys = [];
			if(!helper.isEmptyObj(res.category)){
				this.categorys = res.category.values.map(function(v) {
					v.isActive = false;
					return v;
				});
			}
			
		},
		showAllValues: function(attr){
			attr.showAll = !attr.showAll;
		},
		selectCategory: function(cate,level){
			var _this = this;
			var child = [];
			var isCancel = true;
			if(!cate.isActive){
				child = cate.sub || [];
				isCancel = false;
			}
			switch(level){
			case 0 : 
				this.categorys.map(function(v){
					_this.$set(v,'isActive',false);
				})
				this.categoryChild.map(function(v){
					_this.$set(v,'isActive',false);
				})
				this.categoryGrandChild.map(function(v){
					_this.$set(v,'isActive',false);
				})
				if(!isCancel){
					cate.isActive = true;
				}
				this.categoryChild = child;
				this.categoryGrandChild = [];
				break;
			case 1 : 
				this.categoryChild.map(function(v){
					_this.$set(v,'isActive',false);
				})
				this.categoryGrandChild.map(function(v){
					_this.$set(v,'isActive',false);
				})
				if(!isCancel){
					cate.isActive = true;
				}
				this.categoryGrandChild = child;
				break;
			case 2 : 
				this.$set(cate,'isActive',!cate.isActive);
				break;
			default :
				return;
			}
		},
		reset(){
			this.categoryChild = [];
			this.categoryGrandChild = [];
			this.categorys = this.categorys.map(function(v){
				if(v.isActive){
					v.sub.map(function(c){
						if(c.isActive){
							c.isActive = false;
							c.sub.map(function(g){
								g.isActive = false;
							})
						}
					})
				}
				v.isActive = false;
				return v;
			});
			this.$emit('submit')
		},
		submit(){
			var categorys = this.categorys.filter(function(v){
				return v.isActive;
			}) || [];
			var keyword = this.keyword;
			this.$emit('submit',{
				categorys: categorys,
				keyword: keyword
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
