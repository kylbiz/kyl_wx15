// // 微信官方服务器回调给后端的数据
// var wechat = Meteor.npmRequire('wechat');
// var config = {
//   token: WXConfig.token,
//   appid: WXConfig.appID,
//   // encodingAESKey: 'encodinAESKey'
// };

// WebApp.connectHandlers.use('/receive', wechat(config, function (req, res, next) {
// 	console.log("receive", req);
// 	res.replay("hello!");

// }));




// Meteor.methods({
// 	'receiveHandle': function(req, res) {
// 		WeChatVerifyUrl(req, res); // 用于微信验证url
// 		return 'fuck';
// 	}
// });


// Meteor.methods({
// 	'setSession': function (key, value) {
// 		// console.log("set session", key, value);
// 		// Session.set(key, value);
// 	},
// 	'someOneCome': function (arr) {
// 		console.log("someOneCome");
// 		for (var key in arr) {
// 			console.log(arr[key]);
// 		}
// 	}
// });

// // 微信首次配置URL的验证
// function WeChatVerifyUrl(req, res) {
// 	var query = req.query;
// 	if (!checkSignature(query.timestamp, query.nonce, query.signature)) {
// 		log('verify signature err');
// 		return res.end('verify signature err');
// 	}

// 	log('echostr', query.echostr);
// 	res.end(query.echostr);
// }

// // 对微信回调回来的数据进行处理
// function receiveHandle(data, http) {

// 	console.log("receive post obj", data);
// 	// var msgType = data.MsgType;
// 	// var msgEvent = data.Event;
// 	// ret = false;
// 	// if ( msgType == "event" && msgEvent == "VIEW") {
// 	// 	ret = goToProductCenter(data);
// 	// }

// 	return false;
// }


// // WebApp.connectHandlers.use("/", function (req, res) {
// // 	var query = req.query;
// // 	if (!checkSignature(query.timestamp, query.nonce, query.signature)) {
// // 		log('verify signature err');
// // 		return res.end('verify signature err');
// // 	}

// // 	log('echostr', query.echostr);
// // 	res.end(query.echostr);
// // });


// // 处理微信回调回来的数据
// HTTP.methods({
// 	'/receive': {
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

// // @param data -- binary
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

// // 微信验证url
// function WeChatVerifyUrl (data) {
// 	if (!checkSignature(data.timestamp, data.nonce, data.signature)) {
// 		log('verify signature err');
// 		return false;
// 	} else {
// 		return data.echostr;
// 	}
// }


// function checkSignature(timestamp, nonce, sign) {
// 	var ret = getSignature(timestamp, nonce);
// 	return (ret == sign);
// }


// function getSignature(timestamp, nonce) {
// 	var crypto = Npm.require('crypto');
// 	var shasum = crypto.createHash('sha1');
// 	var arr = [WXConfig.token, timestamp, nonce].sort();
// 	shasum.update(arr.join(''));

// 	return shasum.digest('hex');
// }

