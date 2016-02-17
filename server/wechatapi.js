var WechatAPI = Meteor.npmRequire('wechat-api');
var Fiber = Npm.require('fibers');

// 实例化api，new API('appid', 'appsecret')
//var api = new WechatAPI('wxe67e9ac24749fec2', 'cb702975d29f46804a744a72482e2063' );	//
var api = new WechatAPI('wx8bd4746c11f87c76', '7119516f3a1ef641874d679e0c52053a' );

Meteor.methods({
	send_WechatNews: function(openid){
		var articles = [
		{
			"title": "注册公司提交材料说明",
			"description": "7月火热创业季－1元注册公司活动推出后，感受到了小伙伴们的极大热情，客服团队的MM们都顾不上吃饭了。所以请",
			"url": "http://mp.weixin.qq.com/s?__biz=MzA3NzExNTE5OQ==&mid=206846511&idx=1&sn=317a6765430ecb3dc2a487193efe7441#rd",
			"picurl": "http://mmbiz.qpic.cn/mmbiz/sgT7HNZ9VPWToOuQ4ZEPBtCpgt1iabjnQc3weDibAgVswwUIafWPmo5hUPrNloicrls7lpaSgkt6Jma6OsxQB9SGQ/640?wx_fmt=jpeg&tp=webp&wxfrom=5"
		}]
		//var openid = "oPw1ptwXVwobI7hmFUijqQ4UVBqE";
		api.sendNews(openid, articles, function (err, result) {
			console.log(result)
		});
		return "发送成功！"
	},
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
	get_WechatUserBaseInfo: function(openId, inquiryId){//获取用户信息
		api.getUser(openId, function (err, result) {
			console.log(err)
			if (!err){
				//console.log(result)
				Fiber(function () {
					Inquiry1.update({
						_id: inquiryId
					},{
						$set: {
							subscribe: result.subscribe,//是否关注
							nickname: result.nickname,//昵称
							headimgurl: result.headimgurl,//头像URL
							sex: result.sex, //性别
							language: result.language,//语言
							city: result.city,//城市
							province: result.province,//省
							country: result.country,//国家
							subscribe_time: result.subscribe_time,//关注事件
							unionid: result.unionid,//UnionId
							remark: result.remark,
							groupid: result.groupid
						}
					});
				}).run();
			}
		});
	}
	,
	get_WechatUserBaseInfo2: function(openId, orderId){//获取用户信息
		api.getUser(openId, function (err, result) {
			if (!err){
				//console.log(result)
				var Fiber = Npm.require('fibers');
				Fiber(function () {
					Order1.update({
						_id: orderId
					},{
						$set: {
							subscribe: result.subscribe,//是否关注
							nickname: result.nickname,//昵称
							headimgurl: result.headimgurl,//头像URL
							sex: result.sex, //性别
							language: result.language,//语言
							city: result.city,//城市
							province: result.province,//省
							country: result.country,//国家
							subscribe_time: result.subscribe_time,//关注事件
							unionid: result.unionid,//UnionId
							remark: result.remark,
							groupid: result.groupid
						}
					});
				}).run();
			}
		});
	},
	get_WechatUserBaseInfo3: function(openId){//获取用户信息
		api.getUser(openId, function (err, result) {
			if (!err){
				//console.log('do!')
				var Fiber = Npm.require('fibers');
				Fiber(function () {
					WXUsers.upsert({
						openid: openId
					},{
						$set: {
							openid: result.openid, //openid
							subscribe: result.subscribe,//是否关注
							nickname: result.nickname,//昵称
							headimgurl: result.headimgurl,//头像URL
							sex: result.sex, //性别
							language: result.language,//语言
							city: result.city,//城市
							province: result.province,//省
							country: result.country,//国家
							subscribe_time: result.subscribe_time,//关注事件
							unionid: result.unionid,//UnionId
							remark: result.remark,
							groupid: result.groupid
						}
					});
				}).run();
			}
		});
	},
	searchOrders: function(){
		//var api = new WechatAPI(appId, appSecret);
		api.getOrdersByStatus(function (err, data, res){
			if (!err){
				if (data.errcode == 0){
					var Fiber = Npm.require('fibers');
					Fiber(function () {
						for(i=0;i<data.order_list.length;i++){
							//保存订单
							var data_order_list = data.order_list[i];
							if (data_order_list) {
							//console.log(data_order_list.order_id)
							
								//console.log(data_order_list.order_id)
							  	Order1.upsert({
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
							
							}
						}
					}).run();
				}
			}
		})
		return '100';
	}
	//,
	//get_WechatProductInfo: function(productId){
	//	api.getGoods(productId, function (err, result) {
	//		if (!err) {
	//			console.log(result)
	//		}
	//	});
	//}
})