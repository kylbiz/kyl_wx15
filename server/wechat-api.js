// 载入wechat-api模块，用于调用微信API接口
var WechatAPI = Meteor.npmRequire('wechat-api');
var Payment = Meteor.npmRequire('wechat-pay').Payment;
var fs = Meteor.npmRequire('fs');
var Fiber = Npm.require('fibers');

var appId = 'wx8bd4746c11f87c76';
var appSecret = '7119516f3a1ef641874d679e0c52053a';


var initConfig = {
	//partnerKey: "kylbizdzs123evemornabcdef1234560",
	//appId: "wx8bd4746c11f87c76",
	//mchId: "1226318502",
	//notifyUrl: "http://wx.kyl.biz/pay/"
	partnerKey: "kylbizdzs123evemornabcdef1234560",
	appId: "wxe67e9ac24749fec2",
	mchId: "10023572",
	notifyUrl: "http://dev.kyl.biz/checkpay/"
	//pfx: fs.readFileSync("/apiclient-cert.p12")
};
var payment = new Payment(initConfig);

var api = new WechatAPI('wx8bd4746c11f87c76', '7119516f3a1ef641874d679e0c52053a' );

Meteor.methods({
	send_WechatMsg: function(openId, content){//发送微信信息
		api.sendText(openId, content, function (err, result) {
			console.log(err);
			console.log(result);
			if (!err){
				Fiber(function () {
					WXMsgs.insert({
						openId: openId,
						content: content,
						createTime: new Date()
					});
				}).run();
			}
		})
	    return "微信消息推送成功！";
	},
	payment_setup: function(){
		var Future = Npm.require('fibers/future');
		var fut = new Future();

		//console.log(this.connection.clientAddress)
		var order = {
			//body: '吮指原味鸡 * 1',
			//attach: '{"部位":"三角"}',
			out_trade_no: 'kfc001'+ (+new Date),
			body: 'body',
			attach: 'attach',
			//out_trade_no: 'kfc001123',
			total_fee: 10 * 100,
			spbill_create_ip: this.connection.clientAddress,
			//openid: 'oPw1ptwXVwobI7hmFUijqQ4UVBqE',
			openid: 'o-eTUs5TkmhRkdtkhROK1GTbvsKw',
			trade_type: 'JSAPI'
		};
		payment.getBrandWCPayRequestParams(order, function(err, payargs){
		  	if (!err){
		  		//console.log(out_trade_no);
		  		console.log(payargs);
			  	//存入数据库
			  	var Fiber = Npm.require('fibers');
				Fiber(function () {
					WXPay.remove({});
					WXPay.insert({
						appId: payargs.appId,
						timeStamp: payargs.timeStamp,
						nonceStr: payargs.nonceStr,
						package: payargs.package,
						paySign: payargs.paySign,
						expire_time: expire_time = Date.parse(new Date()) + 7000000,
						create_time: new Date()
					});
				}).run();
				var return_str;
				return_str = "appid:'"+payargs.appId.toString()+"',timeStamp:'"+payargs.timeStamp.toString()+"',nonceStr:'"+payargs.nonceStr.toString()+"',package:'"+payargs.package.toString()+"',signType:'MD5',paySign:'"+payargs.paySign.toString()+"'"
				setTimeout(function(){
					fut['return'](return_str);
				},1000)
			}else{
				console.log(err);
			}
		});

		//var return_str;
		//return_str = "timeStamp:'"+WXPay.findOne().timeStamp.toString()+"',nonceStr:'"+WXPay.findOne().nonceStr.toString()+"',signType:'MD5',package:'"+WXPay.findOne().package.toString()+"',paySign:'"+WXPay.findOne().paySign.toString()+"'"
		//console.log('return_str'+return_str)
		//return return_str;

		return fut.wait();

		//console.log(payargs)
		//payment.downloadBill({
		//  bill_date: "20140913",
		//  bill_type: "ALL"
		//}, function(err, data){
		  // 账单列表
		  //var list = data.list;
		//  console.log(err)
		  // 账单统计信息
		  //var stat = data.stat;
		//});
	},
	searchOrders: function(){
		var api = new WechatAPI(appId, appSecret);
		api.getOrdersByStatus(function (err, data, res){
			if (!err){
				if (data.errcode == 0){
					var Fiber = Npm.require('fibers');
					for(i=0;i<data.order_list.length;i++){
						//保存订单
						var data_order_list = data.order_list[i];
						if (data_order_list) {
							Fiber(function () {
							  	WXOrders.upsert({
							  		order_id: data_order_list.order_id
							  	},{
							  		$set: {
							  			order_id: data_order_list.order_id,
								  		order_status: data_order_list.order_status,
								  		order_total_price: data_order_list.order_total_price,
								  		order_create_time: data_order_list.order_create_time,
								  		order_express_price: data_order_list.order_express_price,
								  		order_create_time: data_order_list.order_create_time,
								  		buyer_openid: data_order_list.buyer_openid,
								  		buyer_nick: data_order_list.buyer_nick,
								  		receiver_name: data_order_list.receiver_name,
								  		receiver_province: data_order_list.receiver_province,
								  		receiver_city: data_order_list.receiver_city,
								  		receiver_address: data_order_list.receiver_address,
								  		receiver_mobile: data_order_list.receiver_mobile,
								  		receiver_phone: data_order_list.receiver_phone,
								  		product_id: data_order_list.product_id,
								  		product_name: data_order_list.product_name,
								  		product_price: data_order_list.product_price,
								  		product_name: data_order_list.product_name,
								  		product_sku: data_order_list.product_sku,
								  		product_count: data_order_list.product_count,
								  		product_img: data_order_list.product_img,
								  		delivery_id: data_order_list.delivery_id,
								  		delivery_company: data_order_list.delivery_company,
								  		trans_id: data_order_list.trans_id,
								  		receiver_zone: data_order_list.receiver_zone
							  		}
							  		
							  	});
							}).run();
						}
					}
				}
			}
		})
		return '100';
	}
})