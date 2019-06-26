import * as db from './db.js' //引入common
import store from '../store/index.js'

 function getSid() {
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


//把obj对象里的值覆盖到newobj里面
function deepCopy(newobj,obj) {
  if (typeof obj != 'object') {
    return obj;
  }
  for (var attr in obj) {
    var a = {};
    if (newobj[attr]){
      a = newobj[attr];
    }
    newobj[attr] = deepCopy(a,obj[attr]);
  }
  return newobj;
}

//跳转到登陆页面
function jumpToLogin(method) {
  var now_time = Date.parse(new Date());
  var value = db.get('jump_to_login');
  if(!value){
    value=0;
  }
  if((now_time - value)> 3000 ){
    //db.set('jump_to_login',now_time); //暂时屏蔽登录时间查询
		// 将当前页面route存vuex中 登录注册后跳转
		let pages = getCurrentPages();
		let page = pages[pages.length - 1]
		// 获取页面参数信息
		let params = ''
		// #ifdef H5 || MP-WEIXIN || APP-PLUS	 || APP-PLUS-NVUE	
		if (page.route.indexOf('pages/goods/index/index') !== -1 || page.route.indexOf('pages/goods/index/group') !== -1) {
			params = encodeURIComponent(page.query)
		}
		// #endif

		// #ifdef MP-ALIPAY
		if (page.__proto__.route.indexOf('pages/goods/index/index') !== -1 || page.__proto__.route.indexOf('pages/goods/index/group') !== -1) {
			params = encodeURIComponent(page.rootVM.query)
		}
		// #endif
		
		store.commit({
			type: 'redirect',
			page: params ? '/' + page.route + '?scene=' + params : '/' + page.route,
		})
		
    uni.showToast({
      title: '请登录...',
      icon: 'success',
      duration: 2000,
      success: function (res) {
		  // #ifdef H5 || APP-PLUS
		  uni.navigateTo({
					url: '/pages/login/login'
		  })
		  // #endif
		  // #ifdef MP-WEIXIN || MP-ALIPAY	
			uni.navigateTo({
					url: '/pages/login/choose/index',
					animationType: 'pop-in',
					animationDuration: 200
			});
		  // #endif
      }
    })
  }else{
  }
}


//操作成功后，的提示信息
function successToShow(msg='保存成功', callback=function(){}){
  uni.showToast({
    title: msg,
    icon: 'success',
    duration: 2000,
  });
  setTimeout(function () {
    callback();
  }, 500);
}


//操作失败的提示信息
function errorToShow(msg = '操作失败', callback = function () { }) {
  uni.showToast({
    title: msg,
    icon: 'none',
    duration: 2000,
  });
	setTimeout(function () {
	  callback();
	}, 2000);
}

//加载显示
function loadToShow(msg = '加载中') {
  uni.showToast({
    title: msg,
    icon: 'loading',
  });
}

//加载隐藏
function loadToHide() {
  uni.hideToast();
}

// 提示框
function modelShow (title = '提示', content = '确认执行此操作吗?',callback = () => {}, showCancel = true,  cancelText = '取消', confirmText = '确定') {
	uni.showModal({
			title: title,
			content: content,
			showCancel: showCancel,
			cancelText: cancelText,
			confirmText: confirmText,
			cancelText: cancelText,
			success: function (res) {
					if (res.confirm) {
							// 用户点击确定操作
							setTimeout(() => {
								callback()
							}, 500)
					} else if (res.cancel) {
							// 用户取消操作
					}
			}
	});
}


//时间戳转时间格式
function timeToDate(date) {
  var date = new Date(date * 1000);//如果date为13位不需要乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate()) + ' ';
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
  var s = (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds());
  return Y + M + D + h + m + s;
}

function time2date(micro_second) {
    var time = {};
    // 总秒数
    var second = Math.floor(micro_second);
    // 天数
    time.day = PrefixInteger(Math.floor(second / 3600 / 24), 2);
    // 小时
    time.hour = PrefixInteger(Math.floor(second / 3600 % 24), 2);
    // 分钟
    time.minute = PrefixInteger(Math.floor(second / 60 % 60), 2);
    // 秒
    time.second = PrefixInteger(Math.floor(second % 60), 2);

    var newtime = '';
    if (time.day > 0) {
        newtime = time.day + '天' + time.hour + '小时' + time.minute + '分' + time.second + '秒';
    } else {
        if (time.hour != 0) {
            newtime = time.hour + '小时' + time.minute + '分' + time.second + '秒';
        } else {
            newtime = time.minute + '分' + time.second + '秒';
        }
    }
    return newtime;
}

//货币格式化
function formatMoney(number, places, symbol, thousand, decimal) {
  number = number || 0;
  places = !isNaN(places = Math.abs(places)) ? places : 2;
  symbol = symbol !== undefined ? symbol : "￥";
  thousand = thousand || ",";
  decimal = decimal || ".";
  var negative = number < 0 ? "-" : "",
    i = parseInt(number = Math.abs(+number || 0).toFixed(places), 10) + "",
    j = (j = i.length) > 3 ? j % 3 : 0;
  return symbol + negative + (j ? i.substr(0, j) + thousand : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousand) + (places ? decimal + Math.abs(number - i).toFixed(places).slice(2) : "");
}
function throttle(fn, context, delay) {
  clearTimeout(fn.timeoutId);
  fn.timeoutId = setTimeout(function () {
    fn.call(context);
  }, delay);
}

// 时间格式化输出，如11:03 25:19 每1s都会调用一次
function dateformat(micro_second) {
		var time = {};
		// 总秒数
		var second = Math.floor(micro_second / 1000);
		  // 天数
		time.day = PrefixInteger(Math.floor(second / 3600 / 24),2);
		  // 小时
		time.hour = PrefixInteger(Math.floor(second / 3600 % 24),2);
		  // 分钟
		time.minute = PrefixInteger(Math.floor(second / 60 % 60),2);
		  // 秒
		time.second = PrefixInteger(Math.floor(second % 60),2);
		return time;
}


//不足位数前面补0
function PrefixInteger(num, length) {
  return (Array(length).join('0') + num).slice(-length); 
}

//验证是否是手机号
function isPhoneNumber(str){
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(str)) {
        return false;
    } else {
        return true;
    }
}



/**
 * 
 * 对象参数转为url参数
 * 
 */
function builderUrlParams(url, data) {
		if(typeof(url) == 'undefined' || url == null || url == '') {
				return '';
		}
		if(typeof(data) == 'undefined' || data == null || typeof(data) != 'object') {
				return '';
		}
		url += (url.indexOf("?") != -1) ? "" : "?";
		for(var k in data) {
				url += ((url.indexOf("=") != -1) ? "&" : "") + k + "=" + encodeURI(data[k]);
		}
		return url;
}

/**
 * 使用循环的方式判断一个元素是否存在于一个数组中
 * @param {Object} arr 数组
 * @param {Object} value 元素值
 */
function isInArray(arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true;
    }
  }
  return false;
}
/**
 * 统一跳转
 */
function navigateTo(url){
	uni.navigateTo({
    url:url,
		animationType:'pop-in',
		animationDuration:300
	});
}


/**
 *  关闭当前页面并跳转
 */
function redirectTo (url) {
	uni.redirectTo({
		url: url,
		animationType: 'pop-in',
		animationDuration: 300
	})
}


/**
 * 
 *  判断是否在微信浏览器 true是
 */
function isWeiXinBrowser () {
	 // #ifdef H5
    // window.navigator.userAgent属性包含了浏览器类型、版本、操作系统类型、浏览器引擎类型等信息，这个属性可以用来判断浏览器类型
    let ua = window.navigator.userAgent.toLowerCase()
    // 通过正则表达式匹配ua中是否含有MicroMessenger字符串
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        return true
    } else {
        return false
    }
		 // #endif
		 
		 // #ifdef MP
		 return false;
		 // #endif
}
 //计算字符长度
 function textlength(res) {
    let len = 0
    let str = res
    let more8CodeRes = res //超过8个字符进行截取
    for (let i = 0; i < str.length; i++) {
      let c = str.charCodeAt(i)
      //单字节加1
      if ((c >= 0x0001 && c <= 0x007e) || (0xff60 <= c && c <= 0xff9f)) {
        len++
      } else {
        len += 2
      }
      if (len > 8) {
        more8CodeRes = str.substr(0, Math.floor(i / 2) * 2) + '...'
      }
    }
    return {
      len: len,
      more8CodeRes: more8CodeRes,
    }
  }

  //获取xxid:先通过store.js获取xxid，没有的话再通过localhost获取，如果没有则没有,传入的参数需要的id名称
  function getId(idName) {
    let id = store.state[idName]
    if (id == null || id === '') {
      id = window.localStorage[idName]
    }
    return id
  }
  
  /**
   * 根据参数名，获取url中#和?之间的
   * */
  function getContentUrl(){
    let url = window.location.href
    //分享情况下 url中携带#
    if(url.indexOf('#') > -1 && url.indexOf('?') > -1){
      let queryUrl =url.split('#')[1]
      let queryUrl1 = queryUrl.split('?')[0]
      return String(queryUrl1)
    }else{
      return ''
    }
  }
  /**
   * 根据参数名，获取url后面的参数的值
   * */
  function getQueryVariable(letiable) {
    let url = window.location.href
    if (url.indexOf('?') >-1) {
      url = url.split('?')[1]
      let lets = url.split('&')
      for (let i = 0; i < lets.length; i++) {
        let pair = lets[i].split('=')
        if (pair[0] === letiable) {
          return pair[1]
        }
      }
    } else {
      return ''
    }
  }
    /**
   * 根据参数名，获取url后面的参数的值
   * */
  function getQueryVariableUrl(letiable,url) {
    if (url.indexOf('?') >-1) {
      url = url.split('?')[1]
      let lets = url.split('&')
      for (let i = 0; i < lets.length; i++) {
        let pair = lets[i].split('=')
        if (pair[0] === letiable) {
          return pair[1]
        }
      }
    } else {
      return ''
    }
  }
  //URL获取
  function GetUrlParms() {
    let args = new Object()
    let query = location.search.substring(1) //获取查询串
    if (query === '') {
      return []
    } else {
      let pairs = query.split('&') //在逗号处断开
      for (let i = 0; i < pairs.length; i++) {
        let pos = pairs[i].indexOf('=') //查找name=value
        if (pos === -1) continue //如果没有找到就跳过
        let argname = pairs[i].substring(0, pos) //提取name
        let value = pairs[i].substring(pos + 1) //提取value
        args[argname] = unescape(value) //存为属性
      }
      return args
    }
  }


  //记录初次进入到微信里面的url 解决ios在微信中跳转路由 ，url无法发生变化， ios中微信只记录初次进入的url
export {
  GetUrlParms,
  getQueryVariableUrl,
  getQueryVariable,
  getContentUrl,
  textlength,
  deepCopy,
  jumpToLogin,
  timeToDate,
  formatMoney,
  /* errorToBack, */
  successToShow,
  throttle,
  errorToShow,
  time2date,
  isPhoneNumber,
  isInArray,
	loadToShow,
	loadToHide,
	navigateTo,
	redirectTo,
	modelShow,
	builderUrlParams,
	isWeiXinBrowser,
	dateformat
}
