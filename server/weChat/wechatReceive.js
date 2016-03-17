// 微信官方服务器回调给后端的数据
var wechat = Meteor.npmRequire('wechat');
var config = {
  token: WXConfig.token,
  appid: WXConfig.appID,
  encodingAESKey: WXConfig.encodingAESKey || ''
};

WebApp.connectHandlers.use('/wechat/receive', wechat(config, function (req, res, next) {
	console.log("wechat receive", req.weixin);
  var wxMsg = req.weixin || {};

  // 用户关注本帐号
  if (wxMsg.Event === 'subscribe') {
    res.reply(WXConfig.subscribeWelcome);
    return;
  }

  // 其他信息转发给客服
	res.reply({
    type: 'transfer_customer_service',
  });
}));




// 处理微信回调回来的数据
// HTTP.methods({
// 	'/wechat/receive': {
// 		post: function (data) {
// 			data = translate2Obj(data, this.requestHeaders['content-type']);
// 			var ret = receiveHandle(data, this);
// 			if (ret) {
// 				return ret;
// 			}
// 		},
// 		get: function (data) {
// 			console.log("receive get obj", this.request.query);
// 			var ret = WeChatVerifyUrl(this.request.query);
// 			if (ret) {
// 				return ret;
// 			}
// 		}
// 	}
// });

// @param data -- binary
// function translate2Obj(data, contentType) {

// 	function xmlObj2normalObj(xmlObj) {
// 		var obj = {};
// 		xmlObj = xmlObj.xml;
// 		for (var key in xmlObj) {
// 			obj[key] = xmlObj[key][0];
// 		}

// 		return obj;
// 	}

// 	data = data.toString('utf-8');

// 	console.log("contentType", contentType, data);

// 	if (contentType == 'text/xml' || contentType == 'application/xml') {
// 		data = xml2js.parseStringSync(data);
// 	} else {
// 		data =  JSON.parse(data);
// 	}

// 	if (data.xml) {
// 		console.log("get xml");
// 		data = xmlObj2normalObj(data);
// 	} else {
// 		console.log("get json");
// 	}

// 	return data;
// }


// // obj转xml
// function translate2xml(obj) {
// 	var xml = Meteor.npmRequire('xml');

// }

// 微信验证url
// function WeChatVerifyUrl (data) {
//   function checkSignature(timestamp, nonce, sign) {
//     var ret = getSignature(timestamp, nonce);
//     return (ret == sign);
//   }

//   function getSignature(timestamp, nonce) {
//     var crypto = Npm.require('crypto');
//     var shasum = crypto.createHash('sha1');
//     var arr = [WXConfig.token, timestamp, nonce].sort();
//     shasum.update(arr.join(''));

//     return shasum.digest('hex');
//   }

//   if (!checkSignature(data.timestamp, data.nonce, data.signature)) {
//     log('verify signature err');
//     return false;
//   } else {
//     return data.echostr;
//   }
// }







