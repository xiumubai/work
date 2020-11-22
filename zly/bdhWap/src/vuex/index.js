import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
export default new Vuex.Store({
	state: {
		loginMeeting: JSON.parse(localStorage.getItem('loginMeetingInfo') || '{}')
	},
	mutations: {
		updateMeeting (state,meetingInfo) {
			state.loginMeeting = meetingInfo;
		}
	},
	getters: {
		getMeetingInfo(state){
			let start = new Date(state.loginMeeting.from_time * 1000).getTime();
			let end = new Date(state.loginMeeting.to_time * 1000).getTime();
			let now = new Date().getTime();
			if(start < now && now < end || start > now){
				return false;
			}else {
				return true;
			}
		}
	}
});