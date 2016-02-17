Meteor.methods({
	//微信jsAPI相关
	wxjs: function (url) {
		// 定义固定参数
		var appId = 'wxe67e9ac24749fec2';
		var appsecret = 'ca12fe20c459157f9a349cc42401d6f5';
		//var appId = 'wx8bd4746c11f87c76';
		//var appsecret = '7119516f3a1ef641874d679e0c52053a';
		var debug = true;
		var jsApiList = "['checkJsApi','chooseWXPay']";

		// 定义变量
		var timestamp = parseInt(new Date().getTime() / 1000) + '';
		var nonceStr = Math.random().toString(36).substr(2, 15);
		var jsapi_ticket = make_ticket(appId, appsecret);
		var url = url;
		var signature = make_signature(nonceStr, timestamp, jsapi_ticket, url);

		//输出调试参数
		//console.log('timestamp:'+timestamp);
		//console.log('nonceStr:'+nonceStr);
		//console.log('jsapi_ticket:'+jsapi_ticket)
		//console.log('url:'+url);
		//console.log('signature:'+signature);

		function make_signature(nonceStr, timestamp, jsapi_ticket, url){
			var raw = function (args) {
				var keys = Object.keys(args);
				keys = keys.sort()
				var newArgs = {};
				keys.forEach(function (key) {newArgs[key.toLowerCase()] = args[key];});
				var string = '';
				for (var k in newArgs) {string += '&' + k + '=' + newArgs[k];}
				string = string.substr(1);
				return string;
			};

			var ret = {
				nonceStr: nonceStr,
				timestamp: timestamp,
				jsapi_ticket: jsapi_ticket,
				url: url
			};

			var string = raw(ret);
			jsSHA = Meteor.npmRequire('jssha');
			shaObj = new jsSHA(string, 'TEXT');
			ret.signature = shaObj.getHash('SHA-1', 'HEX');

			//console.log(ret.signature);
			return ret.signature;
		}

		function make_ticket(appId, appsecret){
			//1.获得token
			var ACCESS_TOKEN;
			var expire_time;
			var now = Date.parse(new Date());

			if (WXTokens.findOne()){
				expire_time=WXTokens.findOne().expire_time
			}else{
				expire_time=0;
			}
			
			if (expire_time < now){
				var TOKEN_URL="https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appId+"&secret="+appsecret;
				var ACCESS_TOKEN = HTTP.call("GET", TOKEN_URL).data.access_token
				//console.log('ACCESS_TOKEN'+ACCESS_TOKEN)
				if (ACCESS_TOKEN){

					var Fiber = Npm.require('fibers');
					Fiber(function () {
						WXTokens.remove({});
						WXTokens.insert({
							access_token: ACCESS_TOKEN,
							expire_time: expire_time = Date.parse(new Date()) + 7000000,
							create_time: new Date()
						});
					}).run();
				}
			}else{
				ACCESS_TOKEN = WXTokens.findOne().access_token;
			}

			if (WXTickets.findOne()){
				expire_time=WXTickets.findOne().expire_time
			}else{
				expire_time=0;
			}
			//2.获得ticket
			if (expire_time < now){
				var TICKET_URL="https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+ACCESS_TOKEN+"&type=jsapi"
				var ticket = HTTP.call("GET", TICKET_URL).data.ticket
				if (ticket){
					var Fiber = Npm.require('fibers');
					Fiber(function () {
						WXTickets.remove({});
						WXTickets.insert({
							ticket: ticket,
							expire_time: expire_time = Date.parse(new Date()) + 7000000,
							create_time: new Date()
						});
					}).run();
				}
			}else{
				ticket = WXTickets.findOne().ticket;
			}
			
			return ticket;
		}

		//console.log(ret)
		var return_str;
		return_str = "debug:"+debug+",appId:'"+appId+"',timestamp:"+timestamp+",nonceStr:'"+nonceStr+"',signature:'"+signature+"',jsApiList:"+jsApiList+"";
		//console.log('return_str'+return_str)
		return return_str;
	}
	,
	payPackage: function() {
		// 以下必要参数
		var appid = 'wx8bd4746c11f87c76';
		var body = 'JSAPI';
		var mch_id = '1226318502';
		var nonce_str = Math.random().toString(36).substr(2, 15);
		var notify_url = 'http://www.kyl.biz/pay/test/';
		var openid = 'oPw1ptwXVwobI7hmFUijqQ4UVBqE';//andy.deng
		var our_trade_no = '1217752501201407033233368018';
		var spbill_create_ip = '192.168.1.8';
		var total_fee = '1';
		var trade_type = 'JSAPI';
		var apikey = 'kylbizdzs123evemornabcdef1234560';

		// 生成签名
		var string1 = 'appid='+appid+'&body='+body+'&mch_id='+mch_id+'&nonce_str='+nonce_str+'&notify_url='+notify_url+'&openid='+openid+'&our_trade_no='+our_trade_no+'&spbill_create_ip='+spbill_create_ip+'&total_fee='+total_fee+'&trade_type='+trade_type+'&key='+apikey

		var sign = CryptoJS.MD5(string1).toString().toUpperCase();

		// 生成post的xml
		var xmlContent = '<xml><appid>'+appid+'</appid><body>'+body+'</body><mch_id>'+mch_id+'</mch_id><nonce_str>'+nonce_str+'</nonce_str><notify_url>'+notify_url+'</notify_url><openid>'+openid+'</openid><out_trade_no>'+our_trade_no+'</out_trade_no><spbill_create_ip>'+spbill_create_ip+'</spbill_create_ip><total_fee>'+total_fee+'</total_fee><trade_type>'+trade_type+'</trade_type><sign>'+sign+'</sign></xml>'

		console.log(xmlContent)

		// 以下非必要，可选填
		//var device_info = 'WEB';
		//var attach = '支付测试';
  		//var detail = '商品详情';
		//var fee_type = 'CNY';
		//var time_start = '';
		//var time_expire = '';
		//var goods_tag = '';
		//var product_id = '';
		
		
		//var package_str = encodeURI(string1+'&sign='+sign).replace(/\//g,'%2F').replace(':','%3A');
		//console.log(package_str);

		HTTP.call("POST", "https://api.mch.weixin.qq.com/pay/unifiedorder",
          {headers: {'Content-Type':'text/xml'},content: xmlContent},
          function (error, result) {
          	console.log(result)
            if (!error) {
            	console.log(error)
              //Session.set("twizzled", true);
            }
          });

		return 'prepay_id=wx201411101639507cbf6ffd8b0779950874';
	},
	paySign: function (package) {

	}
});
