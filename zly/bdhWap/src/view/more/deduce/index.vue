<!--
  * 推送订货
-->
<template>
	<div class="container">
    <header-fix centerText="推送订货"></header-fix>
		<empty-box v-if="nodata"  content="暂无相关推送"></empty-box>
    <div class="body-content" v-else>
			<div v-if="type === 'goods'">
				<goods-deduce :goodsId="id"></goods-deduce>
			</div>
      <div v-if="type === 'collocation'">
				<match-deduce :id="id"></match-deduce>
			</div>
    </div>
  </div>
</template>
<script>
import headerFix from "@/components/headerFix";
import matchDeduce from "./matchDeduce.vue";
import goodsDeduce from "./goodsDeduce.vue";
import emptyBox from "@/components/emptyBox.vue";
export default {
	data() {
		return {
			id: '',
			type: '',
			nodata: false,
			lastData: null
		}
	},
	created() {
		this.getData();
	},
	methods: {
		async getData() {
			let res = await this.axios({
				url: '/wapi/meeting/pull.json',
				isNotLoading: true
			})
			let data = res.data;
			if(this.lastData) {
				if (data.type === this.lastData.type && data.data_id === this.lastData.data_id) {
					setTimeout(() => {
						this.getData();
					}, 3000)
					return
				}
			}
			if(data.type === 'collocation') {
				this.type = 'collocation';
				this.id = data.data_id;
				this.nodata = false;
			} else if(data.type === 'goods') {
				this.type = 'goods';
				this.id = data.data_id;
				this.nodata = false;
			} else {
				this.nodata = true;
			}
			this.lastData = data;
			setTimeout(() =>{
				this.getData();
			}, 3000)
		}
	},
	components: {
		headerFix,matchDeduce,goodsDeduce,emptyBox
	}
};
</script>
<style scoped lang="less">
	.search-ctrl{
		padding: 6px 15px;
	}
	.body-content{
    height: calc(100% - 0.44rem);
    background: #fff;
	}
</style>
