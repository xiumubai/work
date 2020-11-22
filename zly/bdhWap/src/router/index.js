import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/view/index/index'
import bdhRouter from './bdh/index'
const SearchCompany = () => import('@/view/searchCompany/searchCompany');
const MeetingList = () => import('@/view/bdh/meetingList/meetingList');
const Login = () => import('@/view/bdh/login/login');
const My = () => import('@/view/my/index');
const AboutUs = () => import('@/view/aboutUs/aboutUs');
const OurInfo = () => import('@/view/aboutUs/ourInfo');
const bindOtherApp = () => import('@/view/bindOtherApp/index.vue');
const More = () => import('@/view/more/index');
const WebChat = () => import('@/view/aboutUs/webChat')
//keekAliveScrollTop 滚动高度
let keekAliveScrollTop = 0;

Vue.use(Router)
let router = new Router({
	routes: [
		{
			path: '/',
			name: 'Index',
			component: Index,
			meta: {
				pageTitle: '全部应用',
				isNotAuth: true //是否不需要权限登录								
			}
		},
		{
			name: 'BindOtherApp',
			path: '/bindOtherApp/index',
			component: bindOtherApp,
			meta: {
				pageTitle: '必订火',
				isNotAuth: true //是否不需要权限登录
			}
		},
		{
			path: '/aboutUs',
			name: 'AboutUs',
			component: AboutUs,
			meta: {
				pageTitle: '关于我们',
				isNotAuth: true //是否不需要权限登录
			}
		},
		{
			path: '/ourInfo',
			name: 'OurInfo',
			component: OurInfo,
			meta: {
				pageTitle: '关于我们',
				isNotAuth: true //是否不需要权限登录
			}
		},
		{
			path: '/webChat',
			name: 'WebChat',
			component: WebChat,
			meta: {
				pageTitle: '在线客服',
				isNotAuth: true //是否不需要权限登录
			}
		},
		{
			path: '/searchCompany',
			name: 'SearchCompany',
			component: SearchCompany,
			meta: {
				pageTitle: '品牌公司',
				isNotAuth: true
			}
		},
		{
			path: '/meetingList',
			name: 'MeetingList',
			component: MeetingList,
			meta: {
				isNotAuth: true
			}
		},
		{
			path: '/login',
			name: 'Login',
			component: Login,
			meta: {
				pageTitle: '登陆',
				isNotAuth: true
			}
		},
		{
			path: '/My',
			name: 'My',
			component: My
		},
		{
			path: '/More',
			name: 'More',
			component: More
		}
	].concat(bdhRouter)
})
router.beforeEach((to, from, next)=>{
	Vue.nextTick(()=>{
		let bodyContentDom = document.querySelector('.body-content');
		if(from.meta.keepAlive){
			keekAliveScrollTop = bodyContentDom ? bodyContentDom.scrollTop : 0;
			// localStorage.setItem('keekAliveScrollTop',bodyContentScrollTop);
		}
	});
	let userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
	//判断用户访问的页面上会否需要登录
	if(!to.meta.isNotAuth && !userInfo.id){
		router.push({ name: 'SearchCompany' });
	}else{
		next();
	}
});
router.afterEach((to) => {
	Vue.nextTick(()=>{
		let bodyContentDom = document.querySelector('.body-content');
		if(to.meta.keepAlive){
			bodyContentDom && (bodyContentDom.scrollTop = keekAliveScrollTop);
		}
	});
});
export default router;
