import store from '@/store'

export default function Initializer () {
  store.commit('SET_TOKEN', uni.getStorageSync('Access-Token'))
  store.commit('SET_TOKEN_EXPIRED_IN', uni.getStorageSync('Access_token_expired_in'))
	store.commit('SET_USER', uni.getStorageSync('user'))
}

Initializer()