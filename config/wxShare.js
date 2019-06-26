// import wx from 'weixin-js-sdk'
const wx = require('jweixin-module')  
import store from '../store/index.js'
import {getContentUrl,} from './common.js'
import { getSignPackage,getMyStatus } from '../api/apiCommon.js'

export const commonShare = async (shareTitle, shortlink1, shortlink2, successFun,shareImage='', ) => {
  console.log('分享的短链接朋友', shortlink1)
  console.log('分享的短链接朋友圈', shortlink2)

  let signLink = /(Android)/i.test(navigator.userAgent) ? location.href : window.entryUrl
  console.log(store.state.uid,'分享者姓名')
      //获取nickname
  let nicknameResult = await  getMyStatus({
      })
  let nickname = nicknameResult.data.info.nickname
  let shareDesc = `来自于${nickname}的精选内容`
  let sharetrace;
  let shareData = store.state.shareData
  if(!shareData.sq){
    shareData=JSON.parse(sessionStorage.getItem('shareData'))
  }
  let isShare =getContentUrl()//查看当前url中是否携带了#main或者#content
  //是分享页面的情况，且url中不带参数的情况下
  //如果直接从分享的链接进入，url中会自动携带uid shareid sq等参数，直接用 window.location.href
  //但是如果从他人首页回到自己的页面，url中不会携带这些参数，这时候将这些参数手动带上
  if(!isShare && shareData && shareData.shareid){
    sharetrace = window.location.hostname+`#${shareData.whichModule}?sq=${shareData.sq}&shareid=${shareData.shareid}&uid=${shareData.uid}`
  }else{
    sharetrace = window.location.href
  }
  if(shareImage === ''){
    shareImage = require('../assets/img/shareImage.png')
  }
  console.log('获取签名url', signLink)
  console.log('分享图片', shareImage)
  console.log('分享描述',shareDesc)
  console.log('获取参数', sharetrace)
  console.log('分享回调', successFun)
  if (signLink === 'http://x.test.microbooks.cn/' || signLink === 'http://x.test.microbooks.cn') {
    signLink = 'http://x.test.microbooks.cn/index/article'
  }
  let data = {
    sharetrace,
    url: signLink,
    cookie: store.state.cookie != '' ? store.state.cookie : localStorage.getItem('cookie'),
  }

  getSignPackage(data)
    .then((res) => {
      let data = res.data.info.sig
      // let shareid = res.data.info.shareid
      // store.commit('setShareId',shareid)
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: data.appId, // 必填，公众号的唯一标识
        timestamp: String(data.timestamp), // 必填，生成签名的时间戳
        nonceStr: data.nonceStr, // 必填，生成签名的随机串
        signature: data.signature, // 必填，签名，见附录1
        jsApiList: [
          // 所有要调用的 API 都要加到这个列表中
          'updateAppMessageShareData',
          'updateTimelineShareData',
          'onMenuShareAppMessage',
          'onMenuShareTimeline',
        ],
      })
      wx.ready(function() {
        // 在这里调用 API
        var shareData1 = {
          title: shareTitle,
          desc: shareDesc,
          link: `${shortlink1}`, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: shareImage,
          success: function() {
            //分享成功后重新获取shareId
            //console.log(typeof successFun)
            successFun
          },
        }
        var shareData2 = {
          title: shareTitle,
          desc: shareDesc,
          // link: shareUrl_href + '?isShare=true&' + 'sq=2' + "&" + shareUrl_search, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          link: `${shortlink2}`,
          imgUrl: shareImage,
          success: function() {
            //分享成功后重新获取shareId
            // callback()
            // alert('sss')
            // generateshareid({cookie:store.state.cookie !=''? store.state.cookie : localStorage.getItem('cookie')}).then( (res) =>{
            //   store.commit('setShareId',res.data.info.shareid)
            //   console.log(res.data.info.shareid,'shareId')
            // })
            successFun
          },
        }
        if (/(Android)/i.test(navigator.userAgent)) {
          // alert('安卓')
          wx.onMenuShareAppMessage(shareData1) //分享朋友
          wx.onMenuShareTimeline(shareData2) //分享朋友圈
        } else {
          // alert('IOS')
          wx.updateAppMessageShareData(shareData1) //分享朋友
          wx.updateTimelineShareData(shareData2) //分享朋友圈
        }
        // /(Android)/i.test(navigator.userAgent) ? location.href.split('#')[0] : window.entryUrl
        // wx.onMenuShareAppMessage(shareData1) //分享朋友
        // wx.updateAppMessageShareData(shareData1) //分享朋友
        // wx.updateTimelineShareData(shareData2) //分享朋友圈
        // wx.onMenuShareAppMessage (shareData2) //分享朋友圈
      })
    })
    .catch((err) => {})
}
