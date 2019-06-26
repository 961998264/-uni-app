export const orders = {
	mounted () {

	},
	methods: {
		// 查看订单详情
		orderDetail (orderId) {
			this.$common.navigateTo('/pages/member/order/orderdetail?order_id=' + orderId)
		},
		// 取消订单
		
		// 去支付
		toPay (orderId) {
			this.$common.navigateTo('/pages/goods/payment/index?order_id=' + orderId + '&type=1')
		},
		// 确认收货
		
		// 去评价
		toEvaluate (orderId) {
			this.$common.navigateTo('/pages/member/order/evaluate?order_id=' + orderId)
		},
		// 申请售后
		
		// 查看物流信息
		showExpress (code, no, address = '') {
			let params = encodeURIComponent('code=' + code + '&no=' + no + '&add=' + address)
			
			this.$common.navigateTo('/pages/member/order/express_delivery?params=' + params)
		}
	}
}



/**
 *  商品接口信息
 * 
 */
export const goods = {
	mounted() {

	},
	methods: {
		// 查看商品详情
		goodsDetail (goodsId) {
			let scene = encodeURIComponent('id=' + goodsId)
			this.$common.navigateTo('/pages/goods/index/index?scene=' + scene)
		},
		// 跳转商品列表页
		goodsList (obj = {}) {
			let url = '/pages/classify/index'
			if (Object.keys(obj).length) {
				url = this.$common.builderUrlParams(url, obj)
			}
			this.$common.navigateTo(url)
		},
		// 团购秒杀详情
		groupDetail(id, group_id){
			let scene = encodeURIComponent('id=' + id + '&group_id=' + group_id);
			this.$common.navigateTo('/pages/goods/index/group?scene=' + scene);
		}
	}
}

/**
 * 
 *  返回操作处理
 * 
 */
export const goBack = {
	onBackPress (options) {
		if (options.from === 'navigateBack') {
			return false;
		}
		let loginPages = [
			'/pages/cart/index/index',
			'/pages/member/index/index'
		]
		let backPage = this.$store.state.redirectPage
		if (loginPages.indexOf(backPage) > -1) {
			this.$store.commit({
				type: 'redirect',
				page: ''
			})
			uni.reLaunch({
				url: '/pages/index/index'
			})
			return true;
		}
	}
}