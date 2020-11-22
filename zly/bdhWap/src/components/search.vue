<template>
  <van-search v-model="keyword" @keyup="search" @clear="clearKeyword" class="search-ctrl" background="#fff" :placeholder="placeholderText"/>
</template>
<script>
export default {
	props: {
		placeholderText: {
			default: '请输入'
		}
	},
	data() {
		return {
			keyword: '',
			timer: null
		}
	},
	methods: {
		search() {
			clearTimeout(this.timer);
			this.timer = setTimeout(() => {
				this.$emit('search',this.keyword)
			}, 300)
		},
		clearKeyword() {
			this.keyword = '';
			this.$emit('search',this.keyword)
		}
	}
}
</script>

