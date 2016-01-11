Template.trade.onRendered(function () {
    // Session.set('allPayment', 0);
    // Session.set('shopcartIdList', []);

    // 获取微信地址
    // wechatGetAddr();
});

Template.trade.helpers({
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
        var shopcartIdList = Session.get('shopcartIdList');
        var addressId = Session.get('addressId');
        if (!addressId || !shopcartIdList || shopcartIdList.length <= 0) {
            var msg = "数据错误!";
            if (!addressId) {
                msg = "请添加地址!";
            } else if (!shopcartIdList || shopcartIdList.length <= 0) {
                msg = "请添加商品!";
            }
            kylUtil.alert(msg);
            return;
        }

        Meteor.call('getPayArgs', {
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
                    Router.go('/paySuccess?order=' + result.payOrderId + '&style=微信');
                  } else {
                    console.log("支付失败，请重试");
                    kylUtil.alert("支付失败，请重试");
                    Router.go('orderList');
                  }
                });

              }
        });
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
