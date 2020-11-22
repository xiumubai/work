export default function auth(appid) {
	const host = window.location.host
	const redirect_uri = encodeURIComponent('http://' + host + '/frontend/pages/auth/auth?appid=' + appid)
	const href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' + appid + '&redirect_uri=' + redirect_uri +'&response_type=code&scope=snsapi_base&state=123#wechat_redirect'
}

// https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx00caa94fa2a0f780&redirect_uri=http://as-test.duodeclass.com/frontend/pages/login/login?auth=true&appid=wx00caa94fa2a0f780&response_type=code&scope=snsapi_base&state=123#wechat_redirect

// http://as-test.duodeclass.com/frontend/pages/tabBar/task/task?appid=wx00caa94fa2a0f780

// http://as-test.duodeclass.com/frontend/pages/tabBar/index/index?appid=wx00caa94fa2a0f780

// http://as-test.duodeclass.com/frontend/pages/tabBar/info/info?appid=wx00caa94fa2a0f780

// http://as-test.duodeclass.com/frontend/pages/task/recive/recive?appid=wx00caa94fa2a0f780&id=70

// appid:wx00caa94fa2a0f780
