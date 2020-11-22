import {Toast} from 'vant'
class HPlus {
	constructor(){
		this.backBtnDo();
	}
	//返回键
	backBtnDo(){
		document.addEventListener('plusready',()=>{
			let first = null;
			let webview = plus.webview.currentWebview();
			plus.key.addEventListener( 'backbutton', ()=>{
				webview.canBack( function(e){
					if(e.canBack){
						webview.back();
					}else {
						if(!first){
							first = new Date().getTime();
							Toast({
								message: '再按一次退出应用',
								duration: 1000
							})
							setTimeout(function() {
								first = null;
							}, 1000);
						}else{
							plus.runtime.quit();
						}
					}
				});
			});
		});
	}
}
new HPlus();