Template.trade.events({
	'click #wxbuy': function () {

    alert('支付成功');
    Router.go('paySuccess');

    // var order = {
    //   body: '吮指原味鸡 * 1',
    //   attach: '{"部位":"三角"}',
    //   total_fee: 10,
    //   openid: Session.get('WeChatUser'),
    // };

    // Meteor.call('getPayArgs', order, function (error, payargs) {
    //   if (error) {
    //     alert("get Pay args error: " + JSON.stringify(error));
    //   } else {
    //     console.log('payargs', payargs);
    //     WeixinJSBridge.invoke('getBrandWCPayRequest', payargs, function(res){
    //       if(res.err_msg == "get_brand_wcpay_request:ok"){
    //         alert("支付成功");
    //         Router.go('paySuccess');
    //         // 这里可以跳转到订单完成页面向用户展示
    //       }else{
    //         alert("支付失败，请重试");
    //       }
    //     });
    //   }
    // });
  },
  'click #address':function () {
     //当前地址数
     var count=0;
     if(!count==0) {
       Router.go('address');
     }
     else {
       Router.go('addressList');   
     }
  }
});