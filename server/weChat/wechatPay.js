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
	'getPayArgs': function (order) {
		order.spbill_create_ip = this.connection.clientAddress;
		order.out_trade_no = moment(new Date()).format('YYYYMMDDHHmmssSSSS') + randomNumber(4);
		order.trade_type = 'JSAPI';


		var ret = Async.runSync(function(callback) {
			console.log('order -', order);
			payment.getBrandWCPayRequestParams(order, callback);
        });

        if (ret.error) {
        	console.log("getPayArgs error-", ret.error);
            throw new Meteor.Error(ret.error, 'getPayArgs fail');
        } else {

			// save order to collection
			var relationId = order.out_trade_no
			
			

            console.log("getPayArgs ", ret.result);
            return ret.result;
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



function randomNumber(number) {
	var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
	var str = "";
	for(var i = 0; i < number; i++) {
		pos = Math.round(Math.random() * (arr.length -1));
		str += arr[pos];
	}
	return str;
}


// 处理微信支付通知
WebApp.connectHandlers.use("/wxpayret", middleware(initConfig).getNotify().done(function (message, req, res, next) {
	var openid = message.openid;
	var order_id = message.out_trade_no;
	var attach = {}
	try {
		attach = JSON.parse(message.attach);

		// 检测sign

		// 检查数据库中是否还有该order, 并设置未已支付
		

		res.reply('success');
	} catch(e) {
		console.log('get wxpayret err', e);
		res.reply(new Error('error happen'));
	}
}));

