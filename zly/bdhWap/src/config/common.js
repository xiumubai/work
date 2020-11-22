import Vue from 'vue';
import { Toast } from 'vant';

Vue.use(Toast);
function fullScreenloading(tip){
	Toast.loading({
		mask: true,
		message: tip,
		color: '#fff',
		duration: 0
	});
}

Vue.prototype.$fullScreenloading = fullScreenloading;