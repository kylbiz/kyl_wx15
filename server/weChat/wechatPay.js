// 微信支付

var Payment = Meteor.npmRequire('wechat-pay').Payment;
var middleware = Meteor.npmRequire('wechat-pay').middleware;

var fs = Npm.require('fs');

var initConfig = {
  partnerKey: WXConfig.partnerKey,
  appId: WXConfig.appID,
  mchId: WXConfig.mchID,
  notifyUrl: WXConfig.pay_notify,
  // pfx: fs.readFileSync(WXConfig.pfxPath)
};
var payment = new Payment(initConfig);


Meteor.methods({
	// 获取支付参数 prepay_id
	'getPayArgs': function (orderInfo) {
		console.log("ffff ", new Date("20141030133525"));

		var paylogInfo = beforePayHandle(orderInfo);
		var order = getOrderData(paylogInfo, orderInfo.wechatOpenId, this.connection.clientAddress);
		console.log('order -', order);

		var ret = Async.runSync(function(callback) {
			payment.getBrandWCPayRequestParams(order, callback);
        });

        if (ret.error) {
        	console.log("getPayArgs error-", ret.error);
            throw new Meteor.Error('getPayArgs fail', JSON.stringify(ret.error.message));
        } else {			
            console.log("getPayArgs ", ret.result);
            return {payargs: ret.result, payOrderId: order.out_trade_no};
        }

	},

	// 退款
	'refund': function (params) {
		params = {
			out_trade_no: "kfc001",				//商户自定义订单号
			out_refund_no: 'kfc001_refund',		//商户自定义退单号
			total_fee: 10 * 100,				//订单总金额
			refund_fee: 10 * 100				//退款金额
		};

		payment.refund(params, function(err, result){
			/**
			* 微信收到正确的请求后会给用户退款提醒
			* 这里一般不用处理，有需要的话有err的时候记录一下以便排查
			*/
		});
	}
});


// 处理微信支付通知
WebApp.connectHandlers.use("/wxpayret", middleware(initConfig).getNotify().done(
	function (message, req, res, next) {
		console.log('get wechat pay ret', message);	
		// 校验签名

		// 后续处理
		var result_code = message.result_code
		if (result_code == "SUCCESS") {
			var ret = paySuccessHandle(message);
			console.log("paySuccessHandle --", ret);
		} else if (result_code == "FAIL") {
			var ret = payFailHandle(message);
			console.log("payFailHandle --", ret);
		}

		res.reply('success');

		// try {
		// 	res.reply('success');
		// } catch(e) {
		// 	res.reply(new Error('error happen'));
		// }
	}
));





// 获取微信支付所需的数据
function getOrderData (paylog, wechatOpenId, ip) {

	var detail = "";
	paylog.shoplists.forEach(function(info) {
		detail += info.servicename + " ";
	});

	return {
		body: '开业啦微信订单',	// 商品描述
		detail: '产品: ' + detail,	// 可选
		attach: '{"userId": "'+ paylog.userId + '" }',//在查询API和支付通知中原样返回，该字段主要用于商户携带订单的自定义数据
		total_fee: 1, // paylog.moneyAmount,
		out_trade_no: paylog.openid, 	// 
		openid: wechatOpenId,
		spbill_create_ip: ip, 
		trade_type: 'JSAPI',
	};
}

// 提交订单前的预处理
function beforePayHandle(orderInfo) {
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

	var out_trade_no = kylUtil.genOrderId();	// 支付统一订单号

	var infoList = [];
	var moneyAll = 0;
	orderInfo.shopcartIdList.forEach(function (shopcartId) {
		var info = ShopCart.findOne({userId: userId, _id: shopcartId});
		if (!info) {
			throw new Meteor.Error("数据错误", '订单数据查找失败');
		}

		paylogInfo = {
			shopcartId: shopcartId,
			money: info.moneyAmount,
			servicename: info.productType,
			// relationId: info.relationId,	// 创建时添加，则这边就添加 
		};

		moneyAll += info.moneyAmount;
		infoList.push(paylogInfo);
	});
	// if (!infoList || infoList.length == 0) {
	// 	throw new Meteor.Error("数据错误", "无订单数据");
	// }

	var paylog = {
	  openid: out_trade_no,
	  userId: userId,
	  shoplists: infoList,
	  moneyAmount: moneyAll,
	  payed: false,
	  addressInfo: address,
	  invoice: false,
	  createTime: new Date()
	};

	console.log('paylog', paylog);

	var ret = PayLogs.insert(paylog); 
	if (!ret) {
		throw new Meteor.Error("数据错误", "内部数据处理失败");
	} else {
		console.log("insert PayLogs success", ret);
	}
	
	return paylog;
}

// 确认支付成功后的处理
function paySuccessHandle(message) {

	var openid = message.out_trade_no;
	var payedTime = new Date();

	// 更新paylog状态
	var ret = PayLogs.update({openid: openid}, {
		$set: {
			payed: true,
			payedTime: payedTime,
			wxpayInfos: message
		}
	});
	if (!ret) {
		console.log('update paylog fail');
		return false;
	}

	var paylog = PayLogs.findOne({openid: openid});
	if(!paylog || !paylog.hasOwnProperty('shoplists')) {
		console.log('find paylog fail or no shoplists');
		return false;
	}	
	var addressInfo = paylog.addressInfo || {};
	var shoplists = paylog.shoplists;
	shoplists.forEach(function (shoplist) {
		var shopcartId = shoplist.shopcartId;
		
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
		}

		// 创建支付成功后的订单 order
		var shopcartInfo = ShopCart.findOne({_id: shopcartId});
		if (!shopcartInfo) {
			console.log("find shopcart fail");
			return false;
		}
		shopcartInfo.cartId = shopcartInfo._id;
		delete cart._id;
		shopcartInfo.createTime = new Date();
		shopcartInfo.orderId = kylUtil.genOrderId();
		var order_id = Orders.insert(shopcartInfo);
		if (!order_id) {
			console.log("insert order fail");
			return false;
		}
		
	});

	return true;
}

// 支付失败后的处理
function payFailHandle(message) {
	var openid = message.out_trade_no;

	// 更新paylog状态
	var ret = PayLogs.update({openid: openid}, {
		$set: {
			wxpayInfos: message
		}
	});
	if (!ret) {
		console.log("update PayLogs fail");
		return false;
	}

	return true;
}


