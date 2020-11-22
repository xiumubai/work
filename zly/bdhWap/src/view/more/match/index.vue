<!--
  * 搭配订货
-->
<template>
	<div class="container">
    <header-fix :showRight="false">
			<div slot="center" class="searchbox">
				<span class="title">搭配</span>
				<search-box @search="searchFN" placeholderText="请输入搭配编号"></search-box>
			</div>
		</header-fix>
    <div class="body-content">
			<div class="match">
				<div class="wrapper">
					<van-list
						v-if="total > 0"
						v-model="loading"
						:finished="finished"
						@load="onLoad"
						:offset="50"
						:immediate-check="false"
					>
						<ul class="list">
							<li v-for="(match,$key) in list" :key="$key" class="item">
								<router-link :to="{name: 'MatchDetail',query:{id: match.id}}">
									<span v-show="match.collocation_no" class="match-no">{{match.collocation_no}}</span>
									<div v-if="match.default_image" class="imgbox">
										<img :src="match.default_image+'?x-oss-process=image/resize,m_pad,h_226,w_160,color_FFFFFF'">
									</div>
									<div v-else>
										<img src="http://biding365.oss-cn-hangzhou.aliyuncs.com/public/nopic.jpg?x-oss-process=image/resize,m_pad,h_226,w_160,color_FFFFFF">
									</div>
								</router-link>
							</li>
						</ul>
						<div v-if="finished" class="list-loading-finished">没有更多了</div>
					</van-list>
					<empty-box v-else content="暂无数据"></empty-box>	
				</div>
			</div>
    </div>
  </div>
</template>
<script>
import headerFix from "@/components/headerFix";
import emptyBox from "@/components/emptyBox.vue";
import searchBox from "@/components/search.vue";
export default {
	data() {
		return {
			list: [],
			keyword: '',
			total: 0,
			offset: 0,
			limit: 20,
			loading: false,
			isloading: false,
			finished: false,
		}
	},
	mounted() {
		this.getData();
	},
	methods: {
		async getData(isNew = false) {
			let res = await this.axios({
				url: '/wapi/collocation/list.json',
				params: {
					collocation_no: this.keyword,
					offset: this.offset,
					limit: this.limit
				}
			})
			this.list = !isNew ? this.list.concat(res.data) : res.data;
			this.total = res.total;

			if (res.data.length < this.limit) {
				this.finished = true;
			}
			this.isloading = false;
			this.loading = false;
			this.offset += this.limit;
		},
		onLoad() {
			if (!this.isloading) {
				this.getData();
				this.isloading = true;
			}
		},
		searchFN(value) {
			this.offset = 0;
			this.keyword = value;
			this.getData(true);
		}
	},
	components: {
		headerFix,emptyBox,searchBox
	}
};
</script>
<style scoped lang="less">
	.search-ctrl{
		padding: 6px 15px;
	}
	.body-content{
		height: calc(100% - 0.44rem);
	}
	.match{
		.list{
			overflow: hidden;
			width: 100%;
			padding: 0.05rem;
			padding-top: 0;
			.item{
				float: left;
				position: relative;
				background-color: #fff;
				border: solid 1px #DDDDDD;
				box-sizing: border-box;
				margin: 0.1rem 0.05rem 0 0.05rem;
				width: calc(50% - 0.1rem);
				padding-bottom: 0.1rem;
				img{
					height: 100%;
					width: 100%;
				}
			}
		}
	}
	.match-no {
		z-index: 999;
		position: absolute;
		top: 10px;
		left: 10px;
		z-index: 2;
		background: #848484;
		font-size: 12px;
		padding: 0 6px;
		height: 19px;
		line-height: 19px;
		text-align: center;
		color: #fff;
		border-radius: 19px;
	}
	
	.match-no-dp {
		z-index: 999;
		position: absolute;
		top: 12px;
		left: 15px;
		z-index: 2;
		background: #848484;
		font-size: 12px;
		padding: 0 6px;
		height: 19px;
		line-height: 19px;
		text-align: center;
		color: #fff;
		border-radius: 19px;
	}
	.mui-table-view {
		background-color: #EDEEEF;
	}
</style>
