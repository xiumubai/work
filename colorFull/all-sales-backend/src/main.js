/*
 * @Description: In User Settings Edit
 * @Author: your name
 * @Date: 2019-09-23 22:42:36
 * @LastEditTime: 2019-10-17 15:48:32
 * @LastEditors: Please set LastEditors
 */
// ie polyfill
import '@babel/polyfill'
import './core/use'
import './core/bootstrap'

import Vue from 'vue'
import './utils/filter' // global filter

import {
  VueAxios
} from './utils/request'

import App from './App.vue'
import router from './router'
import store from './store/'
import './permission' // permission control

// mock
// import './mock'

Vue.config.productionTip = false

// mount axios Vue.$http and this.$http
Vue.use(VueAxios)

new Vue({
  router,
  store,
  // created: bootstrap,
  render: h => h(App)
}).$mount('#app')
