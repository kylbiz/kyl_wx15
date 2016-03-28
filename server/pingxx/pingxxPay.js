/*
 *  ping++ 支付
**/

var pingpp = Meteor.npmRequire("pingpp")(PingxxConfig.api_key);

Meteor.methods({
  getPingxxPayArgs: function (orderInfo, tradeInfo) {
    console.log("getPingxxPayArgs from", this.connection.clientAddress);
    if (PingxxConfig.channel.indexOf(tradeInfo.channel || "") < 0) {
      throw new Meteor.Error("支付渠道非法", "错误: 支付信息非法");
    }

    var paylogInfo = PayHandle.beforePayHandle(orderInfo);
    var productName = getOrderDes(paylogInfo);
    var client_ip = this.connection.clientAddress;
    return createTradeOrder({
      order_no: paylogInfo.openid,
      channel: tradeInfo.channel,
      amount: Number(paylogInfo.moneyAmount) * 100,
      client_ip: client_ip,
      body: productName,
      subject: '开业啦移动端订单',
    });

    // return getPingxxOrderData(paylogInfo);
  },
  pingxxPayOKTest: function (trade_no) {
    console.log("pingxxPayOKTest", trade_no);
    return PayHandle.paySuccessHandle(trade_no);
  }
});


HTTP.methods({
  '/pingxx/createCharge': {
    post: function (data) {
      console.log("createCharge data", data);
      var client_ip = this.request.connection.remoteAddress;

      var orderInfo = {
        order_no: data.order_no,
        app_id: PingxxConfig.app_id,
        channel: data.channel,
        amount: data.amount,    // 单位 分
        client_ip: client_ip,
        subject: "商品的标题", // 商品的标题 最多32字符
        body: "商品的标题", // 描述信息 最多128字符
        success_url: PingxxConfig.host + PingxxConfig.success_path,
      };

      var cbInfo = Async.runSync(function(callback) {
          extraMap = {
            alipay_wap: {
              success_url: orderInfo.success_url
            }
          }

          pingpp.charges.create({
            order_no:  orderInfo.order_no,
            app:       { id:  orderInfo.app_id},
            channel:   orderInfo.channel,
            amount:    orderInfo.amount,
            client_ip: orderInfo.client_ip,
            currency:  "cny",
            subject:   orderInfo.subject,
            body:      orderInfo.body,
            extra:     extraMap[orderInfo.channel]
          }, callback);
      });

      console.log("ret --", cbInfo);
      return cbInfo.result;
    }
  },
  '/pingxx/hook': {
    post: function (data) {
      data = data || {}
      var ret = false;
      if (data.type || data.type == "charge.succeeded") {
        var payInfo = data.data.object;
        if (payInfo.paid) {
          ret = PayHandle.paySuccessHandle(payInfo.order_no, payInfo);
          if (ret) {
            // 通知相关人员新的订单产生
            SMSSend.orderNotice(payInfo.order_no, 'KYLWAP');
          }

        } else {
          ret = PayHandle.payFailHandle(payInfo.order_no, payInfo);
        }
      }
      if (ret) {
        return "";
      }
    }
  }
});








///////////////////////////////////////////////////////
//
///////////////////////////////////////////////////////
// 创建支付信息
function createTradeOrder(orderInfo) {
  var cbInfo = Async.runSync(function(callback) {
      extraMap = {
        alipay_wap: {
          success_url: PingxxConfig.host + PingxxConfig.success_path,
        }
      }

      pingpp.charges.create({
        order_no:  orderInfo.order_no,
        app:       { id:  PingxxConfig.app_id},
        channel:   orderInfo.channel,
        amount:    orderInfo.amount,
        client_ip: orderInfo.client_ip,
        currency:  "cny",
        subject:   orderInfo.subject,
        body:      orderInfo.body,
        extra:     extraMap[orderInfo.channel]
      }, callback);
  });

  console.log("ret --", cbInfo);
  return cbInfo.result;
}


// 获取订单的描述信息
function getOrderDes(payInfo) {
  var shoplist = payInfo.shoplists;
  var productName = '';
  shoplist.forEach(function (item) {
    if (item && item.servicename) {
      if (productName) {
        productName += "+ " + item.servicename
      } else {
        productName = item.servicename
      }
    }
  });
  return productName;
}

// 壹收款所需要的参数
function getPingxxOrderData(paylogInfo, channel) {
  // {
  //           app_id:'app_f5mvD8rbXLmT5O4e',                     //该应用在 ping++ 的应用 ID
  //           order_no:kylUtil.genOrderId(),                     //订单在商户系统中的订单号
  //           amount:1,                                   //订单价格，单位：人民币 分
  //           // 壹收款页面上需要展示的渠道，数组，数组顺序即页面展示出的渠道的顺序
  //           channel:['alipay_wap'],
  //           charge_url:'http://localhost:3000/pingxx/createCharge',  //商户服务端创建订单的 url
  //           // charge_param: {a:1, b:2},                      //(可选，用户自定义参数，若存在自定义参数则壹收款会通过 POST 方法透传给 charge_url)
  //           // open_id:'wx1234567890',                      //(可选，使用微信公众号支付时必须传入)
  //           debug: true                                   //(可选，debug 模式下会将 charge_url 的返回结果透传回来)
  // }
  return {
    app_id: PingxxConfig.app_id,
    order_no: paylogInfo.openid,
    amount: Number(paylogInfo.moneyAmount) * 100,
    channel: PingxxConfig.channel,
    charge_url: PingxxConfig.host + PingxxConfig.create_charge_path,
    charge_param: {test: 't-e-s-t'},
    debug: true
  };
}


