<script>
export default {
	methods: {
		// 固定表格头部
		fixTableHerder(){
			this.$nextTick(()=>{
				let headerBoxDom = document.querySelector(".header-box");
				let headerBoxHeight = headerBoxDom.offsetHeight;
				let bodyContentDom = document.querySelector('.body-content');
				let fixationHeadDom = document.querySelector('#fixation-head');
				let tableContentDom = document.querySelector('#table-content');
				let fixationHeadTop = fixationHeadDom.offsetTop;
				let tableContentTop = parseInt(window.getComputedStyle(tableContentDom, null).getPropertyValue('margin-top'));
				let fixationHeadMarginTop = parseInt(window.getComputedStyle(fixationHeadDom, null).getPropertyValue('margin-top'));
				let tableBoxDom = document.querySelector('.table-box');
				bodyContentDom.onscroll = function () {
					if(bodyContentDom.scrollTop > fixationHeadTop + 2){
						fixationHeadDom.style.position = 'fixed';
						fixationHeadDom.style.top = (headerBoxHeight - fixationHeadMarginTop) + 'px';
						tableContentDom.style.marginTop = (tableContentTop + fixationHeadDom.offsetHeight) + 'px';
						fixationHeadDom.style.left = -tableBoxDom.scrollLeft + 'px';
						tableBoxDom.onscroll = ()=>{
							fixationHeadDom.style.left = -tableBoxDom.scrollLeft + 'px';
						}
					}else {
						fixationHeadDom.style.position = 'relative';
						fixationHeadDom.style.top = 'auto';
						fixationHeadDom.style.left = 'auto';
						tableBoxDom.onscroll = null;
						tableContentDom.style.marginTop = tableContentTop + 'px';
					}
				}
			})
		}
	}
}
</script>
