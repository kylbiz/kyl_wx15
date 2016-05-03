Template.trade.onRendered(function () {
});

Template.trade.helpers({
    isWechat: function () {
        return kylUtil.isWeChat();
    },
    address: function () {
        if (UserAddress.find().count() > 0) {
            Session.setDefault('addressId', UserAddress.findOne({})._id);
            return UserAddress.findOne({_id: Session.get("addressId")}) || {};
        } else {
            console.log('no address data');
        }
    },
    payList: function () {
        if (!ShopCart.find({}).count()) {
            Session.set('allPayment', 0);
            Session.set('shopcartIdList', []);
            console.log("shopcart empty");
            return [];
        }

        var payList = CommFunc.getShopCartInfo();

        var allPayment = 0;
        var shopcartIdList = [];
        payList.forEach(function (info) {
            allPayment += info.payment;
            shopcartIdList.push(info.id);
        });
        Session.set('allPayment', allPayment);
        Session.set('shopcartIdList', shopcartIdList);
        return payList;
    },

    disc: function () {
        return 0;
    },
    allPayment: function () {
        return Session.get('allPayment') || 0;
    },
});


Template.trade.events({
	'click #wxbuy': function (event, template) {
        var retInfo = getProductInfo();
        if (retInfo.error) {
            kylUtil.alert(retInfo.error);
            return
        }

        var shopcartIdList = retInfo.result.shopcartIdList;
        var addressId = retInfo.result.addressId;
        weChatPay(shopcartIdList, addressId);
    },
    'click #otherbuy': function () {
        var retInfo = getProductInfo();
        if (retInfo.error) {
            kylUtil.alert(retInfo.error);
            return
        }

        var shopcartIdList = retInfo.result.shopcartIdList;
        var addressId = retInfo.result.addressId;
        pingxxPay(shopcartIdList, addressId, 'alipay_wap');
    },
    'click #setAddress':function () {
        if( UserAddress.find({}).count() ) {
            Router.go('addressList');
        } else {
            Router.go('address');
        }
    },
    'change .control.switch':function (e) {
        var smart = $(e.currentTarget).prop("checked");
        if(smart === true) {
          $(".switch-outlook").text("是");
        }
        else {
          $(".switch-outlook").text("否");
        }

        Session.set("invoice", smart);
    }
});


function getProductInfo() {
    var shopcartIdList = Session.get('shopcartIdList');
    var addressId = Session.get('addressId');
    if (!addressId || !shopcartIdList || shopcartIdList.length <= 0) {
        var msg = "数据错误!";
        if (!addressId) {
            msg = "请添加地址!";
        } else if (!shopcartIdList || shopcartIdList.length <= 0) {
            msg = "请添加商品!";
        }
        // kylUtil.alert(msg);
        return {error: msg};
    }

    return {
        error: null,
        result: {
            shopcartIdList: shopcartIdList,
            addressId: addressId
        }
    }
}

function weChatPay(shopcartIdList, addressId) {
    Meteor.call('getWechatPayArgs', {
                shopcartIdList: shopcartIdList,
                invoice: Session.get('invoice') || false,
                addressId: addressId,
                // wechatOpenId: Session.get("WeChatUser")
        }, function (error, result) {
          if (error) {
            console.log("error", error);
            kylUtil.alert("警告", error.reason);
          } else {
            if(typeof window.WeixinJSBridge == 'undefined' || typeof window.WeixinJSBridge.invoke == 'undefined') {
                kylUtil.alert("请在微信中使用");
                return;
            }

            WeixinJSBridge.invoke('getBrandWCPayRequest', result.payargs, function(res){
              if(res.err_msg == "get_brand_wcpay_request:ok"){
                console.log("支付成功");
                // Router.go('/pay_resu/?order=' + result.payOrderId + '&style=微信');
                Router.go('payResult', {channel: 'wechat'}, {query: 'order=' + result.payOrderId});
              } else {
                console.log("支付失败，请重试");
                kylUtil.alert("支付失败，请重试");
                Router.go('orderList');
              }
            });
          }
    });
}


function pingxxPay(shopcartIdList, addressId, channel) {
    Meteor.call('getPingxxPayArgs', {
        shopcartIdList: shopcartIdList,
        invoice: Session.get('invoice') || false,
        addressId: addressId,
        // wechatOpenId: Session.get("WeChatUser")
    }, {
        channel: channel
    }, function (error, result) {
        if (error) {
            console.log("error", error);
            kylUtil.alert("警告", error.reason);
        } else {
            console.log("getPingxxPayArgs ret", result);
            goToPingxxPay(result);
        }
    });

    function goToPingxxPay(charge) {
        pingpp.createPayment(charge, function(result, error){
            console.log("charge ret", result, error);
            if (result == "success") {
                // 只有微信公众账号 wx_pub 支付成功的结果会在这里返回，其他的 wap 支付结果都是在 extra 中对应的 URL 跳转。
            } else if (result == "fail") {
                // charge 不正确或者微信公众账号支付失败时会在此处返回
            } else if (result == "cancel") {
                // 微信公众账号支付取消支付
            }
        });
    }

    // function goToPingxxPay(payInfo) {
    //     pingpp_one.init(payInfo, function(res){
    //         console.log("res -", res);
    //         //debug 模式下获取 charge_url 的返回结果
    //         if(res.debug&&res.chargeUrlOutput){
    //             console.log(res.chargeUrlOutput);
    //         }
    //         if(!res.status){
    //             //处理错误
    //             kylUtil.alert(res.msg);
    //             Router.go('orderList');
    //         }
    //         else{
    //             //debug 模式下调用 charge_url 后会暂停，可以调用 pingpp_one.resume 方法继续执行
    //             if(res.debug&&!res.wxSuccess){
    //                 if(confirm('当前为 debug 模式，是否继续支付？')){
    //                     Meteor.call('pingxxPayOKTest', payInfo.order_no, function (error, result) {
    //                         console.log("pingxxPayOKTest", error, result);
    //                         pingpp_one.resume();
    //                     });
    //                 }
    //             }
    //             //若微信公众号渠道需要使用壹收款的支付成功页面，则在这里进行成功回调，
    //             //调用 pingpp_one.success 方法，你也可以自己定义回调函数
    //             //其他渠道的处理方法请见第 2 节
    //             else pingpp_one.success(function(res) {
    //                 if(!res.status){
    //                     kylUtil.alert(res.msg);
    //                 }
    //             }, function() {
    //                 //这里处理支付成功页面点击“继续购物”按钮触发的方法，
    //                 //例如：若你需要点击“继续购物”按钮跳转到你的购买页，
    //                 //则在该方法内写入 window.location.href = "你的购买页面 url"
    //                 // window.location.href='http://yourdomain.com/payment_succeeded';//示例
    //                 window.location.href='/';//示例
    //             });
    //         }
    //     });
    // }

}


function wechatGetAddr() {
    var openid = Session.get('WeChatUser');
    var url = window.location.href;
    console.log('wechatGetAddr', openid, url);
    Meteor.call('getPayAddrArgs', openid, url, function (err, result) {
        if (err) {
            console.log("getWXAddrArgs fail", err);
            kylUtil.alert("获取收货地址失败");
        } else {
            console.log('getWXAddrArgs ok', result);
            if (result) {
                var weixinJSBridge = WeixinJSBridge || false;
                if (!weixinJSBridge) {
                    kylUtil.alert('获取地址失败，请在微信中使用');
                    return;
                }

                WeixinJSBridge.invoke('editAddress', result, function (res) {
                    //若res中所带的返回值不为空，则表示用户选择该返回值作为收货地址。
                    //否则若返回空，则表示用户取消了这一次编辑收货地址。
                    console.log('editAddress ret', res);
                    kylUtil.alert('获取地址信息', res.err_msg, res.addressDetailInfo);
                });
            } else {
                console.log('getWXAddrArgs fuck');
            }
        }
    });
}
