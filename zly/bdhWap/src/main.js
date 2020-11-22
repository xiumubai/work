import Vue from 'vue'
import router from './router'
import store from './vuex/index'
import App from './App'
import './assets/css/common.less'
import './assets/font/fontawesome/css/font-awesome.min.css'
import './config/axios'
import './config/common'
import './assets//js/hplusApi'
import './assets/js/helper/index.js'
// import 'zlyvant/dest/zlyvant.css'
// import zlyvant from 'zlyvant/dest/zlyvant'
// Vue.use(zlyvant)

import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	render: h => h(App)
})
