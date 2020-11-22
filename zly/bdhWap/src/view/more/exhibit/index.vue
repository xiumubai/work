<!--
  * 陈列订货
-->
<template>  
	<div class="container">
    <header-fix :show-right="false">
			<div slot="center" class="searchbox">
				<span class="title">陈列</span>
				<search-box @search="searchFN" placeholderText="请输入陈列编号"></search-box>
			</div>
		</header-fix>
    <div class="body-content">
      <div class="exhibit">
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
							<li v-for="(exhibit,$key) in list" :key="$key" class="item">
								<router-link :to="{name: 'ExhibitDetail',query:{id: exhibit.id}}">
									<span v-show="exhibit.hanger_no" class="match-no">{{exhibit.hanger_no}}</span>
									<div v-if="exhibit.default_image" class="imgbox">
										<img :src="exhibit.default_image+'?x-oss-process=image/resize,m_pad,h_500,w_500,color_FFFFFF'" style="width:100%">
									</div>
									<div class="img" v-else>
										<img src="~assets/img/common/empty_status/no-good.png" style="width:100%"/>
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
import searchBox from "@/components/search.vue";
import emptyBox from "@/components/emptyBox.vue";
export default {
	data() {
		return {
			keyword: '',
			total: 0,
			list: [],
			offset: 0,
			limit: 20,
			loading: false,
			isloading: false,
			finished: false,
		}
	},
	mounted() {
		this.getData()
	},
	methods: {
		async getData(isNew = false) {
			let res = await this.axios({
				url: '/wapi/hanger/list.json',
				params: {
					hanger_no: this.keyword,
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
		headerFix,searchBox,emptyBox
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
	.exhibit{
		.item:first-child{
			margin-top: 15px;
		}
		.item{
			position: relative;
			text-align: center;
			margin-bottom: 15px;
			padding: 0 10px;
		}
	}
	.match-no {
		z-index: 999;
		position: absolute;
		top: 0px;
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
</style>
