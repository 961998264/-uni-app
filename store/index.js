import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		 //分享所需数据
		 shareData: {
			sq: '',
			shareid: '',
			uid: '',
			whichModule: '', // main 或者 content/文章id
		  },
		config: {}, // 店铺配置信息
		orderTab: 0, // 选中的订单tab页
		redirectPage: '',
		uuid:'',//当前客户端
	},
    mutations: {
		SET_SHAREDATA(state, data) {
			state.shareData = data
		  },
		SET_CONFIG (state, payload) {
			state.config = payload
		},
		SET_ORDERTAB (state, tab) {
			state.orderTab = tab
		},
		SET_REDICTR (state, payload) {
			state.redirectPage = payload.page
		}
	},
	actions: {

	},
	getters: {
		shopConfig: state => state.config,
		uuid: state	=>	state.uuid,
	}
})

export default store
