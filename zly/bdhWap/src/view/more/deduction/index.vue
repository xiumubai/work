<!--
  * 360推演
-->
<template>
	<div class="container">
    <header-fix :showRight="false">
			<div slot="center" class="searchbox">
				<span class="title">推演</span>
				<search-box @search="searchFN" placeholderText="请输入推演编号"></search-box>
			</div>
		</header-fix>
    <div class="body-content">
				<van-list
					v-if="total > 0"
					v-model="loading"
					:finished="finished"
					@load="onLoad"
					:offset="50"
					:immediate-check="false"
				>
				<div style="background-color:#fff; padding: 10px;" id="list">
					<div>
						<ul>
							<li v-for="(deduction,$key) in list" :key="$key">
								<router-link :to="{name: 'DeductionDetail',query:{exhibit_id: deduction.id}}">
									<a :exhibit_id="deduction.id" class="img-responsive change_exhibit_detail">
										<span v-show="deduction.deduction_no" class="match-no">{{deduction.deduction_no}}</span>
										<span v-show="deduction.series" class="match-no-2">{{deduction.series}}</span>
										<div style="width: 100%;height: 25px;">
											<span v-if="deduction.statistics" class="match-no-right">共{{deduction.statistics.collocation}}套 {{deduction.statistics.goods}}款 {{deduction.statistics.goods_color}}款色</span>
										</div>
										<div v-if="deduction.pic_whole">
											<img class="mui-media-object" style="width:100%;height: 300px;" :src="deduction.pic_whole+'?x-oss-process=image/resize,h_170,w_351'">
										</div>
										<div v-else>
											<img class="mui-media-object" style="width:100%;height: 300px;" src="http://biding365.oss-cn-hangzhou.aliyuncs.com/public/nopic.jpg?x-oss-process=image/resize,h_170,w_351">
										</div>
									</a>
								</router-link>
							</li>
						</ul>
					</div>
				</div>
				<div v-if="finished" class="list-loading-finished">没有更多了</div>
			</van-list>
			<empty-box v-else content="暂无数据"></empty-box>	
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
			keyword: '',
			list: [],
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
				url: '/wapi/deduction/list.json',
				params: {
					offset: this.offset,
					limit: this.limit,
					deduction_no: this.keyword
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
			this.keyword = value;
			this.offset = 0;
			this.getData(true);
		}
	},
	components: {
		headerFix,emptyBox,searchBox
	}
};
</script>
<style scoped lang="less">
	.body-content{
		height: calc(100% - 0.44rem);
	}
	.search-ctrl{
		padding: 6px 15px;
	}
	.match-no {
		z-index: 999;
		/*position: absolute;*/
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
		float: left;
	}
	
	.match-no-2 {
		/*position: absolute;*/
		top: 10px;
		left: 60px;
		background: #fff;
		font-size: 14px;
		padding: 0 6px;
		height: 19px;
		line-height: 19px;
		text-align: center;
		float: left;
		margin-left: 10px;
	}
	.match-no-3{
		position: absolute;
		top: 10px;
		left: 200px;
		background: #fff;
		font-size: 14px;
		padding: 0 6px;
		height: 19px;
		line-height: 19px;
		text-align: right;
	}
	.match-no-right{
		float: right;
		font-size: 14px;
		margin-right: 10px;
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
</style>
