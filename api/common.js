import store from '../store/index.js'

export function getSid() {
	let sid = store.state.loginInfo.sid 
	if (!!sid) {
		return sid
	}
	const loginInfo = uni.getStorageInfoSync('loginInfo')
	if (!!loginInfo.sid) {
		return loginInfo.sid
	}
	
	return false
}