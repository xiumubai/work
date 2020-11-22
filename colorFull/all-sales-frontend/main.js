import Vue from 'vue'

import '@/common/js/init.js'
import request from '@/common/js/request.js'
import api from '@/api/index.js'
import url from '@/common/js/config.js'
import '@/common/js/ican-H5Api.js'

Vue.config.productionTip = false

Vue.prototype.$request = request
Vue.prototype.$api = api
Vue.prototype.$url = url

import App from './App'
import store from './store'

App.mpType = 'app'
const app = new Vue({
	store,
	...App
})
app.$mount()
