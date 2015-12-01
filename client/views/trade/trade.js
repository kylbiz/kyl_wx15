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
            throw new Meteor.Error("shopcart empty", "Error: No ShopCart Data Found");
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
        return Session.get('allPayment');
    },
});


Template.trade.events({
	'click #wxbuy': function (event, template) {
        var shopcartIdList = Session.get('shopcartIdList');
        var addressId = Session.get('addressId');
        if (!shopcartIdList || !addressId) {
          kylUtil.alert("数据错误");
          return;
        }

        Meteor.call('getPayArgs', {
                shopcartIdList: shopcartIdList, 
                addressId: addressId, 
                wechatOpenId: Session.get("WeChatUser")
            }, function (error, result) {
              if (error) {
                console.log("error", error);
                kylUtil.alert("警告", JSON.stringify(error));
              } else {
                WeixinJSBridge.invoke('getBrandWCPayRequest', result.payargs, function(res){
                  if(res.err_msg == "get_brand_wcpay_request:ok"){
                    console.log("支付成功");
                    Router.go('/paySuccess?order=' + result.payOrderId + '&style=微信');
                  }else {
                    console.log("支付失败，请重试");
                    Router.go('shopcart');  
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
    }
});