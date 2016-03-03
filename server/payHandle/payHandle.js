/*
 * 支付相关处理
**/

PayHandle = {};

// 提交订单前的预处理
PayHandle.beforePayHandle = function (orderInfo) {
  var userId = Meteor.userId();
  if (!userId) {
    throw new Error('未登录', 'Error: 请登录');
  }

  var address = UserAddress.findOne({userId: userId, _id: orderInfo.addressId});
  if (!address) {
    throw new Meteor.Error('数据错误', '地址数据查找失败');
  }
  delete address._id;
  delete address.createAt;

  var out_trade_no = kylUtil.genOrderId();  // 支付统一订单号

  var infoList = [];  // 产品简要信息list
  var moneyAll = 0; // 订单总金额
  orderInfo.shopcartIdList.forEach(function (shopcartId) {
    var info = ShopCart.findOne({userId: userId, _id: shopcartId});
    if (!info || info.payed) {
      throw new Meteor.Error("数据错误", '订单数据有误');
    }

    var orderId = kylUtil.genOrderId();

    if (!info.ordered) {
      // 第一次付款
      if (!createOrder()) {
        throw new Meteor.Error("生成订单失败");
      }
      updateShopCart();
    } else {
      // 已下过单
      orderId = info.ordered;
      if (!updateOrder()) {
        throw new Meteor.Error("重新下单失败");
      }
    }

    // 获取产品支付log
    getProdPayLog();

    // 创建订单
    function createOrder () {
      info.cartId = info._id;
      delete info._id;
      delete info.deleted;
      delete info.ordered;
      info.canceled = false;
      info.finished = false;
      info.userConfirmed = false;
      info.createTime = new Date();
      info.invoice = orderInfo.invoice;
      info.openid = out_trade_no;
      info.cartId = shopcartId;
      info.orderId = orderId;
      info.addressInfo = address;
      var order_id = Orders.insert(info);
      if (!order_id) {
        console.log("insert pay order fail");
        return false;
      } else {
        console.log("insert pay order ok", order_id);
      }

      return true;
    }

    // 更新订单
    function updateOrder () {
      var orderInfo = Orders.findOne({orderId: orderId});
      if (!orderInfo && orderInfo.payed) {
        return false;
      }

      var order_ret = Orders.update({orderId: orderId}, {
        $set: {
          invoice: orderInfo.invoice,
          openid: out_trade_no,
          addressInfo: address
        }
      });
      if (!order_ret) {
        console.log("update pay order fail");
        return false;
      } else {
        console.log("update pay order ok", order_ret);
      }

      return true;
    }

    // 更新购物车信息
    function updateShopCart() {
      var shopcart_ret = ShopCart.update({_id: shopcartId}, {$set: {ordered: orderId}});
      if (!shopcart_ret) {
        console.log('update ShopCart fail');
        return false;
      } else {
        console.log('update shopcart ok');
      }

      return true;
    }

    // 获取单个产品的支付log信息
    function getProdPayLog() {
      paylogInfo = {
        shopcartId: shopcartId,
        orderId: orderId,
        money: info.moneyAmount,
        servicename: info.productType,
        relationId: info.relationId || "",  // 创建时添加，则这边就添加
      };
      moneyAll += info.moneyAmount;
      infoList.push(paylogInfo);
    }

  });
  // if (!infoList || infoList.length == 0) {
  //  throw new Meteor.Error("数据错误", "无订单数据");
  // }

  // 添加支付log到数据库
  var paylog = {
    openid: out_trade_no,
    userId: userId,
    shoplists: infoList,
    moneyAmount: moneyAll,
    payed: false,
    addressInfo: address,
    invoice: orderInfo.invoice,
    createTime: new Date()
  };

  console.log('paylog', paylog);

  var ret = PayLogs.insert(paylog);
  if (!ret) {
    throw new Meteor.Error("下单失败！");
  } else {
    console.log("insert PayLogs success", ret);
  }

  return paylog;
}

// 确认支付成功后的处理
PayHandle.paySuccessHandle = function (openid, payInfo) {

  // var openid = message.out_trade_no;
  var payedTime = new Date();

  // 检测订单信息, 判断原有订单是否符合要求
  var allPayed = true;
  var orderInfoOld = Orders.find();

  // 更新paylog状态
  updatePayLog();

  // 更新购物车状态
  updateShopcart();

  // 更新订单状态
  updateOrder();

  // 更新paylog状态
  function updatePayLog() {
    var ret = PayLogs.update({openid: openid}, {
      $set: {
        payed: true,
        payedTime: payedTime,
        paySuccessInfo: payInfo
      }
    }, {multi: true});
    if (!ret) {
      console.log('update paylog fail');
      return false;
    } else {
      console.log("update paylog ok", ret);
    }

    return true;
  }

  // 更新购物车状态
  function updateShopcart() {
    var paylog = PayLogs.findOne({openid: openid});
    if(!paylog || !paylog.hasOwnProperty('shoplists')) {
      console.log('find paylog fail or no shoplists');
      return false;
    }
    // var addressInfo = paylog.addressInfo || {};

    var shoplists = paylog.shoplists;
    shoplists.forEach(function (shoplist) {
      var shopcartId = shoplist.shopcartId;
      console.log("shopcartId -", shopcartId);

      // 更新购物车状态
      var ret = ShopCart.update({_id: shopcartId}, {
        $set: {
          payed: true,
          openid: openid,
          payedTime: payedTime
        }
      });
      if (!ret) {
        console.log("update ShopCart fail");
        return false;
      } else {
        console.log("update ShopCart Ok", ret);
      }
    });

    return true;
  }

  // 更新订单状态
  function updateOrder() {
    // 更新订单信息
    var ret = Orders.update({openid: openid}, {
      $set: {
        payed: true,
        payedTime: payedTime,
      }
    }, {multi: true});
    if (!ret) {
      console.log('update order fail');
      return false;
    } else {
      console.log('update order ok', ret);
    }

    return true;
  }

  return true;
}

// 支付失败后的处理
PayHandle.payFailHandle = function (openid, payInfo) {
  // 更新paylog状态
  var ret = PayLogs.update({openid: openid}, {
    $addToSet: {
      payFailInfos: payInfo
    }
  });
  if (!ret) {
    console.log("update PayLogs fail");
    return false;
  }

  return true;
}
