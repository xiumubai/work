import Vue from 'vue'
import {
	Toast
} from 'vant';
import router from '@/router'
import axios from 'axios'
import makeSignature from '../assets/js/helper/makeSignature'
let baseURL = location.host;
// let baseURL = 'bdh123.com';
let globalLoading = {};
if (process.env.BDH_BUILD === 'test') {
	baseURL = 'bdh123.com';
} else if (process.env.BDH_BUILD === 'production') {
	baseURL = 'bidinghuo.cn';
}
//isNotLoading 是否不显示全局加载框 true：不显示  false：显示

// import qs from 'qs';
// import {beforeSend,response,errorHandle} from '@/config/interceptors/axiosHook'
// import {rootUrl} from '@/config'
let AxiosIns = axios.create({
	// baseURL: 'http://www.bdh.com/api',
	baseURL: baseURL,
	timeout: 5000,
	// transformRequest: [data => {
	// 	return qs.stringify(data)
	// }],
	contentType: 'application/json',
	withCredentials: true,
})
AxiosIns.interceptors.request.use(function (config) {
	if (!config.params) {
		config.params = {}
	}
	let isAndroid = navigator.userAgent.indexOf('Android') >= 0;
	let pl = isAndroid ? 'android' : 'ios';
	config.params.version = "3.7.5.4";
	config.params.os_name = pl;
	config.params.os_version = "6.0.1";
	config.params.os_model = navigator.platform;

	let domain = 'www';
	let selectCompany = JSON.parse(localStorage.getItem('selectCompany') || '{}');
	let loginCompany = JSON.parse(localStorage.getItem('loginCompany') || '{}');

	if (config.url.indexOf('/wapi/') === 0) {
		// if(loginCompany.domain){
		// 	domain = loginCompany.domain
		// }else if(selectCompany.domain){
		// 	domain = selectCompany.domain
		// }
		if (selectCompany.domain) {
			domain = selectCompany.domain
		}
		if (router.currentRoute.path.indexOf('/bdh') === 0) {
			if (loginCompany.domain) {
				domain = loginCompany.domain
			}
		}
	}
	config.baseURL = 'http://' + domain + '.' + config.baseURL;
	if(process.env.NODE_ENV === 'development'){
		config.baseURL = 'http://' + location.host;
	}
	//开启全局loading框
	if (!config.isNotLoading) {
		let url = config.baseURL + config.url;
		globalLoading[url] = Toast.loading({
			duration: 0,
			message: '数据加载中...',
			mask: true
		});
	}
	try {
		makeSignature(config);
	} catch (error) {
		console.log(error)
	}

	return config;
});
AxiosIns.interceptors.response.use(function response(res) {
	//关闭全局loading框
	if (!res.config.isNotLoading) {
		Toast.clear(globalLoading[res.config.url]);
		delete globalLoading[res.config.url];
	}
	if (res.data.code === 200000) {
		router.push({
			name: 'SearchCompany'
		});
		localStorage.removeItem('userInfo');
	}
	return res.data;
}, function () {
	Toast.clear('clearAll');
	globalLoading = {};
	Toast('网络链接异常');
	return Promise.reject();
});
Vue.prototype.axios = AxiosIns;
window.axios = axios;
